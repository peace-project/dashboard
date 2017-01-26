'use strict';

import ViewFilter from "./view_filter";
import DefaultViewModel from "../viewmodels/default/default_view_model";
import {isExpressivenessCapability, isConformanceCapability} from "../peace";

export const PortabilityStatus = {
    ALL: '0',
    ONLY: '1',
    WITH: '2',
    NOT_SAME: '3'
};

export default class PortabilityFilter extends ViewFilter {
    constructor() {
        super(PortabilityFilter.Name());
    }

    static Name() {
        return 'portability_status';
    };

    getDefaultFilterValues(language, data) {
        return PortabilityStatus.ALL;
    }

    applyFilter(viewModel, filteredData, filterValues) {
        console.log('Apply ' + this.getName() + ' filter');

        if (!(viewModel instanceof DefaultViewModel)) {
            throw Error('filteredData is not of type DefaultViewModel. filteredData=' + viewModel.constructor.name);
        }
        let that = this;

        if(filterValues.portability_status === undefined){
            console.error('portability_status is undefined');
            return;
        }

        let engines = Object.keys(filterValues.engines);
        let summaryOutdated = true;

        // Use reserve loop to iterate und mutating an array
        let constructs = viewModel.table.constructs;
        console.log(constructs);

        let capability = filteredData.capability;
        for(var i=constructs.length -1; i >= 0; i -=1){
            let construct = constructs[i];

            if (filterValues.portability_status === PortabilityStatus.NOT_SAME) {

                var showFeatures = that._filterFeaturesByNotSameStatus(construct, engines, capability);
                if (showFeatures.length < 1) {
                    constructs.splice(i, 1);
                    summaryOutdated = true;
                    continue;
                }
                construct.features = showFeatures;
                if (construct.features < 2) {
                    construct.moreThanTwoFeatures = false;
                }
                construct.features[construct.features.length - 1]['lastFeature'] = true;
            } else {
                if (!that._isConstructMatchingPortabilityStatus(construct, filterValues)) {
                    if(viewModel.table.constructs[i].isFirstEntry){
                        // If viewModel.constructs[i+1] is undefined than the whole group has been removed, so do nothing
                        this._updateGroupFirstEntry(constructs[i], constructs[i+1]);
                    }

                    constructs.splice(i, 1);
                    summaryOutdated = true;
                    continue;
                }
            }
        }

        if(summaryOutdated){
            viewModel.updateSummaryRow();
        }
    }

    _updateGroupFirstEntry(oldFirstEntryConstruct, newFirstEntryConstruct){
        let gIndex = oldFirstEntryConstruct.groupsIndex;
        if(newFirstEntryConstruct !== undefined && newFirstEntryConstruct.groupsIndex === gIndex){
            newFirstEntryConstruct.isFirstEntry = true;
        }
    }


    _filterFeaturesByNotSameStatus(construct, engines, capability) {
        var showFeatures = [];

        let that = this;
        construct.features.forEach(function (feature) {
            if (that._hasDifferentResults(feature, engines, capability)) {
                showFeatures.push(feature);
            }
        });

        return showFeatures;
    }

    _isConstructMatchingPortabilityStatus(construct, filterValues) {
        if (filterValues.portability_status === PortabilityStatus.ALL) {
            return true;
        }

        let engines = Object.keys(filterValues.engines);
        let countFullSupported = this._getNumberOfFullSupportedTests(construct, engines);

        if (filterValues.portability_status === PortabilityStatus.ONLY && countFullSupported != engines.length) {
            return false;
        } else if (filterValues.portability_status === PortabilityStatus.WITH && (countFullSupported === engines.length)) {
            return false;
        }

        return true;
    }


    _getNumberOfFullSupportedTests(construct, enginesArray){
        let count = enginesArray.length;

        enginesArray.forEach(function (engineId) {
            // If any test for this engine exists or fullSupport is false
            if (!construct['results'].hasOwnProperty(engineId) || !construct['results'][engineId]['patternFulfilledLanguageSupport']) {
                count -= 1;
            }
            /*
            if (!construct['supportStatus'].hasOwnProperty(engineId) || !construct['supportStatus'][engineId].fullSupport) {
                count -= 1;
            }*/
        });

        return count;
    }

    _hasDifferentResults(feature, engines, capability) {
        let showFeature = false;
        let firstResult = undefined;

        let resultProp = undefined;
        if(isExpressivenessCapability(capability)){
            resultProp = 'patternImplementationFulfilledLanguageSupport';
        } else if(isConformanceCapability(capability)){
            resultProp = 'testResultTrivalentAggregation';
        }

        engines.forEach(function (engineId) {
            // If any test for this engine exists or support same
            if (!feature.results.hasOwnProperty(engineId)) {
                showFeature = true;
                return;
            }

            if (firstResult === undefined) {
                //patternImplementationFulfilledLanguageSupport
                console.log(feature.results[engineId])
                firstResult = feature.results[engineId][resultProp];
            }

            if (firstResult !== feature.results[engineId][resultProp]) {
                showFeature = true;
                return;
            }

        });

        return showFeature;
    }

}
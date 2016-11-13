'use strict';

import Filter from "./filter";
import ViewModel from "../viewmodels/default_view_model";

export const PortabilityStatus = {
    ALL: 0,
    ONLY: 1,
    WITH: 2,
    NOT_SAME: 3
}

export default class PortabilityFilter extends Filter {
    constructor() {
        super(PortabilityFilter.Name());
    }

    static Name() {
        return 'portability_status';
    };

    getDefaultFilterValues(language, data) {
        return PortabilityStatus.ALL;
    }


    applyFilter(capabilityData, testData, viewModel, filterValues, filterValuesChanges) {
        console.log('Apply ' + this.getName() + ' filter');

        if (!(viewModel instanceof ViewModel)) {
            throw Error('filteredData is not of type ViewModel. filteredData=' + viewModel.constructor.name);
        }
        let that = this;

        if(filterValues.portability_status === undefined){
            console.error('portability_status is undefined');
            return;
        }

        for(var i=0; i < viewModel.constructs.length; i++){
            let construct = viewModel.constructs[i];

            if (filterValues.portability_status === PortabilityStatus.NOT_SAME) {
                var showFeatures = that._filterFeaturesByNotSameStatus(construct, viewModel);
                if (showFeatures.length < 1) {
                    //remove construct
                    viewModel.constructs.splice(i, 1);
                    //toRemoved.push(key);
                    continue;
                }
                construct.features = showFeatures;
                if (construct.features < 2) {
                    construct.moreThanTwoFeatures = false;
                }
                construct.features[construct.features.length - 1]['lastFeature'] = true;
            } else {
                if (!that._isConstructMatchingPortabilityStatus(construct, viewModel, filterValues)) {
                    console.log(i);
                    viewModel.constructs.splice(i, 1);
                    continue;
                }
            }
        }

        console.log('viewModel.constructs_______');
        console.log(viewModel.constructs);

    }


    _filterFeaturesByNotSameStatus(construct, filteredData) {
        /*if (dataFilters.portability_status !== '3'){
         return;
         }*/

        var showFeatures = [];
        construct.features.forEach(function (feature) {
            if (this._isMatchingPortabilityStatusFeature(feature, filteredData)) {
                showFeatures.push(feature);
            }
        });

        return showFeatures;
    }

    _isConstructMatchingPortabilityStatus(construct, viewModel, filterValues) {
        if (filterValues.portability_status === '0') {
            return true;
        }

        var showConstruct = true;
        var count = viewModel.engines.length;
        Object.keys(viewModel.engines).forEach(function (engine) {
            // If any test for this engine exists or fullSupport is false
            if (!construct['supportStatus'].hasOwnProperty(engine.id) || !construct['supportStatus'][engine.id].fullSupport) {
                count -= 1;
            }
        });

        if (filterValues.portability_status === '1' && count != viewModel.engines.length) {
            showConstruct = false;
        } else if (filterValues.portability_status === '2' && (count === viewModel.engines.length)) {
            showConstruct = false;
        }

        return showConstruct;
    }

    _isMatchingPortabilityStatusFeature(feature, filteredData) {
        var showFeature = false;
        var firstResult = undefined;

        filteredData.engines.data.forEach(function (engine) {
            if (engine === undefined) {
                return;
            }

            // If any test for this engine exists or support same
            if (!feature.results.hasOwnProperty(engine.id)) {
                showFeature = true;
                return;
            }

            if (firstResult == undefined) {
                firstResult = feature.results[engine.id].testResult
            }

            if (firstResult !== feature.results[engine.id].testResult) {
                showFeature = true;
                return;
            }

        });

        return showFeature;
    }


}
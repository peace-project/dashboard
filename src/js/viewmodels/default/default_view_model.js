import {groupEngineByName} from "../helpers";
import Construct from "./construct";

//rename to default tableViewModel
export default class DefaultViewModel {
    constructor(filteredData, capability, language) {
        this.capability = capability;
        this.language = language;

        // TableViewModel
        this.table = {
            constructs: [],
            summaryRow: {},
            engines: groupEngineByName(filteredData.engines.data),
            enginesCount: 0
        };
        this.table.enginesCount = this.table.engines.instancesCount;

        // For SubViewModels (i.e. for popovers)
        this.features = {};
        this.engines = filteredData.engines.data;
        this.independentTests = {};

        let that = this;
        // Init summaryRow
        filteredData.engines.data.forEach(function (engine) {
            if (engine !== undefined) {
                that.table.summaryRow[engine.id] = 0;
            }
        });


        this._addConstructs(filteredData.groups.data, filteredData.constructs.data,
            filteredData.features.data, filteredData.tests.data);
    }

    _addConstructs(groups, constructs, features, tests) {
        // clear constructs
        this.table.constructs.length = 0;
        let that = this;
        var lastGroupIndex = undefined;

        constructs.forEach(function (construct) {
            if (construct === undefined) {
                return;
            }

            // Add groupInfo
            let group = groups[construct.groupsIndex];
            let viewConstruct = new Construct(construct, group, features, tests);

            if (viewConstruct.features.length < 1) {
                return;
            }

            //For SubViewModels
            viewConstruct.features.forEach(feat => {
                that.features[feat.index] = feat;
                //that.test[feat.testIndexes] = tests[feat.testIndexes];
                //that.independentTests[feat.testIndependentIndex] =  independentTests[feat.testIndependentIndex];
            });


            // Reset old value of isFirstEntry to avoid duplicate group marking
            // Marks construct as the first row of a group
            viewConstruct.isFirstEntry = false;
            if (viewConstruct.groupsIndex !== lastGroupIndex) {
                lastGroupIndex = viewConstruct.groupsIndex;
                viewConstruct.isFirstEntry = true;
            }


           // that._updateSummaryRow(viewConstruct);

            that.table.constructs.push(viewConstruct);

        });


    }

    updateSummaryRow() {
        let that = this;
        //that.summaryRow[engine.id] = 0;
        Object.keys(that.table.summaryRow).forEach(key => that.table.summaryRow[key] = 0);
        that.table.constructs.forEach(function (construct) {
            //that._updateSummaryRow(construct);
        });
    }

    _updateSummaryRow(construct) {
        let that = this;
        Object.keys(construct.supportStatus).forEach(engineID => {
            if (construct.featuresIndexes.length === construct.supportStatus[engineID].supportedFeature) {
                that.table.summaryRow[engineID] += 1;
            } else if (that.capability === 'expressiveness' && construct.supportStatus[engineID].supportedFeature > 0) {
                if (construct.upperBound === '+') {
                    that.table.summaryRow[engineID] += 1;
                }
            }
        });
    }
}

export function getSupportClass(result, languageSupport){
    if (result === '+/-' && languageSupport === result) {
        return 'support-partial-true';
    } else if(result === '+/-'){
        return 'support-partial';
    } else {
        return (result === '+')  ? 'support-true' : 'support-false';
    }
}
/*
export function getResultClass(result, resultHtml, upperBound) {
    // add result class
    if (resultHtml !== '+/-') {
        return 'support-' + result;
    } else if (upperBound !== undefined && resultHtml == '+/-' && upperBound === resultHtml) {
        return 'support-partial-true';
    } else {
        return 'support-partial';
    }
} */







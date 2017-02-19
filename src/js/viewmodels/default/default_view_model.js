import {groupEngineByName} from "../helpers";
import Construct from "./construct";
import {getAggregatedConstructMetric} from "../../dashboard_info";

//rename to default tableViewModel
export default class DefaultViewModel {

    constructor(filteredData, capability, language, extensions) {
        this.capability = capability;
        this.language = language;
        console.log('___filteredData')
        console.log(filteredData)

        // TableViewModel
        this.table = {
            groupTitle: extensions['group'],
            constructTitle: extensions['featureSet'],
            featureTitle: extensions['feature'],
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

        this.aggregatedConstructResult = getAggregatedConstructMetric(capability);

       if (this.aggregatedConstructResult === undefined) {
            console.error('Error: Aggregated result not defined for this capability: ' + capability);
        }

        this._addConstructs(filteredData.groups.data, filteredData.constructs.data, filteredData.features.data,
            filteredData.tests.data);
    }

    /**
     * Add constructs
     *
     * @param groups
     * @param constructs
     * @param features
     * @param tests contains all aggregatedResults data that remains unaffected by the filter after its creation.
     * This ease the retrieval of test data (e.g. metric) via fixed and unique indices.
     * @private
     */

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

            that._updateSummaryRow(viewConstruct);
            that.table.constructs.push(viewConstruct);
        });
    }

    updateSummaryRow() {
        if(this.aggregatedConstructResult === undefined){
            return;
        }

        let that = this;
        //that.summaryRow[engine.id] = 0;
        Object.keys(that.table.summaryRow).forEach(key => that.table.summaryRow[key] = 0);
        that.table.constructs.forEach(function (construct) {
            that._updateSummaryRow(construct);
        });
    }

    _updateSummaryRow(construct) {
        if(this.aggregatedConstructResult == undefined){
            return;
        }

        let that = this;
        Object.keys(construct.results).forEach(engineID => {
            let  htmlResult = construct.results[engineID][that.aggregatedConstructResult];
            if (htmlResult === '+' || htmlResult === 'true') {
                that.table.summaryRow[engineID] += 1;
            }
        });
    }
}








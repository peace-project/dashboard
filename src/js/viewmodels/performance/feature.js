import CategoryTestResult from "./category_test_result";
import {createLinkFromPaths} from "../helpers";

export default class Feature {
    constructor(feature, testResults, metricsInfo, resultOrder) {
        //this.lastFeature = false;
        this.results = {};
        this.otherResults = {};
        // this.metricTree = [];

        let that = this;
        Object.keys(feature).forEach(key => {
            that[key] = feature[key];
        });

        console.log("FEATURES___")
        console.log(this)
        this._addTests(testResults, metricsInfo, resultOrder);
    }

    _addTests(testResults, metricsInfo, resultOrder) {
        let that = this;

        let isFirstEntry = true;

        this.testResults.forEach(function (testIndex) {

        });

        this.testResultIndex.forEach(function (testIndex) {
            let test = testResults[testIndex];
            if (test !== undefined && test.result !== undefined) {

                Object.keys(test.result).forEach(category => {
                    if (that.results.hasOwnProperty(category)) {
                        that.results[category].addResult(test);
                    } else {
                        that.results[category] = new CategoryTestResult(category, test, metricsInfo, resultOrder);
                        that.results[category].isFirstEntry = isFirstEntry;
                    }

                    that._addAdditionalDataToFeature(test);
                    isFirstEntry = false;
                });

            }
        });


    }

    _addAdditionalDataToFeature(test) {
        let that = this;

        Object.keys(test).forEach(key => {
            if (key !== 'result') {
                // Add other test data (additionalData, engineDependentFiles, tool, logfiles etc)
                that.otherResults[test.engineID] = that.otherResults[test.engineID] || {};
                let testObj = test[key];
                if(testObj === undefined){
                    return;
                }

                if (key === 'additionalData') {
                    that.otherResults[test.engineID][key] = testObj.map(data => that._flattenAdditionalData(data, ''));
                }else if(key === 'engineDependentFiles'){
                    that.otherResults[test.engineID]['engineDependentFilePaths'] = createLinkFromPaths(testObj);
                } else {
                    that.otherResults[test.engineID][key] = testObj;
                }
            }
        });

    }

    _flattenAdditionalData(data, parentKey) {
        let flattenData = {};
        let that = this;

        Object.keys(data).forEach(key => {
            let flatKey = (parentKey.length === 0 || !parentKey) ? key : parentKey + '.' + key;
            if (data[key] !== null && typeof data[key] === 'object') {
                let flatObj = that._flattenAdditionalData(data[key], flatKey);
                Object.assign(flattenData, flatObj);
            } else if (Array.isArray(data[key])) {
                flattenData[flatKey] = data[key].join(', ');
            } else {
                flattenData[flatKey] = data[key];
            }
        });

        return flattenData;
    }

}
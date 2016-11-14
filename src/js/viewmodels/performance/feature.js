import TestResult from "./test_result";
import Metric from "./metric";

export default class Feature {
    constructor(feature, tests, metricsInfo) {
        //this.lastFeature = false;
        this.results = {};
        this.metricTree = [];

        let that = this;
        Object.keys(feature).forEach(key => {
            that[key] = feature[key];
        });

        this._addTests(tests, metricsInfo);
    }

    _addTests(tests, metricsInfo) {



        let that = this;
        this.testIndexes.forEach(function (testIndex) {
            var test = tests[testIndex];
            console.log('___________');
            console.log(test);

            if (test !== undefined) {
                if (test.result !== undefined) {
                    that.results[test.engineID] = new TestResult(test);



                    var isFirstEntry = true;
                    Object.keys(test.result).forEach(categoryName => {
                        let metric = new Metric(categoryName, test.result[categoryName], metricsInfo);
                        metric.isFirstEntry = isFirstEntry;
                        that.metricTree.push(metric);
                        isFirstEntry = false;
                    });
                }
            }
        });
    }
}
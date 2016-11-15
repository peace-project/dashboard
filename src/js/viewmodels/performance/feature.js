import CategoryTestResult from "./category_test_result";

export default class Feature {
    constructor(feature, tests, metricsInfo, resultOrder) {
        //this.lastFeature = false;
        this.results = {};
       // this.metricTree = [];

        let that = this;
        Object.keys(feature).forEach(key => {
            that[key] = feature[key];
        });

        this._addTests(tests, metricsInfo, resultOrder);
    }

    _addTests(tests, metricsInfo, resultOrder) {
        let that = this;

        let isFirstEntry = true;
        this.testIndexes.forEach(function (testIndex) {
            let test = tests[testIndex];
            if (test !== undefined && test.result !== undefined) {

                //TODO set firstEntry variable correctly

                Object.keys(test.result).forEach(category => {
                    if(that.results.hasOwnProperty(category)){
                        that.results[category].addResult(test);
                    } else {
                        that.results[category] = new CategoryTestResult(category, test, metricsInfo, resultOrder);
                        that.results[category].isFirstEntry = isFirstEntry;
                    }
                    isFirstEntry = false;
                });

            }
        });

        console.log('___________TEST_RESULT');
        console.log(that.results);



    }

}
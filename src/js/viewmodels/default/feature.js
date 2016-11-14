import TestResult from "./test_result";
import {getCapabilityFromId} from "../helpers";

//TODO rename to ViewFeature
export default class Feature {
    constructor(feature, tests) {
        this.lastFeature = false;
        this.results = {} //TestResult

        let that = this;
        Object.keys(feature).forEach(key => {
            that[key] = feature[key];
        });


        this['capability'] = getCapabilityFromId(this.id);
        if (typeof this.capability !== 'string') {
            return;
        }

        if (this.upperBound === '+/-') {
            this['html_standard_class'] = 'standard-col-partial';
        } else {
            this['html_standard_class'] = 'standard-col-res';
        }

        this._addTests(tests);

    }


    _addTests(tests) {
        let that = this;
        this.testIndexes.forEach(function (testIndex) {
            var test = tests[testIndex];
            if (test !== undefined) {

                if (test.result !== undefined && test.result.testResult !== undefined) {
                    that.results[test.engineID] = new TestResult(test, that); // test.result;
                }

                //addSupportStatus(construct, test);
            }
        });

    }

}
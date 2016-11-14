import {getResultClass} from "../default_view_model";

export default class TestResult {
    constructor(test, feature) {
        let that = this;
        Object.keys(test).forEach(key => {
            that[key] = test[key];
        });
        this.html = this._getHtmTestResult(test.result.testResult, feature.upperBound, feature.capability);
        this.html_class = getResultClass(test.result.testSuccessful, this.html, feature.upperBound);
    }

    _getHtmTestResult(result, upperBound, capability) {
        if (result === '+') {
            if (capability === 'expressiveness') {
                return upperBound;
            }
            return '✔';
        } else if (result === '-') {
            return (capability === 'expressiveness') ? '━' : '✖';
        } else if (result === true) {
            return '✔';
        } else if (result === false) {
            return '✖';
        } else if (result === '+/-') {
            return '+/-';
        }
    }
}

import {getResultClass} from "./default_view_model";
import {getHtmlTestResult} from "../helpers";


export default class TestResult {
    constructor(test, feature) {
        let that = this;
        Object.keys(test).forEach(key => {
            that[key] = test[key];
        });

        this.html = getHtmlTestResult(test.result.testResult, feature.upperBound, feature.capability);
        this.html_class = getResultClass(test.result.testSuccessful, this.html, feature.upperBound);
    }
}

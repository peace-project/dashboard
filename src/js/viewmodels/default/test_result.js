import {getResultClass} from "./default_view_model";
import {getHtmlTestResult} from "../helpers";
import {getDateFromTimestamp} from "../helpers";
import {createLinkFromPaths} from "../helpers";
import {formatTestCase} from "../helpers";


export default class TestResult {
    constructor(test, feature) {
        let that = this;
        Object.keys(test).forEach(key => {
            that[key] = test[key];
        });

        this.html = getHtmlTestResult(test.result.testResult, feature.upperBound, feature.capability);
        this.html_class = getResultClass(test.result.testSuccessful, this.html, feature.upperBound);

        this.result['testDeployableHtml'] =  getHtmlTestResult(test.result.testDeployable);
        this.result['testSuccessfulHtml'] =  getHtmlTestResult(test.result.testSuccessful);

        this.executionDuration = test.executionDuration.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.executionTimestamp =  getDateFromTimestamp(test.executionTimestamp);

        this.testCases = test.testCases.map(formatTestCase);
        this['engineDependentFilePaths'] = createLinkFromPaths(test.engineDependentFiles);
        this['logFilePaths']  = createLinkFromPaths(test.logFiles);
    }
}

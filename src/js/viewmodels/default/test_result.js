import {getResultClass} from "./default_view_model";
import {getHtmlTestResult} from "../helpers";
import {getDateFromTimestamp} from "../helpers";
import {createLinkFromPaths} from "../helpers";
import {formatTestCase} from "../helpers";

//TODO rename in Metric?
export default class TestResult {
    constructor(metric) {
        let that = this;
        console.log('ADDD metric ' + metric)
        console.log(metric)


        /*
         Object.keys(test).forEach(key => {
         that[key] = test[key];
         });*/


        this.html = getHtmlTestResult(this.testResult, feature.capability);
        this.html_class = getResultClass(this.testSuccessful, this.html, feature.upperBound);

        this.result['testDeployableHtml'] = getHtmlTestResult(this.testDeployable);
        this.result['testSuccessfulHtml'] = getHtmlTestResult(this.testSuccessful);

        this.executionDuration = test.executionDuration.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.executionTimestamp = getDateFromTimestamp(test.executionTimestamp);

        this.testCases = this.testCases.map(formatTestCase);
        this['engineDependentFilePaths'] = createLinkFromPaths(test.engineDependentFiles);
        this['logFilePaths'] = createLinkFromPaths(test.logFiles);
    }


}

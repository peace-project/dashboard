import {shallowCopy} from "../utils";
import {getHtmlTestResult} from "../viewmodels/helpers";
import {getDateFromTimestamp} from "../viewmodels/helpers";
import {formatTestCase} from "../viewmodels/helpers";
import {createLinkFromPaths} from "../viewmodels/helpers";

//Use for clone/copy and to introduce index
export default class DefaultTestData {

    constructor(tests) {
        let that = this;
        this.tests = tests.map((test, index) => {
            let copiedTest = that._formatTestResult(that._copy(test));
            copiedTest['index'] = index;
            return copiedTest;
        });
    }

    _formatTestResult(test) {
        test.result['testDeployableHtml'] = getHtmlTestResult(test.result.testDeployable);
        test.result['testSuccessfulHtml'] = getHtmlTestResult(test.result.testSuccessful);

        test.executionDuration = test.executionDuration.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        test.executionTimestamp = getDateFromTimestamp(test.executionTimestamp);

        test.testCases = test.testCases.map(formatTestCase);
        test['engineDependentFilePaths'] = createLinkFromPaths(test.engineDependentFiles);
        test['logFilePaths'] = createLinkFromPaths(test.logFiles);
        //testDeployable

        return test;
    }

    getAll() {
        let that = this;
        return this.tests.map((test, index) => {
            let copiedTest = that._copy(test);
            copiedTest['index'] = index;
            return copiedTest;
        });
    }

    _copy(test) {

        return {
            "result": {
                "testCaseSuccesses": test.result.testCaseSuccesses,
                "testCases": test.result.testCases,
                "testDeployable": test.result.testDeployable,
                "testCaseFailures": test.result.testCaseFailures,
                "testSuccessful": test.result.testSuccessful,
                "testResult": test.result.testResult,
                "testDeployableHtml": test.result.testDeployableHtml || undefined,
                "testSuccessfulHtml": test.result.testSuccessfulHtml || undefined
            },
            "logFiles": shallowCopy(test.logFiles),
            "testCases": shallowCopy(test.testCases),
            "executionDuration": test.executionDuration,
            "featureID": test.featureID,
            "tool": {
                "toolID": test.tool.toolID,
                "name": test.tool.name,
                "version": test.tool.version
            },
            "engineID": test.engineID,
            "executionTimestamp": test.executionTimestamp,
            "engineDependentFiles": shallowCopy(test.engineDependentFiles),
            "engineDependentFilePaths": (test.engineDependentFilePaths !== undefined) ? this._copyPaths(test.engineDependentFilePaths) : undefined,
            "logFilePaths": (test.logFilePaths !== undefined) ? this._copyPaths(test.logFilePaths) : undefined,
        };

    }

    _copyPaths(pathArray) {
        return pathArray.map(f => {
                return {title: f.title, url: f.url}
            }
        );
    }
}
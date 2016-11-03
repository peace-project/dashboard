import {shallowCopy} from "../utils";

//Use for clone/copy and to introduce index
export default class TestDataModel  {

    constructor(tests){
        let that = this;
        this.tests = tests.map((test, index) => {
            let copiedTest = that._copy(test);
            copiedTest['index'] = index;
            return copiedTest;
        });
    }

    getAll(){
        let that = this;
        return this.tests.map((test, index) => {
            let copiedTest = that._copy(test);
            copiedTest['index'] = index;
            return copiedTest;
        });
    }

    _copy(test){

        return {
            "result": {
                "testCaseSuccesses": test.result.testCaseSuccesses,
                "testCases": test.result.testCases,
                "testDeployable": test.result.testDeployable,
                "testCaseFailures": test.result.testCaseFailures,
                "testSuccessful": test.result.testSuccessful,
                "testResult": test.result.testResult
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
            "engineDependentFiles": shallowCopy(test.engineDependentFiles)
        };

    }

}
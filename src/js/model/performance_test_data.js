import {shallowCopy} from "../utils";
import {copyShallowObject} from "../utils";
export default class PerformanceTestData {

    constructor(tests){
        //TODO duplicate code see DefaultTestData
        let that = this;
        this.tests = tests.map((test, index) => {
            let copiedTest = that._copy(test);
            copiedTest['index'] = index;
            return copiedTest;
        });

        console.log(tests);
        console.log('_________________-');
        console.log(this.tests);

    }

    getAll(){
        //TODO duplicate code see DefaultTestData
        let that = this;
        return this.tests.map((test, index) => {
            let copiedTest = that._copy(test);
            copiedTest['index'] = index;
            return copiedTest;
        });
    }

    _copy(test){
        return {
            "featureID": test.featureID,
            "tool": {
                "toolID": test.tool.toolID,
                "name": test.tool.name,
                "version": test.tool.version
            },
            "engineID": test.engineID,
            "result": {
                "performance": {
                    "process_duration": copyShallowObject(test.result.performance.process_duration),
                    "throughput":  copyShallowObject(test.result.performance.throughput),
                    "number_of_process_instances": copyShallowObject(test.result.performance.number_of_process_instances)
                },
                "resource_utilisation": {
                    "cpu": copyShallowObject(test.result.resource_utilisation.cpu),
                    "ram": copyShallowObject(test.result.resource_utilisation.ram),
                    "io": copyShallowObject(test.result.resource_utilisation.io),
                    "size_of_stored_data": copyShallowObject(test.result.resource_utilisation.size_of_stored_data)
                }
            },
            "engineDependentFiles": shallowCopy(test.engineDependentFiles),
            "additionalData": test.additionalData.map(data => {
                let copy = {};
                if(data.hasOwnProperty('environment')){
                    Object.keys(data['environment']).forEach(key => {
                        copy[key] = copyShallowObject(data['environment'][key]);
                    });
                }
                return copy;
            })
        }
    }


}
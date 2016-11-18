import {shallowCopy} from "../utils";
import {shallowObjectCopy} from "../utils";
export default class PerformanceTestData {

    constructor(tests){
        //TODO duplicate code see DefaultTestData
        let that = this;
        this.tests = tests.map((test, index) => {
            let copiedTest = that._copy(test);
            copiedTest['index'] = index;
            return copiedTest;
        });
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
                    "process_duration": shallowObjectCopy(test.result.performance.process_duration),
                    "throughput":  shallowObjectCopy(test.result.performance.throughput),
                    "number_of_process_instances": shallowObjectCopy(test.result.performance.number_of_process_instances)
                },
                "resource_utilisation": {
                    "cpu": shallowObjectCopy(test.result.resource_utilisation.cpu),
                    "ram": shallowObjectCopy(test.result.resource_utilisation.ram),
                    "io": shallowObjectCopy(test.result.resource_utilisation.io),
                    "size_of_stored_data": shallowObjectCopy(test.result.resource_utilisation.size_of_stored_data)
                }
            },
            "engineDependentFiles": shallowCopy(test.engineDependentFiles),
            "additionalData": test.additionalData.map(data => {
                let copy = {};
                if(data.hasOwnProperty('environment')){
                    copy['environment'] = {};
                    Object.keys(data['environment']).forEach(key => {
                        copy['environment'][key] = shallowObjectCopy(data['environment'][key]);
                    });

                }
                return copy;
            })
        }
    }


}
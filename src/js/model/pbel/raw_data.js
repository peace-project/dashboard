export default class RawDataModel {

    constructor(data) {


        //this.capabilities = data.pebl.benchmark.capabilities;
        this.metricTypes = data.pebl.benchmark.metricTypes;
        this._independentTests = data.pebl.benchmark.tests.test;
        this._tests = data.pebl.result.testResults.testResult;

        //TODO rename to capabilities
        this._capabilities = data.pebl.benchmark.capabilities.capability;
        this._engines = data.pebl.result.engines.engine;
        this.tools = data.pebl.result.tools;
        //this.tests = data.pebl.result.featureResults;
        //this.metrics = data.metrics;
       // this.independentTests = data.pebl.result.testResults;

        //this['data'] = dataTypes;
        console.log(this._tests);
    }



    getTestsByCapability(capability){
        return this._tests.filter(function (test) {
            let cap = test['test'].split('__')[0];
            return cap.toLowerCase() === capability.toLowerCase();
        });
    }


    getIndependentTestsByCapability(capability){
        return this._independentTests.filter(function (test) {
            let cap = test.feature.split('__')[0];
            return cap.toLowerCase() === capability.toLowerCase();
        });
    }

/*
    getFeatureTree() {
        return this.featureTree;
    } */

    getFeatureTreeByCapability(capability) {
        return _.find(this._capabilities, function(feature){
            return feature.id.toLowerCase() === capability.toLowerCase();
        });
    }

    getEngines() {
        return this._engines;
    }
}
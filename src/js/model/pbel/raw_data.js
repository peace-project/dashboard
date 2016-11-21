export default class RawDataModel {

    constructor(data) {


        //this.capabilities = data.pebl.benchmark.capabilities;
        this.metricTypes = data.pebl.benchmark.metricTypes;
        this._independentTests = data.pebl.benchmark.tests;
        this._testResults = data.pebl.result.testResults;
        this._featureResults = data.pebl.result.featureResults;

        //TODO rename to capabilities
        this._capabilities = data.pebl.benchmark.capabilities;
        this._engines = data.pebl.result.engines;
        this._tools = data.pebl.result.tools;
        //this.tests = data.pebl.result.featureResults;
        //this.metrics = data.metrics;
        // this.independentTests = data.pebl.result.testResults;

        //this['data'] = dataTypes;
        //console.log(data.pebl.result);
    }


    getFeatureResultsByCapability(capability) {
        let that = this;
        return this._featureResults.filter(test => that._getMeasurementByCapability(test, capability));
    }

    getTestResultsByCapability(capability) {
        let that = this;
        return this._testResults.filter(result => {
            let cap = result.test.split('__')[0];
            return cap.toLowerCase() === capability.toLowerCase();
        });
    }

    _getMeasurementByCapability(test, capability) {
        return test.measurements.filter(measure => {
            let cap = measure.metric.split('__')[0];
            return cap.toLowerCase() === capability.toLowerCase();

        });
    }


    getIndependentTestsByCapability(capability) {
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
        return _.find(this._capabilities, function (feature) {
            return feature.id.toLowerCase() === capability.toLowerCase();
        });
    }

    getEngines() {
        return this._engines;
    }
}
export default class RawDataModel {

    constructor(data) {
        //this.capabilities = data.pebl.benchmark.capabilities;
        this._metricTypes = data.pebl.benchmark.metricTypes;
        this._independentTests = data.pebl.benchmark.tests;
        this._testResults = data.pebl.result.testResults;
        this._aggregatedResults = data.pebl.result.aggregatedResults;

        //TODO rename to capabilities
        this._capabilities = data.pebl.benchmark.capabilities;
        this._engines = data.pebl.result.engines;
    }


    getAggregatedResultsByCapability(capability) {
        let that = this;
        return this._aggregatedResults.filter(test => that._getMeasurementByCapability(test, capability));
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

    getMetrics(){
        return this._metricTypes;

    }
}
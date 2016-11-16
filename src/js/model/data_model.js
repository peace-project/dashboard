
export default class DataModel {

    constructor(data) {
        this.featureTree = data.featureTree;
        this.engines = data.engines;
        this.tests = data.tests;
        this.metrics = data.metrics;
        this.independentTests = data.independentTests;

        this._filterCapability = function(capability) {
            return function (test) {
                let cap = test.featureID.split('__')[0];
                return cap.toLowerCase() === capability.toLowerCase();
            }
        }
    }

    getTests() {
        return this.tests
    }

    getIndependentTestsByCapability(capability){
        return this.independentTests.filter(this._filterCapability(capability));
    }

    getTestsByCapability(capability){
        return this.tests.filter(this._filterCapability(capability));
    }

    getFeatureTree() {
        return this.featureTree;
    }

    getFeatureTreeByCapability(capability) {
        return _.find(this.featureTree, function(feature){
            return feature.id.toLowerCase() === capability.toLowerCase();
        });
    }

    getEngines() {
        return this.engines;
    }

    getMetrics() {
        return this.metrics[0];
    }
}
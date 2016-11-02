
export default class DataModel {

    constructor(data) {
        this.featureTree = data.featureTree;
        this.engines = data.engines;
        this.tests = data.tests;
        this.metrics = data.metrics;
    }

    getTests() {
        return this.tests
    }

    getTestsByCapability(capability){
        //console.log(this.tests);
        return this.tests.filter(function(test){
            let cap = test.featureID.split('__')[0];
            //console.log(cap.toLowerCase() + '===' +capability.toLowerCase());
            return cap.toLowerCase() === capability.toLowerCase();
        });
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
        return this.metrics;
    }
}
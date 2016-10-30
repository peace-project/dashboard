
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

    getAllFeatureTree() {
        return this.featureTree;
    }

    getFeatureTreeByCapability(capability) {
        return _.find(this.featureTree, function(feature){
            return feature.id.toLowerCase() == capability.toLowerCase();
        });
    }

    getEngines() {
        return this.engines;
    }

    getMetrics() {
        return this.metrics;
    }
}
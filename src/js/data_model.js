
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

    getFeatureTree() {
        return this.featureTree;
    }

    getEngines() {
        return this.engines;
    }

    getMetrics() {
        return this.metrics;
    }
}
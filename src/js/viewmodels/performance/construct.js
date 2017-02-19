import Feature from "./feature";

export default class Construct {
    constructor(construct) {
        let that = this;
        Object.keys(construct).forEach(key => {
            that[key] = construct[key];
        });
        this.features = [];
    }

    addFeatures(features, testResults, metricsInfo, resultOrder) {
        let that = this;
        console.log('__this.featuresIndexes');
        console.log(this.featuresIndexes);
        this.featuresIndexes.forEach(index => {
            let feature = features[index];
            if (feature === undefined || feature.testResultIndex.length < 1) {
                return;
            }

            let viewFeature = new Feature(feature, testResults, metricsInfo, resultOrder);
            console.log(viewFeature);
            that.features.push(viewFeature);
        });
    }
}
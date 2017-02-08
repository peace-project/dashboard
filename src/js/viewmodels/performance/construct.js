import Feature from "./feature";

export default class Construct {
    constructor(construct) {
        let that = this;
        Object.keys(construct).forEach(key => {
            that[key] = construct[key];
        });
        this.features = [];
    }

    addFeatures(features, tests, metricsInfo, resultOrder) {
        let that = this;
        console.log('this.featuresIndexes')
        this.featuresIndexes.forEach(index => {
            let feature = features[index];
            console.log(feature )

            if (feature === undefined || feature.testResultIndex.length < 1) {
                return;
            }

            let viewFeature = new Feature(feature, tests, metricsInfo, resultOrder);
            that.features.push(viewFeature);
        });
    }
}
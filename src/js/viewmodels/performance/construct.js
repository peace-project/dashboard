import Feature from "./feature";

export default class Construct {
    constructor(construct) {
        let that = this;
        Object.keys(construct).forEach(key => {
            that[key] = construct[key];
        });
        this.features = [];
    }

    addFeatures(features, tests, metricsInfo) {

        let that = this;
        this.featureIndexes.forEach(index => {

            let feature = features[index];
            if (feature === undefined || feature.testIndexes.length < 1) {
                return;
            }



            let viewFeature = new Feature(feature, tests, metricsInfo);

            console.log('_______ADDD FEATURE')
            console.log(viewFeature)
            that.features.push(viewFeature);
        });
    }
}
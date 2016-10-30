
export default class NormalizedFeature {
    constructor(feature, groupIndex, constructIndex, featureIndex, testIndexes) {
        this.name = feature.name.replaceAll('_', ' ');
        this.id = feature.id;
        this.description = feature.description;
        this.upperBound = feature.upperBound;
        this.lastFeature = false;
        //this.groupId = group.id;
        //this.groupName = capitalizeFirstLetter(group.name.replaceAll('_', ' '));
        this.groupIndex = groupIndex;
        this.constructIndex = constructIndex;
        this.featureIndex = featureIndex;
        this.testIndexes = testIndexes;
    }
}
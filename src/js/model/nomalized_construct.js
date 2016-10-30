export default class NormalizedConstruct {
    constructor(construct, groupIndex, featureIndexes) {
        this.name = construct.name.replaceAll('_', ' ');
        this.description = construct.description;
        this.id = construct.id;
        this.isFirstEntry = false;
        //this.groupId = group.id;
        //this.groupName = capitalizeFirstLetter(group.name.replaceAll('_', ' '));
        //this.groupDesc = group.description;
        this.groupIndex = groupIndex;
        this.featureIndexes = featureIndexes;
    }
}


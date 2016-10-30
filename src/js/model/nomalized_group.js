export default class NormalizedGroup {
    constructor(group) {
        this.id = group.id;
        this.name = group.name;
        this.description = group.description;
        this.constructIndexes = group.constructIndexes;
    }
}
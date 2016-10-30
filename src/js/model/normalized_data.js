import NormalizedGroup from "./nomalized_group";
export default class NormalizedData {
    constructor(data){
        this.language = data.language;
        this.groups = new NormalizedGroup(data.groups);
        this.constructs = new NormalizedConstruct(data.constructs);
        this.features = new NormalizedGroup(data.features);
        this.engines = new NormalizedGroup(data.engines);
    }
}
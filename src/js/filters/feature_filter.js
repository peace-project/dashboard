import Filter from "./filter";

export default class FeatureFilter extends Filter{
    constructor() {
        super(FeatureFilter.Name());
    }

    static Name(){ return 'features'};


}
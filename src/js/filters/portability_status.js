import Filter from "./filter";

export const PortabilityStatus = {
    ALL : 0,
    ONLY : 1,
    WITH : 2,
    NOT_SAME : 3
}

export default class PortabilityFilter extends Filter{
    constructor() {
        super(PortabilityFilter.Name());
    }

    static Name(){ return 'portability_status'};
}
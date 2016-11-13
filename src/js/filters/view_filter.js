'use strict';

export default class ViewFilter {
    constructor(name) {
        this.name = name;
    }


    getName() {
        return this.name;
    }

    getDefaultFilterValues() {
        throw Error("Unsupported operation in Filter " + this.name);
    }

    applyFilter(viewModel, filterValues) {
        throw Error("Unsupported operation in Filter " + this.name);
    }
}
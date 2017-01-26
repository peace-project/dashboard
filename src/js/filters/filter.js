'use strict';

export default class Filter {
    constructor(name) {
        this.name = name;
        this.requiredFilteredValues = [];
    }

    getName() {
        return this.name;
    }

    setDependentFilters(filterNames) {
        this.filterNames = filterNames;
    }

    getDependentFilters() {
        return this.filterNames;
    }

    getDefaultFilterValues(language, data) {
        throw Error("Unsupported operation in Filter " + this.name);
    }

    hasRequiredFilterValues(filterValues) {
        let hasMissingValue = this.requiredFilteredValues.some((val, index, array) => {
            return !filterValues.hasOwnProperty(val)
        });

        if (hasMissingValue) {
            console.error("Filter <<" + this.getName() + '>> cannot be applied. Required filterValues ['
                + this.requiredFilteredValues.join(', ') + '] are missing');
            return false;
        }

        return true;
    }

    applyFilter(capabilityData, filteredData, filterValues, filterValuesChanges) {
        throw Error("Unsupported operation in Filter " + this.name);
    }

    copyFilterValues(filterValues) {
        let values = {};
        Object.keys(filterValues).forEach(key => {
            values[key] = {index: filterValues[key].index};
        });
        return values;
    }
}
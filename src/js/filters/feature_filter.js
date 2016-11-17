'use strict';

import Filter from "./filter";

export default class FeatureFilter extends Filter {
    constructor() {
        super(FeatureFilter.Name());
        this.requiredFilteredValues = ['language', 'features'];
    }

    static Name() {
        return 'features'
    };

    //TODO move to filter class
    createFilterValues(feature) {
        var values = {};
        feature.data.forEach((obj) => {
            values[obj.name] = {index: obj.index}
        });
        return values;
    }

    getDefaultFilterValues(language, data) {
        return this.createFilterValues(data.getAllFeaturesByLanguage(language));
    }

    applyFilter(capabilityData, testData, filteredData, filterValues, filterValuesChanges) {
        console.log('Apply ' + this.getName() + ' filter');

        if (!this.hasRequiredFilterValues(filterValues)) {
            return;
        }

        if (filteredData.features.data === undefined) {
            console.error('No features capabilityData to filter');
            return;
        }

        Object.keys(filterValuesChanges.addedValues).forEach(key => {
            let filterValue = filterValuesChanges.addedValues[key];
            filteredData.features.data[filterValue.index] = capabilityData.getFeatureByIndex(filterValues.language, filterValue.index);
        });

        let countFilterFeatures = Object.keys(filterValues.features).length;
        filteredData.features.data.forEach(function (feature, index) {
            if (feature !== undefined) {
                var filterPredicate = (countFilterFeatures === 0) ? false : !filterValues.features.hasOwnProperty(feature.name);
                let constructIsFilteredOut = (filteredData.constructs.data[feature.constructsIndex] === undefined);
                if (feature !== undefined && (filterPredicate || constructIsFilteredOut)) {
                    filteredData.features.data[index] = undefined;
                    delete filterValues.features[feature.name];
                }
            }
        });
    }
}
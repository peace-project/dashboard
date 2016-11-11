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

    applyFilter(capabilityData, testData, filteredData, filterValues) {
        console.log('Apply ' + this.getName() + ' filter');

        if (!this.hasRequiredFilterValues(filterValues)) {
            return;
        }
        if (filteredData.features.data === undefined) {
            console.error('No features capabilityData to filter');
            return;
        }

        this.countFilterFeatures = Object.keys(filterValues.features).length;

        let _filterValues = filterValues;
        if (this.countFilterFeatures === 0) {
            console.log('IS_____________NULL');
            _filterValues['features'] = this.getDefaultFilterValues(filterValues.language, capabilityData);
        }

        var missingKeys = this.isFilteredDataEnough(filteredData.features.data, _filterValues);
        missingKeys.forEach(function (index) {
            filteredData.features.data[index] = capabilityData.getFeatureByIndex(filterValues.language, index);
        });

        let that = this;
        filteredData.features.data.forEach(function (feature, index) {
            if (feature !== undefined) {
                var filterPredicate = (that.countFilterFeatures === 0) ? false : !filterValues.features.hasOwnProperty(feature.name);
                let constructIsFilteredOut = (filteredData.constructs.data[feature.constructIndex] === undefined);
                if (feature !== undefined && (filterPredicate || constructIsFilteredOut)) {
                    filteredData.features.data[index] = undefined;
                }
            }
        });


    }

    isFilteredDataEnough(filteredFeatureData, filterValues) {
        var missingKeys = [];
        Object.keys(filterValues.features).forEach(function (key) {
            let index = filterValues.features[key].index;
            let feature = filteredFeatureData[index];

            let isMissing = feature === undefined;
            if (isMissing) {
                missingKeys.push(index);
            }
        });
        return missingKeys;

    }

}
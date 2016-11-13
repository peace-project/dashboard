'use strict';

import Filter from "./filter";

export default class GroupFilter extends Filter {
    constructor() {
        super(GroupFilter.Name());
        this.requiredFilteredValues = ['language', 'groups'];
    }

    static Name() {
        return 'groups'
    }

    createFilterValues(groups) {
        var values = {};
        groups.data.forEach((obj) => {
            values[obj.name] = {index: obj.index}
        });
        return values;
    }

    getDefaultFilterValues(language, data) {
        return this.createFilterValues(data.getAllGroupsByLanguage(language));
    }

    applyFilter(capabilityData, testData, filteredData, filterValues, filterValuesChanges) {
        console.log('Apply Group filter');

        if (!this.hasRequiredFilterValues(filterValues)) {
            return;
        }

        if (filteredData.groups.data === undefined) {
            console.error('No features capabilityData to filter');
            return;
        }

        Object.keys(filterValuesChanges.addedValues).forEach(key => {
            let filterValue = filterValuesChanges.addedValues[key];
            filteredData.groups.data[filterValue.index] = capabilityData.getGroupByIndex(filterValues.language, filterValue.index);

            // So a new group has been added now.
            // But if some constructs were selected (i.e. anything else than All) before selecting this group,
            // all constructs of the newly selected group wont showing up because the 'filterValues.constructs'
            // only contains constructs of the old groups. Thus, we must update the filterValues.constructs before
            // applying {@link ConstructFilter} filter

            let constructIndexes = filteredData.groups.data[filterValue.index].constructIndexes;
            constructIndexes.forEach(function (index) {
                filteredData.constructs.data[index] = capabilityData.getConstructByIndex(filterValues.language, index);

                let featureIndexes = filteredData.constructs.data[index].featureIndexes;
                featureIndexes.forEach(function (index) {
                    filteredData.features.data[index] = capabilityData.getFeatureByIndex(filterValues.language, index);
                });
            });
        });

        let that = this;
        let countFilterGroups = Object.keys(filterValues.groups).length;
        filteredData.groups.data.forEach(function (group, index) {
            if (group !== undefined) {
                // We don't filter if no groups is selected (countFilterGroups ==0) since showing no data by
                // removing all groups does not make sense
                var filterPredicate = (countFilterGroups === 0) ? false : !filterValues.groups.hasOwnProperty(group.name);
                if (filterPredicate) {
                    filteredData.groups.data[index] = undefined;
                } else if (Object.keys(filterValuesChanges.addedValues).length > 0) {
                    // If a group has been added, then return to default setting where all constructs and all
                    // features are selected
                    that._updateFilterValues(group, capabilityData, filterValues);
                }
            }
        });

    }

    _updateFilterValues(group, capabilityData, filterValues) {
        group.constructIndexes.forEach(function (index) {
            let construct = capabilityData.getConstructByIndex(filterValues.language, index);
            filterValues.constructs[construct.name] = {index: index};

            construct.featureIndexes.forEach(function (fIndex) {
                let feature = capabilityData.getFeatureByIndex(filterValues.language, fIndex);
                filterValues.features[feature.name] = {index: fIndex};
            });

        });
    }

}
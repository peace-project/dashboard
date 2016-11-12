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
        });


        let countFilterGroups = Object.keys(filterValues.groups).length;
        filteredData.groups.data.forEach(function (group, index) {
            if (group !== undefined) {
                // We don't filter if no groups is selected (countFilterGroups ==0) since showing no data by
                // removing all groups does not make sense
                var filterPredicate = (countFilterGroups === 0) ? false : !filterValues.groups.hasOwnProperty(group.name);
                if (filterPredicate) {
                    filteredData.groups.data[index] = undefined;
                }
            }
        });

    }
}
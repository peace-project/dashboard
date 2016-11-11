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

    applyFilter(capabilityData, testData, filteredData, filterValues) {
        console.log('Apply Group filter');

        if (!this.hasRequiredFilterValues(filterValues)) {
            return;
        }

        if (filteredData.groups.data === undefined) {
            console.error('No features capabilityData to filter');
            return;
        }

        this.countFilterGroups = Object.keys(filterValues.groups).length;

        let _filterValues = filterValues;
        if (this.countFilterGroups === 0) {
            console.log('IS_____________NULL');
            _filterValues['groups'] = this.getDefaultFilterValues(filterValues.language, capabilityData);
        }

        var missingKeys = this.isFilteredDataEnough(filteredData.groups.data, _filterValues);
        let that = this;

        missingKeys.forEach(function (index) {
            filteredData.groups.data[index] = capabilityData.getGroupByIndex(filterValues.language, index);

            // So a new group has been added now.
            // But if some constructs were selected (i.e. anything else than All) before selecting this group,
            // all constructs of the newly selected group wont showing up because the 'filterValues.constructs'
            // only contains constructs of the old groups. Thus, we must update the filterValues.constructs before
            // applying  {@link ConstructFilter} filter
            that.addConstructsByGroup(filteredData.groups.data[index].constructIndexes, capabilityData, filterValues);
        });

        filteredData.groups.data.forEach(function (group, index) {
            if (group !== undefined) {
                // We don't filter if no groups is selected (countFilterGroups ==0) since showing no data by
                // removing all groups does not make sense
                var filterPredicate = (that.countFilterGroups === 0) ? false : !filterValues.groups.hasOwnProperty(group.name);
                if (filterPredicate) {
                    filteredData.groups.data[index] = undefined;
                }
            }
        });

    }

    isFilteredDataEnough(filteredGroupData, filterValues) {
        let missingKeys = [];
        Object.keys(filterValues.groups).forEach(function (key) {
            let index = filterValues.groups[key].index;
            let group = filteredGroupData[index];

            let isMissing = group === undefined;
            if (isMissing) {
                missingKeys.push(index);
            }
        });
        return missingKeys;
    }


    addConstructsByGroup(constructIndexes, data, filterValues) {
        if (Object.keys(filterValues.constructs).length === 0) {
            return;
        }
        constructIndexes.forEach(function (constructID) {
            let construct = data.getConstructByIndex(filterValues.language, constructID);
            if (!filterValues.constructs.hasOwnProperty(construct.name)) {
                filterValues.constructs[construct.name] = {index: construct.index};
            }
        });
    }


}
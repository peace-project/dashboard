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
            values[obj.name] = { index: obj.index}
        });
        return values;
    }

    getRealFilterValues(filterValues, data){
        let realFilterValues = filterValues;
        if (this.countFilterGroups === 0) {
            realFilterValues['groups'] = this.createFilterValues(data.getAllGroupsByLanguage(filterValues.language));
        }
        return realFilterValues;
    }

    applyFilter(capabilityData, testData, filteredData, filterValues) {
        console.log('Apply Group filter');

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }

        if(filteredData.groups.data === undefined ){
            console.error('No features capabilityData to filter');
            return;
        }

        this.countFilterGroups = Object.keys(filterValues.groups).length;

        let realFilterValues = this.getRealFilterValues(filterValues, capabilityData);
        var missingKeys = this.isFilteredDataEnough(filteredData.groups.data, realFilterValues);
        let that = this;

        missingKeys.forEach(function (index) {
            //TODO use own deep copy method
            filteredData.groups.data[index] = capabilityData.getGroupByIndex(filterValues.language, index);
            //TODO can we move this to ConstructFilter
            //that.addNewGroupsToFilters(filteredData.groups.data[index].constructIndexes, capabilityData, filterValues);
        });

        filteredData.groups.data.forEach(function (group, index) {
            if (group !== undefined) {
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


    //If any construct filter option is turned on, then checks constructs of this newly added group
    // if none of the filter options are checked (i.e. == 'all') every construct should be shown anyway
    addNewGroupsToFilters(constructIndexes, data, filterValues) {
        if (Object.keys(filterValues.constructs).length > 0) {
            constructIndexes.forEach(function (constructID) {
                console.log(data);
                let construct = data.getConstructByIndex(constructID);
                if (filterValues.constructs.indexOf(construct.name) == -1) {
                    filterValues.constructs.push(construct.name);
                }
            });
        }
    }


}
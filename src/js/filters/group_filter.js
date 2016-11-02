import Filter from "./filter";


export default class GroupFilter extends Filter {
    constructor() {
        super(GroupFilter.Name());
        this.requiredFilteredValues = ['language', 'groups'];
    }

    static Name() {
        return 'groups'
    };


    createFilterValues(groups) {
        var values = {};
        groups.data.forEach((obj) => {
            values[obj.name] = { index: obj.index}
        });
        return values;
    }

    getRealFilterValues(filterValues, data){
        let realFilterValues = filterValues;
        if (filterValues.groups.length == 0) {
            realFilterValues['groups'] = this.createFilterValues(data.getAllGroupsByLanguage(filterValues.language));
        }
        return realFilterValues;
    }


    applyFilter(data, filteredData, filterValues) {
        console.log('Apply Group filter');

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }
        if(filteredData.groups.data === undefined ){
            console.error('No features data to filter');
            return;
        }

        let realFilterValues = this.getRealFilterValues(filterValues, data);
        var missingKeys = this.isFilteredDataEnough(filteredData.groups.data, realFilterValues);
        missingKeys.forEach(function (index) {
            //TODO use own deep copy method
            filteredData.groups[index] = data.getGroupByIndex(filterValues.language, index);
            //TODO can we move this to ConstructFilter
            this.addNewGroupsToFilters(filteredData.groups[index].constructIndexes, data, filterValues);
        });

        filteredData.groups.data.forEach(function (group, index) {
            if (group !== undefined) {
                var filterPredicate = (filterValues.groups.length == 0) ? false : !filterValues.groups.hasOwnProperty(group.name);
                if (filterPredicate) {
                    filteredData.groups[index] = undefined;
                }
            }
        });
    }

    isFilteredDataEnough(filteredGroupData, filterValues) {

        let missingKeys = [];
        Object.keys(filterValues.groups).forEach(function (key) {
            let index = filterValues.groups[key].index;
            let name = filterValues.groups[key].name;
            let group = filteredGroupData[index];

            let isMissing = group.name === name && group.name === undefined;
            if (isMissing) {
                missingKeys.push(index);
            }
        });
        return missingKeys;
    }


    //If any construct filter option is turned on, then checks constructs of this newly added group
    // if none filter option is checked (i.e. == 'all') every constructs we be shown anyway
    addNewGroupsToFilters(constructIndexes, data, filterValues) {
        if (filterValues.constructs.length > 0) {
            constructIndexes.forEach(function (constructID) {
                let construct = data.getConstructByIndex(constructID);
                if (filterValues.constructs.indexOf(construct.name) == -1) {
                    filterValues.constructs.push(construct.name);
                }
            });
        }
    }


}
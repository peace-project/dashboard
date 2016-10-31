import Filter from "./filter";


export default class GroupFilter extends Filter {
    constructor() {
        super(GroupFilter.Name());
    }

    static Name() {
        return 'groups'
    };

    applyFilter(data, filteredData, filterValues) {
        console.log('Apply Group filter');
        // should we preserve filteredData ?
        var missingKeys = this.isFilteredDataEnough();

        missingKeys.forEach(function (index) {
            //TODO use own deep copy method
            filteredData.groups[index] = data.getGroupByIndex(filterValues.language, index);
            this.addNewGroupsToFilters(filteredData.groups[index].constructIndexes, data, filterValues);
        });


        filteredData.groups.forEach(function (group, index) {
            if (group !== undefined) {
                var filterPredicate = (filterValues.groups.length == 0) ? false : (filterValues.groups.indexOf(group.name) == -1);

                if (filterPredicate) {
                    filteredData.groups[index] = undefined;
                }
            }
        });
    }

    isFilteredDataEnough(filteredFeatureData, filterValues) {

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
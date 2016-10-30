import Filter from "./filter";

export default class GroupFilter extends Filter{
    constructor() {
        super('groups');
    }


    apply(filteredData, filterValues){
        // should we preserve filteredData ?
        var missingKeys = isFilteredDataEnough('groups');
        if (missingKeys.length > 0) {
            missingKeys.forEach(function (groupName) {
                var index = _.findIndex(getNormalizedDataByLang().groups, function (group) {
                    return group.name == groupName
                });
                //TODO use own deep copy method
                filteredData.groups[index] = $.extend(true, {}, getNormalizedDataByLang().groups[index]);
                addNewGroupsToFilters(filteredData.groups[index].constructIndexes);
            });
        }

        filteredData.groups.forEach(function (group, index) {
            if (group !== undefined) {
                var filterPredicate = (filterValues.groups.length == 0) ? false : (filterValues.groups.indexOf(group.name) == -1);

                if (filterPredicate) {
                    filteredData.groups[index] = undefined;
                }
            }
        });
    }


}
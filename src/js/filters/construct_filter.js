import Filter from "./filter";


export default class ConstructFilter extends Filter{

    constructor() {
        super(ConstructFilter.Name());
    }

    static Name(){ return 'constructs'};

    apply(data, filteredData, filterValues){

        var missingKeys = this.isFilteredDataEnough(filteredData, filterValues.constructs);
        if (missingKeys.length > 0) {
            missingKeys.forEach(function (constructName) {
                /*
                var index = _.findIndex(data.constructs, function (construct) {
                    return construct.name == constructName
                }); */
                let construct = data.getConstructByName(filterValues.language, constructName);
                filteredData.constructs[construct.constructor.name] =  data.getConstructByName(filterValues.language, constructName);
            });
        }

        filteredData.constructs.forEach(function (construct, index) {
            if (construct !== undefined) {
                var filterPredicate = (filterValues.constructs.length == 0) ? false : (filterValues.constructs.indexOf(construct.name) == -1);
                if ((filterPredicate || filteredData.groups[construct.groupIndex] == undefined)) {
                    filteredData.constructs[index] = undefined;
                }
            }
        });
    }

    //TODO should return boolean
    isFilteredDataEnough(filteredData, filterValues) {
        var missingKeys = []
        for (var key in filterValues) {
            if (_.findWhere(filteredData.constructs, {name: filterValues[key]}) == undefined) {
                missingKeys.push(filterValues[key]);
            }
        }

    }



}
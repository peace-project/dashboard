import Filter from "./filter";


export default class ConstructFilter extends Filter {

    constructor() {
        super(ConstructFilter.Name());
        this.requiredFilteredValues = ['constructs', 'groups'];
    }

    static Name() {
        return 'constructs'
    };

    createFilterValues(construct) {
        var values = {};
        construct.data.forEach((obj) => {
            values[obj.name] = { index: obj.index}
        });
        return values;
    }

    getRealFilterValues(filterValues, data){
        let realFilterValues = filterValues;
        if (filterValues.constructs.length == 0) {
            realFilterValues['constructs'] = this.createFilterValues(data.getAllConstructsByLanguage(filterValues.language));
        }
        return realFilterValues;
    }


    applyFilter(capabilityData, testData, filteredData, filterValues) {
        console.log('Apply Construct filter');

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }
        if(filteredData.constructs.data === undefined ){
            console.log('No constructs capabilityData to filter');
            return;
        }

        let realFilterValues = this.getRealFilterValues(filterValues, capabilityData);
        var missingKeys = this.isFilteredDataEnough(filteredData.constructs.data, realFilterValues);
        missingKeys.forEach(function (index) {
            filteredData.data.constructs[index] = capabilityData.getConstructByIndex(filterValues.language, index);
        });

        filteredData.constructs.data.forEach(function (construct, index) {
            if (construct !== undefined) {
                var filterPredicate = (filterValues.constructs.length == 0) ? false : !filterValues.constructs.hasOwnProperty(construct.name);
                if (filterPredicate || filteredData.groups.data[construct.groupIndex] == undefined) {
                    console.log('########UNdefined');
                    filteredData.constructs.data[index] = undefined;
                }
            }
        });


    }

    //TODO should return boolean
    isFilteredDataEnough(filteredData, filterValues) {

        let missingKeys = [];
        Object.keys(filterValues.constructs).forEach(function (key) {
            let index = filterValues.constructs[key].index;
            let construct = filteredData[index];


            let isMissing = construct === undefined;
            if (isMissing) {
                missingKeys.push(index);
            }
        });
        return missingKeys;
    }


}
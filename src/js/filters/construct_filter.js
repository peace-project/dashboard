'use strict';

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
        construct.forEach((obj) => {
            values[obj.name] = { index: obj.index}
        });
        return values;
    }



    getDefaultFilterValues(language, data){
        return this.createFilterValues(data.getAllConstructsByLanguage(language).data);
    }


    applyFilter(capabilityData, testData, filteredData, filterValues, filterValuesChanges) {
        console.log('Apply Construct filter');

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }
        if(filteredData.constructs.data === undefined ){
            console.error('No constructs capabilityData to filter');
            return;
        }

        Object.keys(filterValuesChanges.addedValues).forEach(key => {
            let filterValue = filterValuesChanges.addedValues[key];
            filteredData.constructs.data[filterValue.index] = capabilityData.getConstructByIndex(filterValues.language, filterValue.index);
        });

        let countFilterConstructs = Object.keys(filterValues.constructs).length;
        filteredData.constructs.data.forEach(function (construct, index) {
            if (construct !== undefined) {
                var filterPredicate = (countFilterConstructs === 0) ? false : !filterValues.constructs.hasOwnProperty(construct.name);
                if (filterPredicate || filteredData.groups.data[construct.groupIndex] === undefined) {
                    filteredData.constructs.data[index] = undefined;
                }
            }
        });

    }


}
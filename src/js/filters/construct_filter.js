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
        construct.data.forEach((obj) => {
            values[obj.name] = { index: obj.index}
        });
        return values;
    }

    getDefaultFilterValues(language, data){
        return this.createFilterValues(data.getAllConstructsByLanguage(language));
    }


    applyFilter(capabilityData, testData, filteredData, filterValues) {
        console.log('Apply Construct filter');

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }
        if(filteredData.constructs.data === undefined ){
            console.error('No constructs capabilityData to filter');
            return;
        }

        this.countFilterConstructs = Object.keys(filterValues.constructs).length;
        let _filterValues = filterValues;
        if(this.countFilterConstructs === 0){
            _filterValues['constructs'] = this.getDefaultFilterValues(filterValues.language, capabilityData);
        }

        var missingKeys = this.isFilteredDataEnough(filteredData.constructs.data, _filterValues);
        missingKeys.forEach(function (index) {
            filteredData.constructs.data[index] = capabilityData.getConstructByIndex(filterValues.language, index);
        });

        let that = this;
        filteredData.constructs.data.forEach(function (construct, index) {
            if (construct !== undefined) {
                var filterPredicate = (that.countFilterConstructs === 0) ? false : !filterValues.constructs.hasOwnProperty(construct.name);
                if (filterPredicate || filteredData.groups.data[construct.groupIndex] === undefined) {
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
'use strict';

import Filter from "./filter";

export default class TestsFilter extends Filter{

    constructor() {
        super(TestsFilter.Name());
        this.requiredFilteredValues = ['engines'];
    }

    static Name(){ return 'tests'};

    applyFilter(capabilityData, testData, filteredData, filterValues, filterValuesChanges){

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }

        if(filteredData.tests.length === undefined){
            filteredData.tests = testData.getAll();
        }

        console.log('Apply tests filter');
        testData.tests.forEach(function (test, index) {
            if (test !== undefined) {
                if (!filterValues.engines.hasOwnProperty(test.engineID)) {
                  filteredData.tests[index] = undefined;
                } else if(filteredData.tests[index] === undefined) {
                    // Engine has been updated, so add test again
                    filteredData.tests[index] = test;
                }
            }
        });
    }

    copyFilterValues(filterValues){
        return [];
    }
}
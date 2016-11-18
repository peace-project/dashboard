'use strict';

import Filter from "./filter";

export default class TestsFilter extends Filter{

    constructor() {
        super(TestsFilter.Name());
        this.requiredFilteredValues = ['engines'];
    }

    static Name(){ return 'tests'};

    applyFilter(capabilityData, filteredData, filterValues, filterValuesChanges){

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }

        let testData = capabilityData.getAllTestsByLanguage(filterValues.language);
        if(testData === undefined){
            console.log('stop filer. we have found no tests')
            return;
        }

        if(filteredData.tests.length === undefined){
            filteredData.tests = testData.clone();
        }

        console.log('Apply tests filter');
        testData.data.forEach(function (test, index) {
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
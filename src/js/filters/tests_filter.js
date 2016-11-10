'use strict';

import Filter from "./filter";

export default class TestsFilter extends Filter{

    constructor() {
        super(TestsFilter.Name());
        this.requiredFilteredValues = ['engines'];

    }

    static  Name(){ return 'tests'};

    applyFilter(capabilityData, testData, filteredData, filterValues){

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }

        if(filteredData.tests.length === undefined){
            console.log(testData.getAll());
            filteredData.tests = testData.getAll();
        }

        console.log('Apply tests filter');
        //TODO we should use filteredData.tests instead of using raw testData which is huge
        // so implement isMissing here and to iterate over data
        testData.tests.forEach(function (test, index) {
            if (test !== undefined) {
                if (!filterValues.engines.hasOwnProperty(test.engineID)) {
                  //filteredData.tests[index] = undefined;
                }
            }
        });


    }
}
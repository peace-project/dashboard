import Filter from "./filter";




export default class TestsFilter extends Filter{

    constructor() {
        super(TestsFilter.Name());
        this.requiredFilteredValues = ['engines'];

    }

    static  Name(){ return 'tests'};

    applyFilter(data, filteredData, filterValues){

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }

        console.log('Apply tests filter');
        filteredData.tests.forEach(function (test, index) {
            if (test !== undefined) {
                if (!filterValues.engines.hasOwnProperty(test.engineID)) {
                    filteredData.tests[index] = undefined;
                }
            }
        });
    }
}
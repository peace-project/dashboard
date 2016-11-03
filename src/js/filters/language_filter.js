import Filter from "./filter";




export default class LanguageFilter extends Filter{

    constructor() {
        super(LanguageFilter.Name());
        this.requiredFilteredValues = ['language', 'groups'];

    }

    static  Name(){ return 'language'};

    applyFilter(capabilityData, testData, filteredData, filterValues){
        if (filterValues.language == undefined) {
            filterValues.language = 'BPMN';
        }

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }

        console.log('Apply language filter');
        capabilityData.copyByLang(filterValues.language, filteredData);
    }
}
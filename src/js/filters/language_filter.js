import Filter from "./filter";




export default class LanguageFilter extends Filter{

    constructor() {
        super(LanguageFilter.Name());
    }

    static  Name(){ return 'language'};

    applyFilter(data, filteredData, filterValues){
        if (filterValues.language == undefined) {
            filterValues.language = 'BPMN'
        }
        console.log('Apply language filter');
        data.cloneByLang(filterValues.language, filteredData);
    }

}
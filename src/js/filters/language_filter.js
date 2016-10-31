import Filter from "./filter";




export default class LanguageFilter extends Filter{

    constructor() {
        super(LanguageFilter.Name);
    }

    static Name() { return 'language'};

    apply(data, filteredData, filterValues){
        if (filterValues.language == undefined) {
            filterValues.language = 'BPMN'
        }

        data.cloneByLang(filterValues.language, filteredData);
    }

}
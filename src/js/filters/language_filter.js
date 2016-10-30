import Filter from "./filter";

export default class LanguageFilter extends Filter{

    constructor() {
        super('language');
    }

    apply(data, filteredData, filterValues){
        if (filterValues.language == undefined) {
            filterValues.language = 'BPMN'
        }

        data.cloneByLang(filterValues.language, filteredData);
    }

}
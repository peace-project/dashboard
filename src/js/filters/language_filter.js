'use strict';

import Filter from "./filter";

export default class LanguageFilter extends Filter{

    constructor() {
        super(LanguageFilter.Name());
        this.requiredFilteredValues = ['language', 'groups'];
    }

    static Name(){ return 'language'};

    getDefaultFilterValues(){
        //TODO make it configurable
        return 'BPMN';
    }

    applyFilter(capabilityData, filteredData, filterValues, filterValuesChanges){
        if (filterValues.language == undefined) {
            filterValues.language = this.getDefaultFilterValues();
        }

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }

        console.log('Apply language filter');
        capabilityData.copyByLang(filterValues.language, filteredData);
    }

    copyFilterValues(filterValues){
        return filterValues;
    }
}
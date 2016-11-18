'use strict';

import Filter from "./filter";

export default class EngineFilter extends Filter {
    constructor() {
        super(EngineFilter.Name());
        this.requiredFilteredValues = ['language', 'engines'];
    }

    static Name() {
        return 'engines'
    };

    static createFilterValues(engines) {
        var values = {};
        engines.forEach((obj) => {
            values[obj.id] = {index: obj.index}
        });
        return values;
    }

    getDefaultFilterValues(language, data) {
        return EngineFilter.createFilterValues(data.getLatestEngineVersions(language));
    }

    applyFilter(capabilityData, filteredData, filterValues, filterValuesChanges) {
        console.log('Apply engine filter');

        if (!this.hasRequiredFilterValues(filterValues)) {
            return false;
        }

        if (filteredData.engines.data === undefined) {
            console.log('No engine capabilityData to filter');
            return false;
        }

        Object.keys(filterValuesChanges.addedValues).forEach(key => {
            let filterValue = filterValuesChanges.addedValues[key];
            filteredData.engines.data[filterValue.index] = capabilityData.getEngineByIndex(filterValues.language, filterValue.index);
        });

        //TODO Comment why this block is needed
        /*if (this.countFilterEngines === 0) {
         filterValues.engines = EngineFilter.createFilterValues(capabilityData.getLatestEngineVersions(filterValues.language));
         }*/

        filteredData.engines.data.forEach(function (engine, index) {
            if (engine !== undefined) {
                if (!filterValues.engines.hasOwnProperty(engine.id)) {
                    filteredData.engines.data[index] = undefined;
                }
            }
        });
    }
}
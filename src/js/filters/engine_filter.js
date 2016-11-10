'use strict';

import Filter from "./filter";

export default class EngineFilter extends Filter {
    constructor() {
        super(EngineFilter.Name());
        this.requiredFilteredValues = ['language', 'engines'];
    }

    static Name() {return 'engines'};

    static createFilterValues(engines) {
        var values = {};
        engines.forEach((obj) => {
            values[obj.id] = { index: obj.index}
        });
        return values;
    }

    getRealFilterValues(filterValues, data){
        let realFilterValues = filterValues;
        if (this.countFilterEngines === 0) {
            realFilterValues['engines'] = EngineFilter.createFilterValues(data.getLatestEngineVersions(filterValues.language));
        }
        return realFilterValues;
    }


    applyFilter(capabilityData, testData, filteredData, filterValues) {
        console.log('Apply engine filter');

        if(!this.hasRequiredFilterValues(filterValues)){
            return false;
        }
        if(filteredData.engines.data === undefined ){
            console.log('No engine capabilityData to filter');
            return false;
        }

        this.countFilterEngines = Object.keys(filterValues.engines).length;

        let realFilterValues = this.getRealFilterValues(filterValues, capabilityData);
        var missingKeys = this.isFilteredDataEnough(filteredData.engines.data, realFilterValues);

        console.log("missingKeys="+missingKeys);
        missingKeys.forEach(function (index) {
            console.log(filteredData.engines);
            filteredData.engines.data[index] = capabilityData.getEngineByIndex(filterValues.language, index);
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

    isFilteredDataEnough(filteredEngineData, filterValues) {

        var missingKeys = [];

        for (var key in filterValues.engines) {
            let engineIndex = filterValues.engines[key].index;
            let engine = filteredEngineData[engineIndex];

            let isMissing = engine === undefined;
            if(isMissing){
                missingKeys.push(engineIndex);
            }
        }
        return missingKeys;
    }

}
import Filter from "./filter";

export default class EngineFilter extends Filter {
    constructor() {
        super(EngineFilter.Name());
    }

    static Name() {return 'engines'};

    applyFilter(data, filteredData, filterValues) {
        console.log('Apply engine filter');
        let filteredEngineData = filteredData.engines.data;
        var missingKeys = this.isFilteredDataEnough(filteredEngineData, filterValues);

        missingKeys.forEach(function (index) {
            filteredData.engines[index] = data.getEngineByIndex(filterValues.language, index);
        });

        /*
        if (missingKeys.length > 0) {
            filteredData.engines = data.getAll(filterValues.language);
        } */

        /*
        if (dataFilters.engines.length === 0) {
            dataFilters.engines = getLatestEngineVersions();
        }*/

        filteredEngineData.forEach(function (engine, index) {
            if (engine !== undefined) {
                if (filteredEngineData.indexOf(engine.id) === -1) {
                    filteredEngineData[index] = undefined;
                }
            }
        });


        //data.copyByLang(filterValues.language, filteredData);
    }

    isFilteredDataEnough(filteredEngineData, filterValues) {
        var missingKeys = [];
        for (var key in filterValues.engines) {

            let engineIndex = filterValues.engines[key].index;
            let engineId = filterValues.engines[key].id;
            let engine = filteredEngineData[engineIndex];

            let isMissing = engine.id === engineId && engine.id === undefined;
            if(isMissing){
                missingKeys.push(engineIndex);
            }
        }
        return missingKeys;
    }

}
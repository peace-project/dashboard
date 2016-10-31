import Filter from "./filter";

export default class EngineFilter extends Filter {
    constructor() {
        super(EngineFilter.Name());
    }

    static Name() {return 'engines'};

    apply(data, filteredData, filterValues) {
        var missingKeys = this.isFilteredDataEnough(filteredData, filterValues);

        if (missingKeys.length > 0) {
            filteredData.engines = data.getAll(filterValues.language);
           // copyEngines(normalizedData[filterValues.language].engines);
        }

        /*
        if (dataFilters.engines.length === 0) {
            dataFilters.engines = getLatestEngineVersions();
        }*/

        filteredData.engines.forEach(function (engine, index) {
            if (engine !== undefined) {
                if (filterValues.engines.indexOf(engine.id) === -1) {
                    filteredData.engines[index] = undefined;
                }
            }
        });


        //data.cloneByLang(filterValues.language, filteredData);
    }

    isFilteredDataEnough(filteredData, filterValues) {
/*
        if (dataFilters[type].length == 0 && type == 'engines') {
            currentDataFilter = getLatestEngineVersions();
        } else {
            currentDataFilter = dataFilters[type];
        }*/

        var missingKeys = [];
        for (var key in filterValues) {
            query[id] = filterValues[key];
            if (_.findWhere(filteredData.engines, query) == undefined) {
                missingKeys.push(filterValues[key]);
            }
        }
        return missingKeys;
    }

}
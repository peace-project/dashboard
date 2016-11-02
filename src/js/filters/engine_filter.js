import Filter from "./filter";

export default class EngineFilter extends Filter {
    constructor() {
        super(EngineFilter.Name());
        this.requiredFilteredValues = ['language', 'engines'];
    }

    static Name() {return 'engines'};

    createFilterValues(engines) {
        var values = {};
        engines.forEach((obj) => {
            values[obj.id] = { index: obj.index}
        });
        return values;
    }

    getRealFilterValues(filterValues, data){
        let realFilterValues = filterValues;
        if (filterValues.engines.length == 0) {
            realFilterValues['engines'] = this.createFilterValues(data.getLatestEngineVersions(filterValues.language));
        }
        return realFilterValues;
    }


    applyFilter(data, filteredData, filterValues) {
        console.log('Apply engine filter');

        if(!this.hasRequiredFilterValues(filterValues)){
            return false;
        }
        if(filteredData.engines.data === undefined ){
            console.log('No engine data to filter');
            return false;
        }

        let filteredEngineData = filteredData.engines.data;
        let realFilterValues = this.getRealFilterValues(filterValues, data);
        var missingKeys = this.isFilteredDataEnough(filteredEngineData, realFilterValues);

        missingKeys.forEach(function (index) {
            filteredData.engines[index] = data.getEngineByIndex(filterValues.language, index);
        });

        //TODO Comment why this block is needed
        if (filterValues.engines.length === 0) {
            filterValues.engines = this.createFilterValues(data.getLatestEngineVersions(filterValues.language));
        }


        filteredEngineData.forEach(function (engine, index) {
            if (engine !== undefined) {
                if (!filterValues.engines.hasOwnProperty(engine.id)) {
                    filteredEngineData[index] = undefined;
                }
            }
        });
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
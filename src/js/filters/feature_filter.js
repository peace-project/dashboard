import Filter from "./filter";

export default class FeatureFilter extends Filter{
    constructor() {
        super(FeatureFilter.Name());
        this.requiredFilteredValues = ['language', 'features'];
    }

    static Name(){ return 'features'};

    createFilterValues(feature) {
        var values = {};
        feature.data.forEach((obj) => {
            values[obj.name] = { index: obj.index}
        });
        return values;
    }

    getRealFilterValues(filterValues, data){
        let realFilterValues = filterValues;
        if (filterValues.constructs.length == 0) {
            realFilterValues['constructs'] = this.createFilterValues(data.getAllConstructsByLanguage(filterValues.language));
        }
        return realFilterValues;
    }

    applyFilter(data, filteredData, filterValues) {
        console.log('Apply ' + this.getName() + ' filter');

        if(!this.hasRequiredFilterValues(filterValues)){
            return;
        }
        if(filteredData.features.data === undefined ){
            console.error('No features data to filter');
            return;
        }

        let realFilterValues = this.getRealFilterValues(filterValues, data);
        var missingKeys = this.isFilteredDataEnough(filteredData.features.data, realFilterValues);

        missingKeys.forEach(function (index) {
            filteredData.features[index] = data.getFeatureByIndex(filterValues.language, index);
        });



        filteredData.engines.data.forEach(function (feature, index) {

            if (feature !== undefined) {

                var filterPredicate = (filterValues.features.length == 0) ? false : !filterValues.features.hasOwnProperty(feature.name);

                if (feature !== undefined && (filterPredicate || (filteredData.constructs.data[feature.constructIndex] == undefined))) {
                    filteredData.features.data[index] = undefined;
                }
            }
        });

    }

    isFilteredDataEnough(filteredFeatureData, filterValues) {
        var missingKeys = [];
        Object.keys(filterValues.features).forEach(function(key){
            let index = filterValues.features[key].index;
            let name = filterValues.features[key].name;

            let feature = filteredFeatureData[index];
            let isMissing = feature.name === name && feature.name === undefined;
            if(isMissing){
                missingKeys.push(index);
            }
        });
        return missingKeys;

    }

}
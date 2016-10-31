import Filter from "./filter";

export default class FeatureFilter extends Filter{
    constructor() {
        super(FeatureFilter.Name());
    }

    static Name(){ return 'features'};

    applyFilter(data, filteredData, filterValues) {
        console.log('Apply ' + this.getName() + ' filter');
        let filteredFeatureData = filteredData.engines.data;
        var missingKeys = this.isFilteredDataEnough(filteredFeatureData, filterValues);

        missingKeys.forEach(function (index) {
            filteredData.engines[index] = data.getFeatureByIndex(filterValues.language, index);
        });

        filteredFeatureData.forEach(function (feature, index) {
            if (feature !== undefined) {
                var filterPredicate = (filterValues.features.length == 0) ? false : (filterValues.features.indexOf(feature.name) == -1);
                if (feature !== undefined && (filterPredicate || (filteredData.constructs.data[feature.constructIndex] == undefined))) {
                    filteredFeatureData.features[index] = undefined;
                }
            }
        });

    }

    isFilteredDataEnough(filteredFeatureData, filterValues) {
        var missingKeys = [];
        console.log("///");
        console.log(filterValues);
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
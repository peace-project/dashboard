import ViewModel from "../viewmodels/default_view_model";

export default class ViewModelConverter{
    constructor() {
    }

    convert(filteredData, capability, language) {
        return new ViewModel(filteredData, capability, language);
    }


    convertFilteredData(dimension, filteredDimensionData, capabilityData, language) {
        let toRemove = [];

        let dataFn;
        if(dimension === 'constructs'){
            dataFn = 'getConstructByIndex';
        } else if(dimension === 'features'){
            dataFn = 'getFeatureByIndex';

        }

        filteredDimensionData.forEach((data, index) => {
            if(data === undefined){
                toRemove.push(capabilityData[dataFn](language, index));
            }
        });

        let cleanedData = filteredDimensionData.filter(obj => obj !== undefined);
        return  {
            dimensionData: cleanedData,
            toRemove: toRemove
        }
    }
}
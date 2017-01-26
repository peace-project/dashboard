import DefaultViewModel from "./default/default_view_model";
import PerformanceViewModel from "./performance/performance_view_model";
import {isPerformanceCapability} from "../peace";
import {isConformanceCapability} from "../peace";
import {isExpressivenessCapability} from "../peace";

/*export default class ViewModelConverter {
    constructor() { }*/

    //TODO rename to createTableViewModel
   export function createTableViewModel(filteredData, capability, language) {
        if(isConformanceCapability(capability) || isExpressivenessCapability(capability)){
            return new DefaultViewModel(filteredData, capability, language);
        } else if(isPerformanceCapability(capability)) {
            return new PerformanceViewModel(filteredData, capability, language);
        }
    }

   export function convertFilteredData(dimension, filteredDimensionData, capabilityData, language) {
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

//}
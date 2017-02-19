import {getTableViewModel} from "../dashboard_info";
import PerformanceViewModel from "./performance/performance_view_model";
import DefaultViewModel from "./default/default_view_model";

const VIEW_MODEL_CLASSES = {DefaultViewModel, PerformanceViewModel};

//TODO rename to createTableViewModel
export function createTableViewModel(filteredData, capability, language, extensions) {
    let viewModelClass = getTableViewModel(capability);
    if (viewModelClass !== undefined) {
        return new VIEW_MODEL_CLASSES[viewModelClass](filteredData, capability, language, extensions);
    } else {
        throw new Error("Unsupported capability: " + capability);
    }
}


export function convertFilteredData(dimension, filteredDimensionData, capabilityData, language) {
    let toRemove = [];

    let dataFn;
    if (dimension === 'constructs') {
        dataFn = 'getConstructByIndex';
    } else if (dimension === 'features') {
        dataFn = 'getFeatureByIndex';
    }

    filteredDimensionData.forEach((data, index) => {
        if (data === undefined) {
            toRemove.push(capabilityData[dataFn](language, index));
        }
    });

    let cleanedData = filteredDimensionData.filter(obj => obj !== undefined);
    return {
        dimensionData: cleanedData,
        toRemove: toRemove
    }
}

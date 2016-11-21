import {shallowCopy} from "../utils";
import {shallowObjectCopy} from "../utils";
export const DataType = {
    GROUPS: 'groups',
    CONSTRUCTS: 'constructs',
    FEATURES: 'features',
    ENGINES: 'engines',
    TESTS_INDEPENDENT: 'tests_independent',
    FEATURE_RESULTS: 'featureResults',
    TEST_RESULTS: 'testResults'
}

// NormalizedDataContainer add some convenient methods such as for cloning this object
// Rename it to Capability
export default class NormalizedDataContainer {
    constructor(data, dimension) {
        this.data = data;
        this.dimension = dimension;
    }

    clone() {
        var target = [];
        if (this.dimension === DataType.GROUPS) {
            this.data.forEach((val, index) => {
                target[index] = {
                    'index': index,
                    name: val.name,
                    description: val.description,
                    id: val.id,
                    constructsIndexes: shallowCopy(val.constructsIndexes),
                    metrics: val.metrics.map(m => {
                        return {id: m.id, metricType: m.metricType}
                    })
                };
            });
        } else if (this.dimension === DataType.CONSTRUCTS) {

            this.data.forEach((val, index) => {
                target[index] = {
                    'index': index,
                    name: val.name,
                    description: val.description,
                    id: val.id,
                    isFirstEntry: val.isFirstEntry,
                    groupsIndex: val.groupsIndex,
                    featuresIndexes: val.featuresIndexes,
                    metrics: val.metrics.map(m => {
                        return {id: m.id, metricType: m.metricType}
                    }),
                    metricIndexes: val.metricIndexes.map(m => {
                        return {featureTestIndex: m.featureTestIndex, measurementIndexes: shallowCopy(m.measurementIndexes)
                        }
                    }),
                    extensions: shallowObjectCopy(val.extensions)
                };
            });

        } else if (this.dimension === DataType.FEATURES) {
            this.data.forEach((val, index) => {
                target[index] = {
                    'index': index,
                    name: val.name,
                    description: val.description,
                    id: val.id,
                    lastFeature: val.lastFeature,
                    //groupsIndex: val.groupsIndex,
                    constructsIndex: val.constructsIndex,
                    metrics: val.metrics.map(m => {
                        return {id: m.id, metricType: m.metricType}
                    }),
                    metricIndexes: val.metricIndexes.map(m => {
                        return {featureTestIndex: m.featureTestIndex, measurementIndexes: shallowCopy(m.measurementIndexes)
                        }
                    }),
                    extensions: shallowObjectCopy(val.extensions),
                    //testIndexesEngine: val.testIndexesEngine,
                    //testIndependentIndex: val.testIndependentIndex,
                };
            });
        } else if (this.dimension === DataType.ENGINES) {
            this.data.forEach((val, index) => {
                var idParts = val.id.split('__');
                var versionLong = val.version;
                if (idParts.length > 2) {
                    versionLong = val.version + ' ' + idParts[2];
                }

                target[index] = {
                    'index': index,
                    id: val.id,
                    name: val.name,
                    version: val.version,
                    configuration: val.configuration,
                    language: val.language,
                    extensions: shallowObjectCopy(val.extensions),
                    versionLong: versionLong
                };
            });
        } else if (this.dimension === DataType.FEATURE_RESULTS) {
            //Missing: featureID, executionDuration
            this.data.forEach((val, index) => {
                target[index] = {
                    engine: val.engine,
                    tool: val.tool,
                    measurements: shallowObjectCopy(val.measurements),

                };
            });
        } else if (this.dimension === DataType.TEST_RESULTS) {
            //Missing: featureID, executionDuration
            this.data.forEach((val, index) => {
                target[index] = {
                    test: val.test,
                    engine: val.engine,
                    tool: val.tool,
                    files: val.files,
                    measurements: shallowObjectCopy(val.measurements),
                    extensions: shallowObjectCopy(val.extensions),
                    testCaseResults: shallowObjectCopy(val.testCaseResults)

                };
            });
        }

        else if (this.dimension === DataType.TESTS_INDEPENDENT) {
            this.data.forEach((val, index) => {
                target[index] = {
                    id: val.id,
                    feature: val.feature,
                    process: val.process,
                    description: val.description,
                    testCases: val.testCases, //TODO should be ignored? => since it will never be displayed
                    files: val.files,
                    testPartners: val.testPartners, //TODO should be ignored?
                    extensions: shallowObjectCopy(val.extensions),
                    metrics: val.metrics.map(m => {
                        return {id: m.id, metricType: m.metricType}
                    }),
                    //image : (val.files && val.files.toLowerCase().split('.').pop() === 'png') ? file : undefined,
                }
            });
        } else {
            throw Error('Failed to clone normalized data. Dimension ' + dimension + ' is unknown.');
        }

        return new NormalizedDataContainer(target, this.dimension);
    }

}



//TODO duplicate code
/*function shallowCopy(array) {
 var copy = [];
 for (var index in array) {
 copy[index] = array[index];
 }
 return copy;
 }*/
import {shallowCopy} from "../utils";
import {shallowObjectCopy} from "../utils";
export const DataType = {
    GROUPS: 'groups',
    CONSTRUCTS: 'constructs',
    FEATURES: 'features',
    ENGINES: 'engines',
    TESTS_INDEPENDENT: 'tests_independent',
    TESTS: 'tests'
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
                    extensions: shallowObjectCopy(val.extensions),
                    upperBound: val.upperBound, //missing
                    lastFeature: val.lastFeature,
                    groupsIndex: val.groupsIndex,
                    constructsIndex: val.constructsIndex,
                    testIndexes: val.testIndexes,
                    testIndexesEngine: val.testIndexesEngine,
                    testIndependentIndex: val.testIndependentIndex,
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
                    language: val.language,
                    name: val.name,
                    version: val.version,
                    url: val.url,
                    license: val.license,
                    licenseURL: val.licenseURL,
                    releaseDate: val.releaseDate,
                    programmingLanguage: val.programmingLanguage,
                    versionLong: versionLong,
                    //indexEngine: index,
                    configuration: shallowCopy(val.configuration)
                };
            });
        } else if (this.dimension === DataType.TESTS) {
            //Missing: featureID, executionDuration
            this.data.forEach((val, index) => {
                target[index] = {
                    test: val.test,
                    engine: val.engine,
                    tool: val.tool,
                    files: shallowCopy(val.files),
                    measurements: shallowCopy(val.measurements),
                    extensions: shallowObjectCopy(val.extensions),
                    testCaseResults: shallowObjectCopy(val.testCaseResults)

                };
            });
        } else if (this.dimension === DataType.TESTS_INDEPENDENT) {
            console.log(this.data);
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
                    metrics: this._getMetricArray(val.metrics).map(m => {
                        return {id: m.id, metricType: m.metricType}
                    }),
                    image : val.files.file.find(path => path.toLowerCase().split('.').pop() === 'png'),
                }
            });
        } else {
            throw Error('Failed to clone normalized data. Dimension ' + dimension + ' is unknown.');
        }

        return new NormalizedDataContainer(target, this.dimension);
    }

    //TODO should be removed when fixed by Simon
    _getMetricArray(metrics){
        return (metrics.hasOwnProperty('metric')) ? metrics.metric :  metrics;
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
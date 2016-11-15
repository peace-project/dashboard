export const DataDimension = {
    GROUPS : 'groups',
    CONSTRUCTS : 'constructs',
    FEATURES : 'features',
    ENGINES : 'engines'
}

// NormalizedDataContainer add some convenient methods such as for cloning this object
// Rename it to Capability
export default class NormalizedDataContainer {
    constructor(data, dimension) {
        this.data = data;
        this.dimension = dimension;
        /*var that = this;
        Object.keys(data).forEach(function (key) {
            that[key] = data[key];
        })*/
    }

     clone() {
        var target = [];
        if (this.dimension === DataDimension.GROUPS) {
            this.data.forEach((val, index) => {
                target[index] = {
                    'index': index,
                    name: val.name,
                    description: val.description,
                    id: val.id,
                    constructIndexes: shallowCopy(val.constructIndexes)
                };
            });
        } else if (this.dimension === DataDimension.CONSTRUCTS) {
            this.data.forEach((val, index) => {
                target[index] = {
                    'index': index,
                    name: val.name,
                    description: val.description,
                    id: val.id,
                    groupId: val.groupId,
                    groupName: val.groupName,
                    groupDesc: val.groupDesc,
                    isFirstEntry: val.isFirstEntry,
                    groupIndex: val.groupIndex,
                    featureIndexes: val.featureIndexes
                };
            });

        } else if (this.dimension === DataDimension.FEATURES) {
            this.data.forEach((val, index) => {
                target[index] = {
                    'index': index,
                    name: val.name,
                    description: val.description,
                    id: val.id,
                    upperBound: val.upperBound,
                    lastFeature: val.lastFeature,
                    groupId: val.groupId,
                    groupName: val.name,
                    groupIndex: val.groupIndex,
                    constructIndex: val.constructIndex,
                    testIndexes: val.testIndexes,
                    testIndexesEngine: val.testIndexesEngine
                };
            });
        } else if (this.dimension === DataDimension.ENGINES) {
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
        } else {
            console.error('Failed to clone normalized data. Dimension ' + dimension + ' is unknown.');
        }
        return new NormalizedDataContainer(target, this.dimension);
    }
}

//TODO duplicate code
function shallowCopy(array) {
    var copy = [];
    for (var index in array) {
        copy[index] = array[index];
    }
    return copy;
}
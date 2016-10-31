export const DataDimension = {
    GROUPS : 'groups',
    CONSTRUCTS : 'constructs',
    FEATURES : 'features',
    ENGINES : 'engines'
}

export default class NormalizedDataContainer {
    constructor(data, dimension) {
        this.data = data;
        this.dimension = dimension;
    }

    clone() {
        var target = {};
        if (this.dimension === DataDimension.GROUPS) {
            Object.keys(this.data).forEach(key => {
                target[key] = {
                    name: this.data[key].name,
                    description: this.data[key].description,
                    id: this.data[key].id,
                    constructIndexes: shallowCopy(this.data[key].constructIndexes)
                }
            });
        } else if (this.dimension === DataDimension.CONSTRUCTS) {
            Object.keys(this.data).forEach(key => {
                target[key] = {
                    name: this.data[key].name,
                    description: this.data[key].description,
                    id: this.data[key].id,
                    groupId: this.data[key].groupId,
                    groupName: this.data[key].groupName,
                    groupDesc: this.data[key].groupDesc,
                    isFirstEntry: this.data[key].isFirstEntry,
                    groupIndex: this.data[key].groupIndex,
                    featureIndexes: this.data[key].featureIndexes
                }
            });

        } else if (this.dimension === DataDimension.FEATURES) {
            Object.keys(this.data).forEach(key => {
                target[key] = {
                    name: this.data[key].name,
                    description: this.data[key].description,
                    id: this.data[key].id,
                    upperBound: this.data[key].upperBound,
                    lastFeature: this.data[key].lastFeature,
                    groupId: this.data[key].groupId,
                    groupName: this.data[key].name,
                    groupIndex: this.data[key].groupIndex,
                    constructIndex: this.data[key].constructIndex,
                    testIndexes: this.data[key].testIndexes
                }
            });
        } else if (this.dimension === DataDimension.ENGINES) {
            Object.keys(this.data).forEach(index => {
                var idParts = this.data[index].id.split('__');
                var versionLong = this.data[index].version;
                if (idParts.length > 2) {
                    versionLong = this.data[index].version + ' ' + idParts[2];
                }

                target[index] = {
                    configuration: shallowCopy(this.data[index].configuration),
                    id: this.data[index].id,
                    language: this.data[index].language,
                    name: this.data[index].name,
                    version: this.data[index].version,
                    url: this.data[index].url,
                    license: this.data[index].license,
                    licenseURL: this.data[index].licenseURL,
                    releaseDate: this.data[index].releaseDate,
                    programmingLanguage: this.data[index].programmingLanguage,
                    versionLong: versionLong,
                    indexEngine: index
                }
            });
        } else {
            console.error('Failed to clone normalized data. Dimension ' + dimension + ' is unknown.');
        }

        return target;

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
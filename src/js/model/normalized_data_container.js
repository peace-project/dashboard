export default class NormalizedDataContainer {
    constructor(data, dimension) {
        this.data = data;
        this.dimension = dimension;
    }

    clone() {
        var target = {};
        if (dimension == 'groups') {
            for (var key in this.data) {
                target[key] = {
                    name: this.data[key].name,
                    description: this.data[key].description,
                    id: this.data[key].id,
                    constructIndexes: shallowCopy(this.data[key].constructIndexes)
                }
            }
        } else if (dimension == 'constructs') {
            for (var key in this.data) {
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
            }

        } else if (dimension == 'features') {
            for (var key in this.data) {
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
            }
        } else if (dimension === 'engines') {
            for (var index in engines) {
                var idParts = engines[index].id.split('__');
                var versionLong = engines[index].version;
                if (idParts.length > 2) {
                    versionLong = engines[index].version + ' ' + idParts[2];
                }
                target[index] = {
                    configuration: shallowCopy(engines[index].configuration),
                    id: engines[index].id,
                    language: engines[index].language,
                    name: engines[index].name,
                    version: engines[index].version,
                    url: engines[index].url,
                    license: engines[index].license,
                    licenseURL: engines[index].licenseURL,
                    releaseDate: engines[index].releaseDate,
                    programmingLanguage: engines[index].programmingLanguage,
                    versionLong: versionLong,
                    indexEngine: index
                }
            }
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
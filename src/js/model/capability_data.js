import NormalizedDataContainer from "./normalized_data_container";
import {DataDimension} from "./normalized_data_container";
const _data = Symbol('data');

export default class CapabilityData {
    constructor(capability) {
        this[_data] = {};
        this.capability = capability;
    }

    getCapability() {
        return this.capability;
    }

    add(data) {
        if (this[_data].hasOwnProperty(data.language)) {
            console.log('Could not add already existing data');
            return;
        }

        this[_data][data.language] = {
            groups: new NormalizedDataContainer(data.groups, DataDimension.GROUPS),
            constructs: new NormalizedDataContainer(data.constructs, DataDimension.CONSTRUCTS),
            features: new NormalizedDataContainer(data.features, DataDimension.FEATURES),
            engines: new NormalizedDataContainer(data.engines, DataDimension.ENGINES)
        }
    }

    hasLanguage(langName) {
        let data = this[_data];
        return data.hasOwnProperty(langName);
    }

    getAll() {
        // we need to clone to make sure that filter does not modify it,
        // otherwise we'll have to load JSON files again
        let data = this[_data];
        var clone = {};
        let that = this;
        Object.keys(data).forEach(key => {
            clone[key] = {};
            that.cloneByLang(key, clone[key])
        });
        return clone;
    }

    getByLanguage(language) {
        let data = this[_data];
        if(!data.hasOwnProperty(language)){
            return undefined;
        }

        var clone = {};
        this.cloneByLang(data[language], clone);
        return clone;
    }

    getConstructByIndex(language, index) {
        let data = this[_data];
        if(!data.hasOwnProperty(language)){
            return undefined;
        }
        return data.constructs[index];
    }
    getConstructByName(language, name) {
        let data = this[_data];
        if(!data.hasOwnProperty(language)){
            return undefined;
        }
        return data.constructs.find(function (constr) {constr.name == name });
    }


    getEnginesByLanguage(language) {
        //TODO return copy ?
        let data = this[_data];
        console.log(language);
        console.log(data.hasOwnProperty(language));

        if (!(data.hasOwnProperty(language) && data[language].hasOwnProperty('engines'))) {
            return undefined;
        }

        // we need to clone to make sure that filter does not modify it,
        // otherwise we'll have to load JSON files again
        return data[language].engines.clone();
    }

    getLatestEngineVersions(language) {

        var sortVersionAscending = function (a, b) {
            return a.id.localeCompare(b.id);
        }

        var latestVersions = _.chain(this.getEnginesByLanguage(language))
            .groupBy('name')
            .map(function (val, key) {
                var sortedInstances = val.sort(sortVersionAscending).reverse();
                var i = 0;
                var versions = [];
                var max = sortedInstances.length;
                var engine;

                while (i < max) {
                    engine = sortedInstances[i];
                    if (engine.configuration.length != 0) {
                        i++;
                    } else {
                        versions.push(engine.id);
                        i = max;
                    }
                }
                if (versions.length == 0 && max > 0) {
                    versions.push(sortedInstances[0].id);
                }
                return versions;
            }).value();

        return _.flatten(latestVersions, true);
    }


    cloneByLang(lang, target) {
        if (!this[_data].hasOwnProperty(lang)) {
            console.error('lang ' + lang + ' not found');
            return;
        }
        if (target === undefined) {
            console.error('target is undefined');
            return;
        }

        //We cannot clear the target variable by assigning to a new object e.g., target = {groups:[], engines: [], ...}
        // as javascript is passed-by-value with access to the properties the target object
        for (var dimension in target) {
            console.log(dimension);
            delete target[dimension];
        }

        var data = this[_data][lang];
        target['groups'] = data.groups.clone();
        target['engines'] = data.engines.clone();
        target['constructs'] = data.constructs.clone();
        target['features'] = data.features.clone();
        target['engines'] = data.engines.clone();

        //cloneEngines(normalizedData['engines']);

    /*
        for (var dimension in normalizedData) {
            if (dimension == 'groups') {
                for (var key in normalizedData[dimension]) {
                    target[dimension][key] = {
                        name: normalizedData[dimension][key].name,
                        description: normalizedData[dimension][key].description,
                        id: normalizedData[dimension][key].id,
                        constructIndexes: shallowCopy(normalizedData[dimension][key].constructIndexes)
                    }
                }
            }

            if (dimension == 'constructs') {
                for (var key in normalizedData[dimension]) {
                    target[dimension][key] = {
                        name: normalizedData[dimension][key].name,
                        description: normalizedData[dimension][key].description,
                        id: normalizedData[lang][dimension][key].id,
                        groupId: normalizedData[lang][dimension][key].groupId,
                        groupName: normalizedData[lang][dimension][key].groupName,
                        groupDesc: normalizedData[lang][dimension][key].groupDesc,
                        isFirstEntry: normalizedData[lang][dimension][key].isFirstEntry,
                        groupIndex: normalizedData[lang][dimension][key].groupIndex,
                        featureIndexes: shallowCopy(normalizedData[dimension][key].featureIndexes)
                    }
                }
            }

            if (dimension == 'features') {
                target[dimension][key] = {
                    name: normalizedData[dimension][key].name,
                    description: normalizedData[dimension][key].description,
                    id: normalizedData[dimension][key].id,
                    upperBound: normalizedData[dimension][key].upperBound,
                    lastFeature: normalizedData[dimension][key].lastFeature,
                    groupId: normalizedData[dimension][key].groupId,
                    groupName: normalizedData[dimension][key].name,
                    groupIndex: normalizedData[dimension][key].groupIndex,
                    constructIndex: normalizedData[dimension][key].constructIndex,
                    testIndexes: normalizedData[dimension][key].testIndexes
                }
            }

        } */


    }
}

/*
function cloneEngines(engines) {
    var target = [];
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
    return target;
}


function shallowCopy(array) {
    var copy = [];
    for (var index in array) {
        copy[index] = array[index];
    }
    return copy;
}*/

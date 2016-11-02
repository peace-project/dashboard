import NormalizedDataContainer from "./normalized_data_container";
import {DataDimension} from "./normalized_data_container";
import CapabilityDataContainer from "./capability_data_container";
const _data = Symbol('data');

// Ensures privacy of data and ensure retrieval via cloning
// Convenient way to interact with data layer without calling clone/copy
export default class CapabilityData {
    constructor(capability) {
        this[_data] = {};
        this.capability = capability;
    }

    getCapability() {
        return this.capability;
    }

    add(data) {
        // is empty?
        if (Object.keys(this[_data]).length === 0 && this[_data].constructor === Object) {
            this[_data] = new CapabilityDataContainer({}, this.capability);
        }

        if (this[_data].data.hasOwnProperty(data.language)) {
            console.log('Could not add already existing data');
            return;
        }

       // this[_data].add(data);
        this[_data].data[data.language] = {
            groups: new NormalizedDataContainer(data.groups, DataDimension.GROUPS),
            constructs: new NormalizedDataContainer(data.constructs, DataDimension.CONSTRUCTS),
            features: new NormalizedDataContainer(data.features, DataDimension.FEATURES),
            engines: new NormalizedDataContainer(data.engines, DataDimension.ENGINES)
        };

    }

    hasLanguage(langName) {
        return this[_data].hasLanguage(langName);
    }

    getAll() {
        // we need to clone to make sure that filter does not modify it,
        // otherwise we'll have to load JSON files again
        var clone = {};
        let that = this;

        Object.keys(this[_data].data).forEach(key => {
            clone[key] = {};
            clone[key]['language'] = key;
            that.copyByLang(key, clone[key])
        });

        // CapabilityDataContainer add some convenient methods for users
        // and its data can be modified
        return new CapabilityDataContainer(clone, this.capability);
    }

    /*
     clone(lang, clone){
     var data = this[_data][lang];
     let target =  {};
     target['language'] = lang;
     target['groups'] = data.groups.clone();
     target['engines'] = data.engines.clone();
     target['constructs'] = data.constructs.clone();
     target['features'] = data.features.clone();
     target['engines'] = data.engines.clone();
     console.log("ADD TARGET");
     console.log(target);
     clone.add(target);
     } */


    copyByLang(lang, target) {
        this[_data].copyByLang(lang, target);
        /*
        if (!this[_data].hasLanguage(lang)) {
            console.error('lang ' + lang + ' not found');
            return;
        }
        if (target === undefined) {
            console.error('target is undefined');
            return;
        }

        var data = this[_data].data[lang];

        console.log("////////////////////");

        target['groups'] = data.groups.clone();
        target['engines'] = data.engines.clone();
        target['constructs'] = data.constructs.clone();
        target['features'] = data.features.clone();
        target['engines'] = data.engines.clone(); */


    }

    getByLanguage(language) {
        let data = this[_data];
        if (!data.hasOwnProperty(language)) {
            return undefined;
        }

        var clone = {};
        this.copyByLang(data[language], clone);
        return clone;
    }

    getConstructByIndex(language, index) {
        let data = this[_data];
        if (!data.hasOwnProperty(language)) {
            return undefined;
        }
        return this[_data].getConstructByIndex(language, index);
    }

    getConstructByName(language, name) {
        let data = this[_data];
        if (!data.hasOwnProperty(language)) {
            return undefined;
        }
        return data.constructs.find(function (constr) {
            constr.name == name
        });
    }


    getEnginesByLanguage(language) {
        let data = this[_data];
        // we need to clone to make sure that filter does not modify it,
        // otherwise we'll have to load JSON files again
        return data[language].data.getEnginesByLanguage(language).clone();
    }


    getLatestEngineVersions(language) {
        let data = this[_data];
        return data[language].data.getLatestEngineVersions(language).clone();
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

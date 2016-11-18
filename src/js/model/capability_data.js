import NormalizedDataContainer from "./normalized_data_container";
import {DataType} from "./normalized_data_container";
import CapabilityDataContainer from "./capability_data_container";
const _data = Symbol('data');

// Ensures privacy of data and ensures retrieval via cloning
// Convenient way to interact with data layer without calling clone/copy
export default class CapabilityData {
    constructor(capability) {
        this[_data] = {};
        this._capability = capability;

        if (Object.keys(this[_data]).length === 0 && this[_data].constructor === Object) {
            this[_data] = new CapabilityDataContainer({}, this._capability);
        }
    }

    getCapability() {
        return this._capability;
    }


    addAll(data, language) {
        if(language === undefined){
            throw Error('language is undefined');
        }

        this[_data].data[language] = this[_data].data[language] || {};
        let __data = this[_data].data[language];

        for(let key in data){
           if(data.hasOwnProperty(key)){
               if(!__data.hasOwnProperty(key)){
                   __data[key] = new NormalizedDataContainer(data[key], key);
               } else {
                   let arr = __data[key].data;
                   arr.push.apply(arr, data[key]);
               }
           }
        }

        console.log('__data');
        console.log(this[_data].data);
/*
        this[_data].data[data.language] = {
            groups: new NormalizedDataContainer(data.groups, DataType.GROUPS),
            constructs: new NormalizedDataContainer(data.constructs, DataType.CONSTRUCTS),
            features: new NormalizedDataContainer(data.features, DataType.FEATURES),
            engines: new NormalizedDataContainer(data.engines, DataType.ENGINES)
        }; */
    }

    add(language, newData, dataType){
        this[_data].data[language] = this[_data].data[language] || {};

        if(this[_data].data[language].hasOwnProperty(dataType)){
            let arr = this[_data].data[language][dataType].data;
            arr.push(newData);
        } else {
            this[_data].data[language][dataType] = new NormalizedDataContainer([newData], dataType);
        }
    }
/*
    getAllLanguages() {
        this[_data].getAllLanguages();
    }

    hasLanguage(langName) {
        return this[_data].hasLanguage(langName);
    } */


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
        return new CapabilityDataContainer(clone, this._capability);
    }

    copyByLang(lang, target) {
        this[_data].copyByLang(lang, target);
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


import NormalizedDataContainer from "./normalized_data_container";
import {DataType} from "./normalized_data_container";
import CapabilityDataContainer from "./capability_data_container";
const _data = Symbol('data');

/**
 * This class reduces the amount of data probably not needed for build view components
 * It only contains data of a specific capability and it groups the data according to the process language
 * since users will only interact with one language at the time.
 *
 * It ensures data privacy and forces retrieval via cloning
 *
 * The data is hold by the CapabilityDataContainer which is always returned when accessing data
 * It provides convenient methods that handles the clone/copy for the view components by calling getAll() which
 * implements most convenient methods
 *
 * Typically, the process in using this class is as follows:
 *      1. During the normalization process => call #addAll() to add data for this capability
 *      2. After the normalization process => call #getAll() to get all added data
 * It should be enough for the UI to call the #getAll() once
 *
 * TODO It should be enough to call #getAll() once , however this is not true for the normalizer
 * TODO this class should be transparent for UI and only used by the normalizer (the normalizer should only run once)
 *
 *  @author David Bimamisa
 */

export default class CapabilityData {
    constructor(capability, extensions) {
        this[_data] = {};
        this._capability = capability;
        this._extensions = extensions;

        if (Object.keys(this[_data]).length === 0 && this[_data].constructor === Object) {
            this[_data] = new CapabilityDataContainer({}, this._capability, this._extensions);
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

    /**
     * Tests if data for the given {@code DataType} and language exists
     *
     * @param language
     * @param dataType
     * @returns {boolean}
     */
    hasData(language, dataType){
        if(this[_data].data[language]){
            return this[_data].data[language].hasOwnProperty(DataType.TESTS_INDEPENDENT);
        }
        return false;
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
        return new CapabilityDataContainer(clone, this._capability, this._extensions);
    }

    copyByLang(lang, target) {
        this[_data].copyByLang(lang, target);
    }
/*
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
    } */



}


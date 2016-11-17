'use strict'

export default class CapabilityDataContainer {
    constructor(data, capability) {
        this.capability = capability;
        this.data = data;

    }

    getEnginesByLanguage(language) {
        //TODO return copy ?
        if (!(this.data.hasOwnProperty(language) && this.data[language].hasOwnProperty('engines'))) {
            return undefined;
        }

        // we need to clone to make sure that filter does not modify it,
        // otherwise we'll have to load JSON files again
        return this.data[language].engines;
    }


    getAllGroupsByLanguage(language) {
        return this.data[language].groups;
    }

    getGroupByIndex(language, index) {
        return this.data[language].groups.data[index];
    }

    getAllConstructsByLanguage(language) {
        return this.data[language].constructs;
    }

    getConstructByIndex(language, index) {
        return this.data[language].constructs.data[index];
    }

    getFeatureByIndex(language, index) {
        return this.data[language].features.data[index];
    }

    getAllFeaturesByLanguage(language) {
        return this.data[language].features;
    }

    getEngineByIndex(language, index) {
        return this.data[language].engines.data[index];
    }


    getAllConstructsName() {
        return this.data[language].constructs.map(obj => obj.name);
    }

    getAllFeaturesName() {
        return this.data[language].features.map(obj => obj.name);
    }

    hasLanguage(language) {
        return this.data.hasOwnProperty(language);
    }

    getAllLanguage() {
        return Object.keys(this.data);
    }

    copyByLang(lang, target) {
        if (!this.hasLanguage(lang)) {
            console.error('lang ' + lang + ' not found');
            return;
        }
        if (target === undefined) {
            console.error('target is undefined');
            return;
        }

        var data = this.data[lang];


        target['groups'] = data.groups.clone();

        target['constructs'] = data.constructs.clone();
        target['features'] = data.features.clone();
        target['engines'] = data.engines.clone();
    }

    getLatestEngineVersions(language) {
        if (language == undefined) {
            console.error('language is undefined');
        }

        var sortVersionAscending = function (a, b) {
            return a.id.localeCompare(b.id);
        }

        let engines = this.getEnginesByLanguage(language);
        if (engines === undefined) {
            return undefined;
        }

        engines = engines.data;
        var latestVersions = _.chain(engines)
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
                        versions.push(engine);
                        i = max;
                    }
                }

                if (versions.length == 0 && max > 0) {
                    versions.push(sortedInstances[0]);
                }
                return versions;
            }).value();
        return _.flatten(latestVersions, true);
    }
}
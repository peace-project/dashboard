import {DataDimension} from "./normalized_data_container";
import NormalizedDataContainer from "./normalized_data_container";

export default class CapabilityDataContainer  {
    constructor(data, capability) {
        this.capability = capability;
        this.data = data;


        /*
        var that = this;
        Object.keys(data).forEach(function (key) {
            that[key] = data[key];
        });*/

        /*
        this.data[data.language] = {
            groups: new NormalizedDataContainer(data.groups, DataDimension.GROUPS),
            constructs: new NormalizedDataContainer(data.constructs, DataDimension.CONSTRUCTS),
            features: new NormalizedDataContainer(data.features, DataDimension.FEATURES),
            engines: new NormalizedDataContainer(data.engines, DataDimension.ENGINES)
        } */

    }

    /*
    add(data){

        //Object.create(data.language, this);

        this.data[data.language] = {
            groups: new NormalizedDataContainer(data.groups, DataDimension.GROUPS),
            constructs: new NormalizedDataContainer(data.constructs, DataDimension.CONSTRUCTS),
            features: new NormalizedDataContainer(data.features, DataDimension.FEATURES),
            engines: new NormalizedDataContainer(data.engines, DataDimension.ENGINES)
        };
    } */


    /*
    getAll(){
        console.log("/////Alll");
        console.log(this);
        return this;
    } */


    getEnginesByLanguage(language) {
        //TODO return copy ?
        if (!(this.data.hasOwnProperty(language) && this.data[language].hasOwnProperty('engines'))) {
            return undefined;
        }

        // we need to clone to make sure that filter does not modify it,
        // otherwise we'll have to load JSON files again
        return this.data[language].engines;
    }


    hasLanguage(language) {
        return this.data.hasOwnProperty(language);
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
        target['engines'] = data.engines.clone();
        target['constructs'] = data.constructs.clone();
        target['features'] = data.features.clone();
        target['engines'] = data.engines.clone();
    }

    getLatestEngineVersions(language) {

        var sortVersionAscending = function (a, b) {
            return a.id.localeCompare(b.id);
        }

        //console.log('this.getEnginesByLanguage(language)');
        //console.log(this.getEnginesByLanguage(language));


        let engines = this.getEnginesByLanguage(language).data;
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
                        versions.push({index: engine.indexEngine, id: engine.id});
                        i = max;
                    }
                }

                if (versions.length == 0 && max > 0) {
                    versions.push({index: sortedInstances[0].indexEngine, id: sortedInstances[0].id});
                }
                return versions;
            }).value();

        return _.flatten(latestVersions, true);
    }
}
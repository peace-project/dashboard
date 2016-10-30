import NormalizedGroup from "./nomalized_group";
import NormalizedConstruct from "./nomalized_construct";
import NormalizedFeature from "./normalized_feature";

const _allData = Symbol('allData');

export default class NormalizedData {
    constructor() {
        this[_allData] = {};
        //var allData = {};
        /*  this.language = data.language;
         this.groups = new NormalizedGroup(data.groups);
         this.constructs = new NormalizedConstruct(data.constructs);
         this.features = new NormalizedFeature(data.features);
         this.engines = new NormalizedEngine(data.engines);*/
    }


    add(capability, data) {
        if (this[_allData].hasOwnProperty(data.language)) {
            console.log('Could not add already existing data');
            return;
        }

        if (!this[_allData].hasOwnProperty(capability)) {
            this[_allData][capability] = {};
        }

        this[_allData][capability][data.language] = {
            constructs: data.constructs,
            features: data.features,
            engines: data.engines
        }
    }

    getAllByCapability(capability) {
        //todo return copy ?
        let allData = this[_allData];
        if (!allData.hasOwnProperty(capability)) {
            return undefined;
        }
        return allData[capability];
    }

    getEnginesByLanguage(capability, language) {
        //todo return copy ?
        let allData = this[_allData];
        if (!allData.hasOwnProperty(capability) || allData[capability].hasOwnProperty('language')) {
            return undefined;
        }
        return allData[capability].language;
    }
}
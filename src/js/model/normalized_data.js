import CapabilityData from "./capability_data";
// Private property
const _allData = Symbol('allData');

export default class NormalizedData {
    constructor() {
        this[_allData] = {};
    }


    add(capability, data) {
        /*  if (this[_allData].hasOwnProperty(data.language)) {
         console.log('Could not add already existing data');
         return;
         }*/

        var capData;
        if (this[_allData].hasOwnProperty(capability)) {
            capData = this[_allData][capability];
        } else {
            capData = new CapabilityData(capability);
            this[_allData][capability] = capData;
        }

        capData.add(data);

        /*
         this[_allData][capability][data.language] = {
         constructs: data.constructs,
         features: data.features,
         engines: data.engines
         }*/
    }

    getAllByCapability(capability) {
        //TODO return copy ?
        let allData = this[_allData];
        if (!allData.hasOwnProperty(capability)) {
            return undefined;
        }
        return allData[capability].getAll();
    }


    getAllLanguagesName(capability) {
        let allData = this[_allData];
        if (!allData.hasOwnProperty(capability)) {
            return undefined;
        }
        return allData[capability].map(function (lang) {
            return lang.constructor.name;
        });
    }

    hasLanguage(capability, langName) {
        let allData = this[_allData];
        if (!allData.hasOwnProperty(capability)) {
            return undefined;
        }
        return allData[capability].hasLanguage(langName);
    }


    getEnginesByLanguage(capability, language) {
        //TODO return copy ?
        let allData = this[_allData];
        if (!allData.hasOwnProperty(capability)) {
            return undefined;
        }
        return allData[capability].getEnginesByLanguage(language);
    }

    getLatestEngineVersions(capability, language) {
        let allData = this[_allData];
        if (!allData.hasOwnProperty(capability)) {
            return undefined;
        }

        return allData[capability].getLatestEngineVersions(language);
    }
}

var sortVersionAscending = function (a, b) {
    return a.id.localeCompare(b.id);
}

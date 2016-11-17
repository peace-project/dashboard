
const _data = Symbol('data');


export default class Capability {
    constructor(capability) {
        this.id = capability.id;
        this.name = capability.name;
        this[_data] = {};


        this._addLanguages(capability.language);
    }

    _addLanguages(language){
        language.forEach(lang => {

            this[_data][lang.name] = {
                groups: lang.groups,
                constructs: lang.constructs,
                features: lang.features,
                engines: lang.engines
            };
        });
    }

}
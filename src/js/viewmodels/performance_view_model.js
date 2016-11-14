import {groupEngineByName} from "./helpers";
import Construct from "./performance/construct";
export default class PerformanceViewModel {
    constructor(data, capability, language) {
        this.capability = capability;
        this.language = language;
        this.constructs = [];

        this.engines = groupEngineByName(data.engines.data); //createEngines(data.engines.data);

        this._addConstructs(data.constructs.data, data.features.data, data.tests, data.metrics);
    }

    _addConstructs(constructs, features, tests, metricsInfo) {
        let that = this;
        constructs.forEach(construct => {
            if (construct === undefined) {
                return;
            }

            let viewConstruct = new Construct(construct);
            viewConstruct.addFeatures(features, tests, metricsInfo);

            that.constructs.push(viewConstruct);
        });
    }

}
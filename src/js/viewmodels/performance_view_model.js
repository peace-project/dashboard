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

        let resultOrder = [];
        this.engines.forEach(engine => {
            engine.instances.forEach(instance => {
                resultOrder.push(instance.id);
            });
        });

        constructs.forEach(construct => {
            console.log('______construct')
            console.log(construct);
            if (construct === undefined) { return; }

            let viewConstruct = new Construct(construct);
            viewConstruct.addFeatures(features, tests, metricsInfo, resultOrder);
            that.constructs.push(viewConstruct);
        });
    }

}
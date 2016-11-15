import {groupEngineByName} from "./helpers";
import Construct from "./performance/construct";

export default class PerformanceViewModel {
    constructor(data, capability, language) {
        this.capability = capability;
        this.language = language;
        this.constructs = [];
        this.engines = groupEngineByName(data.engines.data); //createEngines(data.engines.data);

        //console.log('_________data.constructs.data');
        //console.log(data);

        this._addConstructs(data.constructs.data, data.features.data, data.tests, data.metrics);

        // sort features by engines

        //constructs[0].features[0].results = sortedResults;

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
            if (construct === undefined) { return; }

            let viewConstruct = new Construct(construct);
            viewConstruct.addFeatures(features, tests, metricsInfo, resultOrder);
            that.constructs.push(viewConstruct);
        });
    }

}
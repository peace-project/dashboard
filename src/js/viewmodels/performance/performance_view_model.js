import {groupEngineByName} from "../helpers";
import Construct from "./construct";

export default class PerformanceViewModel {
    constructor(filteredData, capability, language, independentTests) {
        this.capability = capability;
        this.language = language;

        // TableViewModel
        this.table = {
            constructs: [],
            engines: groupEngineByName(filteredData.engines.data),
        };

        // SubViewModel (i.e. for popovers)
        this.features = {};
        this.engines = filteredData.engines.data;

        this.independentTests = independentTests.map(test =>  this._formatIndependentTest(test));

        this._addConstructs(filteredData.constructs.data, filteredData.features.data, filteredData.tests, filteredData.metrics);
    }

    _addConstructs(constructs, features, tests, metricsInfo) {
        let that = this;

        let resultOrder = [];
        this.table.engines.forEach(engine => {
            engine.instances.forEach(instance => {
                resultOrder.push(instance.id);
            });
        });

        constructs.forEach(construct => {
            if (construct === undefined) { return; }

            let viewConstruct = new Construct(construct);
            viewConstruct.addFeatures(features, tests, metricsInfo, resultOrder);
            that.table.constructs.push(viewConstruct);

            viewConstruct.features.forEach(feat => {
                that.features[feat.index] = feat;
               // that.independentTests[feat.testIndependentIndex] =  that._formatIndependentTest(independentTests[feat.testIndependentIndex]);
            });

        });
    }



    _formatIndependentTest(test){

        if(test.loadFunction['users'] === undefined){
            return test;
        }

        let loadFunction = {}
        Object.keys(test.loadFunction).forEach(key => {
            if(key !== 'users'){
                loadFunction[key] = test.loadFunction[key];
            }
        });

        Object.keys(test.loadFunction['users']).forEach(key => {
            loadFunction['users.'+key] = test.loadFunction['users'][key];
        });

        test['loadFunction'] = loadFunction;

        return test;
    }

}
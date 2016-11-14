import {groupEngineByName} from "./helpers";
import Construct from "./default/construct";

export default class ViewModel {
    constructor(data, capability, language) {
        this.capability = capability;
        this.language = language;
        this.constructs = [];
        this.summaryRow = {};
        this.engines = groupEngineByName(data.engines.data); //createEngines(data.engines.data);

        this.enginesCount = this._countEngines();

        let that = this;
        // Init summaryRow
        data.engines.data.forEach(function (engine) {
            if (engine !== undefined) {
                that.summaryRow[engine.id] = 0;
            }
        });

        this._addConstructs(data.constructs.data, data.features.data, data.tests);
    }

    _countEngines() {
        return this.engines.map(eng => eng.instances.length).reduce((a, b) => a + b, 0);
    }

    _addConstructs(constructs, features, tests) {
        // clear constructs
        this.constructs.length = 0;
        let that = this;
        var lastGroupIndex = undefined;
        constructs.forEach(function (construct) {
            if (construct === undefined) {
                return;
            }

            let viewConstruct = new Construct(construct);
            viewConstruct.addFeatures(features, tests);

            if (viewConstruct.features.length < 1) {
                return;
            }

            // Reset old value of isFirstEntry to avoid duplicate group marking
            // Marks construct as the first row of a group
            viewConstruct.isFirstEntry = false;
            if (viewConstruct.groupIndex !== lastGroupIndex) {
                lastGroupIndex = viewConstruct.groupIndex;
                viewConstruct.isFirstEntry = true;
            }


            that._updateSummaryRow(viewConstruct);

            that.constructs.push(viewConstruct);

        });

    }

    updateSummaryRow() {
        let that = this;
        //that.summaryRow[engine.id] = 0;
        Object.keys(that.summaryRow).forEach(key => that.summaryRow[key] = 0);
        this.constructs.forEach(function (construct) {
            that._updateSummaryRow(construct);
        });
    }

    _updateSummaryRow(construct) {
        let that = this;
        Object.keys(construct.supportStatus).forEach(engineID => {
            if (construct.featureIndexes.length === construct.supportStatus[engineID].supportedFeature) {
                that.summaryRow[engineID] += 1;
            } else if (that.capability === 'expressiveness' && construct.supportStatus[engineID].supportedFeature > 0) {
                if (construct.upperBound === '+') {
                    that.summaryRow[engineID] += 1;
                }
            }
        });
    }
}


export function getResultClass(result, resultHtml, upperBound) {
    // add result class
    if (resultHtml !== '+/-') {
        return 'support-' + result;
    } else if (upperBound !== undefined && resultHtml == '+/-' && upperBound === resultHtml) {
        return 'support-partial-true';
    } else {
        return 'support-partial';
    }
}







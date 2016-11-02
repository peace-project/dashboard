import {groupEngineByName} from "./helpers";

export default class ViewModel {
    constructor(data, capability, language) {
        this.capability = capability;
        this.language = language;
        this.engines = {};
        this.constructs = [];
        //['summaryRow'][engine.id]
        this.summaryRow = {};

        this.engines = new Engines(data.engines.data);

        this.summaryRow = {};

        let that = this;

        // Init summaryRow
        data.engines.data.forEach(function (engine) {
            if (engine !== undefined) {
                that.summaryRow[engine.id] = 0;
            }
        });

        this._addConstructs(data.constructs.data, data.features.data, data.tests);
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

            let capability = getCapabilityFromId(viewConstruct.id);
            if (typeof capability !== 'string') {
                return;
            }

            for (var engineID in that.supportStatus) {
                that.supportStatus[engineID].updateSupportStatus(viewConstruct, capability);
                that.updateSummaryRow(engineID, viewConstruct, capability);
            }

            that.constructs.push(viewConstruct);

        });

    }

    updateSummaryRow(engineID, _construct, capability) {
        if (_construct.featureIndexes.length === this.supportedFeature) {
            this.summaryRow[engineID] += 1;
        } else if (capability === 'expressiveness' && this.supportedFeature > 0) {
            if (_construct.upperBound === '+') {
                this.summaryRow[engineID] += 1;
            }
        }
    }
}

//TODO rename to ViewEngines
class Engines {
    constructor(engineData) {
        var that = this;
        let groupeData = groupEngineByName(engineData);
        Object.keys(groupeData).forEach(key => {
            that[key] = groupeData[key];
        });

        this.count = engineData.length || 0;
    }
}

//TODO rename to ViewConstruct
class Construct {
    constructor(construct) {
        //TODO
        //this.construct = construct;
        let that = this;
        Object.keys(construct).forEach(key => {
            that[key] = construct[key];
        });

        this.moreThanTwoFeatures = false;
        this.isFirstEntry = false;
        this.upperBound = '-';
        this.html_standard_class = 'standard-col-partial';
        this.supportStatus = {};
        this.features = [];
    }


    addFeatures(features, tests) {
        var capability = undefined;
        let that = this;
        features.forEach(feature => {

            if (feature === undefined || feature.testIndexes.length < 1) {
                return;
            }

            let viewFeature = new Feature(feature, tests);

            //console.log(viewFeature);

            that.moreThanTwoFeatures = that.featureIndexes.length > 1;

            if (that.upperBound !== '+') {
                that.upperBound = viewFeature.upperBound;
            }

            if (that.upperBound === '+/-') {
                that.html_standard_class = 'standard-col-partial';
            } else {
                that.html_standard_class = 'standard-col-res';
            }

            capability = getCapabilityFromId(viewFeature.id);
            if (typeof capability !== 'string') {
                return;
            }


            //let that = this;
            Object.keys(viewFeature.results).forEach(function (engineId) {
                let testResult = viewFeature.results[engineId];
                that._addSupportStatus(testResult, capability);
            });

            that.features.push(viewFeature);

        });


    }

    _addSupportStatus(testResult, capability) {
        //TODO needed?
        /*if (this.supportStatus[testResult.engineID]) {
         this.supportStatus[testResult.engineID].update(testResult);
         } else { */
        this.supportStatus[testResult.engineID] = new SupportStatus({
            'engineID': testResult.engineID,
            'supportedFeature': testResult.result.testSuccessful ? 1 : 0,
            'fullSupport': false,
            'html': (capability === 'conformance') ? '✖' : '━',
            'supportedFeaturePercent': undefined
        });
    }


}

class SupportStatus {
    constructor(data) {
        this['engineID'] = data.engineID;
        this['supportedFeature'] = data.supportedFeature;
        this['fullSupport'] = data.fullSupport;
        this['html'] = data.html;
        this['supportedFeaturePercent'] = data.supportedFeaturePercent;
    }

    update(test) {
        this.supportedFeature += test.result.testSuccessful ? 1 : 0;
    }

    updateSupportStatus(construct, capability) {
        this['supportedFeaturePercent'] = (this.supportedFeature / construct.featureIndexes.length) * 100;

        if (construct.featureIndexes.length === this.supportedFeature) {
            this.fullSupport = true;
            this.html = '✔';

            if (capability === 'expressiveness') {
                if (construct.upperBound === '+') {
                    this.html = '+';
                } else if (construct.upperBound === '+/-') {
                    this.html = '+/-';
                }
            }
            htmlData['summaryRow'][engineID] += 1;
        } else if (capability === 'expressiveness' && this.supportedFeature > 0) {
            if (construct.upperBound === '+') {
                this.html = '+';
                this.fullSupport = true;
                htmlData['summaryRow'][engineID] += 1;
            }

        } else if (capability === 'conformance' && this.supportedFeature > 0) {
            this.html = '+/-';
            this.fullSupport = false;

        }

        this['html_class'] = getResultClass(this.fullSupport, this.html, construct.upperBound);
    }
}

//TODO rename to ViewFeature
class Feature {
    constructor(feature, tests) {
        this.lastFeature = false;
        this.results = {} //TestResult

        let that = this;
        Object.keys(feature).forEach(key => {
            that[key] = feature[key];
        });


        this['capability'] = getCapabilityFromId(this.id);
        if (typeof this.capability !== 'string') {
            return;
        }

        if (this.upperBound === '+/-') {
            this['html_standard_class'] = 'standard-col-partial';
        } else {
            this['html_standard_class'] = 'standard-col-res';
        }

        this._addTests(tests);

    }


    _addTests(tests) {
        let that = this;

        this.testIndexes.forEach(function (testIndex) {
            var test = tests[testIndex];

            if (test !== undefined) {
                if (test.result !== undefined && test.result.testResult !== undefined) {
                    that.results[test.engineID] = new TestResult(test, that); // test.result;
                }

                //addSupportStatus(construct, test);
            }
        });

    }

}

class TestResult {
    constructor(test, feature) {
        let that = this;
        Object.keys(test).forEach(key => {
            that[key] = test[key];
        });
        this.html = this._getHtmTestResult(test.result.testResult, feature.upperBound, feature.capability);
        this.html_class = getResultClass(test.result.testSuccessful, this.html, feature.upperBound);
    }

    _getHtmTestResult(result, upperBound, capability) {
        if (result === '+') {
            if (capability === 'expressiveness') {
                return upperBound;
            }
            return '✔';
        } else if (result === '-') {
            return (capability === 'expressiveness') ? '━' : '✖';
        } else if (result === true) {
            return '✔';
        } else if (result === false) {
            return '✖';
        } else if (result === '+/-') {
            return '+/-';
        }
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

export function getCapabilityFromId(id) {
    let idSplit = id.split('_');
    if (idSplit < 1) {
        console.error('Wrong featureId. Failed to decode capability');
        return;
    }
    return idSplit[0].toLowerCase();
}



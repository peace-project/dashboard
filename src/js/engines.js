function getNameOfId(id) {
    var split = id.split("__");
    return split[split.length - 1];
}
function getLanguageOfId(id) {
    var split = id.split("__");
    return split[1];
}

function getCapabilities() {
    return data.featureTree.map(function (cap) {
        return cap.id;
    }).sort();
}

function getLanguagesOfCapability(capId) {
    var langs = [];
    data.featureTree.forEach(function (cap) {
        if (cap.id == capId) {
            langs = cap.languages.map(function (lang) {
                return lang.id;
            })
            ;
        }
    });
    return langs.sort();
}

function getGroupsOfLanguage(langId) {
    var groups = [];
    data.featureTree.forEach(function (cap) {
            if (langId.startsWith(cap.id)) {
                cap.languages.forEach(function (lang) {
                    if (lang.id == langId) {
                        groups = lang.groups.map(function (group) {
                                return group.id;
                            }
                        );
                    }
                });

            }
        }
    );
    return groups.sort();
}

function getConstructsOfGroup(groupId) {
    var constructs = [];
    data.featureTree.forEach(function (cap) {
        if (groupId.startsWith(cap.id)) {
            cap.languages.forEach(function (lang) {
                if (groupId.startsWith(lang.id)) {
                    lang.groups.forEach(function (group) {
                        if (group.id == groupId) {
                            constructs = group.constructs.map(function (construct) {
                                    return construct.id;
                                }
                            );
                        }
                    });

                }
            });
        }
    });
    return constructs.sort();
}

function getFeatureOfConstruct(constructId) {
    var features = [];
    data.featureTree.forEach(function (cap) {
        if (constructId.startsWith(cap.id)) {
            cap.languages.forEach(function (lang) {
                if (constructId.startsWith(lang.id)) {
                    lang.groups.forEach(function (group) {
                        if (constructId.startsWith(group.id)) {
                            group.constructs.forEach(function (construct) {
                                    if (construct.id == constructId) {
                                        features = construct.features.map(function (feature) {
                                                return feature.id;
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    });

                }
            });
        }
    });
    return features.sort();
}

function hasTests(id) {
    var result = false;
    data.tests.forEach(function (test) {
        if (test.featureID.startsWith(id)) {
            result = true;
        }
    });
    return result;
}

function getTestResult(id, engineId) {
    var numTotal = 0;
    var numSuccess = 0;
    data.tests.forEach(function (test) {
        if (test.featureID.startsWith(id) && test.engineID == engineId) {
            numTotal++;
            if (test.result.testSuccessful) {
                numSuccess++;
            }
        }
    });
    return {
        total: numTotal,
        success: numSuccess
    }
}

function getEngineLanguages() {
    var langs = [];
    data.engines.forEach(function (engine) {
        if (langs.indexOf(engine.language) == -1) {
            langs.push(engine.language);
        }
    });
    return langs;
}

function getLanguageOfEngine(engineId) {
    var engineLang = "";
    data.tests.forEach(function (test) {
        if (test.engineID == engineId) {
            engineLang = getLanguageOfId(test.featureID);
        }
    });
    return engineLang;
}

function isLanguageTested(lang) {
    var result = false;
    data.tests.forEach(function (test) {
        if (test.featureID.indexOf(lang) != -1) {
            result = true;
        }
    });
    return result;
}

function isTested(engine) {
    var result = false;
    data.tests.forEach(function (test) {
        if (test.engineID.startsWith(engine)) {
            result = true;
        }
    });
    return result;
}

function isCapabilityId(id) {
    return id.split('__').length == 1;
}
function isLanguageId(id) {
    return id.split('__').length == 2;
}
function isGroupId(id) {
    return id.split('__').length == 3;
}
function isConstructId(id) {
    return id.split('__').length == 4;
}
function isFeatureId(id) {
    return id.split('__').length == 5;
}

function getCapabilityOfId(id) {
    return id.split('__')[0];
}


function getEngine(engineId) {
    var returnEngine = null;
    data.engines.forEach(function (engine) {
        if (engine.id == engineId) {
            returnEngine = engine;
        }
    });
    return returnEngine;
}


function getResult(featureId, engineId) {
    var result = null;
    data.tests.forEach(function (test) {
        if (test.featureID == featureId && test.engineID == engineId) {
            result = test.result;
        }
    });
    return result;
}

function getFeature(featureId) {
    var feature = null;
    data.featureTree.forEach(function (cap) {
        if (featureId.startsWith(cap.id)) {
            cap.languages.forEach(function (lang) {
                if (featureId.startsWith(lang.id)) {
                    lang.groups.forEach(function (group) {
                        if (featureId.startsWith(group.id)) {
                            group.constructs.forEach(function (construct) {
                                    if (featureId.startsWith(construct.id)) {
                                        construct.features.forEach(function (f) {
                                                if (f.id == featureId) {
                                                    feature = f;
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    });
                }
            });
        }
    });
    return feature;
}

function getEngineNamesOfLanguage(lang) {
    var names = [];
    data.engines.forEach(function (engine) {
        if (engine.language == lang && names.indexOf(engine.name) == -1) {
            names.push(engine.name);
        }
    });
    return names;
}

function getEnginesForLanguage(lang) {
    var engineIds = [];
    data.tests.filter(function (test) {
        return test.featureID.indexOf(lang) != -1;
    }).forEach(function (test) {
        if (engineIds.indexOf(test.engineID) == -1) {
            engineIds.push(test.engineID);
        }
    });
    return engineIds.sort();
}

function getEnginesForName(name) {
    return data.engines.filter(function (engine) {
        return engine.name == name;
    });
}

function getAllTestsOfEngine(engineId) {
    return data.tests.filter(function (elem) {
        return elem.engineID == engineId;
    });
}


function aggregateInformationPerEngine(engineId, language) {

    var engineTests = getAllTestsOfEngine(engineId);
    engineTests = engineTests.filter(function (test) {
        return test.featureID.indexOf(language) != -1;
    });
    var obj = {};
    obj.features = {};
    obj.features.conformance = aggregateConformanceFeatures(engineTests);
    obj.features.expressivness = aggregateExpressivenessFeatures(engineTests);
    obj.performance = aggregatePerformance(engineTests);

    obj.constructs = {};
    obj.constructs.conformance = aggregateConformanceConstructs(engineTests);
    obj.constructs.expressivness = aggregateExpressivenessConstructs(engineTests);
    return obj;
}

function aggregateConformanceConstructs(tests) {
    var capTests = tests.filter(function (test) {
        return test.featureID.startsWith("Conformance");
    });
    var obj = {};
    obj.full = 0;
    obj.partial = 0;
    obj.none = 0;
    obj.total = 0;
    groupTestsByConstruct(capTests).forEach(function (constGroup) {
        obj.total++;
        var result = aggregateConformanceFeatures(constGroup.features);
        if (result.successful == 0) {
            obj.none++;
        } else if (result.successful == result.total) {
            obj.full++;
        } else {
            obj.partial++;
        }
    });
    return obj;
}

function groupTestsByConstruct(tests) {
    var groups = [];
    tests.forEach(function (test) {
        var c = getConstructId(test.featureID);
        var index = containsConstruct(groups, c);
        if (index != -1) {
            groups[index].features.push(test);
        } else {
            var group = {
                construct: c,
                features: [test]
            };
            groups.push(group);
        }
    });
    return groups;
}

function containsConstruct(tests, c) {
    for (var i = 0; i < tests.length; i++) {
        if (tests[i].construct == c) {
            return i;
        }
    }
    return -1;
}

function getConstructId(id) {
    return id.substring(0, id.lastIndexOf('__'));
}


function aggregateExpressivenessConstructs(tests) {
    var capTests = tests.filter(function (test) {
        return test.featureID.startsWith("Expressiveness");
    });
    var obj = {};
    obj.full = 0;
    obj.partial = 0;
    obj.none = 0;
    obj.total = 0;
    groupTestsByConstruct(capTests).forEach(function (constGroup) {
        obj.total++;
        var result = aggregateExpressivenessFeatures(constGroup.features);
        if (result.successful == 0) {
            obj.none++;
        } else if (result.successful == result.total) {
            obj.full++;
        } else {
            obj.partial++;
        }
    });
    return obj;
}


function aggregateConformanceFeatures(tests) {
    var capTests = tests.filter(function (test) {
        return test.featureID.startsWith("Conformance");
    });
    var obj = {};
    obj.total = capTests.length;
    obj.deployable = 0;
    obj.successful = 0;
    capTests.forEach(function (test) {
        if (test.result.testDeployable) {
            obj.deployable++;
        }
        if (test.result.testSuccessful) {
            obj.successful++;
        }
    });
    return obj;
}

function aggregateExpressivenessFeatures(tests) {
    var capTests = tests.filter(function (test) {
        return test.featureID.startsWith("Expressiveness");
    });
    var obj = {};
    obj.total = capTests.length;
    obj.deployable = 0;
    obj.successful = 0;
    capTests.forEach(function (test) {
        if (test.result.testDeployable) {
            obj.deployable++;
        }
        if (test.result.testSuccessful) {
            obj.successful++;
        }
    });
    return obj;
}

function aggregatePerformance(tests) {
    var capTests = tests.filter(function (test) {
        return test.featureID.startsWith("Performance");
    });
    var obj = {};
    obj.total = capTests.length;
    obj.cpu = 0;
    obj.ram = 0;
    obj.throughput = 0;

    capTests.forEach(function (t) {
        // t = getTests(tId)[0];
        obj.cpu += t.capability.cpu.average;
        obj.ram += t.capability.ram.average;
        obj.throughput += t.capability.throughput.average;
    });
    obj.cpu = obj.cpu / capTests.length;
    obj.ram = obj.ram / capTests.length;
    obj.duration = obj.duration / capTests.length;
    obj.throughput = obj.throughput / capTests.length;
    return obj;
}
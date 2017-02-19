import {sortDataAlphabetic, capitalizeFirstLetter} from './utils';
import NormalizedData from "./model/normalized_data";
import CapabilityData from "./model/capability_data";
import {shallowCopy} from "./utils";

//used for engines-overview page
/*
export function normalizeAll(dataModel) {
    //throw new Error("Unsupported operation");
    //TODO
    let normalizedData = new NormalizedData();
    dataModel.getFeatureTree().forEach(function (obj) {
        normalizedData.add(normalizeByCapability(dataModel, obj.id));
    });
    return normalizedData;
}

export function normalizeByCapability(dataModel, capability, tests, testIndependentData) {
    var data = {};
    data.featureTree = dataModel.getFeatureTreeByCapability(capability);
    let capabilityData = new CapabilityData(capability);

    data.featureTree.languages.forEach(function (treeByLang) {
        let normalizedTree = normalizeFeatureTree(treeByLang, tests, testIndependentData);
        normalizedTree['engines'] = normalizeEngines(dataModel.getEngines(), treeByLang.name);
        capabilityData.add(normalizedTree);
    });
    return capabilityData;
}

function normalizeEngines(engines, lang) {
    let copyEngines_ = copyEngines(_.where(engines, {language: lang}));
    let sortedEngines = sortDataAlphabetic(copyEngines_, 'name');
    //TODO check why needed?
    sortedEngines.forEach(function (engine, index) {
        engine['index'] = index
    });
    return sortedEngines;
    //addIndexToEngines(normalizedData[obj.name]['engines']);
}


function normalizeTests(tests) {
    tests.forEach((test, index) => test.featureID === feature.id);
}

function normalizeFeatureTree(featureTree, tests, testIndependentData) {
    var cTotalLength = 0;
    var fTotalLength = 0;
    var currentConstructIndex = 0;
    var currentFeatureIndex = 0;

    var capData = {language: undefined, groups: [], engines: [], constructs: [], features: []};
    capData.language = featureTree.name;

    var sortedGroups = sortDataAlphabetic(featureTree.groups, 'name');
    sortedGroups.forEach(function (group, gIndex) {

        var sortedConstructs = sortDataAlphabetic(group.constructs, 'name');
        sortedConstructs.forEach(function (construct, cIndex) {

            var sortedFeatures = sortDataAlphabetic(construct.features, 'name');
            sortedFeatures.forEach(function (feature, fIndex) {
                //var _tests = getFeatureTests(tests);
                //capData.tests.push(featureTests);
                var _features = createNormalizedFeature(feature, group, tests, testIndependentData, gIndex, currentConstructIndex, currentFeatureIndex);
                capData.features.push(_features);
                currentFeatureIndex++;
            });


            var start = fTotalLength;
            fTotalLength += construct.features.length;
            var end = fTotalLength;

            var _constructs = createNormalizedConstruct(construct, group, gIndex, start, end);
            capData.constructs.push(_constructs);
            currentConstructIndex++;
        });

        var start = cTotalLength;
        cTotalLength += group.constructs.length;
        var end = cTotalLength;

        capData.groups.push(createNormalizedGroup(group, start, end));

    });


    return capData;
}

function createNormalizedGroup(group, start, end) {
    return {
        name: capitalizeFirstLetter(group.name.replaceAll('_', ' ')),
        description: group.description,
        id: group.id,
        constructIndexes: _.range(start, end)
    };
}

function createNormalizedFeature(feature, group, tests, testIndependentData, gIndex, currentConstructIndex, currentFeatureIndex) {
    let featureTests = tests.filter(test => test.featureID === feature.id);
    let featureTestsIndependent = testIndependentData.filter(test => test.featureID === feature.id);
    return {
        name: feature.name.replaceAll('_', ' '),
        description: feature.description,
        id: feature.id,
        upperBound: feature.upperBound,
        lastFeature: false,
        groupId: group.id,
        groupName: capitalizeFirstLetter(group.name.replaceAll('_', ' ')),
        groupIndex: gIndex,
        constructIndex: currentConstructIndex,
        featureIndex: currentFeatureIndex,
        testIndexes: featureTests.map(obj => obj.index),
        testIndexesEngine: testIndexesByEngines(featureTests),
        testIndependentIndex: featureTestsIndependent.map(obj => obj.index)[0]
        //getTestIndexesByFeatureID(tests, feature.id)
    };
}

function testIndexesByEngines(featureTests){
    let obj = {};
    featureTests.forEach(test => {
        obj[test.engineID] = test.index;
    });
    return obj;
}



function createNormalizedConstruct(construct, group, gIndex, start, end) {
    return {
        name: construct.name.replaceAll('_', ' '),
        description: construct.description,
        id: construct.id,
        groupId: group.id,
        groupName: capitalizeFirstLetter(group.name.replaceAll('_', ' ')),
        groupDesc: group.description,
        isFirstEntry: false,
        groupIndex: gIndex,
        featureIndexes: _.range(start, end)
    };
}

function getFeatureTests(tests, featureID) {
    tests.find(test => test.featureID === featureID);
}

function getTestIndexesByFeatureID(tests, featureID) {
    var index = [];
    tests.forEach(function (test, key) {
        if (test.featureID == featureID) {
            index.push(key);
        }
    });
    return index;
}

function copyEngines(engines) {
    var copy = [];
    for (var index in engines) {
        var idParts = engines[index].id.split('__');
        var versionLong = engines[index].version;
        if (idParts.length > 2) {
            versionLong = engines[index].version + ' ' + idParts[2];
        }
        copy[index] = {
            configuration: shallowCopy(engines[index].configuration),
            id: engines[index].id,
            language: engines[index].language,
            name: engines[index].name,
            version: engines[index].version,
            url: engines[index].url,
            license: engines[index].license,
            licenseURL: engines[index].licenseURL,
            releaseDate: engines[index].releaseDate,
            programmingLanguage: engines[index].programmingLanguage,
            versionLong: versionLong,
            'index': index
        }
    }
    return copy;
} */


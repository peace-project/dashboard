import {sortDataAlphabetic, capitalizeFirstLetter} from './utils';
import NormalizedData from "./model/normalized_data";
import CapabilityData from "./model/capability_data";

//used for engines-overview page

export function normalizeAll(dataModel) {
    //throw new Error("Unsupported operation");
    //TODO
    let normalizedData = new NormalizedData();
    dataModel.getFeatureTree().forEach(function (obj) {
        normalizedData.add(normalizeByCapability(dataModel, obj.id));
    });
    return normalizedData;
}

export function normalizeByCapability(dataModel, capability) {
    var data = {};

    data.featureTree = dataModel.getFeatureTreeByCapability(capability);
    let capabilityData = new CapabilityData(capability);
    data.featureTree.languages.forEach(function (treeByLang) {
        let normalizedTree = normalizeFeatureTree(treeByLang, dataModel.getTests());
        normalizedTree['engines'] = normalizeEngines(dataModel.getEngines(), treeByLang.name);
        capabilityData.add(normalizedTree);
    });

    data.tests = dataModel.getTestsByCapability(capability);

    return capabilityData;
}

function normalizeEngines(engines, lang) {
    let copyEngines_ = copyEngines(_.where(engines, {language: lang}));
    let sortedEngines = sortDataAlphabetic(copyEngines_, 'name');
    //TODO check why needed?
    sortedEngines.forEach(function (engine, index) {
        engine['engineIndex'] = index
    });
    return sortedEngines;
    //addIndexToEngines(normalizedData[obj.name]['engines']);
}

function normalizeFeatureTree(featureTree, tests) {
    var cTotalLength = 0;
    var fTotalLength = 0;
    var currentConstructIndex = 0;
    var currentFeatureIndex = 0;

    var data = {language: undefined, groups: [], engines: [], constructs: [], features: []};
    data.language = featureTree.name;

    var sortedGroups = sortDataAlphabetic(featureTree.groups, 'name');

    sortedGroups.forEach(function (group, gIndex) {

        var sortedConstructs = sortDataAlphabetic(group.constructs, 'name');
        sortedConstructs.forEach(function (construct, cIndex) {

            var sortedFeatures = sortDataAlphabetic(construct.features, 'name');
            sortedFeatures.forEach(function (feature, fIndex) {
                var _features = createNormalizedFeature(feature, group, tests, gIndex, currentConstructIndex, currentFeatureIndex);
                data.features.push(_features);
                currentFeatureIndex++;
            });


            var start = fTotalLength;
            fTotalLength += construct.features.length;
            var end = fTotalLength;

            var _constructs = createNormalizedConstruct(construct, group, gIndex, start, end);
            data.constructs.push(_constructs);
            currentConstructIndex++;
        });

        var start = cTotalLength;
        cTotalLength += group.constructs.length;
        var end = cTotalLength;

        data.groups.push(createNormalizedGroup(group, start, end));

    });


    return data;
}

function createNormalizedGroup(group, start, end) {
    return {
        name: capitalizeFirstLetter(group.name.replaceAll('_', ' ')),
        description: group.description,
        id: group.id,
        constructIndexes: _.range(start, end)
    };
}

function createNormalizedFeature(feature, group, tests, gIndex, currentConstructIndex, currentFeatureIndex) {
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
        testIndexes: getTestIndexesByFeatureID(tests, feature.id)
    };
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
            indexEngine: index
        }
    }
    return copy;
}

function shallowCopy(array){
    var copy = [];
    for (var index in array) {
        copy[index] = array[index];
    }
    return copy;
}
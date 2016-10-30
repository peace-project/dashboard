import {sortDataAlphabetic, capitalizeFirstLetter} from './utils';
import NormalizedData from "./model/normalized_data";
import NormalizedFeature from "./model/normalized_feature";
import NormalizedConstruct from "./model/nomalized_construct";

export function normalizeFeatureTree(featureTree, engines) {
    var cTotalLength = 0;
    var fTotalLength = 0;
    var currentConstructIndex = 0;
    var currentFeatureIndex = 0;

    var data = {groups: [], engines: [], constructs: [], features: []};

    var sortedGroups = sortDataAlphabetic(featureTree.groups, 'name');

    sortedGroups.forEach(function (group, gIndex) {

        var sortedConstructs = sortDataAlphabetic(group.constructs, 'name');
        sortedConstructs.forEach(function (construct, cIndex) {

            var sortedFeatures = sortDataAlphabetic(construct.features, 'name');
            sortedFeatures.forEach(function (feature, fIndex) {
                var _features = createNormalizedFeature(feature , group, currentConstructIndex, currentFeatureIndex);
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


    data.engines =  sortDataAlphabetic(
        copyEngines(_.where(engines, {language:obj.name})), 'name');
    addIndexToEngines(normalizedData[obj.name]['engines']);

    return new NormalizedData(data);
}

function createNormalizedGroup(group, start, end) {
   return new NormalizedConstruct({
       name: capitalizeFirstLetter(group.name.replaceAll('_', ' ')),
       description: group.description,
       id: group.id,
       constructIndexes: _.range(start, end)
   }) ;
}

function createNormalizedFeature(feature, group, currentConstructIndex, currentFeatureIndex){
    return new NormalizedFeature({
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
        testIndexes: getTestIndexesByFeatureID(feature.id)
    });
}

function createNormalizedConstruct(construct, group, gIndex, start, end){
  return  new NormalizedConstruct({
        name: construct.name.replaceAll('_', ' '),
        description: construct.description,
        id: construct.id,
        groupId: group.id,
        groupName: capitalizeFirstLetter(group.name.replaceAll('_', ' ')),
        groupDesc: group.description,
        isFirstEntry: false,
        groupIndex: gIndex,
        featureIndexes: _.range(start, end)
    });
}


function getTestIndexesByFeatureID(featureID){
    var index = [];
    data.tests.forEach(function(test, key){
        if (test.featureID == featureID){
            index.push(key);
        }
    });
    return index;
}

function copyEngines(engines){
    var copy = [];
    for (var index in engines){
        var idParts = engines[index].id.split('__');
        var versionLong = engines[index].version;
        if(idParts.length > 2){
            versionLong = engines[index].version+' '+idParts[2];
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

function addIndexToEngines(engines){
    engines.forEach(function(engine, index){engine['engineIndex'] = index})
}


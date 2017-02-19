'use strict'

import {sortDataAlphabetic, capitalizeFirstLetter, shallowCopy} from "../../utils";
import CapabilityData from "../capability_data";
import Schema from "./schema";
import {DataType} from "../normalized_data_container";

// Inspired by normalizr


const sortByName = function (data) {
    return sortDataAlphabetic(data, 'name');
};


function addIndex(tests) {
    let _tests = tests.map((test, index) => {
        test['index'] = index;
        return test;
    });

    return _tests;
}


function copyAndFormat(engines) {
    let sortedEngines = sortDataAlphabetic(engines, 'name');

    for (let index in sortedEngines) {
        if (engines.hasOwnProperty(index)) {
            let idParts = engines[index].id.split('__');
            let versionLong = engines[index].version;
            if (idParts.length > 2) {
                versionLong = engines[index].version + ' ' + idParts[2];
            }

            sortedEngines[index]['index'] = index;
            sortedEngines[index]['versionLong'] = versionLong;
        }
    }
    return sortedEngines;
}

/*
 function normalizeResultsByCapability(rawData, capability) {
 let tests = addIndex(rawData.getTestsByCapability(capability));
 let testIndependentData = addIndex(rawData.getIndependentTestsByCapability(capability));
 //let testIndependentData = new TestIndependentData(rawData.getIndependentTestsByCapability(capability));

 return  {
 testIndependentData : testIndependentData,
 tests : tests
 }
 }*/


function addFeatureResults(featureResults, capabilityData) {
    let measurementByLanguage = {};
    featureResults.forEach(test => {
        test.measurements.forEach(measure => {
            let splittedMetric = measure.metric.split('__');
            // Skip language independent results
            if (splittedMetric.length < 3) {
                return;
            }

            let language = measure.metric.split('__')[1];
            if (measurementByLanguage[language] === undefined) {
                measurementByLanguage[language] = {
                    engine: test.engine,
                    tool: test.tool,
                    measurements: []
                }
            }
            measurementByLanguage[language]['measurements'].push(measure);
        });
    });

    for (let language in measurementByLanguage) {
        if (measurementByLanguage.hasOwnProperty(language)) {
            capabilityData.add(language, measurementByLanguage[language], DataType.FEATURE_RESULTS);
            //console.log(language);
        }
    }

}

function addTestResults(testResults, capabilityData) {
    testResults.forEach(result => {
        let language = result.test.split('__')[1];
        capabilityData.add(language, result, DataType.TEST_RESULTS);
    });

}

function addEngines(engines, capabilityData) {
    engines.forEach(engine => {
        if (engine.version === 'N.NN.N' && capabilityData.getCapability() !== 'performance') {
            return;
        }

        let language = engine.language.split('__')[0];
        if(capabilityData.hasData(language, DataType.TESTS_INDEPENDENT)){
            capabilityData.add(language, engine, DataType.ENGINES);
        }
    });
}

function addIndependentTests(tests, capabilityData) {
    addIndex(tests);
    tests.forEach(test => {
        let language = test.id.split('__')[1];
        capabilityData.add(language, test, DataType.TESTS_INDEPENDENT);
    });
}

export function normalizeCapability(rawData, capability) {
    let capabilityData = new CapabilityData(capability);

    let testResults = rawData.getTestResultsByCapability(capability) || [];
    let aggregatedResults = rawData.getAggregatedResultsByCapability(capability) || [];
    let engines = copyAndFormat(rawData.getEngines()) || [];
    let testIndependentData = rawData.getIndependentTestsByCapability(capability) || [];

    addTestResults(testResults, capabilityData);
    addFeatureResults(aggregatedResults, capabilityData);
    addIndependentTests(testIndependentData, capabilityData);
    addEngines(engines, capabilityData);

    return normalizeFeatureTree(capabilityData, capability, rawData);
}


function normalizeFeatureTree(capabilityData, capability, rawData) {
    let allData = capabilityData.getAll();

    const afterAssignGroups = function (normalized, schema, parentIndex, fullNormalized) {
        normalized['name'] = capitalizeFirstLetter(normalized['name'].replaceAll('_', ' '));
    };

    const afterAssignConstructs = function (normalized, schema, parentIndex, fullNormalized) {
        normalized['name'] = capitalizeFirstLetter(normalized['name'].replaceAll('_', ' '));
        let language = normalized.id.split('__')[1];
        let featureResults = allData.getFeatureResultsByLanguage(language);
        addFeatureResultIndexes(normalized, featureResults);
    };


    const afterAssignFeatures = function (normalized, schema, parentIndex, fullNormalized) {
        normalized['name'] = capitalizeFirstLetter(normalized['name'].replaceAll('_', ' '));
        let language = normalized.id.split('__')[1];

        let featureResults = allData.getFeatureResultsByLanguage(language);
        addFeatureResultIndexes(normalized, featureResults);

        let testResults = allData.getTestResultsByLanguage(language);
        addTestResultIndex(normalized, testResults);

        //normalized['testIndexes'] = testResult.map(obj => obj.index);
        // normalized['testIndexesEngine'] = testIndexesByEngines(testResult);
        let engineTestsIndependent = allData.getAllTestIndependentByLanguage(language); //.filter(test => test.feature === normalized.id);

        for(let key in engineTestsIndependent.data){
            if(engineTestsIndependent.data[key].feature === normalized.id){
                normalized['testIndependentIndex'] = key;
            }
        }
    };

    const groups = new Schema('groups', {
            sortData: sortByName,
            afterAssign: afterAssignGroups
        }
    );

    const constructs = new Schema('constructs', {
        addProps: {isFirstEntry: false},
        sortData: sortByName,
        afterAssign: afterAssignConstructs
    });

    const features = new Schema('features', {
        addProps: {lastFeature: false},
        sortData: sortByName,
        afterAssign: afterAssignFeatures
    });

    groups.define({
        'featureSets': constructs
    });

    constructs.define({
        'features': features
    });


    let featureTree = rawData.getFeatureTreeByCapability(capability);
    featureTree.languages.forEach(featureSet => {
        let normalizedData = normalize(featureSet, groups);
        capabilityData.addAll(normalizedData, featureSet.name);
    });

    return capabilityData;
}

function addTestResultIndex(normalized, testResults) {
    normalized['testResultIndex'] = {};

    if (testResults === undefined) {
        return;
    }

    for (let key in testResults.data) {
        let id = testResults.data[key].test.replace('__test', '');
        if (id.toLowerCase() === normalized.id.toLowerCase()) {
            let engineId = testResults.data[key].engine;
            normalized['testResultIndex'][engineId] = normalized['testResultIndex'][engineId] || [];
            normalized['testResultIndex'][engineId] = key;
          //  break;
        }
    }
}

function addFeatureResultIndexes(normalized, featureResults) {
    // Always add metricIndexes property to avoid checking against undefined
    normalized['metricIndexes'] = [];

    if (featureResults === undefined || !Array.isArray(normalized['metrics'])) {
        return;
    }

    featureResults.data.forEach((test, index) => {
        const metricIndexes = {featureResultIndex: undefined, measurementIndexes: []};
        metricIndexes['featureResultIndex'] = index;

        for (let key in test.measurements) {
            let measure = test.measurements[key];
            let foundMetric = normalized['metrics'].findIndex(me => me.id.toLowerCase() === measure.metric.toLowerCase());
            if (foundMetric > -1) {
                metricIndexes['measurementIndexes'].push(key);
            }
        }

        normalized['metricIndexes'].push(metricIndexes);
    });
}


export function normalize(obj, schema) {
    if (obj == null || typeof obj !== 'object') {
        throw new Error('The input data must be an object');
    }
    if (schema == undefined) {
        throw new Error('Schema is undefined');
    }
    return visit(obj, schema, {});
}


function visit(obj, schema, normalized, parentIndex) {
    let nestedSchemaKey = (schema.getParentSchema()) ? schema.getNestedKey() : schema.getKey();

    if (!obj.hasOwnProperty(nestedSchemaKey)) {
        throw Error('Schema key ' + nestedSchemaKey + ' not found in input data');
    }

    let data = obj[nestedSchemaKey];
    let sortData = schema.getSortData();
    if (sortData) {
        data = sortData(data);
    }

    let schemaKey = schema.getKey();
    normalized[schemaKey] = normalized[schemaKey] || [];
    let nestedSchema = schema.getNestedSchema();

    parentIndex = (parentIndex === undefined) ? -1 : parentIndex;


    if (schema.getParentSchema()) {
        //totalLength += data.length;
        const startIndex = normalized[schemaKey].length;
        const endIndex = startIndex + data.length;
        //console.log(startIndex + ';' + endIndex)

        assignIndexesToParent(normalized, schema, parentIndex, startIndex, endIndex);
    }

    data.forEach((value, index) => {
        // index of the assigned values is the parent for nested schema object
        let thisIndex = normalized[schemaKey].length;
        assignValues(value, normalized[schemaKey], schema, parentIndex);
        visitNestedSchema(value, nestedSchema, normalized, thisIndex);
    });

    return normalized;
}

function assignIndexesToParent(normalized, nestedSchema, parentIndex, start, end) {
    const parentKey = nestedSchema.getParentSchema().getKey();
    const nestedIndexKey = nestedSchema.getKey() + 'Indexes';
    // console.log('['+parentKey+']['+parentIndex+']['+nestedIndexKey+']=['+start+','+(end-1)+']');
    normalized[parentKey][parentIndex][nestedIndexKey] = _.range(start, end);
}


function visitNestedSchema(data, nestedSchema, normalized, parentIndex) {
    for (let key in nestedSchema) {
        if (nestedSchema.hasOwnProperty(key)) {
            let schema = nestedSchema[key];
            visit(data, schema, normalized, parentIndex);
        }
    }
}


function assignValues(data, normalized, schema, parentIndex) {
    let addProps = schema.getAddProps();
    let removeProps = schema.getRemoveProps();
    let getAfterAssign = schema.getAfterAssign();
    let nestedSchema = schema.getNestedSchema();

    let normalizedValues = {};
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (!nestedSchema.hasOwnProperty(key) && removeProps.indexOf(key) < 0) {
                normalizedValues[key] = data[key];
            }
        }
    }

    if (addProps !== undefined) {
        Object.keys(addProps).forEach(key => {
            normalizedValues[key] = addProps[key];
        });
    }

    if (getAfterAssign) {
        getAfterAssign(normalizedValues, schema, parentIndex, normalized);
    }
    if (parentIndex > -1 && schema.getParentSchema()) {
        assignParentIndexes(normalizedValues, schema.getParentSchema(), parentIndex);
    }
    normalized.push(normalizedValues);
}

function assignParentIndexes(normalized, schema, parentIndex) {
    const schemaKey = schema.getKey();
    const parentIndexKey = schemaKey + 'Index';
    normalized[parentIndexKey] = parentIndex;
}


function testIndexesByEngines(featureTests) {
    let obj = {};
    featureTests.forEach(test => {
        obj[test.engineID] = test.index;
    });
    return obj;
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
}


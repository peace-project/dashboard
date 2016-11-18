'use strict'

import {sortDataAlphabetic, capitalizeFirstLetter, shallowCopy} from "../../utils";
import CapabilityData from "../capability_data";
import Schema from "./schema";
import {DataType} from "../normalized_data_container";

// Inspired by normalizr

const afterAssignGroups = function (normalized, schema, parentIndex, fullNormalized) {
    normalized['name'] = capitalizeFirstLetter(normalized['name'].replaceAll('_', ' '));
    //normalized['metrics'] = normalized['metrics'].metric;
};

const afterAssignConstructs = function (normalized, schema, parentIndex, fullNormalized) {
    normalized['name'] = capitalizeFirstLetter(normalized['name'].replaceAll('_', ' '));
 //   normalized['metrics'] = normalized['metrics'].metric;
};


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
        if(engines.hasOwnProperty(index)){
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


function addTests(tests, capabilityData){
    addIndex(tests);
    tests.forEach(test => {
        let language = test.test.split('__')[1];
        capabilityData.add(language, test, DataType.TESTS);
    });
}


function addEngines(engines, capabilityData){
    engines.forEach(engine => {
        let language = engine.language.split('__')[0];
        capabilityData.add(language, engine, DataType.ENGINES);
    });
}

function addIndependentTests(tests, capabilityData){
    addIndex(tests);
    tests.forEach(test => {
       let language = test.id.split('__')[1];
       capabilityData.add(language, test, DataType.TESTS_INDEPENDENT);

    });
}

export function normalizeCapability(rawData, capability) {
    let capabilityData = new CapabilityData(capability);

    let tests = rawData.getTestsByCapability(capability);
    if(tests === undefined || tests.length === 0){
        throw new Error('No tests found for capability '+ capability);
    }

    console.log('tests=='+tests)
    console.log(tests)

    let engines = copyAndFormat(rawData.getEngines());
    if(engines === undefined || engines.length === 0){
        throw new Error('No engines found for capability '+ capability);
    }

    let testIndependentData = rawData.getIndependentTestsByCapability(capability);
    if(testIndependentData === undefined || testIndependentData.length === 0){
        throw new Error('TestData for capability '+ capability + ' is incomplete');
    }


    addTests(tests, capabilityData);
    addEngines(engines, capabilityData);
    addIndependentTests(testIndependentData, capabilityData);



    const afterAssignFeatures = function (normalized, schema, parentIndex, fullNormalized) {
        normalized['name'] = capitalizeFirstLetter(normalized['name'].replaceAll('_', ' '));
        let testResult = tests.filter(test => {
            const featureId = test.test.replace('__test', '').toLowerCase();
            return featureId === normalized.id.toLowerCase();
        });


        let featureTestsIndependent = testIndependentData.filter(test => test.featureID === normalized.id);

        normalized['testIndexes'] = testResult.map(obj => obj.index);
        normalized['testIndexesEngine'] = testIndexesByEngines(testResult);

        normalized['testIndependentIndex'] = featureTestsIndependent.map(obj => obj.index)[0];

    };


    const groups = new Schema('groups', {
            //inputKey: 'group',
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



    //var data = {};
    let featureTree = rawData.getFeatureTreeByCapability(capability);

    featureTree.languages.forEach(featureSet => {
        let normalizedData = normalize(featureSet, groups);
        console.log(normalizedData);
        capabilityData.addAll(normalizedData, featureSet.name);

    });

    console.log('_________normalizedTree');
    console.log(capabilityData.getAll());
    return capabilityData;
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
    let nestedSchemaKey = schema.getKey();
    if(schema.getParentSchema()){
        nestedSchemaKey = schema.getNestedKey()
    } else if(schema.getInputKey()){
        nestedSchemaKey = schema.getInputKey();
    }

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


import {sortDataAlphabetic} from "../../utils";
import CapabilityData from "../capability_data";
import {capitalizeFirstLetter} from "../../utils";
import {shallowCopy} from "../../utils";
import Schema from "./schema";

// Inspired by normalizr

const afterAssignGroups = function (normalized, schema, parentIndex, fullNormalized) {
    normalized['name'] = capitalizeFirstLetter(normalized['name'].replaceAll('_', ' '))
};

const afterAssignConstructs = function (normalized, schema, parentIndex, fullNormalized) {
    normalized['name'] = capitalizeFirstLetter(normalized['name'].replaceAll('_', ' '))
};


const sortByName = function (data) {
    return sortDataAlphabetic(data, 'name');
};


export function normalizeCapability(dataModel, capability, tests, testIndependentData) {

    const afterAssignFeatures = function (normalized, schema, parentIndex, fullNormalized) {
        normalized['name'] = capitalizeFirstLetter(normalized['name'].replaceAll('_', ' '));
        let featureTests = tests.filter(test => test.featureID === normalized.id);
        let featureTestsIndependent = testIndependentData.filter(test => test.featureID === normalized.id);
        normalized['testIndexes'] = featureTests.map(obj => obj.index);
        normalized['testIndependentIndex'] = featureTestsIndependent.map(obj => obj.index)[0];
        normalized['testIndexesEngine'] = testIndexesByEngines(featureTests);
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
        'constructs': constructs
    });

    constructs.define({
        'features': features
    });


    var data = {};
    data.featureTree = dataModel.getFeatureTreeByCapability(capability);
    let capabilityData = new CapabilityData(capability);


    data.featureTree.languages.forEach(featureSet => {
        let normalizedData = normalize(featureSet, groups);
        normalizedData['language'] = featureSet.name;
        normalizedData['engines'] = normalizeEngines(dataModel.getEngines(), featureSet.name);
        capabilityData.add(normalizedData);
    });

    console.log('_________normalizedTree');
    console.log(capabilityData.getAll());
    return capabilityData;
}




function normalizeEngines(engines, lang) {
    let copyEngines_ = copyEngines(_.where(engines, {language: lang}));
    let sortedEngines = sortDataAlphabetic(copyEngines_, 'name');
    sortedEngines.forEach(function (engine, index) {
        engine['index'] = index
    });
    return sortedEngines;
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
    let schemaKey = schema.getKey();
    if (!obj.hasOwnProperty(schemaKey)) {
        throw Error('Schema key ' + schemaKey + ' not found in input data');
    }

    let data = obj[schemaKey];
    let sortData = schema.getSortData();
    if (sortData) {
        data = sortData(data);
    }


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


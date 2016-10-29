import {fetchBetsyData} from './fetch'
import {fetchBenFlowData} from './fetch'
import DataModel from './data_model'
/*import { initFilter } from './filters'
 import { prepareHtmlData } from './prepareOutputData'
 import { buildFilterItems } from './html'
 import { renderCapabilityTable } from './render'*/

var page, capability, filteredData, htmlData, dataFilters, numberOfreceivedData, normalizedData;
var data;

export function Peace(page) {
    if (page === undefined || page == null) {
        console.error('page is undefined');
        return false;
    }

    loadData(page)
        .then(res => {
            data = getData(res);
            console.log(data);
            process();
        });


    //console.log(data);
}


function loadData(page) {
    if (page === 'conformance' || page === 'expressiveness' || page === 'engines-overview' || page === 'engines-compare') {
        console.log("Start loading betsy data");
        return fetchBetsyData();
        /*fetchBetsyData()
         .then(results => setData(results))
         .catch(function (e) {
         console.log(e);
         });*/
    } else if (page === 'performance') {
        console.log("Start loading benchFlow data");
        return fetchBenFlowData();
        /*then(results => setData(results))
         .catch(function (e) {
         console.log(e);
         });*/
    } else {
        console.log("Unsupported page");
        throw Error("Unsupported page");
    }
}

function getData(results) {
    var objResults = {};
    results.forEach(function (row) {
        objResults[row.name] = row.result;
    });

    return new DataModel(objResults);

    /*data = {tests: [], testsIndependent: [], featureTree: [], engines: [], metrics: []};
     filteredData = {groups: [], engines: [], constructs: [], features: []};
     normalizedData = [];
     htmlData = {constructs: [], summaryRow: {'totalConstructs': 0}};
     dataFilters = {
     language: 'BPMN',
     groups: undefined,
     constructs: undefined,
     features: undefined,
     portability_status: 0
     } */

    //new DataModel();
}


function process() {
    console.log(data instanceof DataModel);
    if (!(data instanceof DataModel)) {
        console.log('Failed to initialize JSON data');
        return;
    }

    if (page === 'conformance' || page === 'expressiveness' || page === 'performance') {
        initFilter();
        prepareHtmlData();
        buildFilterItems();
        renderCapabilityTable();
    } else if (page === 'engines-overview') {
        engineOverview();
    } else if (page === 'engines-compare') {
        engineCompare();
    }
}

/*
 page = benchmarkType;
 capability = benchmarkType;

 data = {tests: [], testsIndependent: [], featureTree: [], engines: [], metrics: []};
 filteredData = {groups: [], engines: [], constructs: [], features: []};
 normalizedData = [];
 htmlData = {constructs:[], summaryRow: {'totalConstructs' : 0} };
 dataFilters = { language:   'BPMN', groups: undefined, constructs: undefined, features: undefined, portability_status: 0}


 numberOfreceivedData = 0;
 var totalJSONFiles = (page === 'performance') ? 5 : 4;

 if(page === 'conformance' || page === 'expressiveness' || page === 'engines-overview'
 || page === 'engines-compare'){
 getJSON("../data/tests-engine-dependent.json", setDataCallback('tests', totalJSONFiles));
 getJSON("../data/feature-tree.json", setDataCallback('featureTree', totalJSONFiles));
 getJSON("../data/engines.json", setDataCallback('engines', totalJSONFiles));
 getJSON("../data/tests-engine-independent.json", setDataCallback('independentTests', totalJSONFiles));
 } else if(page === 'performance'){
 getJSON("../data/benchflow-tests-engine-dependent.json", setDataCallback('tests', totalJSONFiles));
 getJSON("../data/benchflow-feature-tree.json", setDataCallback('featureTree', totalJSONFiles));
 getJSON("../data/benchflow-tests-engine-independent.json", setDataCallback('independentTests', totalJSONFiles));
 getJSON("../data/benchflow-engines.json", setDataCallback('engines', totalJSONFiles));
 getJSON("../data/metrics.json", setDataCallback('metrics', totalJSONFiles));
 }


 return peace;
 }

 function setDataCallback(dataType, totalJSONFiles){
 return function(jsonData, textStatus, jqXHR) {
 if(dataType === 'tests'){
 data.tests = jsonData;
 } else if(dataType === 'featureTree'){
 data.featureTree = jsonData;
 if(page !== 'engines-overview' && page !== 'engines-compare'){
 udpateFeatureTreeByCapability();
 }
 } else if(dataType === 'engines'){
 data.engines = jsonData;
 } else if(dataType === 'independentTests'){
 data.independentTests = jsonData;
 } else if(dataType === 'metrics'){
 data.metrics = jsonData[0];
 }

 numberOfreceivedData++;
 if(numberOfreceivedData === totalJSONFiles){
 if(data.featureTree === undefined) {
 console.error('Capability not found in the dataset')
 return false;
 }
 process();

 }
 }
 }



 }

 function udpateFeatureTreeByCapability(cap){
 if(cap !== undefined) { capability = cap }

 data.featureTree = _.find(data.featureTree, function(feature){
 return feature.id.toLowerCase() == capability.toLowerCase();
 });
 } */

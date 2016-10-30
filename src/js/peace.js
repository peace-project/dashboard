import {fetchBetsyData} from './fetch'
import {fetchBenFlowData} from './fetch'
import DataModel from './data_model'
import {normalizeCapability} from "./normalizer";
import FilterManager from "./filter_manager";
import GroupFilter from "./filters/group_filter";
import LanguageFilter from "./filters/language_filter";
import EngineFilter from "./filters/engine_filter";
import ConstructFilter from "./filters/construct_filter";
import FeatureFilter from "./filters/feature_filter";
import PortabilityFilter from "./filters/portability_status";
import {PORTABILITY_STATUS} from "./filters/portability_status";
/* import { prepareHtmlData } from './prepareOutputData'
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
            data = createDataModel(res);
            console.log(data);
            process(page);
        }).catch(function (err) {
        console.error(err);
    });


    //console.log(data);
}


function loadData(page) {
    if (page === 'conformance' || page === 'expressiveness' || page === 'engines-overview' || page === 'engines-compare') {
        return fetchBetsyData();
    } else if (page === 'performance') {
        return fetchBenFlowData();
    } else {
        throw Error("Unsupported page");
    }
}

function createDataModel(results) {
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


function process(page) {
    if (!(data instanceof DataModel)) {
        console.log('Failed to initialize JSON data');
        return;
    }
    if (page === 'conformance' || page === 'expressiveness' || page === 'performance') {
        let capability = page;
        let normalizedCapability = normalizeCapability(data, capability);

        console.log("Normalized data");
        console.log(normalizedCapability.getAll());


        let defaultLang = 'BPMN';
        if(!normalizedCapability.hasLanguage(defaultLang)){
            console.warn(defaultLang + " does not exist")
        }

        let filterManager = new FilterManager();
        filterManager.addFilter(new LanguageFilter(), defaultLang);
        filterManager.addFilter(new GroupFilter());
        filterManager.addFilter(new EngineFilter(), normalizedCapability.getLatestEngineVersions(defaultLang));
        filterManager.addFilter(new ConstructFilter());
        filterManager.addFilter(new FeatureFilter());
        filterManager.addFilter(new PortabilityFilter(), PORTABILITY_STATUS.ALL);

        filteredData = {groups: [], engines: [], constructs: [], features: []};
        filteredData['independentTests'] = _.where(data.independentTests, {language: dataFilters.language});

        filterManager.applyAllFilters(filteredData);

        /*initFilter();
         prepareHtmlData();
         buildFilterItems();
         renderCapabilityTable();*/
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

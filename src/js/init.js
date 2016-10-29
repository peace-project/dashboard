
import { fetchBetsyData } from './fetch'
import { fetchBenflowData } from './fetch'
/*import { initFilter } from './filters'
import { prepareHtmlData } from './prepareOutputData'
import { buildFilterItems } from './html'
import { renderCapabilityTable } from './render'*/

 var page, data, capability, filteredData, htmlData, dataFilters, numberOfreceivedData,  normalizedData;

   export function init(benchmarkType) {
       if (benchmarkType === undefined) {
           console.error('page is undefined');
           return false;
       }

       let peace = this;
       initData(peace);

   }


 function initData(peace){
     peace.data = { tests: [], testsIndependent: [], featureTree: [], engines: [], metrics: []};
     peace.filteredData = {groups: [], engines: [], constructs: [], features: []};
     peace.normalizedData = [];
     peace.htmlData = {constructs:[], summaryRow: {'totalConstructs' : 0} };
     peace.dataFilters = { language:   'BPMN', groups: undefined, constructs: undefined, features: undefined, portability_status: 0}
     loadData();
 }

 function loadData() {
     if(page === 'conformance' || page === 'expressiveness' || page === 'engines-overview'
         || page === 'engines-compare'){
         fetchBetsyData().then(setData);
     } else if(page === 'performance'){
        fetchBenflowData()
     }
 }

 function setData(results){
    console.log(results);
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

    function process(){
        if(page === 'conformance' || page === 'expressiveness' || page === 'performance'){
            initFilter();
            prepareHtmlData();
            buildFilterItems();
            renderCapabilityTable();
        } else if(page === 'engines-overview'){
            engineOverview();
        }  else if(page === 'engines-compare'){
            engineCompare();
        }

    }

    function udpateFeatureTreeByCapability(cap){
        if(cap !== undefined) { capability = cap }

        data.featureTree = _.find(data.featureTree, function(feature){
            return feature.id.toLowerCase() == capability.toLowerCase();
        });
    } */

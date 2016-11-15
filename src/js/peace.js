'use strict';

import {fetchBetsyData} from './fetch'
import {fetchBenFlowData} from './fetch'
import DataModel from './model/data_model'
import {normalizeByCapability} from "./normalizer";
import FilterManager from "./filters/filter_manager";
import GroupFilter from "./filters/group_filter";
import LanguageFilter from "./filters/language_filter";
import EngineFilter from "./filters/engine_filter";
import ConstructFilter from "./filters/construct_filter";
import FeatureFilter from "./filters/feature_filter";
import PortabilityFilter from "./filters/portability_status";
import ViewModelConverter from "./filters/view_model_converter";
import TestsFilter from "./filters/tests_filter";
import {CapabilityTableComponent} from "./components/capability_table";
import {EnginesFilterComponent} from "./components/engines_filters";
import {FCGFiltersComponent} from "./components/fcg_filters";
import PortabilityFilterComponent from "./components/portability_filter";
import {PortabilityStatus} from "./filters/portability_status";
import LanguageFilterComponent from "./components/language_filter";
import DefaultTestData from "./model/test_data";
import PerformanceTestData from "./model/performance_test_data";


var page, capability, filteredData, htmlData, dataFilters, numberOfreceivedData, normalizedData;
var rawData;


export const CapabilityTypes = {
    CONFORMANCE: 'conformance',
    EXPRESSIVENESS: 'expressiveness',
    PERFORMANCE: 'performance',
};

export function Peace(page) {
    if (page === undefined || page == null) {
        console.error('page is undefined');
        return false;
    }

    loadData(page)
        .then(res => {
            rawData = createDataModel(res);
            process(page);
        }).catch(function (err) {
        console.error(err);
    });


    //console.log(rawData);
}

//TODO should be called via Peace.checkCapabilityType
export function checkCapabilityType(capability, type){
    return (capability.toLowerCase() === type);
}

export function isConformanceCapability(capability){
    return checkCapabilityType(capability, CapabilityTypes.CONFORMANCE);
}

export function isExpressivenessCapability(capability){
    return checkCapabilityType(capability, CapabilityTypes.EXPRESSIVENESS);
}

export function isPerformanceCapability(capability){
    return checkCapabilityType(capability, CapabilityTypes.PERFORMANCE);
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

    /*rawData = {tests: [], testsIndependent: [], featureTree: [], engines: [], metrics: []};
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

}


function process(page) {
    if (!(rawData instanceof DataModel)) {
        console.log('Failed to initialize JSON rawData');
        return;
    }
    if (page === 'conformance' || page === 'expressiveness' || page === 'performance') {
        let capability = page;

        let testData;
        if(isPerformanceCapability(capability)){
            testData = new PerformanceTestData(rawData.getTestsByCapability(capability));
        } else if(isConformanceCapability(capability) || isExpressivenessCapability(capability)){
            testData = new DefaultTestData(rawData.getTestsByCapability(capability));
        } else {
            throw new Error('Failed to create test data model for capability: ' +capability);
        }

        let normalizedCapabilityData = normalizeByCapability(rawData, capability, testData.tests);

        var capabilityData = normalizedCapabilityData.getAll();

        let defaultLang = 'BPMN';
        if (!capabilityData.hasLanguage(defaultLang)) {
            console.warn(defaultLang + " does not exist")
        }

        let filteredData = {
            capability: capability,
            groups: {},
            engines: {},
            constructs: {},
            features: {},
            tests: {},
            independentTests: {}
        };

        if(isPerformanceCapability(capability)){
            filteredData['metrics'] = rawData.getMetrics();
        }

        //TODO Rename to ProcessPipeline
        let filterManager = new FilterManager(capabilityData, testData, filteredData);
        // Adding order represents the calling order. It must be adhered to

        let engineFilter = new EngineFilter();
        let groupFilter = new GroupFilter();
        let constructFilter = new ConstructFilter();
        let featureFilter = new FeatureFilter();
        let testsFilter = new TestsFilter();

        filterManager.addFilter(new LanguageFilter(), defaultLang);
        filterManager.addFilter(engineFilter, engineFilter.getDefaultFilterValues(defaultLang, capabilityData));
        filterManager.addFilter(groupFilter, groupFilter.getDefaultFilterValues(defaultLang, capabilityData));
        filterManager.addFilter(constructFilter, constructFilter.getDefaultFilterValues(defaultLang, capabilityData));
        filterManager.addFilter(featureFilter, featureFilter.getDefaultFilterValues(defaultLang, capabilityData));
        filterManager.addFilter(testsFilter, testData.getAll());
        let portabilityFilter = new PortabilityFilter();
        filterManager.addViewModelFilter(portabilityFilter, portabilityFilter.getDefaultFilterValues());


        // Apply all filters
        filterManager.applyAllFilters();

        let viewConverter = new ViewModelConverter();
        var viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);

        if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
            filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel);
        }

        let capabilityTableComponent = new CapabilityTableComponent(viewModel);


        //TODO check if allEngines is undefined
        let allEngines = capabilityData.getEnginesByLanguage(filterManager.getFilterValues().language);
        let latestVersionValues = EngineFilter.createFilterValues(capabilityData.getLatestEngineVersions(filterManager.getFilterValues().language));


        new LanguageFilterComponent({
            filterValues: filterManager.getFilterValues(),
            onFilter: function (newFilterValues) {

                if(capabilityData.hasLanguage(newFilterValues)){
                    console.error('No benchmark results for ' + newFilterValues + ' found.');
                    return;
                }

                //Update filter values
                latestVersionValues = EngineFilter.createFilterValues(capabilityData.getLatestEngineVersions(newFilterValues));
                filterManager.getFilterValues().engines = latestVersionValues;
                filterManager.getFilterValues().groups = groupFilter.getDefaultFilterValues(newFilterValues, capabilityData);
                filterManager.getFilterValues().constructs = constructFilter.getDefaultFilterValues(newFilterValues, capabilityData);
                filterManager.getFilterValues().features = featureFilter.getDefaultFilterValues(newFilterValues, capabilityData);

                filterManager.applyFilter(LanguageFilter.Name(), newFilterValues);
                filterManager.applyFilter(EngineFilter.Name());
                filterManager.applyFilter(GroupFilter.Name());
                filterManager.applyFilter(ConstructFilter.Name());
                filterManager.applyFilter(FeatureFilter.Name());
                filterManager.applyFilter(TestsFilter.Name());

                // Update filter components
                engineFilterComponent.updateModel({
                    engines: capabilityData.getEnginesByLanguage(newFilterValues).data,
                    latestVersionValues: latestVersionValues,
                    filterValues: filterManager.getFilterValues()
                });

                // By passing groupsFilters.dimensionData we clear all current checkboxes first
                groupsFilters.updateDimensionData(filterManager.getFilteredData().groups.data);
                constructFilters.updateDimensionData(filterManager.getFilteredData().constructs.data);
                featuresFilters.updateDimensionData(filterManager.getFilteredData().features.data);

                viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, newFilterValues);

                if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel);
                }
                capabilityTableComponent = new CapabilityTableComponent(viewModel);
            }
        });


        var engineFilterComponent = new EnginesFilterComponent({
            viewModel: {
                engines: allEngines.data,
                latestVersionValues: latestVersionValues,
                filterValues: filterManager.getFilterValues()
            },
            onFilter: function (newFilterValues) {
                // Filters
                filterManager.applyFilter(EngineFilter.Name(), newFilterValues);
                filterManager.applyFilter(TestsFilter.Name());

                // DefaultViewModel
                viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
                if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel);
                }
                capabilityTableComponent.updateModel(viewModel);
            }
        });

        if (isPerformanceCapability(capability)) {
            //TODO create experiment Filter


        } else {
            var groupsFilters = new FCGFiltersComponent({
                dimension: 'groups',
                dimensionData: filterManager.getFilteredData().groups.data,
                filterValues: filterManager.getFilterValues(),
                onFilter: function (newFilterValues) {

                    filterManager.applyFilter(GroupFilter.Name(), newFilterValues);
                    filterManager.applyFilter(ConstructFilter.Name());
                    filterManager.applyFilter(FeatureFilter.Name());
                    filterManager.applyFilter(TestsFilter.Name());

                    let langFilterValue = filterManager.getFilterValues().language;

                    let filteredConstructs = viewConverter.convertFilteredData('constructs', filterManager.getFilteredData().constructs.data,
                        capabilityData, langFilterValue);
                    let filteredFeatures = viewConverter.convertFilteredData('features', filterManager.getFilteredData().features.data,
                        capabilityData, langFilterValue);


                    constructFilters.updateDimensionData(filteredConstructs.dimensionData, filteredConstructs.toRemove);
                    featuresFilters.updateDimensionData(filteredFeatures.dimensionData, filteredFeatures.toRemove);

                    // ViewModels
                    viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel);
                    capabilityTableComponent.updateModel(viewModel);

                }
            });


            var constructFilters = new FCGFiltersComponent({
                dimension: 'constructs',
                dimensionData: filterManager.getFilteredData().constructs.data,
                filterValues: filterManager.getFilterValues(),
                onFilter: function (newFilterValues) {
                    filterManager.applyFilter(ConstructFilter.Name(), newFilterValues);
                    filterManager.applyFilter(FeatureFilter.Name());
                    filterManager.applyFilter(TestsFilter.Name());

                    let filteredFeatures = viewConverter.convertFilteredData('features', filterManager.getFilteredData().features.data,
                        capabilityData, filterManager.getFilterValues().language);

                    console.log('__________filteredConstructs');
                    console.log(filteredFeatures.toRemove);

                    featuresFilters.updateDimensionData(filteredFeatures.dimensionData, filteredFeatures.toRemove);

                    // ViewModels
                    viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel)
                    capabilityTableComponent.updateModel(viewModel);
                }
            });


            var featuresFilters = new FCGFiltersComponent({
                dimension: 'features',
                dimensionData: filterManager.getFilteredData().features.data,
                filterValues: filterManager.getFilterValues(),
                onFilter: function (newFilterValues) {
                    filterManager.applyFilter(FeatureFilter.Name(), newFilterValues);
                    filterManager.applyFilter(TestsFilter.Name());

                    // DefaultViewModel
                    viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel);
                    capabilityTableComponent.updateModel(viewModel);
                }
            });


            let reBuildViewModel = false;
            var portabilityFilterComp = new PortabilityFilterComponent({
                filterValues: filterManager.getFilterValues(),
                onFilter: function (newFilterValues) {

                    if (reBuildViewModel) {
                        // We have applied a different PortabilityStatus than ALL which has reduced the items of the viewModel
                        // Hence, build a complete viewModel again
                        viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
                    }

                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel, newFilterValues);
                    capabilityTableComponent.updateModel(viewModel);

                    reBuildViewModel = newFilterValues !== PortabilityStatus.ALL;
                }

            });
        }


        //filteredData['independentTests'] = _.where(rawData.independentTests, {language: langFilterValue});


        // let htmlData = prepareHtmlData(capability, filteredData, filterManager.getFilterValues(), testData);
        // buildFilterItems(capability);
        //renderCapabilityTable(capability, htmlData, filterManager.getFilterValues());
        /*
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

 rawData = {tests: [], testsIndependent: [], featureTree: [], engines: [], metrics: []};
 filteredData = {groups: [], engines: [], constructs: [], features: []};
 normalizedData = [];
 htmlData = {constructs:[], summaryRow: {'totalConstructs' : 0} };
 dataFilters = { language:   'BPMN', groups: undefined, constructs: undefined, features: undefined, portability_status: 0}


 numberOfreceivedData = 0;
 var totalJSONFiles = (page === 'performance') ? 5 : 4;

 if(page === 'conformance' || page === 'expressiveness' || page === 'engines-overview'
 || page === 'engines-compare'){
 getJSON("../rawData/tests-engine-dependent.json", setDataCallback('tests', totalJSONFiles));
 getJSON("../rawData/feature-tree.json", setDataCallback('featureTree', totalJSONFiles));
 getJSON("../rawData/engines.json", setDataCallback('engines', totalJSONFiles));
 getJSON("../rawData/tests-engine-independent.json", setDataCallback('independentTests', totalJSONFiles));
 } else if(page === 'performance'){
 getJSON("../rawData/benchflow-tests-engine-dependent.json", setDataCallback('tests', totalJSONFiles));
 getJSON("../rawData/benchflow-feature-tree.json", setDataCallback('featureTree', totalJSONFiles));
 getJSON("../rawData/benchflow-tests-engine-independent.json", setDataCallback('independentTests', totalJSONFiles));
 getJSON("../rawData/benchflow-engines.json", setDataCallback('engines', totalJSONFiles));
 getJSON("../rawData/metrics.json", setDataCallback('metrics', totalJSONFiles));
 }


 return peace;
 }

 function setDataCallback(dataType, totalJSONFiles){
 return function(jsonData, textStatus, jqXHR) {
 if(dataType === 'tests'){
 rawData.tests = jsonData;
 } else if(dataType === 'featureTree'){
 rawData.featureTree = jsonData;
 if(page !== 'engines-overview' && page !== 'engines-compare'){
 udpateFeatureTreeByCapability();
 }
 } else if(dataType === 'engines'){
 rawData.engines = jsonData;
 } else if(dataType === 'independentTests'){
 rawData.independentTests = jsonData;
 } else if(dataType === 'metrics'){
 rawData.metrics = jsonData[0];
 }

 numberOfreceivedData++;
 if(numberOfreceivedData === totalJSONFiles){
 if(rawData.featureTree === undefined) {
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

 rawData.featureTree = _.find(rawData.featureTree, function(feature){
 return feature.id.toLowerCase() == capability.toLowerCase();
 });
 } */

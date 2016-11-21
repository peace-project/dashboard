'use strict';

import {fetchPbelData} from "./fetch";
import FilterManager from "./filters/filter_manager";
import GroupFilter from "./filters/group_filter";
import LanguageFilter from "./filters/language_filter";
import EngineFilter from "./filters/engine_filter";
import ConstructFilter from "./filters/construct_filter";
import FeatureFilter from "./filters/feature_filter";
import PortabilityFilter, {PortabilityStatus} from "./filters/portability_status";
import ViewModelConverter from "./viewmodels/view_model_converter";
import TestsFilter from "./filters/tests_filter";
import {CapabilityTableComponent} from "./components/capability_table";
import {EnginesFilterComponent} from "./components/filters/engines_filters";
import {FCGFiltersComponent} from "./components/filters/fcg_filters";
import PortabilityFilterComponent from "./components/filters/portability_filter";
import LanguageFilterComponent from "./components/filters/language_filter";
import {normalizeCapability} from "./model/pbel/normalizer";
import RawDataModel from "./model/pbel/raw_data";


var page, capability;
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
    return fetchPbelData();
    /*
    if (page === 'conformance' || page === 'expressiveness' || page === 'engines-overview' || page === 'engines-compare') {
        return fetchBetsyData();
    } else if (page === 'performance') {
        return fetchBenFlowData();
    } else {
        throw Error("Unsupported page");
    }*/
}

function createDataModel(results) {
   /* var objResults = {};
    results.forEach(function (row) {
        objResults[row.name] = row.result;
    });*/

   //    return new RawDataModel(objResults);


    return new RawDataModel(results);
}


function process(page) {
    if (!(rawData instanceof RawDataModel)) {
        console.log('Failed to initialize JSON rawData');
        return;
    }
    if (page === 'conformance' || page === 'expressiveness' || page === 'performance') {
        let capability = page;

        let normalizedData = normalizeCapability(rawData, capability);
        //TODO getAll should be called transparently, since most of the time we will use CapabilityDataContainer anyway
        var capabilityData = normalizedData.getAll();


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
            //TODO misleading? independentTests will not be filtered
           // independentTests: capabilityData.getAllTestIndependentByLanguage()
        };

        if(isPerformanceCapability(capability)){
            filteredData['metrics'] = rawData.getMetrics();
        }

        //TODO Rename to ProcessPipeline
        let filterManager = new FilterManager(capabilityData, filteredData);
        // Adding order represents the calling order. It must be adhered to

        let engineFilter = new EngineFilter();
        let groupFilter = new GroupFilter();
        let constructFilter = new ConstructFilter();
        let featureFilter = new FeatureFilter();
        let testsFilter = new TestsFilter();


        let testData = capabilityData.getFeatureResultsByLanguage(defaultLang);
        testData = (testData) ? testData.clone() : [];

        filterManager.addFilter(new LanguageFilter(), defaultLang);
        filterManager.addFilter(engineFilter, engineFilter.getDefaultFilterValues(defaultLang, capabilityData));
        filterManager.addFilter(groupFilter, groupFilter.getDefaultFilterValues(defaultLang, capabilityData));
        filterManager.addFilter(constructFilter, constructFilter.getDefaultFilterValues(defaultLang, capabilityData));
        filterManager.addFilter(featureFilter, featureFilter.getDefaultFilterValues(defaultLang, capabilityData));
        filterManager.addFilter(testsFilter, testData);
        let portabilityFilter = new PortabilityFilter();
        filterManager.addViewModelFilter(portabilityFilter, portabilityFilter.getDefaultFilterValues());


        // Apply all filters
        filterManager.applyAllFilters();

        let testIndependentData = capabilityData.getAllTestIndependentByLanguage(filterManager.getFilterValues().language);

        let viewConverter = new ViewModelConverter();
        var viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language, testIndependentData);

        if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
            filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel);
        }

        let capabilityTableComponent = new CapabilityTableComponent(viewModel);

        //TODO check if allEngines is undefined
        let allEngines = capabilityData.getEnginesByLanguage(filterManager.getFilterValues().language);
        let latestVersionValues = EngineFilter.createFilterValues(capabilityData.getLatestEngineVersions(filterManager.getFilterValues().language));

        new LanguageFilterComponent({
            dimension: 'language',
            dimensionData: capabilityData.getAllLanguage().reverse(),
            filterValues: filterManager.getFilterValues(),
            onFilter: function (newFilterValues) {

                if(!capabilityData.hasLanguage(newFilterValues)){
                    console.error('No benchmark results for ' + newFilterValues + ' found.');
                    return;
                }

                testIndependentData = capabilityData.getAllTestIndependentByLanguage(newFilterValues);

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

                if(constructFilters.searchable){
                    constructFilters.searchFullData = capabilityData.getAllConstructsByLanguage(filterManager.getFilterValues().language).clone().data
                }

                featuresFilters.updateDimensionData(filterManager.getFilteredData().features.data);
                if(featuresFilters.searchable){
                    featuresFilters.searchFullData = capabilityData.getAllFeaturesByLanguage(filterManager.getFilterValues().language).clone().data
                }

                if (isPerformanceCapability(capability)) {
                    experimentFilter.updateDimensionData(filterManager.getFilteredData().groups.data);
                    if(featuresFilters.searchable){
                        featuresFilters.searchFullData = capabilityData.getAllConstructsByLanguage(filterManager.getFilterValues().language).clone().data
                    }
                }

                viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, newFilterValues, testIndependentData);

                if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel);
                }
                capabilityTableComponent = new CapabilityTableComponent(viewModel, testIndependentData);
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
                viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language, testIndependentData);
                if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel);
                }
                capabilityTableComponent.updateModel(viewModel);
            }
        });

        if (isPerformanceCapability(capability)) {
            //TODO create experiment Filter

            var experimentFilter = new FCGFiltersComponent({
                dimension: 'constructs',
                dimensionData: filterManager.getFilteredData().constructs.data,
                filterValues: filterManager.getFilterValues(),
                searchable: true,
                searchFullData: capabilityData.getAllConstructsByLanguage(filterManager.getFilterValues().language).clone().data,
                onFilter: function (newFilterValues) {
                    filterManager.applyFilter(ConstructFilter.Name(), newFilterValues);
                    filterManager.applyFilter(FeatureFilter.Name());
                    filterManager.applyFilter(TestsFilter.Name());

                    // ViewModels
                    viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language, testIndependentData);
                    capabilityTableComponent.updateModel(viewModel);
                }
            });


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
                    viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language, testIndependentData);
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel);
                    capabilityTableComponent.updateModel(viewModel);

                }
            });


            var constructFilters = new FCGFiltersComponent({
                dimension: 'constructs',
                dimensionData: filterManager.getFilteredData().constructs.data,
                searchable: true,
                searchFullData: capabilityData.getAllConstructsByLanguage(filterManager.getFilterValues().language).clone().data,
                filterValues: filterManager.getFilterValues(),
                onFilter: function (newFilterValues) {
                    filterManager.applyFilter(ConstructFilter.Name(), newFilterValues);
                    filterManager.applyFilter(FeatureFilter.Name());
                    filterManager.applyFilter(TestsFilter.Name());

                    let filteredFeatures = viewConverter.convertFilteredData('features', filterManager.getFilteredData().features.data,
                        capabilityData, filterManager.getFilterValues().language);

                    featuresFilters.updateDimensionData(filteredFeatures.dimensionData, filteredFeatures.toRemove);

                    // ViewModels
                    viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language, testIndependentData);
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel)
                    capabilityTableComponent.updateModel(viewModel);
                }
            });


            var featuresFilters = new FCGFiltersComponent({
                dimension: 'features',
                dimensionData: filterManager.getFilteredData().features.data,
                searchable: true,
                searchFullData: capabilityData.getAllFeaturesByLanguage(filterManager.getFilterValues().language).clone().data,
                filterValues: filterManager.getFilterValues(),
                onFilter: function (newFilterValues) {
                    filterManager.applyFilter(FeatureFilter.Name(), newFilterValues);
                    filterManager.applyFilter(TestsFilter.Name());

                    // DefaultViewModel
                    viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language, testIndependentData);
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
                        viewModel = viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language, testIndependentData);
                    }

                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), viewModel, newFilterValues);
                    capabilityTableComponent.updateModel(viewModel);

                    reBuildViewModel = newFilterValues !== PortabilityStatus.ALL;
                }

            });

        }

    } else if (page === 'engines-overview') {
        engineOverview();
    } else if (page === 'engines-compare') {
        engineCompare();
    }
}
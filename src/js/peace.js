'use strict';

import {fetchPbelData} from "./fetch";
import FilterManager from "./filters/filter_manager";
import GroupFilter from "./filters/group_filter";
import LanguageFilter from "./filters/language_filter";
import EngineFilter from "./filters/engine_filter";
import ConstructFilter from "./filters/construct_filter";
import FeatureFilter from "./filters/feature_filter";
import PortabilityFilter from "./filters/portability_status";
import TestsFilter from "./filters/tests_filter";
import {normalizeCapability} from "./model/pbel/normalizer";
import RawDataModel from "./model/pbel/raw_data";
import {createViewModel} from "./viewmodels/table_view_model_view";
import {convertFilteredData} from "./viewmodels/view_model_converter";
import TableViewModelView from "./viewmodels/table_view_model_view";
import FiltersViewModelView from "./viewmodels/filters_view_model_view";


var page, rawData;


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

    loadData()
        .then(res => {
            rawData = createDataModel(res);
            process(page);
        }).catch(function (err) {
        console.error(err);
    });
    //console.log(rawData);
}

//TODO should be called via Peace.checkCapabilityType
export function checkCapabilityType(capability, type) {
    return (capability.toLowerCase() === type);
}

export function isConformanceCapability(capability) {
    return checkCapabilityType(capability, CapabilityTypes.CONFORMANCE);
}

export function isExpressivenessCapability(capability) {
    return checkCapabilityType(capability, CapabilityTypes.EXPRESSIVENESS);
}

export function isPerformanceCapability(capability) {
    return checkCapabilityType(capability, CapabilityTypes.PERFORMANCE);
}


function loadData() {
    return fetchPbelData();
}

function createDataModel(results) {
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

        //TODO Rename to ProcessPipeline
        let filterManager = setUpFilterManager(capabilityData, capability);

        let tableViewModelView = new TableViewModelView(filterManager, capabilityData);
        tableViewModelView.initialize();

        let filtersViewModelView = new FiltersViewModelView(filterManager, {
            onFilterLanguage: function (capability) {
                tableViewModelView.updateViewModelView(capability, true)
            },
            onFilterEngines: function (capability) {
                tableViewModelView.updateViewModelView(capability)
            },
            onFilterFCG: function (capability) {
                tableViewModelView.updateViewModelView(capability)
            },
            onFilterPortability: function (capability, newFilterValues, reBuildViewModel) {
                tableViewModelView.updateTableResultPortability(capability, newFilterValues, reBuildViewModel);
            }
        });

        filtersViewModelView.initialize(capabilityData);


    } else if (page === 'engines-overview') {
        engineOverview();
    } else if (page === 'engines-compare') {
        engineCompare();
    }


    function setUpFilterManager(capabilityData, capability) {

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

        if (isPerformanceCapability(capability)) {
            console.log(rawData);
            filteredData['metrics'] = rawData.getMetrics();
        }

        let filterManager = new FilterManager(capabilityData, filteredData);
        // Adding order represents the calling order. It must be adhered to

        let defaultLang = 'BPMN';
        if (!capabilityData.hasLanguage(defaultLang)) {
            console.warn(defaultLang + " does not exist")
        }

        let languageFilter = new LanguageFilter();
        let engineFilter = new EngineFilter();
        let groupFilter = new GroupFilter();
        let constructFilter = new ConstructFilter();
        let featureFilter = new FeatureFilter();
        let testsFilter = new TestsFilter();

        // Specify hierarchy
        languageFilter.setDependentFilters([EngineFilter.Name(), GroupFilter.Name(), ConstructFilter.Name(), FeatureFilter.Name(), TestsFilter.Name()]);
        engineFilter.setDependentFilters([TestsFilter.Name()]);
        groupFilter.setDependentFilters([ConstructFilter.Name(), FeatureFilter.Name(), TestsFilter.Name()]);
        constructFilter.setDependentFilters([FeatureFilter.Name(), TestsFilter.Name()]);
        featureFilter.setDependentFilters([TestsFilter.Name()]);

        filterManager.addFilter(languageFilter, defaultLang);
        filterManager.addFilter(engineFilter, engineFilter.getDefaultFilterValues(defaultLang, capabilityData));
        filterManager.addFilter(groupFilter, groupFilter.getDefaultFilterValues(defaultLang, capabilityData));
        filterManager.addFilter(constructFilter, constructFilter.getDefaultFilterValues(defaultLang, capabilityData));
        filterManager.addFilter(featureFilter, featureFilter.getDefaultFilterValues(defaultLang, capabilityData));

        let testData = capabilityData.getFeatureResultsByLanguage(defaultLang);
        testData = (testData) ? testData.clone() : [];
        filterManager.addFilter(testsFilter, testData);

        let portabilityFilter = new PortabilityFilter();
        filterManager.addViewModelFilter(portabilityFilter, portabilityFilter.getDefaultFilterValues());

        // Apply all filters
        filterManager.applyAllFilters();

        return filterManager;
    }


    function updateFilterDimensionData(dimensionName, filterComp, filterManager, langFilterValue) {
        let filteredConstructs = convertFilteredData(dimensionName, filterManager.getFilteredData().constructs.data, capabilityData, langFilterValue);
        filterComp.updateDimensionData(filteredConstructs.dimensionData, filteredConstructs.toRemove);
    }





}
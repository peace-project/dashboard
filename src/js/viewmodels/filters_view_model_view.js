import LanguageFilterComponent from "../components/filters/language_filter";
import EngineFilter from "../filters/engine_filter";
import GroupFilter from "../filters/group_filter";
import ConstructFilter from "../filters/construct_filter";
import FeatureFilter from "../filters/feature_filter";
import LanguageFilter from "../filters/language_filter";
import {isPerformanceCapability} from "../peace";
import {PortabilityStatus} from "../filters/portability_status";
import PortabilityFilterComponent from "../components/filters/portability_filter";
import {FCGFiltersComponent} from "../components/filters/fcg_filters";
import {EnginesFilterComponent} from "../components/filters/engines_filters";
import {convertFilteredData} from "./view_model_converter";
export default class FiltersViewModelView {

    constructor(filterManager, filtersCallback) {
        this.viewModel;
        this.filterManager = filterManager;
        this.filtersCallback = filtersCallback;
    }


    initialize(capabilityData){
        let filterManager = this.filterManager;

        //TODO check if allEngines is undefined
        let latestVersionValues = EngineFilter.createFilterValues(capabilityData.getLatestEngineVersions(filterManager.getFilterValues().language));

        let capability = filterManager.getFilteredData().capability;

        let that = this;


        new LanguageFilterComponent({
            dimension: 'language',
            dimensionData: capabilityData.getAllLanguage().reverse(),
            filterValues: filterManager.getFilterValues(),
            onFilter: function (newFilterValues) {

                if (!capabilityData.hasLanguage(newFilterValues)) {
                    console.error('No benchmark results for ' + newFilterValues + ' found.');
                    return;
                }

                //Update filter values
                latestVersionValues = EngineFilter.createFilterValues(capabilityData.getLatestEngineVersions(newFilterValues));
                filterManager.getFilterValues().engines = latestVersionValues;
                filterManager.getFilterValues().groups = filterManager.getFilterDefaultValues(GroupFilter.Name(), newFilterValues, capabilityData);
                filterManager.getFilterValues().constructs = filterManager.getFilterDefaultValues(ConstructFilter.Name(), newFilterValues, capabilityData);
                filterManager.getFilterValues().features = filterManager.getFilterDefaultValues(FeatureFilter.Name(), newFilterValues, capabilityData);



                filterManager.applyFilter(LanguageFilter.Name(), newFilterValues, true);

                // Update filter components
                engineFilterComponent.updateModel({
                    engines: capabilityData.getEnginesByLanguage(newFilterValues).data,
                    latestVersionValues: latestVersionValues,
                    filterValues: filterManager.getFilterValues()
                });

                // By passing groupsFilters.dimensionData we clear all current checkboxes first
                groupsFilters.updateDimensionData(filterManager.getFilteredData().groups.data);
                constructFilters.updateDimensionData(filterManager.getFilteredData().constructs.data);

                if (constructFilters.searchable) {
                    constructFilters.searchFullData = capabilityData.getAllConstructsByLanguage(filterManager.getFilterValues().language).clone().data
                }

                featuresFilters.updateDimensionData(filterManager.getFilteredData().features.data);
                if (featuresFilters.searchable) {
                    featuresFilters.searchFullData = capabilityData.getAllFeaturesByLanguage(filterManager.getFilterValues().language).clone().data
                }

                if (isPerformanceCapability(capability)) {
                    experimentFilter.updateDimensionData(filterManager.getFilteredData().groups.data);
                    if (featuresFilters.searchable) {
                        featuresFilters.searchFullData = capabilityData.getAllConstructsByLanguage(filterManager.getFilterValues().language).clone().data
                    }
                }

                that.filtersCallback['onFilterLanguage'](capability);
               // updateTableResultLanguage(filterManager, capability, capabilityTableComponent, newFilterValues);


            }
        });

        let allEngines = capabilityData.getEnginesByLanguage(filterManager.getFilterValues().language);
        var engineFilterComponent = new EnginesFilterComponent({
            viewModel: {
                engines: allEngines.data,
                latestVersionValues: latestVersionValues,
                filterValues: filterManager.getFilterValues()
            },
            onFilter: function (newFilterValues) {
                // Filters
                filterManager.applyFilter(EngineFilter.Name(), newFilterValues, true);
                //filterManager.applyFilter(TestsFilter.Name());

                // DefaultViewModel
                that.filtersCallback['onFilterEngines'](capability);

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
                    filterManager.applyFilter(ConstructFilter.Name(), newFilterValues, true);

                    // ViewModels
                    that.filtersCallback['onFilterFCG'](capability);
                }
            });


        } else {
            var groupsFilters = new FCGFiltersComponent({
                dimension: 'groups',
                dimensionData: filterManager.getFilteredData().groups.data,
                filterValues: filterManager.getFilterValues(),
                onFilter: function (newFilterValues) {

                    filterManager.applyFilter(GroupFilter.Name(), newFilterValues, true);

                    // Update other filters
                    let langFilterValue = filterManager.getFilterValues().language;

                    let filteredConstructs =  convertFilteredData('constructs', filterManager.getFilteredData().constructs.data, capabilityData, langFilterValue);
                    constructFilters.updateDimensionData(filteredConstructs.dimensionData, filteredConstructs.toRemove);

                    let filteredFeatures =  convertFilteredData('features', filterManager.getFilteredData().features.data,
                        capabilityData, langFilterValue);
                    featuresFilters.updateDimensionData(filteredFeatures.dimensionData, filteredFeatures.toRemove);


                    // ViewModels
                    that.filtersCallback['onFilterFCG'](capability);
                }
            });


            var constructFilters = new FCGFiltersComponent({
                dimension: 'constructs',
                dimensionData: filterManager.getFilteredData().constructs.data,
                searchable: true,
                searchFullData: capabilityData.getAllConstructsByLanguage(filterManager.getFilterValues().language).clone().data,
                filterValues: filterManager.getFilterValues(),
                onFilter: function (newFilterValues) {
                    filterManager.applyFilter(ConstructFilter.Name(), newFilterValues, true);

                    let filteredFeatures = convertFilteredData('features', filterManager.getFilteredData().features.data,
                        capabilityData, filterManager.getFilterValues().language);

                    featuresFilters.updateDimensionData(filteredFeatures.dimensionData, filteredFeatures.toRemove);

                    // ViewModels
                    that.filtersCallback['onFilterFCG'](capability);
                }
            });


            var featuresFilters = new FCGFiltersComponent({
                dimension: 'features',
                dimensionData: filterManager.getFilteredData().features.data,
                searchable: true,
                searchFullData: capabilityData.getAllFeaturesByLanguage(filterManager.getFilterValues().language).clone().data,
                filterValues: filterManager.getFilterValues(),
                onFilter: function (newFilterValues) {
                    filterManager.applyFilter(FeatureFilter.Name(), newFilterValues, true);

                    // DefaultViewModel
                    that.filtersCallback['onFilterFCG'](capability);
                }
            });


            let reBuildViewModel = false;
            var portabilityFilterComp = new PortabilityFilterComponent({
                filterValues: filterManager.getFilterValues(),
                onFilter: function (newFilterValues) {
                    that.filtersCallback['onFilterPortability'](capability, newFilterValues, reBuildViewModel);
                    reBuildViewModel = newFilterValues !== PortabilityStatus.ALL;
                }

            });

        }
    }

}
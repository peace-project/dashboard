import ViewModelConverter from "./view_model_converter";
import {isConformanceCapability, isExpressivenessCapability, isPerformanceCapability} from "../peace";
import LanguageFilterComponent from "../components/filters/language_filter";
import EngineFilter from "../filters/engine_filter";
import LanguageFilter from "../filters/language_filter";
import GroupFilter from "../filters/group_filter";
import ConstructFilter from "../filters/construct_filter";
import FeatureFilter from "../filters/feature_filter";
import TestsFilter from "../filters/tests_filter";
import {EnginesFilterComponent} from "../components/filters/engines_filters";
import {FCGFiltersComponent} from "../components/filters/fcg_filters";
import PortabilityFilterComponent from "../components/filters/portability_filter";
import {CapabilityTableComponent} from "../components/capability_table";
import {PortabilityStatus} from "../filters/portability_status";
import PortabilityFilter from "../filters/portability_status";

export default class ViewModelCreator {
    constructor() {
        this.viewConverter = new ViewModelConverter();
        this.viewModel;
    }

    createViewModel(capabilityData, filterManager) {
        let testIndependentData = capabilityData.getAllTestIndependentByLanguage(filterManager.getFilterValues().language);
        let testResults = capabilityData.getTestResultsByLanguage(filterManager.getFilterValues().language);

        let capability = filterManager.getFilteredData().capability;

        this.viewModel = this.viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);

        if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
            filterManager.applyViewModelFilter(PortabilityFilter.Name(), this.viewModel);
        }

        this.viewModel['testResults'] = testResults.data;
        this.viewModel['testsIndependent'] = testIndependentData.data;

        this._createComponents(capabilityData, filterManager);
    }

    _createComponents(capabilityData, filterManager) {
        //TODO check if allEngines is undefined
        let allEngines = capabilityData.getEnginesByLanguage(filterManager.getFilterValues().language);
        let latestVersionValues = EngineFilter.createFilterValues(capabilityData.getLatestEngineVersions(filterManager.getFilterValues().language));

        let capability = filterManager.getFilteredData().capability;

        let capabilityTableComponent = new CapabilityTableComponent(this.viewModel);
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

                that .viewModel = that .viewConverter.convert(filterManager.getFilteredData(), capability, newFilterValues);

                if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), that .viewModel);
                }

                let testResults = capabilityData.getTestResultsByLanguage(newFilterValues);
                let testIndependentData = capabilityData.getAllTestIndependentByLanguage(newFilterValues);


                that.viewModel['testResults'] = (testResults) ? testResults.data : undefined;
                that.viewModel['testsIndependent'] = testIndependentData.data;

                capabilityTableComponent.updateModel(that.viewModel);
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
                that.viewModel = that.viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
                if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(),  that.viewModel);
                }
                capabilityTableComponent.updateModel( that.viewModel);
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
                    that.viewModel =  that.viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
                    capabilityTableComponent.updateModel( that.viewModel);
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

                    let filteredConstructs =  that.viewConverter.convertFilteredData('constructs', filterManager.getFilteredData().constructs.data,
                        capabilityData, langFilterValue);
                    let filteredFeatures =  that.viewConverter.convertFilteredData('features', filterManager.getFilteredData().features.data,
                        capabilityData, langFilterValue);


                    constructFilters.updateDimensionData(filteredConstructs.dimensionData, filteredConstructs.toRemove);
                    featuresFilters.updateDimensionData(filteredFeatures.dimensionData, filteredFeatures.toRemove);

                    // ViewModels
                    that.viewModel = that.viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), that.viewModel);
                    capabilityTableComponent.updateModel(that.viewModel);

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

                    let filteredFeatures = this.viewConverter.convertFilteredData('features', filterManager.getFilteredData().features.data,
                        capabilityData, filterManager.getFilterValues().language);

                    featuresFilters.updateDimensionData(filteredFeatures.dimensionData, filteredFeatures.toRemove);

                    // ViewModels
                    viewModel = this.viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
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
                    that.viewModel = that.viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
                    filterManager.applyViewModelFilter(PortabilityFilter.Name(), that.viewModel);
                    capabilityTableComponent.updateModel(that.viewModel);
                }
            });


            let reBuildViewModel = false;
            var portabilityFilterComp = new PortabilityFilterComponent({
                filterValues: filterManager.getFilterValues(),
                onFilter: function (newFilterValues) {

                    if (reBuildViewModel) {
                        // We have applied a different PortabilityStatus than ALL which has reduced the items of the viewModel
                        // Hence, build a complete viewModel again
                        that.viewModel =  that.viewConverter.convert(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
                    }

                    filterManager.applyViewModelFilter(PortabilityFilter.Name(),  that.viewModel, newFilterValues);
                    capabilityTableComponent.updateModel( that.viewModel);

                    reBuildViewModel = newFilterValues !== PortabilityStatus.ALL;
                }

            });

        }
    }

}

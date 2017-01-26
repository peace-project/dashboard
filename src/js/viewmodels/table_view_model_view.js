
import {isConformanceCapability, isExpressivenessCapability, isPerformanceCapability} from "../peace";

import PortabilityFilter from "../filters/portability_status";
import {createTableViewModel} from "./view_model_converter";
import {CapabilityTableComponent} from "../components/capability_table";

export default class TableViewModelView {
    constructor(filterManager, capabilityData) {
        this.filterManager = filterManager;
        this.capabilityData = capabilityData;
        this.viewModel;
        this.capabilityTableComponent; // the view
    }

    initialize() {
        let filterManager = this.filterManager;
        let capabilityData = this.capabilityData;

        let capability = filterManager.getFilteredData().capability;

        this.viewModel = createTableViewModel(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);

        if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
            filterManager.applyViewModelFilter(PortabilityFilter.Name(), this.viewModel);
        }

        let testIndependentData = capabilityData.getAllTestIndependentByLanguage(filterManager.getFilterValues().language);
        let testResults = capabilityData.getTestResultsByLanguage(filterManager.getFilterValues().language);
        this.viewModel['testResults'] = testResults.data;
        this.viewModel['testsIndependent'] = testIndependentData.data;

        this.capabilityTableComponent = new CapabilityTableComponent(this.viewModel);
        //this._createComponents(capabilityData, filterManager);
    }

    getViewModel(){
        return  this.viewModel;

    }

    getView(){
      return  this.capabilityTableComponent;
    }


    updateViewModelView(capability){
        this.viewModel = createTableViewModel(this.filterManager.getFilteredData(), capability, this.filterManager.getFilterValues().language);
        this.filterManager.applyViewModelFilter(PortabilityFilter.Name(), this.viewModel);
        this.capabilityTableComponent.updateModel(this.viewModel);
    }

    //TODO replace newFilterValues with filterManager.getFilterValues().language??
    //TODO replace capability with filterManager.getFilterValues().capability??
    updateTableResultLanguage(capability, newFilterValues) {
        this.viewModel = createTableViewModel(this.filterManager.getFilteredData(), capability, newFilterValues);

        if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
            this.filterManager.applyViewModelFilter(PortabilityFilter.Name(),this. viewModel);
        }

        let testResults = this.capabilityData.getTestResultsByLanguage(newFilterValues);
        let testIndependentData = this.capabilityData.getAllTestIndependentByLanguage(newFilterValues);
        this.viewModel['testResults'] = (testResults) ? testResults.data : undefined;
        this.viewModel['testsIndependent'] = testIndependentData.data;

        this.capabilityTableComponent.updateModel(this.viewModel);
    }

/*
    updateTableResultEngine(capability) {
        this.viewModel = createTableViewModel(this.filterManager.getFilteredData(), capability, this.filterManager.getFilterValues().language);
        if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
            this.filterManager.applyViewModelFilter(PortabilityFilter.Name(), this.viewModel);
        }
        this.capabilityTableComponent.updateModel(this.viewModel);
    } */

    updateTableResult(capability) {
        this.viewModel = createTableViewModel(this.filterManager.getFilteredData(), capability, this.filterManager.getFilterValues().language);

        // Filter view model according to the portability status
        if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
            this.filterManager.applyViewModelFilter(PortabilityFilter.Name(), this.viewModel);
        }
        this.capabilityTableComponent.updateModel(this.viewModel);
    }


    //TODO replace newFilterValues with filterManager.getFilterValues().language??
    updateTableResultPortability(capability, newFilterValues, reBuildViewModel){
        if (reBuildViewModel) {
            // We have applied a different PortabilityStatus than ALL which has reduced the items of the viewModel
            // Hence, build a complete viewModel again
            this.viewModel =  createTableViewModel(this.filterManager.getFilteredData(), capability, this.filterManager.getFilterValues().language);
        }

        this.filterManager.applyViewModelFilter(PortabilityFilter.Name(), this.viewModel, newFilterValues);
        this.capabilityTableComponent.updateModel(this.viewModel);

    }


}


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
        let capability = filterManager.getFilteredData().capability;

        this.viewModel = createTableViewModel(filterManager.getFilteredData(), capability, filterManager.getFilterValues().language);
        if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
            filterManager.applyViewModelFilter(PortabilityFilter.Name(), this.viewModel);
        }

        this._replaceTestResults(this.filterManager.getFilterValues().language);
        this.capabilityTableComponent = new CapabilityTableComponent(this.viewModel);
        //this._createComponents(capabilityData, filterManager);
    }

    /**
     * Replaces testResults and testsIndependent data with new ones of the given language
     *
     * @param language
     * @private
     */
    _replaceTestResults(language){
        let testResults = this.capabilityData.getTestResultsByLanguage(language);
        let testIndependentData = this.capabilityData.getAllTestIndependentByLanguage(language);
        this.viewModel['testResults'] = (testResults) ? testResults.data : undefined;
        this.viewModel['testsIndependent'] = testIndependentData.data;
    }

    getViewModel(){
        return  this.viewModel;

    }

    getView(){
      return  this.capabilityTableComponent;
    }


    _updateViewModel(capability, language){
        this.viewModel = createTableViewModel(this.filterManager.getFilteredData(), capability, language);
        if (isConformanceCapability(capability) || isExpressivenessCapability(capability)) {
            this.filterManager.applyViewModelFilter(PortabilityFilter.Name(),this. viewModel);
        }
    }


    updateViewModelView(capability, replace) {
        let language = this.filterManager.getFilterValues().language;
        this._updateViewModel(capability, language);

        // Replace all test results due to  the language change
        if(replace === true){
            this._replaceTestResults(this.filterManager.getFilterValues().language);
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

import PortabilityFilter from "../filters/portability_status";
import {createTableViewModel} from "./view_model_converter";
import {CapabilityTableComponent} from "../components/capability_table";
import {hasPortabilityFilter} from "../dashboard_info";
import {capitalizeAllFirstLetters} from "../utils";

export default class TableViewModelView {
    constructor(filterManager, capabilityData) {
        this.filterManager = filterManager;
        this.capabilityData = capabilityData;
        this.viewModel;
        this.capabilityExtensions = {};

        //Copy
        let extKey
        for(extKey in this.capabilityData['extensions']){
            this.capabilityExtensions[extKey] = capitalizeAllFirstLetters(this.capabilityData['extensions'][extKey]);
        }

        // serve as local copy
        this.testResults;
        this.testIndependentData;

        this.capabilityTableComponent; // the view
        this.oldLanguage;
    }

    initialize() {
        let filterManager = this.filterManager;
        let capability = filterManager.getFilteredData().capability;

        this.viewModel = createTableViewModel(filterManager.getFilteredData(), capability,
            filterManager.getFilterValues().language, this.capabilityExtensions);
        console.log(this.viewModel);

        if (hasPortabilityFilter(capability)) {
            filterManager.applyViewModelFilter(PortabilityFilter.Name(), this.viewModel);
        }

        this._replaceTestResults(this.filterManager.getFilterValues().language);
        this.capabilityTableComponent = new CapabilityTableComponent(this.viewModel);
        //this._createComponents(capabilityData, filterManager);

        this.oldLanguage = filterManager.getFilterValues().language;
    }

    /**
     * Replaces testResults and testsIndependent data with new ones of the given language
     *
     * @param language
     * @private
     */
    _replaceTestResults(language){
        this.testResults = this.capabilityData.getTestResultsByLanguage(language);
        this.testIndependentData = this.capabilityData.getAllTestIndependentByLanguage(language);
        this._addTestResults();
    }

    _addTestResults(){
        this.viewModel['testResults'] = (this.testResults) ? this.testResults.data : undefined;
        this.viewModel['testsIndependent'] = this.testIndependentData.data;
    }

    getViewModel(){
        return  this.viewModel;

    }

    getView(){
      return  this.capabilityTableComponent;
    }


    _updateViewModel(capability, language){
        this.viewModel = createTableViewModel(this.filterManager.getFilteredData(), capability, language, this.capabilityExtensions);
        this._addTestResults();
        if (hasPortabilityFilter(capability)) {
            this.filterManager.applyViewModelFilter(PortabilityFilter.Name(), this. viewModel);
        }
    }

    /**
     * Updates the view model of the result table according to the current filter values.
     *
     * @param capability
     */
    updateViewModelView(capability) {
        let language = this.filterManager.getFilterValues().language;
        this._updateViewModel(capability, language);

        // Replace all test results due to the language change
        let languageChanged = this.oldLanguage !== language;
        this.oldLanguage = language;
        if(languageChanged === true){
            this._replaceTestResults(this.filterManager.getFilterValues().language);
        }
        this.capabilityTableComponent.updateModel(this.viewModel);
    }


    //TODO replace newFilterValues with filterManager.getFilterValues().language??
    updateTableResultPortability(capability, newFilterValues, reBuildViewModel){
        if (reBuildViewModel) {
            // We have applied a different PortabilityStatus than ALL which has reduced the items of the viewModel
            // Hence, build a complete viewModel again
            this.viewModel =  createTableViewModel(this.filterManager.getFilteredData(), capability,
                this.filterManager.getFilterValues().language, this.capabilityExtensions);
            this._addTestResults();
        }

        this.filterManager.applyViewModelFilter(PortabilityFilter.Name(), this.viewModel, newFilterValues);
        this.capabilityTableComponent.updateModel(this.viewModel);
    }

}

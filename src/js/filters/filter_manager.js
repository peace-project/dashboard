
export default class FilterManager {
    constructor(capabilityData, filteredData) {
        this.filters = [];
        this.viewFilters = [];
        this.filterValues = {};
        this.oldFilterValues = {};
        this.capabilityData = capabilityData;
       // this.testData = capabilityData.getAllTestsByLanguage();
        this.filteredData = filteredData;

        // Initialize filterValues
    }

    getFilteredData() {
        return this.filteredData;
    }

    addFilter(filter, defaultValue) {
        if (!this.filterValues.hasOwnProperty(filter)) {

            if (defaultValue === undefined) {
                throw new Error('Filter must  have defaultValues');
            }

            this.filterValues[filter.getName()] = defaultValue;
            this.oldFilterValues[filter.getName()] = filter.copyFilterValues(defaultValue);
            this.filters.push(filter);
        }
    }

    addViewModelFilter(filter, defaultValue) {
        if (!this.filterValues.hasOwnProperty(filter)) {
            if (defaultValue === undefined) {
                throw new Error('Filter must  have defaultValues');
            }
            this.filterValues[filter.getName()] = defaultValue;
            this.viewFilters.push(filter);
        }
    }

    getFilterValues() {
        return this.filterValues; //this._copyFiltersValues();
    }


    getFilterValue(filterName) {
        if (this.filterValues.hasOwnProperty(filterName)) {
            let filter = this.filters.find(f => f.getName() == filterName);
            return filter.copyFilterValues(this.filterValues[filter.getName()]);
        }
        return undefined;
    }

    applyFilter(filterName, newFilterValues) {
        let filter = this.filters.find(f => f.getName() == filterName);
        let that = this;

        if (filter !== undefined) {
            let filterValuesChanges = {addedValues: [], removedValues: []};

            if (newFilterValues !== undefined && newFilterValues !== null) {

                let diffFilterValues;
                let diffNewFilterValues;

                    // We must copy the filterValues to manipulate them without any side-effects
                    diffFilterValues = filter.copyFilterValues(that.oldFilterValues[filterName]);
                    diffNewFilterValues = filter.copyFilterValues(newFilterValues);


                if(Array.isArray(newFilterValues)){
                    Object.keys(that.oldFilterValues[filterName]).forEach(key => {
                        if (newFilterValues.hasOwnProperty(key)) {
                            delete diffFilterValues[key];
                            delete diffNewFilterValues[key];
                        }
                    });
                } else  {
                    // Must be single type value (String, Number, Boolean, Object or Symbol)
                    // So removedValues = oldFilterValues and addedValues = newFilterValues
                }

                filterValuesChanges['addedValues'] = diffNewFilterValues;
                filterValuesChanges['removedValues'] = diffFilterValues;

                that.filterValues[filterName] = newFilterValues;
            }

            that.oldFilterValues[filterName] = filter.copyFilterValues(that.filterValues[filterName]);

            filter.applyFilter(that.capabilityData, that.filteredData, that.filterValues, filterValuesChanges);
        }
    }

    applyViewModelFilter(filterName, viewModel, newFilterValues) {
        let filter = this.viewFilters.find(f => f.getName() == filterName);
        let that = this;

        if (filter === undefined) {
            console.log('Could not find filter: ' + filterName);
            return;
        }

        if(newFilterValues !== undefined){
            that.filterValues[filterName] = newFilterValues;
        }

        filter.applyFilter(viewModel, that.filterValues);
    }

    applyAllFilters() {
        var that = this;
        let filterValuesChanges = {addedValues: [], removedValues: []};
        that.oldFilterValues = this._copyFiltersValues();
        this.filters.forEach(filter => {
            filter.applyFilter(that.capabilityData, that.filteredData, that.filterValues, filterValuesChanges);
        });

    }

    _copyFiltersValues() {
        let that = this;
        var values = {};

        this.filters.forEach(filter => {
            values[filter.getName()] = filter.copyFilterValues(that.filterValues[filter.getName()]);
        });

        return values;
    }
}
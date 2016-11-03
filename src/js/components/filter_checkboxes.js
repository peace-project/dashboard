import RenderComponent from "../render/render_component";

export class FilterCheckboxes extends RenderComponent {
    constructor(dimensionName, dimensionItems, filterValues, filteredData, createItems, parentComp) {
        super(undefined, undefined, parentComp);
        this.dimensionName = dimensionName;
        this.dimensionItems = dimensionItems;
        this.filteredData = filteredData;
        this.filterValues = filterValues;
        this.createItems = createItems;
    }

    onRenderingStarted() {
        this.updateCheckboxes();
        this.addCheckBoxFilterEventHandler();
    }

    //TODO rename to initCheckboxes
    updateCheckboxes() {
        let that = this;
        this.dimensionItems.forEach(function (dimensionItem) {
            if (that.createItems) {
                that.buildFilterCheckboxes(dimensionItem.name);
            }
            var checked = that.filterValues[that.dimensionName].hasOwnProperty(dimensionItem.id);
            $('input[data-dimension~="' + that.dimensionName + '"][value~="' + dimensionItem.id + '"]').prop("checked", checked);
        });
    }

    addCheckBoxFilterEventHandler() {
        let that = this;
        var elem = $('input[data-dimension="' + that.dimensionName + '"]');
        $(elem).on('change', function (event) {
            that.updateCheckBoxAllOrLatestVersion(this);
            //Do filter
            that.handleFilterRequest(that.dimensionName, that.filterValues);
        });
    }


    updateCheckBoxAllOrLatestVersion(changedElem) {
        var allFilterID = '#all_' + this.dimensionName;
        if (this.dimensionName === 'engines') {
            allFilterID = 'input[data-engine-all~="' + $(changedElem).attr('data-engine') + '"]';
            $('#cbox-lversions').prop('checked', false);
        }

        var checkedAll = $('input[data-dimension="' + this.dimensionName + '"]:checked').length === 0;
        $(allFilterID).prop('checked', checkedAll);
    }

    buildFilterCheckboxes(value, name) {
        let that = this;
        var div = '#filter-items-' + that.dimensionName;
        name = (name) ? name : value;
        $(div)
            .append('<li><label class="filter-item"><input type="checkbox" '
                + 'class="checkbox-filter" data-dimension="' + that.dimensionName + '" value="' + value + '"> '
                + '<span class="checkbox-icon"></span>' + name + '</label></li>');

        /*
         context = {
         dimensionName: this.dimensionName,
         dimensionItems: []
         }*/

    }

    handleFilterRequest(dimension, all) {
        this.parentComp.handleFilterRequest(dimension, all);
    }

}


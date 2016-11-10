import RenderComponent from "../render/render_component";

export default class FilterCheckboxesAll extends RenderComponent {
    constructor(dimensionName, filterValues, createItems, parentComp) {
        super(undefined, undefined, parentComp);
        this.dimensionName = dimensionName;
        this.filterValues = filterValues;
        this.createItems = createItems;
    }

    onRenderingStarted(){
        this.initCheckboxes();
    }


    initCheckboxes() {
        if (this.createItems) {
            this.buildCheckboxAll();
        }
        let that = this;
        that.addCheckBoxAllFilterEventHandler();
    }

    addCheckBoxAllFilterEventHandler(elemID, filterID) {
        var elem = (elemID) ? $(elemID) : $('#all_' + this.dimensionName);
        var checked = this.filterValues[this.dimensionName].length === 0;

        elem.prop("checked", checked);

        let that = this;
        $(elem).on('click', function (event) {
            that.checkFilterAll(this.dimensionName, elemID, filterID);
            var checkedAll = true;
            that.handleFilterRequest(checkedAll);

        });
    }

    checkFilterAll(elemID, filterElems) {
        var elem = (elemID) ? $(elemID) : $('#all_' + this.dimensionName);
        var _filterElems = (filterElems) ? filterElems : '#filter-items-' + this.dimensionName + ' :checkbox';
        $(_filterElems).prop('checked', false);

        elem.prop("checked", true);
    }

    buildCheckboxAll() {
        var div = '#filter-items-' + this.dimensionName;
        $(div)
            .empty()
            .append('<li><label class="filter-item"><input type="checkbox" '
                + 'class="checkbox-filter" id="all_' + this.dimensionName + '"> '
                + '<span class="checkbox-icon"></span>All </label></li>');

        console.log('this.dimensionName');
        console.log(this.dimensionName);

    }

    handleFilterRequest(dimension, all) {
        let newFilterValues = {};


        //$('all_engine_'+ this.dimensionName)
        $('all_engine_'+ this.dimensionName).each(function (index, val) {
            var engine = $(this).attr('data-engine-all');
            if ($(this).is(':checked')) {
                $('input[data-engine~="' + engine + '"]').each(function (index, val) {
                    newFilterValues[$(this).attr('value')] = {
                        index: $(this).attr('value-index')
                    }
                });
            } else {
                var dimInputs = $('input[data-engine~="' + engine + '"]');
                var checkedInputs = $('input[data-engine~="' + engine + '"]:checked');

                $(dimInputs).each(function (index, val) {
                    //var filterDimension = $(this).attr('data-dimension');
                    //newFilterValues = newFilterValues[filterDimension] || [];
                    if ($(this).is(':checked')) {
                        newFilterValues[$(this).attr('value')] = {
                            index: $(this).attr('value-index')
                        }
                    }
                });

                // Update checkbox ALL
                if (dimInputs.length === checkedInputs.length) {
                    var engineName = dimInputs.attr('data-engine');
                    var elemID = '#all_engine_' + engineName;
                    var filterID = '#filter-items-engine-' + engineName;
                    this.engineCheckBoxesAll.checkFilterAll(elemID, filterID);
                }

                //that.createCewFilterValues(dimInputs, checkedInputs);
            }
        });


        setTimeout(function () {
            that.filter(newFilterValues)
        }, 100);


        console.log("this.parentComp");
        console.log(this.parentComp);
        // this.parentComp.handleFilterRequest(dimension, all);
    }
}
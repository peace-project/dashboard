import RenderComponent from "../render/render_component";
import {groupEngineByName} from "../viewmodels/helpers";

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

    }
}
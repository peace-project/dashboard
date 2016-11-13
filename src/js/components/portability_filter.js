export default class PortabilityFilterComponent {
    constructor(options) {
        this.onFilter = options.onFilter;
        this.filterValues = options.filterValues;
        this._init();
    }

    _init() {
        let that = this;

        var elem = $('input[data-filter~="portability_status"]');
        console.log('ELEM_');
        console.log(elem);

        $(elem).each(function (index) {
            $(this).on('change', function (event) {
                console.log('change');
                if ($(this).is(':checked')) {
                    that.filterValues['portability_status'] = $(this).val();
                    that._doFilter();
                }
            });
        });

    }

    _doFilter() {
        let that = this;
        setTimeout(function () {
            console.log('_____DO_FILTER');
            console.log(that.filterValues);
            that.onFilter(that.filterValues);
        }, 100);
    }
}


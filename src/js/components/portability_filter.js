export default class PortabilityFilterComponent {
    constructor(options) {
        this.onFilter = options.onFilter;
        this.filterValues = options.filterValues;
        this._init();
    }

    _init() {
        let that = this;

        var elem = $('input[data-filter~="portability_status"]');

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
            that.onFilter(that.filterValues['portability_status']);
        }, 100);
    }
}


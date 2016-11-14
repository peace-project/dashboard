export default class LanguageFilterComponent {
    constructor(options) {
        this.onFilter = options.onFilter;
        this.filterValues = options.filterValues;
        this._init();
    }

    _init() {
        let that = this;

        var elem = $('input[data-filter~="language"]');

       // var checked = that.filterValues['language'].indexOf(lang) > -1;
       // elem.prop("checked", checked);

        $(elem).on('change', function(event) {
            if( $(this).is(':checked')){
                that.filterValues['language'] = $(this).val();
                that._doFilter();
            }
        });
    }

    _doFilter() {
        let that = this;
        setTimeout(function () {
            that.onFilter(that.filterValues['language']);
        }, 100);
    }
}


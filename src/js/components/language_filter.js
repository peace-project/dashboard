import RadioButtonDefault from "./radio_button_default";

export default class LanguageFilterComponent {
    constructor(options) {
        this.allCheckBoxes = {};
        this.onFilter = options.onFilter;

        this.filterValues = options.filterValues;
        this.dimension = options.dimension;
        this.dimensionData = options.dimensionData;
        this._init();
    }

    _init() {
        let that = this;

        this.dimensionData.forEach(function (language, index) {
            that.allCheckBoxes[language] = that._createRadioButton(language, index);
        });
    }


    _createRadioButton(language, index) {
        let that = this;

        let elem = 'input[data-filter="' + that.dimension + '"][value="' + language + '"]';
        let checked = (index === 0);
        let checkedClass = (checked) ? ' active' : '';

        console.log('elem=' +elem);

        let radioButton = new RadioButtonDefault(this, {
                dimensionName: that.dimension,
                elem: elem,
                is: that.dimension + '-instance',
                checked: checked,
              /*  changeEventHandler: function (event, radioButton) {
                    that._select(radioButton);
                },*/
                html: {
                    container: '#filter-items-' + that.dimension,
                    contentClass: '.filter-item-btn' ,
                    content: '<label class="btn filter-item-btn'+ checkedClass+ '" >' + ' ' +
                    '<input type="radio" name="langs" id="lang' + index + '" ' +
                    'autocomplete="off" data-filter="' + that.dimension + '" value="' + language + '" >'
                    + language + '</label>'
                }
            }
        );

        radioButton.onRenderingStarted();

        // We use jquery instead of the native addEventListener here.
        // somehow bootstrap button plugin is consuming change events
        // TODO fix this issue
        $(elem).on('change', function(event) {
            that._select(radioButton);
        });

        return radioButton;
    }

    _select(radioButton) {
        if(radioButton.isChecked()){
            this.filterValues['language'] = radioButton.getValue();
            this._doFilter();
        }
    }

    _doFilter() {
        let that = this;
        setTimeout(function () {
            that.onFilter(that.filterValues['language']);
        }, 100);
    }
}


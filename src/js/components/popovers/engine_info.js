import RenderComponent from "../../render/render_component";

export default class EngineInfoPopover extends RenderComponent {
    constructor(options) {
        super(undefined, 'engine_info', undefined);

        this.id = '[data-engine-info].engine-info';
        this.engines = options.engines;
        this._init();
    }

    onRendering() {
        // The DOM of the table containing the results has changed, so we must register the popover again
        this._initPopover();
    }

    _init() {
        this._initPopover();

        let that = this;
        $('body').on('click', function (e) {
            $(that.id).each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }

            });
        });
    }

    _initPopover() {
        let that = this;
        if (this.popoverOptions === undefined) {
            this.popoverOptions = {
                trigger: 'hover',
                html: true,
                placement: 'auto top',
                container: '.content-wrapper',
                content: function () {
                    return that._renderContent($(this).attr('data-engine-info'))
                },
                title: function () {
                    return '<span>Engine</span> ' + that._getEngineNameId($(this).attr('data-engine-info'));
                }
            }
        }

        $(this.id).popover(this.popoverOptions);
    }

    _renderContent(engineIndex) {
        this.context['engine'] = this.engines[engineIndex];
        return super.renderTemplate();
    }

    _getEngineNameId(engineIndex) {
        return this.engines[engineIndex].name + ' ' + this.engines[engineIndex].version;
    }
}
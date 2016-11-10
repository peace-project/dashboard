import RenderComponent from "../render/render_component";

export default class CheckBoxDefault extends RenderComponent {
    constructor(parentComp, options) {
        super(undefined, undefined, parentComp);

        this.options = {};
        Object.keys(options).forEach(opt => {
            this.options[opt] = options[opt];
        });

        //TODO check if all needed option are added
        if(this.options.checked === undefined){
            this.options['checked'] = false;
        }
    }

    onRenderingStarted(){
        this._init();
    }

    _init() {
        if(this.inputElement === undefined){
            this._createCheckbox();
        }
    }

    _createCheckbox() {
        if(this.options.html !== undefined && this.options.html.content !== undefined && this.options.html.containerElem !== undefined){
            //var div = '#filter-items-' + this.dimensionName;
            //TODO can we use vanilla javascript here
            $(this.options.html.containerElem).empty().append(this.options.html.content);
        }

        this.inputElement = $(this.options.elem)[0];

        // Only now we can access the DOM-element and thus apply the checked option
        this.setChecked(this.options.checked);

        // Register event handler

        if(this.options.eventHandler !== undefined){
            //let eventHandler = this.options.eventHandler.bind(this.parentComp);
            let that = this;
            that.inputElement.addEventListener('click', function(event){
                that.options.eventHandler(event, that);
            });
        }
    }


    setChecked(checked){
        this.inputElement.checked = checked;
        //$(this.options.elem).prop("checked", checked);
    }

    isChecked(){
      return this.inputElement.checked;
    }

    getValue(){
        return this.inputElement.getAttribute('value');
    }

    getAttribute(attr){
        return this.inputElement.getAttribute(attr);
    }



}
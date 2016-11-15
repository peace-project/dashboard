
import RenderComponent from "../render/render_component";

export default class RadioButtonDefault extends RenderComponent {

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
            this._createRadioButton();
        }
    }



    _createRadioButton() {
        if(this.options.html !== undefined && this.options.html.content !== undefined && this.options.html.container !== undefined){
            //var div = '#filter-items-' + this.dimensionName;
            //TODO can we use vanilla javascript here
            $(this.options.html.container).append(this.options.html.content);
        }

        this.inputElement = $(this.options.elem)[0];

        if(this.inputElement === undefined){
            console.error('Could note find or create element: ' + this.options.elem);
        }

        // Only now we can access the DOM-element and thus apply the checked option
        this.setChecked(this.options.checked);

        // Register event handler
        let that = this;
        if(this.options.clickEventHandler !== undefined){
            that.inputElement.addEventListener('click', function(event){
                that.options.clickEventHandler(event, that);
            });
        }

        if(this.options.changeEventHandler !== undefined){
            that.inputElement.addEventListener('change', function(event){
                that.options.changeEventHandler(event, that);
            });
        }

    }

    setChecked(checked){
        this.inputElement.checked = checked;
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


    remove(){
        if(this.inputElement !== undefined && this.options.html.contentClass !== undefined){
            $(this.inputElement).closest(this.options.html.contentClass).remove();
        }
    }

}
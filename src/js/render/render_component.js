import Renderer from "./renderer";

export default class RenderComponent {
    constructor(elementId, templateId, parentComp) {
        this.elementId = elementId;
        this.templateId = templateId;
        this.parentComp = parentComp;
        this.context = {};

        //TODO singleton
        this.renderer = new Renderer();
    }

    render(){
        this.renderer.render(this);
    }

    onRendering(){}
    onRenderingStarted(){}

    updateModel(viewModel, preventRendering){
        this.context = viewModel;
        if(!preventRendering){
            super.render();
        }
    }
}

import Renderer from "./renderer";

export default class RenderComponent {
    constructor(elementId, templateId, parentComp) {
        this.elementId = elementId;
        this.parentComp = parentComp;
        this.context = {};
        this.html = {};

        this.templateId = (templateId !== null && templateId !== undefined) ? templateId.toLowerCase() : undefined;

        //TODO singleton
        this.renderer = new Renderer();
    }

    render(){
        this.renderer.render(this);
    }

    renderTemplate(){
        return this.renderer.renderTemplate(this);
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

import {math} from "./helpers/math";
import {getProperty} from "./helpers/get_property";
import {breaklines} from "./helpers/breaklines";
import capitalize from "./helpers/capitalize";
import if_eq from "./helpers/if_eq";

export default class Renderer {
    constructor() {
        this._initHelpers();
        this.started = false;
    }

    render(renderComponent) {
        console.log(renderComponent);

        this._checkComponent(renderComponent);
        let tpl = PeaceTemp.templates[renderComponent.templateId];
        if (tpl === undefined) {
            console.error("Could not find template " + renderComponent.templateId);
            return;
        }
        let html = tpl(renderComponent.context);
        $(renderComponent.elementId).html(html);

        if (this.started) {
            renderComponent.onRendering();
        } else {
            this.started = true;
            renderComponent.onRenderingStarted();
        }
    }

    _initHelpers() {
        Handlebars.registerHelper('capitalize', capitalize);
        Handlebars.registerHelper('getProperty', getProperty);
        Handlebars.registerHelper('breaklines', breaklines);
        Handlebars.registerHelper("math", math);
        Handlebars.registerHelper('if_eq', if_eq);
    }

    _checkComponent(comp) {
        if (comp.templateId === undefined || comp === null) {
            throw Error('Failed to render a component. templateId is undefined');
        } else if (comp.context === undefined) {
            throw Error('Failed to render a component. context is undefined');
        }
        else if (comp.elementId === undefined) {
            throw Error('Failed to render a component. elementId is undefined');
        }
    }


}
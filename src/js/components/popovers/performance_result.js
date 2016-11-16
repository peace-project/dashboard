import {createLinkFromPaths} from "../../viewmodels/helpers";
import DefaultResultPopover from "./result_info";

export default class PerformanceTestResultPopover extends DefaultResultPopover{
    constructor(options){
        super({
            //templateId: 'feature_test_description',
            id: '[data-test-index].info-performance-test',
            capability: options.capability,
            tests: options.tests,
            features: options.features,
        });

    }

    _renderContent(testIndex){
        var featureTest = getFeatureTestByEngine(filteredData.features[featureIndex], engineID);
        if(featureTest == undefined){ return;}

        var test = this.tests[testIndex];
        if (test === undefined) {
            console.error('Test is undefined');
            return;
        }
        this.context['test'] = test;
        return super.renderTemplate();
    }


    _getPerformanceTestInfo(featureTest){
        var additional = featureTest.additionalData;
        var values = [];
        var treeOfKey = [];
        this._getChild("", additional, treeOfKey);
        var inclModels = {
            'treeOfKey': treeOfKey,
            'models': createLinkFromPaths(featureTest.engineDependentFiles)
        };
        return inclModels;
    }

    _getChild(name,father,treeOfKey){
        if (father instanceof (Array)){
            for (var index=0;index<father.length;index++){
                this._getChild(name,father[index],treeOfKey);
            }
        }

        else if (father instanceof(Object)){
            for (var key in father){
                var nameNew=name.concat("."+key);
                if ((father[key]) instanceof(Object)){
                    this._getChild(nameNew, father[key],treeOfKey);
                }else {
                    if (nameNew.charAt(0)=='.'){
                        nameNew=nameNew.substring(1,nameNew.length);
                    }
                    treeOfKey.push({
                        name:nameNew,
                        value:father[key]
                    });

                }
            }
        }
    }
}
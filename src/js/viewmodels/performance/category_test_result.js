export default class CategoryTestResult {
    constructor(category, test, metricsInfo, resultOrder) {
        this.category = category;
        this.categoryName = category.replaceAll('_', ' ');
        this.metrics = {};
        this.isFirstEntry = false;
        this.resultOrder = resultOrder;

        let that = this;
        Object.keys(test.result[category]).forEach(metric => {
            that.metrics[metric] = {
                'metric': metric,
                'metricName': metricsInfo[metric].name,
                'description':metricsInfo[metric].description,
                'metricUnit': metricsInfo[metric].unit,
                'results' : {}
            };
        });

        this.addResult(test);
    }

    addResult(test){
        if(!test.result.hasOwnProperty(this.category)){
            console.error('Test cannot be added to this category metric '+ this.category);
            return;
        }

        let that = this;
        Object.keys(this.metrics).forEach(metric => {
            if(this._isEmptyResult(test.result[that.category][metric] )){
                delete that.metrics[metric];
                return;
            }

            that.metrics[metric]['results'][test.engineID] = test.result[that.category][metric];

            Object.keys(test).forEach(key => {
                if(key !== 'result'){
                    // Add additionally test data
                    that.metrics[metric]['results'][test.engineID][key] = test[key];
                }
            });
        });


        // Sort by engine according the resultOrder
        //TODO test if sorting is actually working
        Object.keys(this.metrics).forEach(metric => {
            let sortedResults = {};

            that.resultOrder.forEach(engineId => {
                if(that.metrics[metric]['results'].hasOwnProperty(engineId)){
                    sortedResults[engineId] = that.metrics[metric]['results'][engineId];
                }
            });

            that.metrics[metric]['results'] = sortedResults;

        });
    }

    _isEmptyResult(result){
        return result['min'] === "" && result['max'] === "" && result['avg±ci'] === "" && result['sd'] == "";
    }

}
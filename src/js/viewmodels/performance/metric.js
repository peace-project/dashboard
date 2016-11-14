export default class Metric {
    constructor(categoryName, result, metricsInfo) {
        console.log('__categoryName');
        console.log(categoryName);
        console.log('__result');
        console.log(result);

        this.category = categoryName;
        this.categoryName = categoryName.replaceAll('_', ' ');
        this.metrics = [];
        this.isFirstEntry = false;

        let that = this;
        Object.keys(result).forEach(metric => {
            that.metrics.push({
                'metric': metric,
                'metricName': metricsInfo[metric].name,
                'description':metricsInfo[metric].description,
                'metricUnit': metricsInfo[metric].unit
            });
        });
    }
}
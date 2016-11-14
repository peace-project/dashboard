export default class TestResult {
    constructor(test) {
        let that = this;
        Object.keys(test).forEach(key => {
            that[key] = test[key];
        });
    }
}
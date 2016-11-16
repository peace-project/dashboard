export default class TestIndependentData {

    constructor(tests) {
        let that = this;
        // Add index to ease access of test data
        this.tests = tests.map((test, index) => {
            let copiedTest = that._formatTestResult(test);
            copiedTest['index'] = index;
            return copiedTest;
        });
    }

    getAll() {
        //TODO copy
        return this.tests;
    }

    _formatTestResult(test) {
        test['image'] = test.engineIndependentFiles.find(path => path.toLowerCase().split('.').pop() === 'png');
        return test;
    }


}
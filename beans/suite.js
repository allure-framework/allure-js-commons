function Suite(name, timestamp) {
    this.name = name;
    this.start = timestamp || Date.now();
    this.testcases = [];
}
Suite.prototype.end = function(timestamp) {
    this.stop = timestamp || Date.now();
};

Suite.prototype.hasTests = function() {
    return this.testcases.length > 0;
};

Suite.prototype.addTest = function(test) {
    this.testcases.push(test);
};

Suite.prototype.toXML = function() {
	console.log('Suite.prototype.toXML', this.start, this.stop);
	var start = (this.start == "" || typeof this.start === "undefined") ? Date.now() : this.start;
    var stop = (this.stop == "" || typeof this.stop === "undefined") ? Date.now() : this.stop;
    return {
        '@': {
            'xmlns:ns2' : 'urn:model.allure.qatools.yandex.ru',
            start: start,
            stop: stop,
        },
        name: this.name,
        title: this.name,
        'test-cases': {
            'test-case': this.testcases.map(function(testcase) {
                return testcase.toXML();
            })
        }
    };
};

module.exports = Suite;

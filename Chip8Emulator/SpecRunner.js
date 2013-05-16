require([
    'spec/memory.spec', 
    'spec/registers.spec', 
    'spec/stack.spec', 
    'spec/decoder.spec', 
    'spec/core.spec', 
    'spec/timers.spec', 
    'spec/screen.spec'
], function () {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.execute();
}, function (err) {
    console.log("Error loading specs:\n\t" + err);
});
//@ sourceMappingURL=SpecRunner.js.map

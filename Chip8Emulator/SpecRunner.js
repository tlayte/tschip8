/// <reference path=".typings/require.d.ts" />
/// <reference path=".typings/jasmine.d.ts" />
require([
    'spec/memory.spec', 
    'spec/registers.spec'
], function () {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.execute();
}, function (err) {
    console.log("Error loading specs:\n\t" + err);
});
//@ sourceMappingURL=SpecRunner.js.map

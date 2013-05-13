/// <reference path=".typings/require.d.ts" />
/// <reference path=".typings/jasmine.d.ts" />


require(['spec/memory.spec', 'spec/registers.spec'], () => {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.execute();
}, (err) => {
    console.log("Error loading specs:\n\t" + err);
});
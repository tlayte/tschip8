/// <reference path=".typings/require.d.ts" />
/// <reference path=".typings/jasmine.d.ts" />


require([
'spec/memory.spec',
'spec/registers.spec',
'spec/stack.spec',
'spec/decoder.spec',
'spec/core.spec',
'spec/timers.spec',
'spec/screen.spec'
], () => {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.execute();
}, (err) => {
    console.log("Error loading specs:\n\t" + err);
});
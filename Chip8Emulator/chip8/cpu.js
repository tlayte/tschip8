define(["require", "exports"], function(require, exports) {
    // Module
    (function (chip8) {
        var CPU = (function () {
            function CPU() {
            }
            return CPU;
        })();
        chip8.CPU = CPU;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=cpu.js.map

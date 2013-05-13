define(["require", "exports"], function(require, exports) {
    (function (chip8) {
        var Registers = (function () {
            function Registers() { }
            return Registers;
        })();
        chip8.Registers = Registers;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=registers.js.map

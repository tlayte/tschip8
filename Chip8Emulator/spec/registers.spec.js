define(["require", "exports", "chip8/registers"], function(require, exports, __registersModule__) {
    var registersModule = __registersModule__;

    var Registers = registersModule.chip8.Registers;
    (function (chip8) {
        (function (spec) {
            describe('A registers object', function () {
                it('should initialise all 16 registers to zero', function () {
                    var registers = new Registers();
                    for(var i = 0; i < 16; i++) {
                        expect(registers.read(i)).toBe(0);
                    }
                });
            });
        })(chip8.spec || (chip8.spec = {}));
        var spec = chip8.spec;
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=registers.spec.js.map

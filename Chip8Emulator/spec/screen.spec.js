define(["require", "exports", "chip8/screen"], function(require, exports, __screenModule__) {
    var screenModule = __screenModule__;

    (function (chip8) {
        (function (spec) {
            describe('A screen object', function () {
                it('should have a default size of 64x32', function () {
                    var screen = new screenModule.chip8.Screen();
                    expect(screen.width).toBe(64);
                    expect(screen.height).toBe(32);
                });
                it('should have a default size of 128x64', function () {
                    var screen = new screenModule.chip8.Screen(128, 64);
                    expect(screen.width).toBe(128);
                    expect(screen.height).toBe(64);
                });
            });
        })(chip8.spec || (chip8.spec = {}));
        var spec = chip8.spec;
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=screen.spec.js.map

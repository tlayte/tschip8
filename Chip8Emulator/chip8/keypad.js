define(["require", "exports", "chip8/event"], function(require, exports, __eventModule__) {
    var eventModule = __eventModule__;

    (function (chip8) {
        var Keypad = (function () {
            function Keypad() {
                this.onKeyDown = new eventModule.chip8.Event();
            }
            Keypad.prototype.read = function (key) {
                return undefined;
            };
            return Keypad;
        })();
        chip8.Keypad = Keypad;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=keypad.js.map

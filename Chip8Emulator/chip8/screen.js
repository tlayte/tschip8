define(["require", "exports"], function(require, exports) {
    (function (chip8) {
        var Screen = (function () {
            function Screen() { }
            Screen.prototype.clear = function () {
            };
            Screen.prototype.draw = function (x, y, data) {
            };
            return Screen;
        })();
        chip8.Screen = Screen;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=screen.js.map

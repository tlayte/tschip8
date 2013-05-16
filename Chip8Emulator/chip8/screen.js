define(["require", "exports"], function(require, exports) {
    (function (chip8) {
        var Screen = (function () {
            function Screen(width, height) {
                if (typeof width === "undefined") { width = 64; }
                if (typeof height === "undefined") { height = 32; }
                this.width = width;
                this.height = height;
            }
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

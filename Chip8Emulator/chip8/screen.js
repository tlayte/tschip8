define(["require", "exports", "chip8/event"], function(require, exports, __eventModule__) {
    var eventModule = __eventModule__;

    (function (chip8) {
        var Screen = (function () {
            function Screen(width, height) {
                if (typeof width === "undefined") { width = 64; }
                if (typeof height === "undefined") { height = 32; }
                this.width = width;
                this.height = height;
                this.onDraw = new eventModule.chip8.Event();
                this.onClear = new eventModule.chip8.Event();
                this.clear();
            }
            Screen.prototype.clear = function () {
                this._pixels = [];
                for(var i = 0; i < this.width * this.height; i++) {
                    this._pixels[i] = 0;
                }
                this.onClear.raise();
            };
            Screen.prototype.draw = function (x, y, data) {
                var minX = this.width;
                var minY = this.height;
                var maxX = 0;
                var maxY = 0;
                var collision = 0;
                for(var sourceY = 0; sourceY < data.length; sourceY++) {
                    var line = data[sourceY];
                    for(var sourceX = 7; sourceX >= 0; sourceX--) {
                        var value = line & 0x1;
                        var result = this.setPixel(x + sourceX, y + sourceY, value);
                        if(result === 0) {
                            collision = 1;
                        }
                        line >>= 1;
                    }
                }
                this.onDraw.raise();
                return collision;
            };
            Screen.prototype.setPixel = function (x, y, value) {
                if(value === 0) {
                    return -1;
                }
                while(x >= this.width) {
                    x -= this.width;
                }
                while(y >= this.height) {
                    y -= this.height;
                }
                var addr = x + y * this.width;
                return this._pixels[addr] ^= value;
            };
            Screen.prototype.getPixels = function () {
                return this._pixels.slice(0);
            };
            return Screen;
        })();
        chip8.Screen = Screen;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=screen.js.map

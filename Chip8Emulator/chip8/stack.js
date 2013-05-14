define(["require", "exports"], function(require, exports) {
    (function (chip8) {
        var Stack = (function () {
            function Stack(size) {
                if (typeof size === "undefined") { size = 16; }
                this.size = size;
                this.data = [];
                this.reset();
            }
            Stack.prototype.reset = function () {
                this._SP = 0;
            };
            Stack.prototype.push = function (value) {
                if(this._SP >= this.size) {
                    throw "Stack overflow";
                }
                this.data[this._SP++] = value;
            };
            Stack.prototype.pop = function () {
                if(this._SP <= 0) {
                    throw "Stack underflow";
                }
                return this.data[--this._SP];
            };
            Object.defineProperty(Stack.prototype, "SP", {
                get: function () {
                    return this._SP;
                },
                enumerable: true,
                configurable: true
            });
            return Stack;
        })();
        chip8.Stack = Stack;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=stack.js.map

define(["require", "exports", "chip8/event"], function(require, exports, __eventModule__) {
    var eventModule = __eventModule__;

    (function (chip8) {
        var Stack = (function () {
            function Stack(size) {
                if (typeof size === "undefined") { size = 16; }
                this.size = size;
                this.onWrite = new eventModule.chip8.Event();
                this.data = [];
                this.reset();
            }
            Stack.prototype.reset = function () {
                this._SP = 0;
                this.onWrite.raise(0, null);
            };
            Stack.prototype.push = function (value) {
                if(this._SP >= this.size) {
                    throw "Stack overflow";
                }
                this.data[this._SP++] = value;
                this.onWrite.raise(this._SP, value);
            };
            Stack.prototype.pop = function () {
                if(this._SP <= 0) {
                    throw "Stack underflow";
                }
                var data = this.data[--this._SP];
                this.onWrite.raise(this._SP, data);
                return data;
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

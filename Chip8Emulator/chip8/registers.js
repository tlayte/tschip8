var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "chip8/memory"], function(require, exports, __memModule__) {
    var memModule = __memModule__;

    (function (chip8) {
        var Registers = (function (_super) {
            __extends(Registers, _super);
            function Registers() {
                        _super.call(this, 16);
            }
            Registers.prototype.reset = function () {
                _super.prototype.reset.call(this);
                this._PC = 0x200;
                this._I = 0;
            };
            Registers.prototype.read = function (address) {
                if(typeof address == "string") {
                    return this["_" + address];
                }
                return _super.prototype.read.call(this, address);
            };
            Registers.prototype.write = function (address, value) {
                if(typeof address == "string") {
                    this["_" + address] = value;
                    this.onWrite.raise(address, value);
                } else {
                    _super.prototype.write.call(this, address, value);
                }
            };
            Object.defineProperty(Registers.prototype, "v0", {
                get: function () {
                    return this.read(0);
                },
                set: function (value) {
                    this.write(0, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "v1", {
                get: function () {
                    return this.read(1);
                },
                set: function (value) {
                    this.write(1, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "v2", {
                get: function () {
                    return this.read(2);
                },
                set: function (value) {
                    this.write(2, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "v3", {
                get: function () {
                    return this.read(3);
                },
                set: function (value) {
                    this.write(3, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "v4", {
                get: function () {
                    return this.read(4);
                },
                set: function (value) {
                    this.write(4, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "v5", {
                get: function () {
                    return this.read(5);
                },
                set: function (value) {
                    this.write(5, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "v6", {
                get: function () {
                    return this.read(6);
                },
                set: function (value) {
                    this.write(6, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "v7", {
                get: function () {
                    return this.read(7);
                },
                set: function (value) {
                    this.write(7, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "v8", {
                get: function () {
                    return this.read(8);
                },
                set: function (value) {
                    this.write(8, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "v9", {
                get: function () {
                    return this.read(9);
                },
                set: function (value) {
                    this.write(9, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "vA", {
                get: function () {
                    return this.read(10);
                },
                set: function (value) {
                    this.write(10, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "vB", {
                get: function () {
                    return this.read(11);
                },
                set: function (value) {
                    this.write(11, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "vC", {
                get: function () {
                    return this.read(12);
                },
                set: function (value) {
                    this.write(12, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "vD", {
                get: function () {
                    return this.read(13);
                },
                set: function (value) {
                    this.write(13, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "vE", {
                get: function () {
                    return this.read(14);
                },
                set: function (value) {
                    this.write(14, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "vF", {
                get: function () {
                    return this.read(15);
                },
                set: function (value) {
                    this.write(15, value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "PC", {
                get: function () {
                    return this.read("PC");
                },
                set: function (value) {
                    this.write("PC", value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Registers.prototype, "I", {
                get: function () {
                    return this.read("I");
                },
                set: function (value) {
                    this.write("I", value);
                },
                enumerable: true,
                configurable: true
            });
            return Registers;
        })(memModule.chip8.Memory);
        chip8.Registers = Registers;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=registers.js.map

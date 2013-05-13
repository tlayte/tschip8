define(["require", "exports", 'chip8/event'], function(require, exports, __eventModule__) {
    var eventModule = __eventModule__;

    var Event = eventModule.chip8.Event;
    (function (chip8) {
        var Memory = (function () {
            function Memory(Size) {
                if (typeof Size === "undefined") { Size = 4096; }
                this.Size = Size;
                this._memory = [];
                this.onWrite = new Event();
                for(var i = 0; i < this.Size; i++) {
                    this._memory[i] = 0;
                }
            }
            Memory.prototype.write = function (address, value) {
                this.checkBounds(address);
                this._memory[address] = value;
                this.onWrite.raise();
            };
            Memory.prototype.read = function (address) {
                this.checkBounds(address);
                return this._memory[address];
            };
            Memory.prototype.load = function (address, data, size) {
                this.checkBounds(address);
                if(size < 0) {
                    size = data.length;
                }
                if(address + size > this.Size) {
                    throw "Data (" + size + ") would overflow memory(" + this.Size + ")";
                }
                for(var i = 0; i < size; i++) {
                    this._memory[address + i] = data[i];
                }
            };
            Memory.prototype.checkBounds = function (address) {
                if(address < 0 || address >= this.Size) {
                    throw "Address (" + address + ") was out of bounds";
                }
            };
            return Memory;
        })();
        chip8.Memory = Memory;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=memory.js.map

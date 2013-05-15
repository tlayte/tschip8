define(["require", "exports"], function(require, exports) {
    
    
    (function (chip8) {
        var Decoder = (function () {
            function Decoder(memory, registers) {
                this.memory = memory;
                this.registers = registers;
            }
            Decoder.prototype.getNext = function () {
                var instruction = this.buildInstruction();
                this.registers.PC += 2;
                return instruction;
            };
            Decoder.prototype.peekNext = function (offset) {
                if (typeof offset === "undefined") { offset = 0; }
                return this.buildInstruction(offset);
            };
            Decoder.prototype.buildInstruction = function (offset) {
                if (typeof offset === "undefined") { offset = 0; }
                var nextAddress = this.registers.PC + (offset * 2);
                var data = [
                    this.memory.read(nextAddress), 
                    this.memory.read(nextAddress + 1)
                ];
                var opcode = (data[0] << 8) | data[1];
                var nibbles = [
                    data[0] >> 4, 
                    data[0] & 0xF, 
                    data[1] >> 4, 
                    data[1] & 0xF
                ];
                return {
                    opcode: opcode,
                    nibbles: nibbles,
                    bytes: data,
                    NN: data[1],
                    NNN: opcode & 0xFFF,
                    X: nibbles[1],
                    Y: nibbles[2]
                };
            };
            return Decoder;
        })();
        chip8.Decoder = Decoder;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=decoder.js.map

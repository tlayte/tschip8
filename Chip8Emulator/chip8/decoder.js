define(["require", "exports"], function(require, exports) {
    
    
    (function (chip8) {
        var Decoder = (function () {
            function Decoder(memory, registers) {
                this.memory = memory;
                this.registers = registers;
            }
            Decoder.prototype.getNext = function () {
                var nextAddress = this.registers.PC;
                var data = [
                    this.memory.read(nextAddress), 
                    this.memory.read(nextAddress + 1)
                ];
                this.registers.PC = nextAddress + 2;
                return {
                    opcode: (data[0] << 8) | data[1],
                    nibbles: [
                        data[0] >> 4, 
                        data[0] & 15, 
                        data[1] >> 4, 
                        data[1] & 15
                    ],
                    bytes: data
                };
            };
            return Decoder;
        })();
        chip8.Decoder = Decoder;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=decoder.js.map

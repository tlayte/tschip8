import memoryModule = module("chip8/memory");
import registerModule = module("chip8/registers");

export module chip8 {
    export interface Instruction {
        opcode: number;
        nibbles: number[];
        bytes: number[];
        NN: number;
        NNN: number;
    }
    export class Decoder {
        constructor(private memory: memoryModule.chip8.Memory, private registers: registerModule.chip8.Registers) { }

        getNext(): Instruction {
            var nextAddress = this.registers.PC;
            var data = [this.memory.read(nextAddress), this.memory.read(nextAddress + 1)];
            var opcode = (data[0] << 8) | data[1]
            var nibbles = [data[0] >> 4, data[0] & 0xF, data[1] >> 4, data[1] & 0xF]
            this.registers.PC = nextAddress + 2;
            return {
                opcode: opcode,
                nibbles: nibbles,
                bytes: data,
                NN: data[1],
                NNN: opcode & 0xFFF
            }
        }
    }
}
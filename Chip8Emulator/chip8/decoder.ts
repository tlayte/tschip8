import memoryModule = module("chip8/memory");
import registerModule = module("chip8/registers");

export module chip8 {
    export interface Instruction {
        opcode: number;
        nibbles: number[];
        bytes: number[];
        NN: number;
        NNN: number;
        X: number;
        Y: number;
    }
    export class Decoder {
        constructor(private memory: memoryModule.chip8.Memory, private registers: registerModule.chip8.Registers) { }

        getNext(): Instruction {
            var instruction = this.buildInstruction();
            this.registers.PC += 2;
            return instruction;
        }

        peekNext(offset: number = 0): Instruction{
            return this.buildInstruction(offset);
        }

        private buildInstruction(offset: number = 0): Instruction {
            var nextAddress = this.registers.PC + (offset * 2);
            var data = [this.memory.read(nextAddress), this.memory.read(nextAddress + 1)];
            var opcode = (data[0] << 8) | data[1];
            var nibbles = [data[0] >> 4, data[0] & 0xF, data[1] >> 4, data[1] & 0xF];
            return {
                opcode: opcode,
                nibbles: nibbles,
                bytes: data,
                NN: data[1],
                NNN: opcode & 0xFFF,
                X: nibbles[1],
                Y: nibbles[2]
            }
        }
    }
}
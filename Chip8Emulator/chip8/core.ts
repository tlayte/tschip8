import decoderModule = module("chip8/decoder");
import registerModule = module("chip8/registers");
import stackModule = module("chip8/stack");

export module chip8 {
    export class Core {
        private instructions =  [];
        private instructions8 = [];

        constructor(public registers: registerModule.chip8.Registers, public stack: stackModule.chip8.Stack) {
            this.mapInstructions();
        }

        execute(instruction: decoderModule.chip8.Instruction) {
            this.instructions[instruction.nibbles[0]].call(this,instruction);
        }

        private iRet(instruction: decoderModule.chip8.Instruction) {
            this.registers.PC = this.stack.pop();
        }
        
        private iJmp(instruction: decoderModule.chip8.Instruction) {
            this.registers.PC = instruction.NNN;
        }

        private iCall(instruction: decoderModule.chip8.Instruction) {
            this.stack.push(this.registers.PC);
            this.registers.PC = instruction.NNN;
        }

        private iSkipEqual(instruction: decoderModule.chip8.Instruction) {
            if (this.registers.read(instruction.nibbles[1]) === instruction.NN) {
                this.registers.PC += 2;
            }
        }

        private iSkipNotEqual(instruction: decoderModule.chip8.Instruction) {
            if (this.registers.read(instruction.nibbles[1]) !== instruction.NN) {
                this.registers.PC += 2;
            }
        }

        private iSkipXequalY(instruction: decoderModule.chip8.Instruction) {
            if (this.registers.read(instruction.nibbles[1]) === this.registers.read(instruction.nibbles[2])) {
                this.registers.PC += 2;
            }
        }

        private iSetX(instruction: decoderModule.chip8.Instruction) {
            this.registers.write(instruction.nibbles[1], instruction.NN);
        }

        private iAddNtoX(instruction: decoderModule.chip8.Instruction) {
            var oldValue = this.registers.read(instruction.nibbles[1]);
            this.registers.write(instruction.nibbles[1],  (oldValue + instruction.NN) & 0xff);
        }

        private branch8(instruction: decoderModule.chip8.Instruction) {
            this.instructions8[instruction.nibbles[3]].call(this, instruction);
        }

        private iSetXtoY(instruction: decoderModule.chip8.Instruction) {
            this.registers.write(instruction.nibbles[1], this.registers.read(instruction.nibbles[2]));
        }

        private iOrXwithY(instruction: decoderModule.chip8.Instruction) {
            var newValue = this.registers.read(instruction.nibbles[1]) | this.registers.read(instruction.nibbles[2]);
            this.registers.write(instruction.nibbles[1], newValue);
        }

        private iAndXwithY(instruction: decoderModule.chip8.Instruction) {
            var newValue = this.registers.read(instruction.nibbles[1]) & this.registers.read(instruction.nibbles[2]);
            this.registers.write(instruction.nibbles[1], newValue);
        }

        private iXorXwithY(instruction: decoderModule.chip8.Instruction) {
            var newValue = this.registers.read(instruction.nibbles[1]) ^ this.registers.read(instruction.nibbles[2]);
            this.registers.write(instruction.nibbles[1], newValue);
        }

        private iAddYtoXWithCarry(instruction: decoderModule.chip8.Instruction) {
            var newValue = this.registers.read(instruction.nibbles[1]) + this.registers.read(instruction.nibbles[2]);
            this.registers.vF = (newValue >> 8) > 0 ? 1 : 0;
            this.registers.write(instruction.nibbles[1], newValue & 0xff);
        }

        private iSubYfromXWithBorrow(instruction: decoderModule.chip8.Instruction) {
            var newValue = this.registers.read(instruction.nibbles[1]) - this.registers.read(instruction.nibbles[2]);
            if (newValue < 0) {
                this.registers.vF = 0;
            } else {
                this.registers.vF = 1;
            }
            this.registers.write(instruction.nibbles[1], newValue & 0xff);
        }

        private mapInstructions() {
            this.instructions[0] = this.iRet;
            this.instructions[1] = this.iJmp;
            this.instructions[2] = this.iCall;
            this.instructions[3] = this.iSkipEqual;
            this.instructions[4] = this.iSkipNotEqual;
            this.instructions[5] = this.iSkipXequalY;
            this.instructions[6] = this.iSetX;
            this.instructions[7] = this.iAddNtoX;
            this.instructions[8] = this.branch8;
            this.instructions8[0] = this.iSetXtoY;
            this.instructions8[1] = this.iOrXwithY;
            this.instructions8[2] = this.iAndXwithY;
            this.instructions8[3] = this.iXorXwithY;
            this.instructions8[4] = this.iAddYtoXWithCarry;
            this.instructions8[5] = this.iSubYfromXWithBorrow;
        }
    }
}
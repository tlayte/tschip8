import decoderModule = module("chip8/decoder");
import registerModule = module("chip8/registers");
import stackModule = module("chip8/stack");
import memoryModule = module("chip8/memory");
import timersModule = module("chip8/timers");
import screenModule = module("chip8/screen");

export module chip8 {
    export class Core {
        private instructions =  [];
        private instructions8 = [];
        private instructionsF = [];

        constructor(
                public registers: registerModule.chip8.Registers,
                public stack: stackModule.chip8.Stack,
                public memory: memoryModule.chip8.Memory,
                public timers: timersModule.chip8.Timers,
                public screen: screenModule.chip8.Screen
                ) {
            this.mapInstructions();
        }

        execute(instruction: decoderModule.chip8.Instruction) {
            this.instructions[instruction.nibbles[0]].call(this,instruction);
        }

        private iClearScreen(instruction: decoderModule.chip8.Instruction) {
            this.screen.clear();
        }

        private iRet(instruction: decoderModule.chip8.Instruction) {
            this.registers.PC = this.stack.pop();
        }
        
        private iJmp(instruction: decoderModule.chip8.Instruction) {
            this.registers.PC = instruction.NNN;
        }

        private iJmpWithAdd(instruction: decoderModule.chip8.Instruction) {
            this.registers.PC = instruction.NNN + this.registers.v0;
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

        private iSkipXYEqual(instruction: decoderModule.chip8.Instruction) {
            if (this.registers.read(instruction.nibbles[1]) === this.registers.read(instruction.nibbles[2])) {
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

        private iSubXfromYWithBorrow(instruction: decoderModule.chip8.Instruction) {
            var newValue = this.registers.read(instruction.nibbles[2]) - this.registers.read(instruction.nibbles[1]);
            if (newValue < 0) {
                this.registers.vF = 0;
            } else {
                this.registers.vF = 1;
            }
            this.registers.write(instruction.nibbles[1], newValue & 0xff);
        }

        private iShiftXRightWithCarry(instruction: decoderModule.chip8.Instruction) {
            var oldValue = this.registers.read(instruction.nibbles[1]);
            this.registers.vF = oldValue & 0x01;
            this.registers.write(instruction.nibbles[1], oldValue >> 1);
        }

        private iShiftXLeftWithCarry(instruction: decoderModule.chip8.Instruction) {
            var oldValue = this.registers.read(instruction.nibbles[1]);
            this.registers.vF = (oldValue >> 7) & 0x01;
            this.registers.write(instruction.nibbles[1], (oldValue << 1) & 0xFF);
        }

        private iSetI(instruction: decoderModule.chip8.Instruction) {
            this.registers.I = instruction.NNN;
        }

        private iRandInX(instruction: decoderModule.chip8.Instruction) {
            this.registers.write(instruction.nibbles[1], (Math.random() * 0xff) & instruction.NN);
        }

        private branchF(instruction: decoderModule.chip8.Instruction) {
            this.instructionsF[instruction.NN].call(this, instruction);
        }

        private iBCD(instruction: decoderModule.chip8.Instruction) {
            var addr = this.registers.I;
            var parts = ("000" + this.registers.read(instruction.nibbles[1]).toString(10)).substr(-3).split('');
            this.memory.write(addr, parseInt(parts[0]));
            this.memory.write(addr+1, parseInt(parts[1]));
            this.memory.write(addr+2, parseInt(parts[2]));
        }

        private iAddXtoI(instruction: decoderModule.chip8.Instruction) {
            var newValue = this.registers.I + this.registers.read(instruction.nibbles[1]);
            this.registers.vF = newValue > 0xFFF ? 1 : 0;
            this.registers.I = newValue & 0xFFF;
        }

        private iSaveRegisters(instruction: decoderModule.chip8.Instruction) {
            var addr = this.registers.I;
            var end = addr + instruction.nibbles[1];            
            for (var y = 0; addr <= end ; y++, addr++) {
                this.memory.write(addr, this.registers.read(y));
            }
            this.registers.I = addr;
        }

        private iLoadRegisters(instruction: decoderModule.chip8.Instruction) {
            var addr = this.registers.I;
            var end = addr + instruction.nibbles[1];
            for (var y = 0; addr <= end ; y++, addr++) {
                this.registers.write(y, this.memory.read(addr));
            }
            this.registers.I = addr;
        }

        private iLoadFontAddress(instruction: decoderModule.chip8.Instruction) {
            this.registers.I = this.registers.read(instruction.nibbles[1]) * 5;
        }

        private iSetXToDelay(instruction: decoderModule.chip8.Instruction) {
            this.registers.write(instruction.nibbles[1], this.timers.delay);
        }

        private iSetDelayToX(instruction: decoderModule.chip8.Instruction) {
            this.timers.delay = this.registers.read(instruction.nibbles[1]);
        }

        private iSetSoundToX(instruction: decoderModule.chip8.Instruction) {
            this.timers.sound = this.registers.read(instruction.nibbles[1]);
        }

        private branch0(instruction: decoderModule.chip8.Instruction) {
            switch (instruction.NN) {
                case 0xE0:
                    this.iClearScreen(instruction);
                    break;
                case 0xEE:
                    this.iRet(instruction);
                    break;
                default:
                    console.log("Error");
            }
        }

        private iDrawSprite(instruction: decoderModule.chip8.Instruction) {
            var sprite = [];
            var addr = this.registers.I;
            for (var i = 0; i < instruction.nibbles[3]; i++){
                sprite.push(this.memory.read(addr + i));
            }
            this.screen.draw(this.registers.read(instruction.nibbles[1]), this.registers.read(instruction.nibbles[2]), sprite);
        }


        private mapInstructions() {
            this.instructions[0x0] = this.branch0;
            this.instructions[0x1] = this.iJmp;
            this.instructions[0x2] = this.iCall;
            this.instructions[0x3] = this.iSkipEqual;
            this.instructions[0x4] = this.iSkipNotEqual;
            this.instructions[0x5] = this.iSkipXequalY;
            this.instructions[0x6] = this.iSetX;
            this.instructions[0x7] = this.iAddNtoX;
            this.instructions[0x8] = this.branch8;
            this.instructions8[0x0] = this.iSetXtoY;
            this.instructions8[0x1] = this.iOrXwithY;
            this.instructions8[0x2] = this.iAndXwithY;
            this.instructions8[0x3] = this.iXorXwithY;
            this.instructions8[0x4] = this.iAddYtoXWithCarry;
            this.instructions8[0x5] = this.iSubYfromXWithBorrow;
            this.instructions8[0x6] = this.iShiftXRightWithCarry;
            this.instructions8[0x7] = this.iSubXfromYWithBorrow;
            this.instructions8[0xE] = this.iShiftXLeftWithCarry;
            this.instructions[0x9] = this.iSkipXYEqual;
            this.instructions[0xA] = this.iSetI;
            this.instructions[0xB] = this.iJmpWithAdd;
            this.instructions[0xC] = this.iRandInX;
            this.instructions[0xD] = this.iDrawSprite;

            this.instructions[0xF] = this.branchF;
            this.instructionsF[0x07] = this.iSetXToDelay;
            this.instructionsF[0x15] = this.iSetDelayToX;
            this.instructionsF[0x18] = this.iSetSoundToX;
            this.instructionsF[0x1E] = this.iAddXtoI;
            this.instructionsF[0x29] = this.iLoadFontAddress;
            this.instructionsF[0x33] = this.iBCD;
            this.instructionsF[0x55] = this.iSaveRegisters;
            this.instructionsF[0x65] = this.iLoadRegisters;
        }

        private loadFont() {
            var font = [0xF0, 0x90, 0x90, 0x90, 0xF0, 0x20, 0x60, 0x20, 0x20, 0x70, 0xF0, 0x10, 0xF0, 0x80, 0xF0, 0xF0, 0x10, 0xF0, 0x10, 0xF0, 0x90, 0x90, 0xF0, 0x10, 0x10, 0xF0, 0x80, 0xF0, 0x10, 0xF0, 0xF0, 0x80, 0xF0, 0x90, 0xF0, 0xF0, 0x10, 0x20, 0x40, 0x40, 0xF0, 0x90, 0xF0, 0x90, 0xF0, 0xF0, 0x90, 0xF0, 0x10, 0xF0, 0xF0, 0x90, 0xF0, 0x90, 0x90, 0xE0, 0x90, 0xE0, 0x90, 0xE0, 0xF0, 0x80, 0x80, 0x80, 0xF0, 0xE0, 0x90, 0x90, 0x90, 0xE0, 0xF0, 0x80, 0xF0, 0x80, 0xF0, 0xF0, 0x80, 0xF0, 0x80, 0x80];
            this.memory.load(0, font, -1);
        }
    }
}
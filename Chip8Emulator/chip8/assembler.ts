import decoderModule = module("chip8/decoder");

export module chip8 {
    export class Disassembler{
        private instructions = [];
        private instructions8 = [];
        private instructionsF = [];

        constructor() {
            this.mapInstructions();
        }

        disassemble(instruction: decoderModule.chip8.Instruction): string {
            return this.instructions[instruction.nibbles[0]].call(this, instruction);
        }

        private iClearScreen(instruction: decoderModule.chip8.Instruction) {
            return "CLS";
        }

        private iRet(instruction: decoderModule.chip8.Instruction) {
            return "RET";
        }

        private iJmp(instruction: decoderModule.chip8.Instruction) {
            return "JP " + hexPad(instruction.NNN, 3);
        }

        private iJmpWithAdd(instruction: decoderModule.chip8.Instruction) {
            return "JP v0, " + hexPad(instruction.NNN, 3);
        }

        private iCall(instruction: decoderModule.chip8.Instruction) {
            return "CALL " + hexPad(instruction.NNN, 3);
        }

        private iSkipEqual(instruction: decoderModule.chip8.Instruction) {
            return "SE v" + hexPad(instruction.X, 1) + ", " + hexPad(instruction.NN, 2);
        }

        private iSkipXYNotEqual(instruction: decoderModule.chip8.Instruction) {
            return "SNE v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
        }

        private iSkipNotEqual(instruction: decoderModule.chip8.Instruction) {
            return "SNE v" + hexPad(instruction.X, 1) + ", " + hexPad(instruction.NN, 2);
        }

        private iSkipXequalY(instruction: decoderModule.chip8.Instruction) {
            return "SE v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
        }

        private iSetX(instruction: decoderModule.chip8.Instruction) {
            return "LD v" + hexPad(instruction.X, 1) + ", " + hexPad(instruction.NN, 2);
        }

        private iAddNtoX(instruction: decoderModule.chip8.Instruction) {
            return "ADD v" + hexPad(instruction.X, 1) + ", " + hexPad(instruction.NN, 2);
        }

        private branch8(instruction: decoderModule.chip8.Instruction) {
            return this.instructions8[instruction.nibbles[3]].call(this, instruction);
        }

        private iSetXtoY(instruction: decoderModule.chip8.Instruction) {
            return "LD v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
        }

        private iOrXwithY(instruction: decoderModule.chip8.Instruction) {
            return "OR v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1)
        }

        private iAndXwithY(instruction: decoderModule.chip8.Instruction) {
            return "AND v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1)
        }

        private iXorXwithY(instruction: decoderModule.chip8.Instruction) {
            return "XOR v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1)
        }

        private iAddYtoXWithCarry(instruction: decoderModule.chip8.Instruction) {
            return "ADD v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
        }

        private iSubYfromXWithBorrow(instruction: decoderModule.chip8.Instruction) {
            return "SUB v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
        }

        private iSubXfromYWithBorrow(instruction: decoderModule.chip8.Instruction) {
            return "SUBN v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
        }

        private iShiftXRightWithCarry(instruction: decoderModule.chip8.Instruction) {
            return "SHR v" + hexPad(instruction.X, 1);
        }

        private iShiftXLeftWithCarry(instruction: decoderModule.chip8.Instruction) {
            return "SHL v" + hexPad(instruction.X, 1);
        }

        private iSetI(instruction: decoderModule.chip8.Instruction) {
            return "LD I, " + hexPad(instruction.NNN, 3);
        }

        private iRandInX(instruction: decoderModule.chip8.Instruction) {
            return "RND v" + hexPad(instruction.X, 1) + ", " + hexPad(instruction.NN, 2);
        }

        private branchF(instruction: decoderModule.chip8.Instruction) {
            return this.instructionsF[instruction.NN].call(this, instruction);
        }

        private iBCD(instruction: decoderModule.chip8.Instruction) {
            return "LD B, v" + hexPad(instruction.X, 1);
        }

        private iAddXtoI(instruction: decoderModule.chip8.Instruction) {
            return "ADD I, v" + hexPad(instruction.X, 1);
        }

        private iSaveRegisters(instruction: decoderModule.chip8.Instruction) {
            return "LD [I], v" + hexPad(instruction.X, 1);
        }

        private iLoadRegisters(instruction: decoderModule.chip8.Instruction) {
            return "LD v" + hexPad(instruction.X, 1) + ", [I]";
        }

        private iLoadFontAddress(instruction: decoderModule.chip8.Instruction) {
            return "LD F, v" + hexPad(instruction.X, 1);
        }

        private iSetXToDelay(instruction: decoderModule.chip8.Instruction) {
            return "LD v" + hexPad(instruction.X, 1) + ", DT";
        }

        private iSetDelayToX(instruction: decoderModule.chip8.Instruction) {
            return "LD DT, v" + hexPad(instruction.X, 1);
        }

        private iSetSoundToX(instruction: decoderModule.chip8.Instruction) {
            return "LD ST, v" + hexPad(instruction.X, 1);
        }

        private branch0(instruction: decoderModule.chip8.Instruction) {
            switch (instruction.NN) {
                case 0xE0:
                    return this.iClearScreen(instruction);
                case 0xEE:
                    return this.iRet(instruction);
                default:
                    return "SYS " + hexPad(instruction.NNN, 3);
            }
        }

        private iDrawSprite(instruction: decoderModule.chip8.Instruction) {
            return "DRW v" + hexPad(instruction.X, 1), + ", v" + hexPad(instruction.Y, 1) + ", " + hexPad(instruction.nibbles[3], 1);
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
            this.instructions[0x9] = this.iSkipXYNotEqual;
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
    }

    function hexPad(value, size) {
        return ("00000000" + value.toString(16).toUpperCase()).substr(size * -1);
    }
}
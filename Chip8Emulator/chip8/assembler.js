define(["require", "exports"], function(require, exports) {
    
    (function (chip8) {
        var Disassembler = (function () {
            function Disassembler() {
                this.instructions = [];
                this.instructions8 = [];
                this.instructionsF = [];
                this.mapInstructions();
            }
            Disassembler.prototype.disassemble = function (instruction) {
                var result;
                try  {
                    result = this.instructions[instruction.nibbles[0]].call(this, instruction);
                } catch (ex) {
                    result = "-----";
                }
                return result;
            };
            Disassembler.prototype.iClearScreen = function (instruction) {
                return "CLS";
            };
            Disassembler.prototype.iRet = function (instruction) {
                return "RET";
            };
            Disassembler.prototype.iJmp = function (instruction) {
                return "JP " + hexPad(instruction.NNN, 3);
            };
            Disassembler.prototype.iJmpWithAdd = function (instruction) {
                return "JP v0, " + hexPad(instruction.NNN, 3);
            };
            Disassembler.prototype.iCall = function (instruction) {
                return "CALL " + hexPad(instruction.NNN, 3);
            };
            Disassembler.prototype.iSkipEqual = function (instruction) {
                return "SE v" + hexPad(instruction.X, 1) + ", " + hexPad(instruction.NN, 2);
            };
            Disassembler.prototype.iSkipXYNotEqual = function (instruction) {
                return "SNE v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
            };
            Disassembler.prototype.iSkipNotEqual = function (instruction) {
                return "SNE v" + hexPad(instruction.X, 1) + ", " + hexPad(instruction.NN, 2);
            };
            Disassembler.prototype.iSkipXequalY = function (instruction) {
                return "SE v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
            };
            Disassembler.prototype.iSetX = function (instruction) {
                return "LD v" + hexPad(instruction.X, 1) + ", " + hexPad(instruction.NN, 2);
            };
            Disassembler.prototype.iAddNtoX = function (instruction) {
                return "ADD v" + hexPad(instruction.X, 1) + ", " + hexPad(instruction.NN, 2);
            };
            Disassembler.prototype.branch8 = function (instruction) {
                return this.instructions8[instruction.nibbles[3]].call(this, instruction);
            };
            Disassembler.prototype.iSetXtoY = function (instruction) {
                return "LD v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
            };
            Disassembler.prototype.iOrXwithY = function (instruction) {
                return "OR v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
            };
            Disassembler.prototype.iAndXwithY = function (instruction) {
                return "AND v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
            };
            Disassembler.prototype.iXorXwithY = function (instruction) {
                return "XOR v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
            };
            Disassembler.prototype.iAddYtoXWithCarry = function (instruction) {
                return "ADD v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
            };
            Disassembler.prototype.iSubYfromXWithBorrow = function (instruction) {
                return "SUB v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
            };
            Disassembler.prototype.iSubXfromYWithBorrow = function (instruction) {
                return "SUBN v" + hexPad(instruction.X, 1) + ", v" + hexPad(instruction.Y, 1);
            };
            Disassembler.prototype.iShiftXRightWithCarry = function (instruction) {
                return "SHR v" + hexPad(instruction.X, 1);
            };
            Disassembler.prototype.iShiftXLeftWithCarry = function (instruction) {
                return "SHL v" + hexPad(instruction.X, 1);
            };
            Disassembler.prototype.iSetI = function (instruction) {
                return "LD I, " + hexPad(instruction.NNN, 3);
            };
            Disassembler.prototype.iRandInX = function (instruction) {
                return "RND v" + hexPad(instruction.X, 1) + ", " + hexPad(instruction.NN, 2);
            };
            Disassembler.prototype.branchF = function (instruction) {
                return this.instructionsF[instruction.NN].call(this, instruction);
            };
            Disassembler.prototype.iBCD = function (instruction) {
                return "LD B, v" + hexPad(instruction.X, 1);
            };
            Disassembler.prototype.iAddXtoI = function (instruction) {
                return "ADD I, v" + hexPad(instruction.X, 1);
            };
            Disassembler.prototype.iSaveRegisters = function (instruction) {
                return "LD [I], v" + hexPad(instruction.X, 1);
            };
            Disassembler.prototype.iLoadRegisters = function (instruction) {
                return "LD v" + hexPad(instruction.X, 1) + ", [I]";
            };
            Disassembler.prototype.iLoadFontAddress = function (instruction) {
                return "LD F, v" + hexPad(instruction.X, 1);
            };
            Disassembler.prototype.iSetXToDelay = function (instruction) {
                return "LD v" + hexPad(instruction.X, 1) + ", DT";
            };
            Disassembler.prototype.iSetDelayToX = function (instruction) {
                return "LD DT, v" + hexPad(instruction.X, 1);
            };
            Disassembler.prototype.iSetSoundToX = function (instruction) {
                return "LD ST, v" + hexPad(instruction.X, 1);
            };
            Disassembler.prototype.branch0 = function (instruction) {
                switch(instruction.NN) {
                    case 0xE0:
                        return this.iClearScreen(instruction);
                    case 0xEE:
                        return this.iRet(instruction);
                    default:
                        return instruction.NNN === 0 ? "-------" : "SYS " + hexPad(instruction.NNN, 3);
                }
            };
            Disassembler.prototype.iDrawSprite = function (instruction) {
                return "DRW v" + hexPad(instruction.X, 1) , +", v" + hexPad(instruction.Y, 1) + ", " + hexPad(instruction.nibbles[3], 1);
            };
            Disassembler.prototype.mapInstructions = function () {
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
            };
            return Disassembler;
        })();
        chip8.Disassembler = Disassembler;        
        function hexPad(value, size) {
            return ("00000000" + value.toString(16).toUpperCase()).substr(size * -1);
        }
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=assembler.js.map

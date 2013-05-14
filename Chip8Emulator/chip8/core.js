define(["require", "exports"], function(require, exports) {
    
    
    
    (function (chip8) {
        var Core = (function () {
            function Core(registers, stack) {
                this.registers = registers;
                this.stack = stack;
                this.instructions = [];
                this.instructions8 = [];
                this.mapInstructions();
            }
            Core.prototype.execute = function (instruction) {
                this.instructions[instruction.nibbles[0]].call(this, instruction);
            };
            Core.prototype.iRet = function (instruction) {
                this.registers.PC = this.stack.pop();
            };
            Core.prototype.iJmp = function (instruction) {
                this.registers.PC = instruction.NNN;
            };
            Core.prototype.iCall = function (instruction) {
                this.stack.push(this.registers.PC);
                this.registers.PC = instruction.NNN;
            };
            Core.prototype.iSkipEqual = function (instruction) {
                if(this.registers.read(instruction.nibbles[1]) === instruction.NN) {
                    this.registers.PC += 2;
                }
            };
            Core.prototype.iSkipNotEqual = function (instruction) {
                if(this.registers.read(instruction.nibbles[1]) !== instruction.NN) {
                    this.registers.PC += 2;
                }
            };
            Core.prototype.iSkipXequalY = function (instruction) {
                if(this.registers.read(instruction.nibbles[1]) === this.registers.read(instruction.nibbles[2])) {
                    this.registers.PC += 2;
                }
            };
            Core.prototype.iSetX = function (instruction) {
                this.registers.write(instruction.nibbles[1], instruction.NN);
            };
            Core.prototype.iAddNtoX = function (instruction) {
                var oldValue = this.registers.read(instruction.nibbles[1]);
                this.registers.write(instruction.nibbles[1], (oldValue + instruction.NN) & 255);
            };
            Core.prototype.branch8 = function (instruction) {
                this.instructions8[instruction.nibbles[3]].call(this, instruction);
            };
            Core.prototype.iSetXtoY = function (instruction) {
                this.registers.write(instruction.nibbles[1], this.registers.read(instruction.nibbles[2]));
            };
            Core.prototype.iOrXwithY = function (instruction) {
                var newValue = this.registers.read(instruction.nibbles[1]) | this.registers.read(instruction.nibbles[2]);
                this.registers.write(instruction.nibbles[1], newValue);
            };
            Core.prototype.iAndXwithY = function (instruction) {
                var newValue = this.registers.read(instruction.nibbles[1]) & this.registers.read(instruction.nibbles[2]);
                this.registers.write(instruction.nibbles[1], newValue);
            };
            Core.prototype.iXorXwithY = function (instruction) {
                var newValue = this.registers.read(instruction.nibbles[1]) ^ this.registers.read(instruction.nibbles[2]);
                this.registers.write(instruction.nibbles[1], newValue);
            };
            Core.prototype.iAddYtoXWithCarry = function (instruction) {
                var newValue = this.registers.read(instruction.nibbles[1]) + this.registers.read(instruction.nibbles[2]);
                this.registers.vF = (newValue >> 8) > 0 ? 1 : 0;
                this.registers.write(instruction.nibbles[1], newValue & 255);
            };
            Core.prototype.iSubYfromXWithBorrow = function (instruction) {
                var newValue = this.registers.read(instruction.nibbles[1]) - this.registers.read(instruction.nibbles[2]);
                if(newValue < 0) {
                    this.registers.vF = 0;
                } else {
                    this.registers.vF = 1;
                }
                this.registers.write(instruction.nibbles[1], newValue & 255);
            };
            Core.prototype.mapInstructions = function () {
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
            };
            return Core;
        })();
        chip8.Core = Core;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=core.js.map

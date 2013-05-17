define(["require", "exports"], function(require, exports) {
    
    
    
    
    
    
    
    (function (chip8) {
        var Core = (function () {
            function Core(registers, stack, memory, timers, screen, keypad) {
                this.registers = registers;
                this.stack = stack;
                this.memory = memory;
                this.timers = timers;
                this.screen = screen;
                this.keypad = keypad;
                this.instructions = [];
                this.instructions8 = [];
                this.instructionsF = [];
                this.halted = false;
                this.mapInstructions();
                this.keypad.onKeyDown.subscribe(this.keyDown.bind(this));
            }
            Core.prototype.keyDown = function (key) {
                if(this.halted) {
                    this.registers.write(this.keypressTarget, key);
                    this.halted = false;
                }
            };
            Core.prototype.execute = function (instruction) {
                this.instructions[instruction.nibbles[0]].call(this, instruction);
            };
            Core.prototype.iClearScreen = function (instruction) {
                this.screen.clear();
            };
            Core.prototype.iRet = function (instruction) {
                this.registers.PC = this.stack.pop();
            };
            Core.prototype.iJmp = function (instruction) {
                this.registers.PC = instruction.NNN;
            };
            Core.prototype.iJmpWithAdd = function (instruction) {
                this.registers.PC = instruction.NNN + this.registers.v0;
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
            Core.prototype.iSkipXYNotEqual = function (instruction) {
                if(this.registers.read(instruction.nibbles[1]) !== this.registers.read(instruction.nibbles[2])) {
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
                this.registers.write(instruction.nibbles[1], (oldValue + instruction.NN) & 0xff);
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
                this.registers.write(instruction.nibbles[1], newValue & 0xff);
            };
            Core.prototype.iSubYfromXWithBorrow = function (instruction) {
                var newValue = this.registers.read(instruction.nibbles[1]) - this.registers.read(instruction.nibbles[2]);
                if(newValue < 0) {
                    this.registers.vF = 0;
                } else {
                    this.registers.vF = 1;
                }
                this.registers.write(instruction.nibbles[1], newValue & 0xff);
            };
            Core.prototype.iSubXfromYWithBorrow = function (instruction) {
                var newValue = this.registers.read(instruction.nibbles[2]) - this.registers.read(instruction.nibbles[1]);
                if(newValue < 0) {
                    this.registers.vF = 0;
                } else {
                    this.registers.vF = 1;
                }
                this.registers.write(instruction.nibbles[1], newValue & 0xff);
            };
            Core.prototype.iShiftXRightWithCarry = function (instruction) {
                var oldValue = this.registers.read(instruction.nibbles[2]);
                this.registers.vF = oldValue & 0x01;
                this.registers.write(instruction.nibbles[1], oldValue >> 1);
            };
            Core.prototype.iShiftXLeftWithCarry = function (instruction) {
                var oldValue = this.registers.read(instruction.nibbles[2]);
                this.registers.vF = (oldValue >> 7) & 0x01;
                this.registers.write(instruction.nibbles[1], (oldValue << 1) & 0xFF);
            };
            Core.prototype.iSetI = function (instruction) {
                this.registers.I = instruction.NNN;
            };
            Core.prototype.iRandInX = function (instruction) {
                this.registers.write(instruction.nibbles[1], (Math.random() * 0xff) & instruction.NN);
            };
            Core.prototype.branchF = function (instruction) {
                this.instructionsF[instruction.NN].call(this, instruction);
            };
            Core.prototype.iBCD = function (instruction) {
                var addr = this.registers.I;
                var parts = ("000" + this.registers.read(instruction.nibbles[1]).toString(10)).substr(-3).split('');
                this.memory.write(addr, parseInt(parts[0]));
                this.memory.write(addr + 1, parseInt(parts[1]));
                this.memory.write(addr + 2, parseInt(parts[2]));
            };
            Core.prototype.iAddXtoI = function (instruction) {
                var newValue = this.registers.I + this.registers.read(instruction.nibbles[1]);
                this.registers.vF = newValue > 0xFFF ? 1 : 0;
                this.registers.I = newValue & 0xFFF;
            };
            Core.prototype.iSaveRegisters = function (instruction) {
                var addr = this.registers.I;
                var end = addr + instruction.nibbles[1];
                for(var y = 0; addr <= end; y++ , addr++) {
                    this.memory.write(addr, this.registers.read(y));
                }
                this.registers.I = addr;
            };
            Core.prototype.iLoadRegisters = function (instruction) {
                var addr = this.registers.I;
                var end = addr + instruction.nibbles[1];
                for(var y = 0; addr <= end; y++ , addr++) {
                    this.registers.write(y, this.memory.read(addr));
                }
                this.registers.I = addr;
            };
            Core.prototype.iLoadFontAddress = function (instruction) {
                this.registers.I = this.registers.read(instruction.nibbles[1]) * 5;
            };
            Core.prototype.iSetXToDelay = function (instruction) {
                this.registers.write(instruction.nibbles[1], this.timers.delay);
            };
            Core.prototype.iSetDelayToX = function (instruction) {
                this.timers.delay = this.registers.read(instruction.nibbles[1]);
            };
            Core.prototype.iSetSoundToX = function (instruction) {
                this.timers.sound = this.registers.read(instruction.nibbles[1]);
            };
            Core.prototype.branch0 = function (instruction) {
                switch(instruction.NN) {
                    case 0xE0:
                        this.iClearScreen(instruction);
                        break;
                    case 0xEE:
                        this.iRet(instruction);
                        break;
                    default:
                        console.log("Error");
                }
            };
            Core.prototype.iDrawSprite = function (instruction) {
                var sprite = [];
                var addr = this.registers.I;
                for(var i = 0; i < instruction.nibbles[3]; i++) {
                    sprite.push(this.memory.read(addr + i));
                }
                var result = this.screen.draw(this.registers.read(instruction.nibbles[1]), this.registers.read(instruction.nibbles[2]), sprite);
                this.registers.vF = result;
            };
            Core.prototype.iSkipOnKeyState = function (instruction) {
                var keyState = this.keypad.read(this.registers.read(instruction.X));
                if(!!keyState != (instruction.NN == 0xA1)) {
                    this.registers.PC += 2;
                }
            };
            Core.prototype.iAwaitKey = function (instruction) {
                this.halted = true;
                this.keypressTarget = instruction.X;
            };
            Core.prototype.mapInstructions = function () {
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
                this.instructions[0xE] = this.iSkipOnKeyState;
                this.instructions[0xF] = this.branchF;
                this.instructionsF[0x07] = this.iSetXToDelay;
                this.instructionsF[0x0A] = this.iAwaitKey;
                this.instructionsF[0x15] = this.iSetDelayToX;
                this.instructionsF[0x18] = this.iSetSoundToX;
                this.instructionsF[0x1E] = this.iAddXtoI;
                this.instructionsF[0x29] = this.iLoadFontAddress;
                this.instructionsF[0x33] = this.iBCD;
                this.instructionsF[0x55] = this.iSaveRegisters;
                this.instructionsF[0x65] = this.iLoadRegisters;
            };
            Core.prototype.loadFont = function () {
                var font = [
                    0xF0, 
                    0x90, 
                    0x90, 
                    0x90, 
                    0xF0, 
                    0x20, 
                    0x60, 
                    0x20, 
                    0x20, 
                    0x70, 
                    0xF0, 
                    0x10, 
                    0xF0, 
                    0x80, 
                    0xF0, 
                    0xF0, 
                    0x10, 
                    0xF0, 
                    0x10, 
                    0xF0, 
                    0x90, 
                    0x90, 
                    0xF0, 
                    0x10, 
                    0x10, 
                    0xF0, 
                    0x80, 
                    0xF0, 
                    0x10, 
                    0xF0, 
                    0xF0, 
                    0x80, 
                    0xF0, 
                    0x90, 
                    0xF0, 
                    0xF0, 
                    0x10, 
                    0x20, 
                    0x40, 
                    0x40, 
                    0xF0, 
                    0x90, 
                    0xF0, 
                    0x90, 
                    0xF0, 
                    0xF0, 
                    0x90, 
                    0xF0, 
                    0x10, 
                    0xF0, 
                    0xF0, 
                    0x90, 
                    0xF0, 
                    0x90, 
                    0x90, 
                    0xE0, 
                    0x90, 
                    0xE0, 
                    0x90, 
                    0xE0, 
                    0xF0, 
                    0x80, 
                    0x80, 
                    0x80, 
                    0xF0, 
                    0xE0, 
                    0x90, 
                    0x90, 
                    0x90, 
                    0xE0, 
                    0xF0, 
                    0x80, 
                    0xF0, 
                    0x80, 
                    0xF0, 
                    0xF0, 
                    0x80, 
                    0xF0, 
                    0x80, 
                    0x80
                ];
                this.memory.load(0, font, -1);
            };
            return Core;
        })();
        chip8.Core = Core;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=core.js.map

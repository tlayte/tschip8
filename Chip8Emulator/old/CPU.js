define(["require", "exports", "old/Events"], function(require, exports, __ev__) {
    var ev = __ev__;

    var Cpu = (function () {
        function Cpu() {
            this.memory = [];
            this.registers = [];
            this.keys = [];
            this.stack = [];
            this.debug_registers = ko.observableArray();
            this.debug_pc = ko.observable();
            this.debug_i = ko.observable();
            this.debug_sp = ko.observable();
            this.debug_stack = ko.observable();
            this.debug_next = ko.observable();
            this.ClearScreen = new ev.Event();
            this.DrawSprite = new ev.Event();
            this.onWrite = new ev.Event();
            this.onRegisterChange = new ev.Event();
            this.onHalt = new ev.Event();
            this.stopSound = new ev.Event();
            this.startSound = new ev.Event();
            this.instructions = [];
            this.instructions8 = [];
            this.instructionsF = [];
            this.loadInstructions();
            this.reset();
        }
        Cpu.prototype.reset = function () {
            zeroArray(this.registers, 16);
            zeroArray(this.memory, 4096);
            zeroArray(this.stack, 16);
            fillArray(this.keys, 16, false);
            this.I = 0;
            this.PC = 512;
            this.SP = 0;
            this.delay = 0;
            this.sound = 0;
            this.updateDebug();
            this.stopSound.raise();
        };
        Cpu.prototype.cycle = function () {
            var opcode = this.readOpcode();
            var MSN = getNibble1(opcode);
            this.instructions[MSN](opcode & 4095);
            this.updateDebug();
        };
        Cpu.prototype.tick = function () {
            if(this.delay > 0) {
                this.delay--;
            }
            if(this.sound > 0) {
                this.sound--;
            } else {
                this.stopSound.raise();
            }
        };
        Cpu.prototype.loadInstructions = function () {
            var _this = this;
            this.instructions[0] = function (data) {
                switch(data) {
                    case 224:
                        _this.ClearScreen.raise();
                        break;
                    case 238:
                        _this.PC = _this.pop();
                        break;
                    default:
                        _this.onHalt.raise(data);
                        console.log("Not implemented");
                }
            };
            this.instructions[1] = function (data) {
                _this.PC = data;
            };
            this.instructions[2] = function (data) {
                _this.push(_this.PC);
                _this.PC = data;
            };
            this.instructions[3] = function (data) {
                var register = _this.registers[getNibble2(data)];
                if(register === (data & 255)) {
                    _this.moveNext();
                }
            };
            this.instructions[4] = function (data) {
                var register = _this.registers[getNibble2(data)];
                if(register !== (data & 255)) {
                    _this.moveNext();
                }
            };
            this.instructions[5] = function (data) {
                var register1 = _this.registers[getNibble2(data)];
                var register2 = _this.registers[getNibble3(data)];
                if(register1 === register2) {
                    _this.moveNext();
                }
            };
            this.instructions[6] = function (data) {
                var register = getNibble2(data);
                _this.registers[register] = (data & 255);
            };
            this.instructions[7] = function (data) {
                var register = getNibble2(data);
                _this.registers[register] += (data & 255);
            };
            this.instructions[8] = function (data) {
                var nibbles = toNibbles(data);
                _this.instructions8[nibbles[3]](nibbles[1], nibbles[2]);
            };
            this.instructions8[0] = function (x, y) {
                _this.registers[x] = _this.registers[y];
            };
            this.instructions8[1] = function (x, y) {
                _this.registers[x] |= _this.registers[y];
            };
            this.instructions8[2] = function (x, y) {
                _this.registers[x] &= _this.registers[y];
            };
            this.instructions8[3] = function (x, y) {
                _this.registers[x] ^= _this.registers[y];
            };
            this.instructions8[4] = function (x, y) {
                var result = _this.registers[x] + _this.registers[y];
                _this.registers[15] = result & 65536;
                _this.registers[x] = result & 65535;
            };
            this.instructions8[5] = function (x, y) {
                var result = _this.registers[x] - _this.registers[y];
                if(result < 0) {
                    result += 65536;
                    _this.registers[15] = 1;
                } else {
                    _this.registers[15] = 0;
                }
                _this.registers[x] = result;
            };
            this.instructions8[6] = function (x, y) {
                _this.registers[15] = _this.registers[x] & 1;
                _this.registers[x] >>= 1;
            };
            this.instructions8[7] = function (x, y) {
                var result = _this.registers[y] - _this.registers[x];
                if(result < 0) {
                    result += 65536;
                    _this.registers[15] = 1;
                } else {
                    _this.registers[15] = 0;
                }
                _this.registers[x] = result;
            };
            this.instructions8[14] = function (x, y) {
                _this.registers[15] = (_this.registers[x] >> 15) & 1;
                _this.registers[x] <<= 1;
            };
            this.instructions[9] = function (data) {
                if(_this.registers[getNibble2(data)] !== _this.registers[getNibble3(data)]) {
                    _this.moveNext();
                }
            };
            this.instructions[10] = function (data) {
                _this.I = data & 4095;
            };
            this.instructions[11] = function (data) {
                _this.PC = _this.registers[0] + (data & 4095);
            };
            this.instructions[12] = function (data) {
                var random = Math.random() * 65535;
                _this.registers[getNibble2(data)] = random & 255;
            };
            this.instructions[13] = function (data) {
                var nibbles = toNibbles(data);
                var x = _this.registers[nibbles[1]];
                var y = _this.registers[nibbles[2]];
                var height = nibbles[3];
            };
            this.instructions[14] = function (data) {
                var x = getNibble2(data);
                switch(data & 255) {
                    case 158:
                        if(_this.keys[x]) {
                            _this.moveNext();
                        }
                        break;
                    case 161:
                        if(!_this.keys[x]) {
                            _this.moveNext();
                        }
                        break;
                }
            };
            this.instructions[15] = function (data) {
                var subcode = data & 255;
                _this.instructionsF[subcode](getNibble2(data));
            };
            this.instructionsF[7] = function (x) {
                _this.registers[x] = _this.delay;
            };
            this.instructionsF[10] = function (x) {
                throw "FX07 not implemented";
            };
            this.instructionsF[21] = function (x) {
                _this.delay = _this.registers[x];
            };
            this.instructionsF[24] = function (x) {
                _this.sound = _this.registers[x];
                if(_this.sound > 0) {
                    _this.startSound.raise();
                }
            };
            this.instructionsF[30] = function (x) {
                _this.I += _this.registers[x];
            };
            this.instructionsF[41] = function (x) {
            };
            this.instructionsF[51] = function (x) {
            };
            this.instructionsF[85] = function (x) {
                var end = _this.I + x;
                for(var y = 0; _this.I <= end; y++ , _this.I++) {
                    _this.write(_this.I, _this.registers[y]);
                }
            };
            this.instructionsF[101] = function (x) {
                var end = _this.I + x;
                for(var y = 0; _this.I <= end; y++ , _this.I++) {
                    _this.registers[y] = _this.read(_this.I);
                }
            };
        };
        Cpu.prototype.pop = function () {
            if(this.SP === 0) {
                throw "Stack underflow";
            }
            return this.stack[--this.SP];
        };
        Cpu.prototype.push = function (value) {
            if(this.SP === 16) {
                throw "Stack overflow";
            }
            this.stack[this.SP++] = value;
        };
        Cpu.prototype.readOpcode = function () {
            var opcode = (this.read(this.PC) << 8) | this.read(this.PC + 1);
            this.moveNext();
            return opcode;
        };
        Cpu.prototype.moveNext = function () {
            this.PC += 2;
        };
        Cpu.prototype.read = function (address) {
            if(address > 4095) {
                throw "Address (" + address + ") is out of range";
            }
            return this.memory[address];
        };
        Cpu.prototype.write = function (address, value) {
            if(address > 4095) {
                throw "Address (" + address + ") is out of range";
            }
            this.memory[address] = value;
        };
        Cpu.prototype.updateDebug = function () {
            this.debug_registers(this.registers.map(function (value, index) {
                return {
                    index: index.toString(16).toUpperCase(),
                    value: value.toString(16).toUpperCase()
                };
            }));
            this.debug_i(this.I.toString(16).toUpperCase());
            this.debug_pc(this.PC.toString(16).toUpperCase());
            this.debug_sp(this.SP.toString(16).toUpperCase());
            this.debug_next(displayByte(this.memory[this.PC]) + displayByte(this.memory[this.PC + 1]));
        };
        return Cpu;
    })();
    exports.Cpu = Cpu;    
    function displayByte(byte) {
        return ("00" + byte.toString(16).toUpperCase()).substr(-2);
    }
    exports.displayByte = displayByte;
    function getNibble1(opcode) {
        return (opcode & 61440) >> 12;
    }
    function getNibble2(opcode) {
        return (opcode & 3840) >> 8;
    }
    function getNibble3(opcode) {
        return (opcode & 240) >> 4;
    }
    function getNibble4(opcode) {
        return (opcode & 15);
    }
    function toNibbles(opcode) {
        var nibbles = [];
        nibbles[3] = opcode & 15;
        opcode >>= 4;
        nibbles[2] = opcode & 15;
        opcode >>= 4;
        nibbles[1] = opcode & 15;
        opcode >>= 4;
        nibbles[0] = opcode & 15;
        return nibbles;
    }
    function fillArray(array, size, value) {
        for(var i = 0; i < size; i++) {
            array[i] = value;
        }
    }
    function zeroArray(array, size) {
        fillArray(array, size, 0);
    }
})
//@ sourceMappingURL=CPU.js.map

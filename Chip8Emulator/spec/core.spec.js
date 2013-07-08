define(["require", "exports", "chip8/core"], function(require, exports, __coreModule__) {
    var coreModule = __coreModule__;

    var Chip8 = coreModule.chip8;
    
    (function (chip8) {
        (function (spec) {
            describe("A chip-8 core", function () {
                var core;
                var registers;
                var memory;
                var stack;
                var timers;
                var screen;
                var keypad;
                beforeEach(function () {
                    registers = createRegisterSpy();
                    stack = createStackSpy();
                    memory = createMemorySpy();
                    timers = createTimersSpy();
                    screen = createScreenSpy();
                    keypad = createKeypadSpy();
                    core = new Chip8.Core(registers, stack, memory, timers, screen, keypad);
                });
                describe('executing the 00E0 - clear screen instruction', function () {
                    beforeEach(function () {
                        core.execute(createInstruction(0x00, 0xE0));
                    });
                    it('should clear the screen', function () {
                        expect(screen.clear).toHaveBeenCalled();
                    });
                });
                describe('executing the 00EE - return instruction', function () {
                    describe('with a return address of 0x600', function () {
                        beforeEach(function () {
                            stack.pop.andReturn(0x600);
                            core.execute(createInstruction(0x00, 0xEE));
                        });
                        it('should set the PC register to 0x600', function () {
                            expect(registers.write).toHaveBeenCalledWith("PC", 0x600);
                        });
                    });
                });
                describe('executing the 1NNN - jmp instruction', function () {
                    describe('with the address 0xF63', function () {
                        beforeEach(function () {
                            core.execute(createInstruction(0x1F, 0x63));
                        });
                        it('should set the PC register to 0xF63', function () {
                            expect(registers.write).toHaveBeenCalledWith("PC", 0xF63);
                        });
                    });
                });
                describe('executing the 2NNN - call instruction', function () {
                    describe('with a current PC of 0x210 and a target address of 0x32F', function () {
                        beforeEach(function () {
                            registers.fakeValues({
                                "PC": 0x210
                            });
                            core.execute(createInstruction(0x23, 0x2F));
                        });
                        it('should set the PC register to 0x32F', function () {
                            expect(registers.write).toHaveBeenCalledWith("PC", 0x32F);
                        });
                        it('should push 0x210 on to the stack', function () {
                            expect(stack.push).toHaveBeenCalledWith(0x210);
                        });
                    });
                });
                describe('executing the 3XNN - skip if equal instruction', function () {
                    describe('with a PC of 0x200 and register 1 set to 0x2f', function () {
                        beforeEach(function () {
                            registers.fakeValues({
                                1: 0x2f,
                                "PC": 0x200
                            });
                            registers.write.reset();
                        });
                        describe('when checking for a matching value (0x2F)', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x31, 0x2F));
                            });
                            it('should set the PC register to 0x202', function () {
                                expect(registers.write).toHaveBeenCalledWith("PC", 0x202);
                            });
                        });
                        describe('when checking for a non matching value (0x11)', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x31, 0x11));
                            });
                            it('should not change the PC register', function () {
                                expect(registers.write).not.toHaveBeenCalledWith("PC", 0x202);
                            });
                        });
                    });
                });
                describe('executing the 4XNN - skip if not equal instruction', function () {
                    beforeEach(function () {
                        registers.fakeValues({
                            1: 0x2f,
                            "PC": 0x200
                        });
                        registers.write.reset();
                    });
                    describe('when checking for a matching value', function () {
                        beforeEach(function () {
                            core.execute(createInstruction(0x41, 0x2F));
                        });
                        it('should not change the PC register', function () {
                            expect(registers.write).not.toHaveBeenCalledWith("PC", 0x202);
                        });
                    });
                    describe('when checking for a non matching value (0x11)', function () {
                        beforeEach(function () {
                            core.execute(createInstruction(0x41, 0x11));
                        });
                        it('should set the PC register to 0x202', function () {
                            expect(registers.write).toHaveBeenCalledWith("PC", 0x202);
                        });
                    });
                });
                describe('executing the 5XY0 - skip if X equal Y instruction', function () {
                    describe('with register values of 1 = 0x2f, 2 = 0x2f, 3 = 0x11 and a PC of 0x200', function () {
                        beforeEach(function () {
                            registers.fakeValues({
                                1: 0x2f,
                                2: 0x2f,
                                3: 0x11,
                                "PC": 0x200
                            });
                            registers.write.reset();
                        });
                        describe('when checking two matching registers (1 and 2)', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x51, 0x20));
                            });
                            it('should set the PC register to 0x202', function () {
                                expect(registers.write).toHaveBeenCalledWith("PC", 0x202);
                            });
                        });
                        describe('when checking two non matching registers (1 and 3)', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x51, 0x30));
                            });
                            it('should not change the PC register', function () {
                                expect(registers.write).not.toHaveBeenCalledWith("PC", 0x202);
                            });
                        });
                    });
                });
                describe('executing the 6XNN - set X to NN instruction', function () {
                    describe('with a value of 0xF0 and a target of register 1', function () {
                        beforeEach(function () {
                            core.execute(createInstruction(0x61, 0xF0));
                        });
                        it('should set register 1 to 0xF0', function () {
                            expect(registers.write).toHaveBeenCalledWith(1, 0xF0);
                        });
                    });
                });
                describe('executing the 7XNN - add NN to X instruction', function () {
                    describe('with the register values 1 = 0x20, 2 = 0x5', function () {
                        beforeEach(function () {
                            registers.fakeValues({
                                1: 0x20,
                                2: 0x5
                            });
                            registers.write.reset();
                        });
                        describe('when adding 0x25 to register 1', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x71, 0x25));
                            });
                            it('should set register 1 to 0x45', function () {
                                expect(registers.write).toHaveBeenCalledWith(1, 0x45);
                            });
                        });
                        describe('when adding 0x3 to register 2', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x72, 0x03));
                            });
                            it('should set register 2 to 0x8', function () {
                                expect(registers.write).toHaveBeenCalledWith(2, 0x08);
                            });
                        });
                        describe('when adding 0xFF to register 1', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x71, 0xFF));
                            });
                            it('should wrap around and set regist 1 to 0x1F', function () {
                                expect(registers.write).toHaveBeenCalledWith(1, 0x1F);
                            });
                        });
                    });
                });
                describe('executing the 8XY0 - set X to Y instruction', function () {
                    describe('with register 5 set to 0x6A', function () {
                        beforeEach(function () {
                            registers.fakeValues({
                                5: 0x6A
                            });
                        });
                        describe('with a source of register 5 and a target of register 1', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x81, 0x50));
                            });
                            it('should set register 1 to 0x6A', function () {
                                expect(registers.write).toHaveBeenCalledWith(1, 0x6A);
                            });
                        });
                    });
                });
                describe('executing the 8XY1 - set X to X or Y instruction', function () {
                    describe('with register values of 1 = 0x0F, 3 = 0x70', function () {
                        beforeEach(function () {
                            registers.fakeValues({
                                1: 0x0F,
                                3: 0x70
                            });
                        });
                        describe('with target registers 1 and 3', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x81, 0x31));
                            });
                            it('should set register 1 to 0x7F', function () {
                                expect(registers.write).toHaveBeenCalledWith(1, 0x7F);
                            });
                        });
                    });
                });
                it('should execute the 8XY2 - set X to Z and Y instruction', function () {
                    registers.fakeValues({
                        1: 0xC3,
                        2: 0x0F
                    });
                    core.execute(createInstruction(0x81, 0x22));
                    expect(registers.write).toHaveBeenCalledWith(1, 0x03);
                });
                it('should execute the 8XY3 - set X to Z xor Y instruction', function () {
                    registers.fakeValues({
                        1: 0x6C,
                        2: 0x55
                    });
                    core.execute(createInstruction(0x81, 0x23));
                    expect(registers.write).toHaveBeenCalledWith(1, 0x39);
                });
                it('should execute the 8XY4 - add Y to X with carry instruction', function () {
                    registers.fakeValues({
                        1: 0x01,
                        2: 0x55,
                        3: 0xFF
                    });
                    core.execute(createInstruction(0x81, 0x24));
                    expect(registers.write).toHaveBeenCalledWith(0xf, 0);
                    expect(registers.write).toHaveBeenCalledWith(1, 0x56);
                    registers.write.reset();
                    core.execute(createInstruction(0x81, 0x34));
                    expect(registers.write).toHaveBeenCalledWith(0xf, 1);
                    expect(registers.write).toHaveBeenCalledWith(1, 0x00);
                });
                it('should execute the 8XY5 - sub Y from X with borrow instruction', function () {
                    registers.fakeValues({
                        1: 0x10,
                        2: 0x05,
                        3: 0x20
                    });
                    core.execute(createInstruction(0x81, 0x25));
                    expect(registers.write).toHaveBeenCalledWith(0xf, 1);
                    expect(registers.write).toHaveBeenCalledWith(1, 0x0B);
                    registers.write.reset();
                    core.execute(createInstruction(0x81, 0x35));
                    expect(registers.write).toHaveBeenCalledWith(0xf, 0);
                    expect(registers.write).toHaveBeenCalledWith(1, 0xF0);
                });
                describe('executing the 8XY6 - shift Y right by 1 with carry and store in X instruction', function () {
                    beforeEach(function () {
                        registers.write.reset();
                    });
                    describe('with register 1 set to 0x04', function () {
                        beforeEach(function () {
                            registers.fakeValues({
                                1: 0x04
                            });
                        });
                        describe('when shifting register 1 with a target of register 5', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x85, 0x16));
                            });
                            it('should set register 5 to 0x02', function () {
                                expect(registers.write).toHaveBeenCalledWith(5, 0x02);
                            });
                            it('should set register F to previous LSB (0)', function () {
                                expect(registers.write).toHaveBeenCalledWith(0xf, 0);
                            });
                        });
                    });
                    describe('with register 2 set to 0x05', function () {
                        beforeEach(function () {
                            registers.fakeValues({
                                2: 0x05
                            });
                        });
                        describe('when shifting register 2 with a target of register 4', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x84, 0x26));
                            });
                            it('should set register 4 to 0x02', function () {
                                expect(registers.write).toHaveBeenCalledWith(4, 0x02);
                            });
                            it('should set register F to previous LSB (1)', function () {
                                expect(registers.write).toHaveBeenCalledWith(0xf, 1);
                            });
                        });
                    });
                });
                it('should execute the 8XY7 - sub X from Y storing in X with borrow instruction', function () {
                    registers.fakeValues({
                        1: 0x10,
                        2: 0x05,
                        3: 0x20
                    });
                    core.execute(createInstruction(0x82, 0x17));
                    expect(registers.write).toHaveBeenCalledWith(0xf, 1);
                    expect(registers.write).toHaveBeenCalledWith(2, 0x0B);
                    registers.write.reset();
                    core.execute(createInstruction(0x83, 0x17));
                    expect(registers.write).toHaveBeenCalledWith(0xf, 0);
                    expect(registers.write).toHaveBeenCalledWith(3, 0xF0);
                });
                describe('executing the 8XYE - shift Y left by 1 with carry and store in X instruction', function () {
                    beforeEach(function () {
                        registers.write.reset();
                    });
                    describe('with register 1 set to 0xF0', function () {
                        beforeEach(function () {
                            registers.fakeValues({
                                1: 0xF0
                            });
                        });
                        describe('when shifting register 1 with a target of register 5', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x85, 0x1E));
                            });
                            it('should set register 5 to 0x02', function () {
                                expect(registers.write).toHaveBeenCalledWith(5, 0xE0);
                            });
                            it('should set register F to previous MSB (1)', function () {
                                expect(registers.write).toHaveBeenCalledWith(0xf, 1);
                            });
                        });
                    });
                    describe('with register 2 set to 0x04', function () {
                        beforeEach(function () {
                            registers.fakeValues({
                                2: 0x04
                            });
                        });
                        describe('when shifting register 2 with a target of register 4', function () {
                            beforeEach(function () {
                                core.execute(createInstruction(0x84, 0x2E));
                            });
                            it('should set register 4 to 0x08', function () {
                                expect(registers.write).toHaveBeenCalledWith(4, 0x08);
                            });
                            it('should set register F to previous MSB (0)', function () {
                                expect(registers.write).toHaveBeenCalledWith(0xf, 0);
                            });
                        });
                    });
                });
                it('should execute the 9XY0 - skip if X not equal Y instruction', function () {
                    registers.fakeValues({
                        1: 0x2f,
                        2: 0x2f,
                        3: 0x71,
                        "PC": 0x200
                    });
                    core.execute(createInstruction(0x91, 0x20));
                    expect(registers.write).not.toHaveBeenCalledWith("PC", 0x202);
                    registers.write.reset();
                    core.execute(createInstruction(0x91, 0x30));
                    expect(registers.write).toHaveBeenCalledWith("PC", 0x202);
                });
                it('should execute the ANNN - set I to NNN instruction', function () {
                    var instruction = createInstruction(0xA1, 0xFD);
                    core.execute(instruction);
                    expect(registers.write).toHaveBeenCalledWith("I", 0x1FD);
                });
                it('should execute the BNNN - jump to NNN + v0 instruction', function () {
                    registers.fakeValues({
                        0: 0xff
                    });
                    var instruction = createInstruction(0xBF, 0xFF);
                    core.execute(instruction);
                    expect(registers.write).toHaveBeenCalledWith("PC", 0x10FE);
                });
                it('should execute the CXNN - set X to random AND NN instruction', function () {
                    var oldRand = Math.random;
                    Math.random = jasmine.createSpy("random").andReturn((1 / 0xff) * 0xf9);
                    core.execute(createInstruction(0xC1, 0xFF));
                    expect(registers.write).toHaveBeenCalledWith(1, 0xf9);
                    registers.write.reset();
                    core.execute(createInstruction(0xC1, 0x0F));
                    expect(registers.write).toHaveBeenCalledWith(1, 0x09);
                    Math.random = oldRand;
                });
                it('should execute the DXYN - draw sprite instruction', function () {
                    var expectedSprite = [
                        0xF0, 
                        0x90, 
                        0x90, 
                        0x90, 
                        0xF0
                    ];
                    memory.fakeValues({
                        1792: 0xF0,
                        1793: 0x90,
                        1794: 0x90,
                        1795: 0x90,
                        1796: 0xF0
                    });
                    registers.fakeValues({
                        1: 10,
                        2: 25,
                        "I": 0x700
                    });
                    screen.draw.andReturn(1);
                    core.execute(createInstruction(0xD1, 0x25));
                    expect(screen.draw).toHaveBeenCalledWith(10, 25, expectedSprite);
                    expect(registers.write).toHaveBeenCalledWith(0xf, 1);
                    registers.write.reset();
                    screen.draw.andReturn(0);
                    core.execute(createInstruction(0xD1, 0x25));
                    expect(registers.write).toHaveBeenCalledWith(0xf, 0);
                });
                it('should execute the EX9E - skip if key X is pressed instruction', function () {
                    registers.fakeValues({
                        1: 0,
                        5: 4,
                        "PC": 0x200
                    });
                    keypad.fakeKeys({
                        0: 1,
                        4: 0
                    });
                    core.execute(createInstruction(0xE1, 0x9E));
                    expect(registers.write).toHaveBeenCalledWith("PC", 0x202);
                    registers.write.reset();
                    core.execute(createInstruction(0xE5, 0x9E));
                    expect(registers.write).not.toHaveBeenCalled();
                });
                it('should execute the EXA1 - skip if key X is not pressed instruction', function () {
                    registers.fakeValues({
                        1: 8,
                        5: 3,
                        "PC": 0x200
                    });
                    keypad.fakeKeys({
                        3: 1,
                        8: 0
                    });
                    core.execute(createInstruction(0xE1, 0xA1));
                    expect(registers.write).toHaveBeenCalledWith("PC", 0x202);
                    registers.write.reset();
                    core.execute(createInstruction(0xE5, 0xA1));
                    expect(registers.write).not.toHaveBeenCalled();
                });
                it('should execute the FX07 - set X to delay timer instruction', function () {
                    timers.getDelay.andReturn(0xD5);
                    core.execute(createInstruction(0xF3, 0x07));
                    expect(registers.write).toHaveBeenCalledWith(3, 0xd5);
                });
                it('should execute the FX0A - await keypress and store in X instruction', function () {
                    core.execute(createInstruction(0xF3, 0x0A));
                    expect(core.halted).toBe(true);
                    expect(registers.write).not.toHaveBeenCalledWith(3, 0xA);
                    keypad.fakeKeypress(0xA);
                    expect(core.halted).toBe(false);
                    expect(registers.write).toHaveBeenCalledWith(3, 0xA);
                });
                it('should execute the FX15 - set delay timer to X instruction', function () {
                    registers.fakeValues({
                        1: 0xF6
                    });
                    core.execute(createInstruction(0xF1, 0x15));
                    expect(timers.setDelay).toHaveBeenCalledWith(0xf6);
                });
                it('should execute the FX18 - set sound timer to X instruction', function () {
                    registers.fakeValues({
                        7: 0x2b
                    });
                    core.execute(createInstruction(0xF7, 0x18));
                    expect(timers.setSound).toHaveBeenCalledWith(0x2b);
                });
                it('should execute the FX1E - Add vX to I instruction', function () {
                    registers.fakeValues({
                        1: 0x8,
                        2: 0xff,
                        I: 0xF01
                    });
                    core.execute(createInstruction(0xF1, 0x1E));
                    expect(registers.write).toHaveBeenCalledWith("I", 0xF09);
                    expect(registers.write).toHaveBeenCalledWith(0xF, 0);
                    registers.write.reset();
                    core.execute(createInstruction(0xF2, 0x1E));
                    expect(registers.write).toHaveBeenCalledWith("I", 0x0);
                    expect(registers.write).toHaveBeenCalledWith(0xF, 1);
                });
                it('should execute the FX29 - load address of font char X into I instruction', function () {
                    registers.fakeValues({
                        1: 0x03,
                        2: 0x01
                    });
                    core.execute(createInstruction(0xF1, 0x29));
                    expect(registers.write).toHaveBeenCalledWith("I", 15);
                    registers.write.reset();
                    core.execute(createInstruction(0xF2, 0x29));
                    expect(registers.write).toHaveBeenCalledWith("I", 5);
                });
                it('should execute the FX33 - store BCD of X in memory at I instruction', function () {
                    registers.fakeValues({
                        1: 0xF0,
                        2: 0x02,
                        I: 0x700
                    });
                    core.execute(createInstruction(0xF1, 0x33));
                    expect(memory.write).toHaveBeenCalledWith(0x700, 2);
                    expect(memory.write).toHaveBeenCalledWith(0x701, 4);
                    expect(memory.write).toHaveBeenCalledWith(0x702, 0);
                    memory.write.reset();
                    core.execute(createInstruction(0xF2, 0x33));
                    expect(memory.write).toHaveBeenCalledWith(0x700, 0);
                    expect(memory.write).toHaveBeenCalledWith(0x701, 0);
                    expect(memory.write).toHaveBeenCalledWith(0x702, 2);
                });
                it('should execute the FX55 - store v0 to v5 in memory at I instruction', function () {
                    registers.fakeValues({
                        0: 0,
                        1: 10,
                        2: 20,
                        3: 30,
                        4: 40,
                        "I": 0x700
                    });
                    core.execute(createInstruction(0xF4, 0x55));
                    expect(registers.write).toHaveBeenCalledWith("I", 0x705);
                    expect(memory.write).toHaveBeenCalledWith(0x700, 0);
                    expect(memory.write).toHaveBeenCalledWith(0x701, 10);
                    expect(memory.write).toHaveBeenCalledWith(0x702, 20);
                    expect(memory.write).toHaveBeenCalledWith(0x703, 30);
                    expect(memory.write).toHaveBeenCalledWith(0x704, 40);
                });
                it('should execute the FX65 - load v0 to v5 from memory at I instruction', function () {
                    memory.fakeValues({
                        1792: 0,
                        1793: 10,
                        1794: 20,
                        1795: 30,
                        1796: 40
                    });
                    registers.fakeValues({
                        "I": 0x700
                    });
                    core.execute(createInstruction(0xF4, 0x65));
                    expect(registers.write).toHaveBeenCalledWith("I", 0x705);
                    expect(registers.write).toHaveBeenCalledWith(0, 0);
                    expect(registers.write).toHaveBeenCalledWith(1, 10);
                    expect(registers.write).toHaveBeenCalledWith(2, 20);
                    expect(registers.write).toHaveBeenCalledWith(3, 30);
                    expect(registers.write).toHaveBeenCalledWith(4, 40);
                });
            });
        })(chip8.spec || (chip8.spec = {}));
        var spec = chip8.spec;
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
    function createInstruction(data1, data2) {
        return {
            opcode: (data1 << 8) | data2,
            nibbles: [
                data1 >> 4, 
                data1 & 0xF, 
                data2 >> 4, 
                data2 & 0xF
            ],
            bytes: [
                data1, 
                data2
            ],
            NN: data2,
            NNN: ((data1 << 8) | data2) & 0xFFF,
            X: data1 & 0xf,
            Y: data2 >> 4
        };
    }
    function createStackSpy() {
        var stack = jasmine.createSpyObj("stack", [
            "push", 
            "pop", 
            "getSP"
        ]);
        Object.defineProperty(stack, "SP", {
            get: function () {
                return this.getSP();
            }
        });
        return stack;
    }
    function createMemorySpy() {
        var memory = jasmine.createSpyObj("memory", [
            "read", 
            "write"
        ]);
        memory.fakeValues = function (values) {
            memory.read.andCallFake(function (address) {
                return values[address];
            });
        };
        return memory;
    }
    function createTimersSpy() {
        var timers = jasmine.createSpyObj("timers", [
            "setDelay", 
            "getDelay", 
            "setSound"
        ]);
        Object.defineProperty(timers, "delay", {
            set: function (value) {
                this.setDelay(value);
            },
            get: function () {
                return this.getDelay();
            }
        });
        Object.defineProperty(timers, "sound", {
            set: function (value) {
                this.setSound(value);
            }
        });
        return timers;
    }
    function createScreenSpy() {
        var screen = jasmine.createSpyObj("screen", [
            "clear", 
            "draw"
        ]);
        return screen;
    }
    function createKeypadSpy() {
        var keypad = jasmine.createSpyObj("keypad", [
            "read"
        ]);
        keypad.fakeKeys = function (keys) {
            keypad.read.andCallFake(function (key) {
                return keys[key];
            });
        };
        var eventCallback;
        keypad.onKeyDown = {
            subscribe: function (callback) {
                eventCallback = callback;
            }
        };
        keypad.fakeKeypress = function (key) {
            if(eventCallback) {
                eventCallback(key);
            }
        };
        return keypad;
    }
    function createRegisterSpy() {
        var registers = jasmine.createSpyObj("registers", [
            "read", 
            "write"
        ]);
        Object.defineProperty(registers, "PC", {
            set: function (value) {
                this.write("PC", value);
            },
            get: function () {
                return this.read("PC");
            }
        });
        Object.defineProperty(registers, "I", {
            set: function (value) {
                this.write("I", value);
            },
            get: function () {
                return this.read("I");
            }
        });
        for(var i = 0; i <= 0xf; i++) {
            (function (variable) {
                Object.defineProperty(registers, "v" + variable.toString(16).toUpperCase(), {
                    set: function (value) {
                        this.write(variable, value);
                    },
                    get: function () {
                        return this.read(variable);
                    }
                });
            })(i);
        }
        registers.fakeValues = function (values) {
            registers.read.andCallFake(function (address) {
                return values[address];
            });
        };
        return registers;
    }
})
//@ sourceMappingURL=core.spec.js.map

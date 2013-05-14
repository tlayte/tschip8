define(["require", "exports", "chip8/core"], function(require, exports, __coreModule__) {
    var coreModule = __coreModule__;

    var Chip8 = coreModule.chip8;
    
    (function (chip8) {
        (function (spec) {
            describe("A chip-8 core", function () {
                var core;
                var registers;
                var stack;
                beforeEach(function () {
                    registers = createRegisterSpy();
                    stack = createStackSpy();
                    core = new Chip8.Core(registers, stack);
                });
                it('should execute the 00E0 - return instruction', function () {
                    var instruction = createInstruction(0, 224);
                    stack.pop.andReturn(1536);
                    core.execute(instruction);
                    expect(stack.pop).toHaveBeenCalled();
                    expect(registers.write).toHaveBeenCalledWith("PC", 1536);
                });
                it('should execute the 1NNN - jmp instruction', function () {
                    var instruction = createInstruction(31, 99);
                    core.execute(instruction);
                    expect(registers.write).toHaveBeenCalledWith("PC", 3939);
                });
                it('should execute the 2NNN - call instruction', function () {
                    var instruction = createInstruction(35, 47);
                    registers.fakeValues({
                        "PC": 528
                    });
                    core.execute(instruction);
                    expect(registers.write).toHaveBeenCalledWith("PC", 815);
                    expect(stack.push).toHaveBeenCalledWith(528);
                });
                it('should execute the 3XNN - skip if equal instruction', function () {
                    registers.fakeValues({
                        1: 47,
                        "PC": 512
                    });
                    core.execute(createInstruction(49, 47));
                    expect(registers.write).toHaveBeenCalledWith("PC", 514);
                    registers.write.reset();
                    core.execute(createInstruction(49, 17));
                    expect(registers.write).not.toHaveBeenCalledWith("PC", 514);
                });
                it('should execute the 4XNN - skip if not equal instruction', function () {
                    registers.fakeValues({
                        1: 47,
                        "PC": 512
                    });
                    core.execute(createInstruction(65, 47));
                    expect(registers.write).not.toHaveBeenCalledWith("PC", 514);
                    registers.write.reset();
                    core.execute(createInstruction(65, 17));
                    expect(registers.write).toHaveBeenCalledWith("PC", 514);
                });
                it('should execute the 5XY0 - skip if X equal Y instruction', function () {
                    registers.fakeValues({
                        1: 47,
                        2: 47,
                        3: 17,
                        "PC": 512
                    });
                    core.execute(createInstruction(81, 32));
                    expect(registers.write).toHaveBeenCalledWith("PC", 514);
                    registers.write.reset();
                    core.execute(createInstruction(81, 48));
                    expect(registers.write).not.toHaveBeenCalledWith("PC", 514);
                });
                it('should execute the 6XNN - set X to NN instruction', function () {
                    core.execute(createInstruction(97, 240));
                    expect(registers.write).toHaveBeenCalledWith(1, 240);
                });
                it('should execute the 7XNN - add NN to X instruction', function () {
                    registers.fakeValues({
                        1: 32
                    });
                    core.execute(createInstruction(113, 37));
                    expect(registers.write).toHaveBeenCalledWith(1, 69);
                    registers.write.reset();
                    core.execute(createInstruction(113, 255));
                    expect(registers.write).toHaveBeenCalledWith(1, 31);
                });
                it('should execute the 8XY0 - set X to Y instruction', function () {
                    registers.fakeValues({
                        5: 106
                    });
                    core.execute(createInstruction(129, 80));
                    expect(registers.write).toHaveBeenCalledWith(1, 106);
                });
                it('should execute the 8XY1 - set X to Z or Y instruction', function () {
                    registers.fakeValues({
                        1: 15,
                        3: 112
                    });
                    core.execute(createInstruction(129, 49));
                    expect(registers.write).toHaveBeenCalledWith(1, 127);
                });
                it('should execute the 8XY2 - set X to Z and Y instruction', function () {
                    registers.fakeValues({
                        1: 195,
                        2: 15
                    });
                    core.execute(createInstruction(129, 34));
                    expect(registers.write).toHaveBeenCalledWith(1, 3);
                });
                it('should execute the 8XY3 - set X to Z xor Y instruction', function () {
                    registers.fakeValues({
                        1: 108,
                        2: 85
                    });
                    core.execute(createInstruction(129, 35));
                    expect(registers.write).toHaveBeenCalledWith(1, 57);
                });
                it('should execute the 8XY4 - add Y to X with carry instruction', function () {
                    registers.fakeValues({
                        1: 1,
                        2: 85,
                        3: 255
                    });
                    core.execute(createInstruction(129, 36));
                    expect(registers.write).toHaveBeenCalledWith(15, 0);
                    expect(registers.write).toHaveBeenCalledWith(1, 86);
                    registers.write.reset();
                    core.execute(createInstruction(129, 52));
                    expect(registers.write).toHaveBeenCalledWith(15, 1);
                    expect(registers.write).toHaveBeenCalledWith(1, 0);
                });
                it('should execute the 8XY5 - sub Y from X with borrow instruction', function () {
                    registers.fakeValues({
                        1: 16,
                        2: 5,
                        3: 32
                    });
                    core.execute(createInstruction(129, 37));
                    expect(registers.write).toHaveBeenCalledWith(15, 1);
                    expect(registers.write).toHaveBeenCalledWith(1, 11);
                    registers.write.reset();
                    core.execute(createInstruction(129, 53));
                    expect(registers.write).toHaveBeenCalledWith(15, 0);
                    expect(registers.write).toHaveBeenCalledWith(1, 240);
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
                data1 & 15, 
                data2 >> 4, 
                data2 & 15
            ],
            bytes: [
                data1, 
                data2
            ],
            NN: data2,
            NNN: ((data1 << 8) | data2) & 4095
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
                this.write("PC", value);
            },
            get: function () {
                return this.read("PC");
            }
        });
        for(var i = 0; i <= 15; i++) {
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

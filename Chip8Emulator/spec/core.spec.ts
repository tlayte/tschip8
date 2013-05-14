/// <reference path="../.typings/jasmine.d.ts" />

import coreModule = module("chip8/core");
import Chip8 = coreModule.chip8;
import decoderModule = module("chip8/decoder");

export module chip8.spec {
    describe("A chip-8 core", () => {
        var core: Chip8.Core;
        var registers;
        var stack;

        beforeEach(() => {
            registers = createRegisterSpy();
            stack = createStackSpy();
            core = new Chip8.Core(registers, stack);
        });

        //it('should execute the XXXX instruction', () => {
        //    
        //});

        it('should execute the 00E0 - return instruction', () => {
            var instruction = createInstruction(0x00, 0xE0);
            stack.pop.andReturn(0x600);
            core.execute(instruction);
            expect(stack.pop).toHaveBeenCalled();
            expect(registers.write).toHaveBeenCalledWith("PC", 0x600);
        });

        it('should execute the 1NNN - jmp instruction', () => {
            var instruction = createInstruction(0x1F, 0x63);
            core.execute(instruction);
            expect(registers.write).toHaveBeenCalledWith("PC", 0xF63);
        });

        it('should execute the 2NNN - call instruction', () => {
            var instruction = createInstruction(0x23, 0x2F);
            registers.fakeValues({ "PC": 0x210 });
            core.execute(instruction);
            expect(registers.write).toHaveBeenCalledWith("PC", 0x32F);
            expect(stack.push).toHaveBeenCalledWith(0x210);
        });

        it('should execute the 3XNN - skip if equal instruction', () => {            
            registers.fakeValues({
                1: 0x2f,
                "PC": 0x200
            });
            core.execute(createInstruction(0x31, 0x2F));
            expect(registers.write).toHaveBeenCalledWith("PC", 0x202);

            registers.write.reset();

            core.execute(createInstruction(0x31, 0x11));
            expect(registers.write).not.toHaveBeenCalledWith("PC", 0x202);
        });

        it('should execute the 4XNN - skip if not equal instruction', () => {
            registers.fakeValues({
                1: 0x2f,
                "PC": 0x200
            });
            core.execute(createInstruction(0x41, 0x2F));
            expect(registers.write).not.toHaveBeenCalledWith("PC", 0x202);

            registers.write.reset();

            core.execute(createInstruction(0x41, 0x11));
            expect(registers.write).toHaveBeenCalledWith("PC", 0x202);
        });

        it('should execute the 5XY0 - skip if X equal Y instruction', () => {
            registers.fakeValues({
                1: 0x2f,
                2: 0x2f,
                3: 0x11,
                "PC": 0x200
            });
            core.execute(createInstruction(0x51, 0x20));
            expect(registers.write).toHaveBeenCalledWith("PC", 0x202);

            registers.write.reset();

            core.execute(createInstruction(0x51, 0x30));
            expect(registers.write).not.toHaveBeenCalledWith("PC", 0x202);
        });

        it('should execute the 6XNN - set X to NN instruction', () => {
            core.execute(createInstruction(0x61, 0xF0));
            expect(registers.write).toHaveBeenCalledWith(1, 0xF0);
        });

        it('should execute the 7XNN - add NN to X instruction', () => {
            registers.fakeValues({ 1: 0x20 });
            core.execute(createInstruction(0x71, 0x25));
            expect(registers.write).toHaveBeenCalledWith(1, 0x45);

            registers.write.reset();

            core.execute(createInstruction(0x71, 0xFF));
            expect(registers.write).toHaveBeenCalledWith(1, 0x1F);
        });

        it('should execute the 8XY0 - set X to Y instruction', () => {
            registers.fakeValues({ 5: 0x6A });
            core.execute(createInstruction(0x81, 0x50));
            expect(registers.write).toHaveBeenCalledWith(1, 0x6A);
        });

        it('should execute the 8XY1 - set X to Z or Y instruction', () => {
            registers.fakeValues({1: 0x0F, 3: 0x70 });
            core.execute(createInstruction(0x81, 0x31));
            expect(registers.write).toHaveBeenCalledWith(1, 0x7F);
        });

        it('should execute the 8XY2 - set X to Z and Y instruction', () => {
            registers.fakeValues({ 1: 0xC3, 2: 0x0F });
            core.execute(createInstruction(0x81, 0x22));
            expect(registers.write).toHaveBeenCalledWith(1, 0x03);
        });

        it('should execute the 8XY3 - set X to Z xor Y instruction', () => {
            registers.fakeValues({ 1: 0x6C, 2: 0x55 });
            core.execute(createInstruction(0x81, 0x23));
            expect(registers.write).toHaveBeenCalledWith(1, 0x39);
        });

        it('should execute the 8XY4 - add Y to X with carry instruction', () => {
            registers.fakeValues({ 1: 0x01, 2: 0x55, 3: 0xFF });
            core.execute(createInstruction(0x81, 0x24));
            expect(registers.write).toHaveBeenCalledWith(0xf, 0);
            expect(registers.write).toHaveBeenCalledWith(1, 0x56);

            registers.write.reset();

            core.execute(createInstruction(0x81, 0x34));
            expect(registers.write).toHaveBeenCalledWith(0xf, 1);
            expect(registers.write).toHaveBeenCalledWith(1, 0x00);
        });

        it('should execute the 8XY5 - sub Y from X with borrow instruction', () => {
            registers.fakeValues({ 1: 0x10, 2: 0x05, 3: 0x20 });
            core.execute(createInstruction(0x81, 0x25));
            expect(registers.write).toHaveBeenCalledWith(0xf, 1);
            expect(registers.write).toHaveBeenCalledWith(1, 0x0B);

            registers.write.reset();

            core.execute(createInstruction(0x81, 0x35));
            expect(registers.write).toHaveBeenCalledWith(0xf, 0);
            expect(registers.write).toHaveBeenCalledWith(1, 0xF0);
        });

    });
}

function createInstruction(data1, data2): decoderModule.chip8.Instruction{
    return {
        opcode: (data1 << 8) | data2,
        nibbles: [data1 >> 4, data1 & 0xF, data2 >> 4, data2 & 0xF],
        bytes: [data1, data2],
        NN: data2,
        NNN: ((data1 << 8) | data2) & 0xFFF
    }
}

function createStackSpy() {
    var stack = jasmine.createSpyObj("stack", ["push", "pop", "getSP"]);
    Object.defineProperty(stack, "SP", {
        get: function () { return this.getSP(); }
    });
    return stack;
}

function createRegisterSpy() {
    var registers = jasmine.createSpyObj("registers", ["read", "write"]);
    Object.defineProperty(registers, "PC", {
        set: function (value) { this.write("PC", value); },
        get: function () { return this.read("PC"); }
    });
    Object.defineProperty(registers, "I", {
        set: function (value) { this.write("PC", value); },
        get: function () { return this.read("PC"); }
    });

    for (var i = 0; i <= 0xf; i++){
        (variable) => {
            Object.defineProperty(registers, "v" + variable.toString(16).toUpperCase(), {
                set: function (value) { this.write(variable, value); },
                get: function () { return this.read(variable); }
            })
        } (i);
    }

    registers.fakeValues = (values) => {
        registers.read.andCallFake((address) => {            
            return values[address];
        });
    };
    return registers;
}
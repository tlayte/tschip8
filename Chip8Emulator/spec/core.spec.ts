/// <reference path="../.typings/jasmine.d.ts" />

import coreModule = module("chip8/core");
import Chip8 = coreModule.chip8;
import decoderModule = module("chip8/decoder");

export module chip8.spec {
    describe("A chip-8 core", () => {
        var core: Chip8.Core;
        var registers;
        var memory;
        var stack;
        var timers;
        var screen;

        beforeEach(() => {
            registers = createRegisterSpy();
            stack = createStackSpy();
            memory = createMemorySpy();
            timers = createTimersSpy();
            screen = createScreenSpy();
            core = new Chip8.Core(registers, stack, memory, timers, screen);
        });

        it('should execute the 00E0 - clear screen instruction', () => {
            core.execute(createInstruction(0x00, 0xE0));
            expect(screen.clear).toHaveBeenCalled();
        });

        it('should execute the 00EE - return instruction', () => {
            stack.pop.andReturn(0x600);
            core.execute(createInstruction(0x00, 0xEE));
            expect(registers.write).toHaveBeenCalledWith("PC", 0x600);
        });

        it('should execute the 1NNN - jmp instruction', () => {
            core.execute(createInstruction(0x1F, 0x63));
            expect(registers.write).toHaveBeenCalledWith("PC", 0xF63);
        });

        it('should execute the 2NNN - call instruction', () => {
            registers.fakeValues({ "PC": 0x210 });
            core.execute(createInstruction(0x23, 0x2F));
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

        it('should execute the 8XY6 - shift X right by 1 with carry instruction', () => {
            registers.fakeValues({ 1: 0x04, 2: 0x05 });
            core.execute(createInstruction(0x81, 0x06));
            expect(registers.write).toHaveBeenCalledWith(0xf, 0);
            expect(registers.write).toHaveBeenCalledWith(1, 0x02);

            registers.write.reset();

            core.execute(createInstruction(0x82, 0x06));
            expect(registers.write).toHaveBeenCalledWith(0xf, 1);
            expect(registers.write).toHaveBeenCalledWith(2, 0x02);
        });

        it('should execute the 8XY7 - sub X from Y storing in X with borrow instruction', () => {
            registers.fakeValues({ 1: 0x10, 2: 0x05, 3: 0x20 });
            core.execute(createInstruction(0x82, 0x17));
            expect(registers.write).toHaveBeenCalledWith(0xf, 1);
            expect(registers.write).toHaveBeenCalledWith(2, 0x0B);

            registers.write.reset();

            core.execute(createInstruction(0x83, 0x17));
            expect(registers.write).toHaveBeenCalledWith(0xf, 0);
            expect(registers.write).toHaveBeenCalledWith(3, 0xF0);
        });

        it('should execute the 8XYE - shift X left by 1 with carry instruction', () => {
            registers.fakeValues({ 1: 0xF0, 2: 0x04 });
            core.execute(createInstruction(0x81, 0x0E));
            expect(registers.write).toHaveBeenCalledWith(0xf, 1);
            expect(registers.write).toHaveBeenCalledWith(1, 0xE0);

            registers.write.reset();

            core.execute(createInstruction(0x82, 0x0E));
            expect(registers.write).toHaveBeenCalledWith(0xf, 0);
            expect(registers.write).toHaveBeenCalledWith(2, 0x08);
        });

        it('should execute the 9XY0 - skip if X not equal Y instruction', () => {
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

        it('should execute the ANNN - set I to NNN instruction', () => {
            var instruction = createInstruction(0xA1, 0xFD);
            core.execute(instruction);
            expect(registers.write).toHaveBeenCalledWith("I", 0x1FD);
        });

        it('should execute the BNNN - jump to NNN + v0 instruction', () => {
            registers.fakeValues({ 0: 0xff });
            var instruction = createInstruction(0xBF, 0xFF);
            core.execute(instruction);
            expect(registers.write).toHaveBeenCalledWith("PC", 0x10FE);
        });

        it('should execute the CXNN - set X to random AND NN instruction', () => {
            var oldRand = Math.random;
            Math.random = jasmine.createSpy("random").andReturn((1 / 0xff) * 0xf9);

            core.execute(createInstruction(0xC1, 0xFF));
            expect(registers.write).toHaveBeenCalledWith(1, 0xf9);

            registers.write.reset();

            core.execute(createInstruction(0xC1, 0x0F));
            expect(registers.write).toHaveBeenCalledWith(1, 0x09);

            Math.random = oldRand;
        });

        it('should execute the DXYN - draw sprite instruction', () => {
            var expectedSprite = [0xF0, 0x90, 0x90, 0x90, 0xF0];
            memory.fakeValues({
                0x700: 0xF0,
                0x701: 0x90,
                0x702: 0x90,
                0x703: 0x90,
                0x704: 0xF0
            });
            registers.fakeValues({
                1: 10,
                2: 25,
                "I": 0x700
            });
            core.execute(createInstruction(0xD1, 0x25));
            expect(screen.draw).toHaveBeenCalledWith(10, 25, expectedSprite);
        });

        it('should execute the FX07 - set X to delay timer instruction', () => {
            timers.getDelay.andReturn(0xD5);
            core.execute(createInstruction(0xF3, 0x07));
            expect(registers.write).toHaveBeenCalledWith(3, 0xd5);
        });

        it('should execute the FX15 - set delay timer to X instruction', () => {
            registers.fakeValues({ 1: 0xF6 });
            core.execute(createInstruction(0xF1, 0x15));
            expect(timers.setDelay).toHaveBeenCalledWith(0xf6);
        });

        it('should execute the FX18 - set sound timer to X instruction', () => {
            registers.fakeValues({ 7: 0x2b });
            core.execute(createInstruction(0xF7, 0x18));
            expect(timers.setSound).toHaveBeenCalledWith(0x2b);
        });

        it('should execute the FX1E - Add vX to I instruction', () => {
            registers.fakeValues({ 1: 0x8, 2: 0xff, I: 0xF01 });

            core.execute(createInstruction(0xF1, 0x1E));
            expect(registers.write).toHaveBeenCalledWith("I", 0xF09);
            expect(registers.write).toHaveBeenCalledWith(0xF, 0);

            registers.write.reset();

            core.execute(createInstruction(0xF2, 0x1E));
            expect(registers.write).toHaveBeenCalledWith("I", 0x0);
            expect(registers.write).toHaveBeenCalledWith(0xF, 1);
        });

        it('should execute the FX29 - load address of font char X into I instruction', () => {
            registers.fakeValues({ 1: 0x03, 2: 0x01 });
            core.execute(createInstruction(0xF1, 0x29));
            expect(registers.write).toHaveBeenCalledWith("I", 15);

            registers.write.reset();

            core.execute(createInstruction(0xF2, 0x29));
            expect(registers.write).toHaveBeenCalledWith("I", 5);
        });

        it('should execute the FX33 - store BCD of X in memory at I instruction', () => {
            registers.fakeValues({ 1: 0xF0, 2: 0x02, I: 0x700 });
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

        it('should execute the FX55 - store v0 to v5 in memory at I instruction', () => {
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

        it('should execute the FX65 - load v0 to v5 from memory at I instruction', () => {
            memory.fakeValues({
                0x700: 0,
                0x701: 10,
                0x702: 20,
                0x703: 30,
                0x704: 40                
            });
            registers.fakeValues({ "I": 0x700 });
            core.execute(createInstruction(0xF4, 0x65));
            expect(registers.write).toHaveBeenCalledWith("I", 0x705);
            expect(registers.write).toHaveBeenCalledWith(0, 0);
            expect(registers.write).toHaveBeenCalledWith(1, 10);
            expect(registers.write).toHaveBeenCalledWith(2, 20);
            expect(registers.write).toHaveBeenCalledWith(3, 30);
            expect(registers.write).toHaveBeenCalledWith(4, 40);
        });
    });
}

function createInstruction(data1, data2): decoderModule.chip8.Instruction{
    return {
        opcode: (data1 << 8) | data2,
        nibbles: [data1 >> 4, data1 & 0xF, data2 >> 4, data2 & 0xF],
        bytes: [data1, data2],
        NN: data2,
        NNN: ((data1 << 8) | data2) & 0xFFF,
        X: data1 & 0xf,
        Y: data2 >> 4
    }
}

function createStackSpy() {
    var stack = jasmine.createSpyObj("stack", ["push", "pop", "getSP"]);
    Object.defineProperty(stack, "SP", {
        get: function () { return this.getSP(); }
    });
    return stack;
}

function createMemorySpy() {
    var memory = jasmine.createSpyObj("memory", ["read", "write"]);
    memory.fakeValues = (values) => {
        memory.read.andCallFake((address) => {
            return values[address];
        });
    };
    return memory;
}

function createTimersSpy() {
    var timers = jasmine.createSpyObj("timers", ["setDelay", "getDelay", "setSound"]);
    Object.defineProperty(timers, "delay", {
        set: function (value) { this.setDelay(value); },
        get: function () { return this.getDelay(); }
    });
    Object.defineProperty(timers, "sound", {
        set: function (value) { this.setSound(value); }
    });
    return timers;
}

function createScreenSpy() {
    var screen = jasmine.createSpyObj("screen", ["clear", "draw"]);
    return screen;
}

function createRegisterSpy() {
    var registers = jasmine.createSpyObj("registers", ["read", "write"]);
    Object.defineProperty(registers, "PC", {
        set: function (value) { this.write("PC", value); },
        get: function () { return this.read("PC"); }
    });
    Object.defineProperty(registers, "I", {
        set: function (value) { this.write("I", value); },
        get: function () { return this.read("I"); }
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
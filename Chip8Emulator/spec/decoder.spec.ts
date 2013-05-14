/// <reference path="../.typings/jasmine.d.ts" />
import decoderModule = module("chip8/decoder");
import Chip8 = decoderModule.chip8;

export module chip8.spec {
    describe('An instruction decoder', () => {
        var decoder: Chip8.Decoder;
        var memorySpy;
        var registerSpy;

        beforeEach(() => {
            memorySpy = jasmine.createSpyObj("memorySpy", ["read", "write"]);
            registerSpy = jasmine.createSpyObj("memorySpy", ["read", "write"]);
            Object.defineProperty(registerSpy, "PC", {
                set: function (value) { this.write("PC", value); },
                get: function () { return this.read("PC"); }
            });

            decoder = new Chip8.Decoder(memorySpy, registerSpy);
        });

        it('should read the program counter', () => {
            decoder.getNext();
            expect(registerSpy.read).toHaveBeenCalledWith("PC");
        });

        it('should read both bytes of the next instruction', () => {
            registerSpy.read.andReturn(0x200);
            decoder.getNext();
            expect(memorySpy.read).toHaveBeenCalledWith(0x200);
            expect(memorySpy.read).toHaveBeenCalledWith(0x201);
        });

        it('should increment the program counter', () => {
            registerSpy.read.andReturn(0x200);
            decoder.getNext();
            expect(registerSpy.write).toHaveBeenCalledWith("PC", 0x202);
        });
        
        describe('returns an instruction which', () => {
            var fakeData = [0xF5, 0x65];
            var instruction: Chip8.Instruction;
            beforeEach(() => {
                memorySpy = jasmine.createSpyObj("memorySpy", ["read", "write"]);
                memorySpy.read.andCallFake((address: number) => {
                    return fakeData[address - 0x200];
                });
                registerSpy = jasmine.createSpyObj("memorySpy", ["read", "write"]);
                Object.defineProperty(registerSpy, "PC", {
                    get: function () { return 0x200; }
                });

                decoder = new Chip8.Decoder(memorySpy, registerSpy);
                instruction = decoder.getNext();
            });

            it('should have the 16bit opcode', () => {
                expect(instruction.opcode).toBe(0xF565);
            });

            it('should have an array of nibbles', () => {
                expect(instruction.nibbles[0]).toBe(0xF);
                expect(instruction.nibbles[1]).toBe(0x5);
                expect(instruction.nibbles[2]).toBe(0x6);
                expect(instruction.nibbles[3]).toBe(0x5);
            });

            it('should have an array of bytes', () => {
                expect(instruction.bytes[0]).toBe(0xF5);
                expect(instruction.bytes[1]).toBe(0x65);
            });

        });
    });
}
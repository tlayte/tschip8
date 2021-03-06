/// <reference path="../.typings/jasmine.d.ts" />
import registersModule = module("chip8/registers");
import Chip8 = registersModule.chip8;

export module chip8.spec {
    describe('A registers object', () => {
        var registers: Chip8.Registers;

        beforeEach(() => {
            registers = new Chip8.Registers();
        });

        describe('when reset', () => {
            beforeEach(() => {
                registers = new Chip8.Registers();
                registers.reset();
            });

            it('should set all 16 variable registers to zero', () => {
                for (var i = 0; i < 16; i++) {
                    expect(registers.read(i)).toBe(0);
                }
            });
            it('should set PC to 0x200', () => {
                expect(registers.PC).toBe(0x200);
            });

            it('should set I to 0x0', () => {
                expect(registers.I).toBe(0);
            });
        })
        

        describe('has a PC register which', () => {

            it('should be accessible by address', () => {
                registers.write("PC", 100);
                expect(registers.PC).toBe(100);
            });

            it('should be accessible by alias', () => {
                registers.PC = 1337;
                expect(registers.read("PC")).toBe(1337);
            });
        });

        describe("can store data which", () => {
            beforeEach(() => {
                registers = new Chip8.Registers();

                for (var i = 0; i < 16; i++) {
                    registers.write(i, i * 10);
                }
            });

            it('should have aliases for variable registers', () => {
                expect(registers.v0).toBe(0);
                expect(registers.v3).toBe(30);
                expect(registers.vE).toBe(140);
                expect(registers.vF).toBe(150);
            });

            it('should be writable via the aliases', () => {
                registers.vA = 1337;
                expect(registers.read(0xA)).toBe(1337);
            });

            it('should raise an event when writing via an alias', () => {
                var callback = jasmine.createSpy("callback");
                registers.onWrite.subscribe(callback);

                registers.PC = 1337;
                registers.v5 = 1234;
                expect(callback).toHaveBeenCalledWith("PC", 1337);
                expect(callback).toHaveBeenCalledWith(5, 1234);                
            });
        });
    });
}
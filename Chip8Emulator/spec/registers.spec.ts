/// <reference path="../.typings/jasmine.d.ts" />
import registersModule = module("chip8/registers");
var Registers = registersModule.chip8.Registers;

export module chip8.spec {
    describe('A registers object', () => {
        it('should initialise all 16 registers to zero', () => {
            var registers = new Registers();
            for (var i = 0; i < 16; i++){
                expect(registers.read(i)).toBe(0);
            }
        });
    });
}
/// <reference path="../.typings/jasmine.d.ts" />
import screenModule = module("chip8/screen");

export module chip8.spec {
    describe('A screen object', () => {
        it('should have a default size of 64x32', () => {
            var screen = new screenModule.chip8.Screen();
            expect(screen.width).toBe(64);
            expect(screen.height).toBe(32);
        })

        it('should have a default size of 128x64', () => {
            var screen = new screenModule.chip8.Screen(128, 64);
            expect(screen.width).toBe(128);
            expect(screen.height).toBe(64);
        })
    });
}
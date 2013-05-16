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

        describe('with a size of 10x10', () => {
            var screen: screenModule.chip8.Screen;

            beforeEach(() => {
                screen = new screenModule.chip8.Screen(10, 10);
            });

            it('should return 100 pixels', () => {
                var pixels = screen.getPixels();
                expect(pixels.length).toBe(100);
            });

            it('should initialise all pixels to 0', () => {
                var pixels = screen.getPixels();
                expect(pixels.every((pixel) => pixel == 0)).toBeTruthy();
            });

            it('should draw a solid 8x8 block sprite at 0,0', () => {
                var sprite = buildSprite(
                    "11111111",
                    "11111111",
                    "11111111",
                    "11111111",
                    "11111111",
                    "11111111",
                    "11111111",
                    "11111111");
                var result = screen.draw(0, 0, sprite);
                expect(result).toBe(0);
                var pixels = screen.getPixels();
                for (var x = 0; x < 8; x++){
                    for (var y = 0; y < 8; y++) {
                        expect(getPixel(pixels, x, y, 10)).toBe(1);
                    }
                }
            });

            it('should wrap horizontally', () => {
                var sprite = buildSprite(
                    "10011001",
                    "11111111");
                screen.draw(6, 0, sprite);
                var pixels = screen.getPixels();
                expect(getPixel(pixels, 3, 0, 10)).toBe(1);
                expect(getPixel(pixels, 2, 0, 10)).toBe(0);
                expect(getPixel(pixels, 1, 0, 10)).toBe(0);
                expect(getPixel(pixels, 0, 0, 10)).toBe(1);
            });

            it('should wrap vertically', () => {
                var sprite = buildSprite(
                    "10000000",
                    "00000000",
                    "00000000",
                    "10000000",
                    "10000000",
                    "00000000",
                    "00000000",
                    "10000000");
                screen.draw(0, 6, sprite);
                var pixels = screen.getPixels();
                expect(getPixel(pixels,0, 3, 10)).toBe(1);
                expect(getPixel(pixels,0, 2, 10)).toBe(0);
                expect(getPixel(pixels,0, 1, 10)).toBe(0);
                expect(getPixel(pixels,0, 0, 10)).toBe(1);
            });

            it('should XOR the pixels of a sprite', () => {
                var sprite1 = buildSprite(
                    "11110000",
                    "11110000",
                    "11110000",
                    "00000000",
                    "00000000",
                    "00000000",
                    "00000000",
                    "00000000");
                var sprite2 = buildSprite(
                    "00000000",
                    "01100000",
                    "00000000",
                    "00000000",
                    "00000000",
                    "00000000",
                    "00000000",
                    "00000000");
                var result1 = screen.draw(0, 0, sprite1);
                var result2 = screen.draw(0, 0, sprite2);

                expect(result1).toBe(0);
                expect(result2).toBe(1);
                var pixels = screen.getPixels();
                expect(getPixel(pixels, 0, 0, 10)).toBe(1);
                expect(getPixel(pixels, 1, 1, 10)).toBe(0);
            });

            it('should raise an event when drawing', () => {
                var callback = jasmine.createSpy("callback");
                screen.onDraw.subscribe(callback);
                screen.draw(0, 2, [0xff, 0xff]);
                expect(callback).toHaveBeenCalled();
            });

            it('should raise an event when clearing', () => {
                var callback = jasmine.createSpy("callback");
                screen.onClear.subscribe(callback);
                screen.clear();
                expect(callback).toHaveBeenCalled();
            });
        });        
    });

    function buildSprite(...lines: string[]): number[]{
        var sprite = [];
        lines.forEach((line: string) => {
            sprite.push(parseInt(line, 2));
        });
        return sprite;
    }

    function getPixel(pixels: number[], x: number, y: number, stride: number): number{
        var addr = x + y * stride;
        return pixels[addr];
    }
}
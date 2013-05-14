/// <reference path="../.typings/jasmine.d.ts" />

import memModule = module('chip8/memory');
var Memory = memModule.chip8.Memory;

export module chip8.spec {
    describe('A memory object', () => {
        it('should be initialized with a specified size', () => {
            var memory = new Memory(32);
            expect(memory.Size).toBe(32);
        });

        it('should have a default size of 4096', () => {
            var memory = new Memory();
            expect(memory.Size).toBe(4096);
        });

        it('should store and retrieve a value', () => {
            var memory = new Memory(32);
            memory.write(0, 1337);
            expect(memory.read(0)).toBe(1337);
        });

        it('should initialize storage to zero', () => {
            var memory = new Memory(10);
            for (var i = 0; i < 10; i++){
                expect(memory.read(i)).toBe(0);
            }
        });

        it('should throw an exception if reading outside of bounds', () => {
            var memory = new Memory(32);
            expect(() => {
                memory.read(-1);
            }).toThrow("Address (-1) was out of bounds");

            expect(() => {
                memory.read(32);
            }).toThrow("Address (32) was out of bounds");
        });

        it('should throw an exception if writing outside of bounds', () => {
            var memory = new Memory(32);
            expect(() => {
                memory.write(-1,1);
            }).toThrow("Address (-1) was out of bounds");

            expect(() => {
                memory.write(32,1);
            }).toThrow("Address (32) was out of bounds");
        });

        describe('When writing', () => {
            it('should raise an event', () => {
                var memory = new Memory(32);
                var callback = jasmine.createSpy("callback");
                memory.onWrite.subscribe(callback);
                memory.write(10, 200);
                expect(callback).toHaveBeenCalledWith(10, 200);
            });
        });

        describe('When bulk loading', () => {
            var memory;
            beforeEach(() => {
                memory = new Memory(32);
            });
            it('should load values starting at the correct address', () => {
                memory.load(10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
                for (var i = 10; i < 15; i++){
                    expect(memory.read(i)).toBe(i - 9);
                }
                expect(memory.read(15)).toBe(0);
            });

            it('should throw an exception for an invalid start address', () => {
                expect(() => {
                    memory.load(-1, [1, 2, 3, 4], 4);
                }).toThrow("Address (-1) was out of bounds");

                expect(() => {
                    memory.load(32, [1, 2, 3, 4], 4);
                }).toThrow("Address (32) was out of bounds");
            });

            it('should throw an exception when data would overflow', () => {
                expect(() => {
                    memory.load(0, [1, 2, 3, 4], 64);
                }).toThrow("Data (64) would overflow memory(32)");
            });

            it('should copy entire array if size is less than zero', () => {
                memory.load(0, [1, 2, 3, 4], -1);
                for (var i = 0; i < 4; i++){
                    expect(memory.read(i)).toBe(i + 1);
                }
            });
        });
    });
}
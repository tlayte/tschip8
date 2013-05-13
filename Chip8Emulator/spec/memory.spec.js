define(["require", "exports", 'chip8/memory'], function(require, exports, __memModule__) {
    /// <reference path="../.typings/jasmine.d.ts" />
    var memModule = __memModule__;

    var Memory = memModule.chip8.Memory;
    (function (chip8) {
        (function (spec) {
            describe('A memory object', function () {
                it('should be initialized with a specified size', function () {
                    var memory = new Memory(32);
                    expect(memory.Size).toBe(32);
                });
                it('should have a default size of 4096', function () {
                    var memory = new Memory();
                    expect(memory.Size).toBe(4096);
                });
                it('should store and retrieve a value', function () {
                    var memory = new Memory(32);
                    memory.write(0, 1337);
                    expect(memory.read(0)).toBe(1337);
                });
                it('should initialize storage to zero', function () {
                    var memory = new Memory(10);
                    for(var i = 0; i < 10; i++) {
                        expect(memory.read(i)).toBe(0);
                    }
                });
                it('should throw an exception if reading outside of bounds', function () {
                    var memory = new Memory(32);
                    expect(function () {
                        memory.read(-1);
                    }).toThrow("Address (-1) was out of bounds");
                    expect(function () {
                        memory.read(32);
                    }).toThrow("Address (32) was out of bounds");
                });
                it('should throw an exception if writing outside of bounds', function () {
                    var memory = new Memory(32);
                    expect(function () {
                        memory.write(-1, 1);
                    }).toThrow("Address (-1) was out of bounds");
                    expect(function () {
                        memory.write(32, 1);
                    }).toThrow("Address (32) was out of bounds");
                });
                describe('When writing', function () {
                    it('should raise an event', function () {
                        var memory = new Memory(32);
                        var callback = jasmine.createSpy("callback");
                        memory.onWrite.subscribe(callback);
                        memory.write(10, 200);
                        expect(callback).toHaveBeenCalled();
                    });
                });
                describe('When bulk loading', function () {
                    var memory;
                    beforeEach(function () {
                        memory = new Memory(32);
                    });
                    it('should load values starting at the correct address', function () {
                        memory.load(10, [
                            1, 
                            2, 
                            3, 
                            4, 
                            5, 
                            6, 
                            7, 
                            8, 
                            9, 
                            10
                        ], 5);
                        for(var i = 10; i < 15; i++) {
                            expect(memory.read(i)).toBe(i - 9);
                        }
                        expect(memory.read(15)).toBe(0);
                    });
                    it('should throw an exception for an invalid start address', function () {
                        expect(function () {
                            memory.load(-1, [
                                1, 
                                2, 
                                3, 
                                4
                            ], 4);
                        }).toThrow("Address (-1) was out of bounds");
                        expect(function () {
                            memory.load(32, [
                                1, 
                                2, 
                                3, 
                                4
                            ], 4);
                        }).toThrow("Address (32) was out of bounds");
                    });
                    it('should throw an exception when data would overflow', function () {
                        expect(function () {
                            memory.load(0, [
                                1, 
                                2, 
                                3, 
                                4
                            ], 64);
                        }).toThrow("Data (64) would overflow memory(32)");
                    });
                    it('should copy entire array if size is less than zero', function () {
                        memory.load(0, [
                            1, 
                            2, 
                            3, 
                            4
                        ], -1);
                        for(var i = 0; i < 4; i++) {
                            expect(memory.read(i)).toBe(i + 1);
                        }
                    });
                });
            });
        })(chip8.spec || (chip8.spec = {}));
        var spec = chip8.spec;
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=memory.spec.js.map

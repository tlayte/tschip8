define(["require", "exports", "chip8/decoder"], function(require, exports, __decoderModule__) {
    var decoderModule = __decoderModule__;

    var Chip8 = decoderModule.chip8;
    (function (chip8) {
        (function (spec) {
            describe('An instruction decoder', function () {
                var decoder;
                var memorySpy;
                var registerSpy;
                beforeEach(function () {
                    memorySpy = jasmine.createSpyObj("memorySpy", [
                        "read", 
                        "write"
                    ]);
                    registerSpy = jasmine.createSpyObj("memorySpy", [
                        "read", 
                        "write"
                    ]);
                    Object.defineProperty(registerSpy, "PC", {
                        set: function (value) {
                            this.write("PC", value);
                        },
                        get: function () {
                            return this.read("PC");
                        }
                    });
                    decoder = new Chip8.Decoder(memorySpy, registerSpy);
                });
                it('should read the program counter', function () {
                    decoder.getNext();
                    expect(registerSpy.read).toHaveBeenCalledWith("PC");
                });
                it('should read both bytes of the next instruction', function () {
                    registerSpy.read.andReturn(512);
                    decoder.getNext();
                    expect(memorySpy.read).toHaveBeenCalledWith(512);
                    expect(memorySpy.read).toHaveBeenCalledWith(513);
                });
                it('should increment the program counter', function () {
                    registerSpy.read.andReturn(512);
                    decoder.getNext();
                    expect(registerSpy.write).toHaveBeenCalledWith("PC", 514);
                });
                describe('returns an instruction which', function () {
                    var fakeData = [
                        245, 
                        101
                    ];
                    var instruction;
                    beforeEach(function () {
                        memorySpy = jasmine.createSpyObj("memorySpy", [
                            "read", 
                            "write"
                        ]);
                        memorySpy.read.andCallFake(function (address) {
                            return fakeData[address - 512];
                        });
                        registerSpy = jasmine.createSpyObj("memorySpy", [
                            "read", 
                            "write"
                        ]);
                        Object.defineProperty(registerSpy, "PC", {
                            get: function () {
                                return 512;
                            }
                        });
                        decoder = new Chip8.Decoder(memorySpy, registerSpy);
                        instruction = decoder.getNext();
                    });
                    it('should have the 16bit opcode', function () {
                        expect(instruction.opcode).toBe(62821);
                    });
                    it('should have an array of nibbles', function () {
                        expect(instruction.nibbles[0]).toBe(15);
                        expect(instruction.nibbles[1]).toBe(5);
                        expect(instruction.nibbles[2]).toBe(6);
                        expect(instruction.nibbles[3]).toBe(5);
                    });
                    it('should have an array of bytes', function () {
                        expect(instruction.bytes[0]).toBe(245);
                        expect(instruction.bytes[1]).toBe(101);
                    });
                });
            });
        })(chip8.spec || (chip8.spec = {}));
        var spec = chip8.spec;
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=decoder.spec.js.map

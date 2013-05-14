define(["require", "exports", "chip8/stack"], function(require, exports, __stackModule__) {
    var stackModule = __stackModule__;

    var Chip8 = stackModule.chip8;
    (function (chip8) {
        (function (spec) {
            describe('A stack', function () {
                it('should have a default size of 16', function () {
                    var stack = new Chip8.Stack();
                    expect(stack.size).toBe(16);
                });
                it('should allow a size to be specified', function () {
                    var stack = new Chip8.Stack(32);
                    expect(stack.size).toBe(32);
                });
                it('should reset SP to zero', function () {
                    var stack = new Chip8.Stack(10);
                    stack.push(1);
                    stack.push(2);
                    stack.push(3);
                    stack.reset();
                    expect(stack.SP).toBe(0);
                });
                describe('when pushing values', function () {
                    var stack;
                    beforeEach(function () {
                        stack = new Chip8.Stack(5);
                    });
                    it('should increase the stack pointer', function () {
                        stack.push(1);
                        expect(stack.SP).toBe(1);
                    });
                    it('should throw on stack overflow', function () {
                        stack.push(1);
                        stack.push(1);
                        stack.push(1);
                        stack.push(1);
                        stack.push(1);
                        expect(function () {
                            stack.push(1);
                        }).toThrow("Stack overflow");
                    });
                });
                describe('when popping values', function () {
                    var stack;
                    beforeEach(function () {
                        stack = new Chip8.Stack(5);
                        stack.push(1);
                        stack.push(2);
                        stack.push(3);
                        stack.push(4);
                        stack.push(5);
                    });
                    it('should return values in the correct order', function () {
                        expect(stack.pop()).toBe(5);
                        expect(stack.pop()).toBe(4);
                        expect(stack.pop()).toBe(3);
                        expect(stack.pop()).toBe(2);
                        expect(stack.pop()).toBe(1);
                    });
                    it('should throw on stack underflow', function () {
                        stack.pop();
                        stack.pop();
                        stack.pop();
                        stack.pop();
                        stack.pop();
                        expect(function () {
                            stack.pop();
                        }).toThrow("Stack underflow");
                    });
                });
            });
        })(chip8.spec || (chip8.spec = {}));
        var spec = chip8.spec;
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=stack.spec.js.map

/// <reference path="../.typings/jasmine.d.ts" />
import stackModule = module("chip8/stack");
import Chip8 = stackModule.chip8;

export module chip8.spec {
    describe('A stack', () => {
        it('should have a default size of 16', () => {
            var stack = new Chip8.Stack();
            expect(stack.size).toBe(16);
        });

        it('should allow a size to be specified', () => {
            var stack = new Chip8.Stack(32);
            expect(stack.size).toBe(32);
        });

        it('should reset SP to zero', () => {
            var stack = new Chip8.Stack(10);
            stack.push(1);
            stack.push(2);
            stack.push(3);
            stack.reset();
            expect(stack.SP).toBe(0);
        });

        describe('when pushing values', () => {
            var stack: Chip8.Stack;
            beforeEach(() => {
                stack = new Chip8.Stack(5);
            });
            it('should increase the stack pointer', () => {
                stack.push(1);
                expect(stack.SP).toBe(1);
            });
            it('should throw on stack overflow', () => {
                stack.push(1);
                stack.push(1);
                stack.push(1);
                stack.push(1);
                stack.push(1);
                expect(() => { stack.push(1); }).toThrow("Stack overflow");
            });
        });

        describe('when popping values', () => {
            var stack: Chip8.Stack;
            beforeEach(() => {
                stack = new Chip8.Stack(5);
                stack.push(1);
                stack.push(2);
                stack.push(3);
                stack.push(4);
                stack.push(5);
            });

            it('should return values in the correct order', () => {
                expect(stack.pop()).toBe(5);
                expect(stack.pop()).toBe(4);
                expect(stack.pop()).toBe(3);
                expect(stack.pop()).toBe(2);
                expect(stack.pop()).toBe(1);
            });

            it('should throw on stack underflow', () => {
                stack.pop();
                stack.pop();
                stack.pop();
                stack.pop();
                stack.pop();
                expect(() => { stack.pop(); }).toThrow("Stack underflow");
            });
        });
    });
}
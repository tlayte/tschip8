/// <reference path="../.typings/jasmine.d.ts" />
import timersModule = module("chip8/timers");

export module chip8.spec {
    describe("A timers object", () => {
        var timers: timersModule.chip8.Timers;

        beforeEach(() => {
            timers = new timersModule.chip8.Timers();
        });

        it("should raise an event when setting the value", () => {
            var callback = jasmine.createSpy("callback");
            timers.onWrite.subscribe(callback);
            timers.delay = 10;
            timers.sound = 41;
            expect(callback).toHaveBeenCalledWith("delay", 10);
            expect(callback).toHaveBeenCalledWith("sound", 41);
        });

        it('should count down the timers when ticked', () => {
            timers.delay = 10;
            timers.sound = 3;
            var callback = jasmine.createSpy("callback");
            timers.onWrite.subscribe(callback);
            timers.tick();
            expect(timers.delay).toBe(9);
            expect(callback).toHaveBeenCalledWith("sound", 2);
        });

        it('should not count down when at 0', () => {
            var callback = jasmine.createSpy("callback");
            timers.onWrite.subscribe(callback);
            timers.tick();
            expect(callback).not.toHaveBeenCalled();
        });

        it('should raise an event when turning the sound on', () => {
            var callback = jasmine.createSpy("callback");
            timers.onStartSound.subscribe(callback);
            timers.sound = 10;
            expect(callback).toHaveBeenCalled();
        });

        it('should not raise an event when the sound is already on', () => {
            var callback = jasmine.createSpy("callback");
            timers.sound = 4;
            timers.onStartSound.subscribe(callback);
            timers.sound = 10;
            expect(callback).not.toHaveBeenCalled();
        });

        it('should raise an event when turning the sound off', () => {
            var callback = jasmine.createSpy("callback");
            timers.sound = 1;
            timers.onStopSound.subscribe(callback);
            timers.tick();
            expect(callback).toHaveBeenCalled();
        });

        it('should not raise an event when the sound is already off', () => {
            var callback = jasmine.createSpy("callback");
            timers.sound = 0;
            timers.onStopSound.subscribe(callback);
            timers.sound = 0;
            expect(callback).not.toHaveBeenCalled();
        });
    });
}
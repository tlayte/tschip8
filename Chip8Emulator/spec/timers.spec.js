define(["require", "exports", "chip8/timers"], function(require, exports, __timersModule__) {
    var timersModule = __timersModule__;

    (function (chip8) {
        (function (spec) {
            describe("A timers object", function () {
                var timers;
                beforeEach(function () {
                    timers = new timersModule.chip8.Timers();
                });
                it("should raise an event when setting the value", function () {
                    var callback = jasmine.createSpy("callback");
                    timers.onWrite.subscribe(callback);
                    timers.delay = 10;
                    timers.sound = 41;
                    expect(callback).toHaveBeenCalledWith("delay", 10);
                    expect(callback).toHaveBeenCalledWith("sound", 41);
                });
                it('should count down the timers when ticked', function () {
                    timers.delay = 10;
                    timers.sound = 3;
                    var callback = jasmine.createSpy("callback");
                    timers.onWrite.subscribe(callback);
                    timers.tick();
                    expect(timers.delay).toBe(9);
                    expect(callback).toHaveBeenCalledWith("sound", 2);
                });
                it('should not count down when at 0', function () {
                    var callback = jasmine.createSpy("callback");
                    timers.onWrite.subscribe(callback);
                    timers.tick();
                    expect(callback).not.toHaveBeenCalled();
                });
                it('should raise an event when turning the sound on', function () {
                    var callback = jasmine.createSpy("callback");
                    timers.onStartSound.subscribe(callback);
                    timers.sound = 10;
                    expect(callback).toHaveBeenCalled();
                });
                it('should not raise an event when the sound is already on', function () {
                    var callback = jasmine.createSpy("callback");
                    timers.sound = 4;
                    timers.onStartSound.subscribe(callback);
                    timers.sound = 10;
                    expect(callback).not.toHaveBeenCalled();
                });
                it('should raise an event when turning the sound off', function () {
                    var callback = jasmine.createSpy("callback");
                    timers.sound = 1;
                    timers.onStopSound.subscribe(callback);
                    timers.tick();
                    expect(callback).toHaveBeenCalled();
                });
                it('should not raise an event when the sound is already off', function () {
                    var callback = jasmine.createSpy("callback");
                    timers.sound = 0;
                    timers.onStopSound.subscribe(callback);
                    timers.sound = 0;
                    expect(callback).not.toHaveBeenCalled();
                });
            });
        })(chip8.spec || (chip8.spec = {}));
        var spec = chip8.spec;
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=timers.spec.js.map

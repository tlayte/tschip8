define(["require", "exports", "chip8/event"], function(require, exports, __eventModule__) {
    var eventModule = __eventModule__;

    (function (chip8) {
        var Timers = (function () {
            function Timers() {
                this._delay = 0;
                this._sound = 0;
                this.onWrite = new eventModule.chip8.Event();
                this.onStartSound = new eventModule.chip8.Event();
                this.onStopSound = new eventModule.chip8.Event();
            }
            Timers.prototype.tick = function () {
                if(this._delay > 0) {
                    this.delay = this._delay - 1;
                }
                if(this._sound > 0) {
                    this.sound = this._sound - 1;
                }
            };
            Timers.prototype.reset = function () {
                this.delay = 0;
                this.sound = 0;
            };
            Object.defineProperty(Timers.prototype, "delay", {
                get: function () {
                    return this._delay;
                },
                set: function (value) {
                    this._delay = value;
                    this.onWrite.raise("delay", value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Timers.prototype, "sound", {
                set: function (value) {
                    if(value > 0 && this._sound === 0) {
                        this.onStartSound.raise();
                    }
                    if(value === 0 && this._sound > 0) {
                        this.onStopSound.raise();
                    }
                    this._sound = value;
                    this.onWrite.raise("sound", value);
                },
                enumerable: true,
                configurable: true
            });
            return Timers;
        })();
        chip8.Timers = Timers;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=timers.js.map

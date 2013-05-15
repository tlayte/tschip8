define(["require", "exports"], function(require, exports) {
    (function (chip8) {
        var Timers = (function () {
            function Timers() { }
            Object.defineProperty(Timers.prototype, "delay", {
                get: function () {
                    return undefined;
                },
                set: function (value) {
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Timers.prototype, "sound", {
                set: function (value) {
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

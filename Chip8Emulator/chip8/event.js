define(["require", "exports"], function(require, exports) {
    (function (chip8) {
        var Event = (function () {
            function Event() {
                this.handlers = [];
            }
            Event.prototype.raise = function () {
                this.handlers.forEach(function (callback) {
                    callback(arguments);
                });
            };
            Event.prototype.subscribe = function (callback) {
                this.handlers.push(callback);
            };
            return Event;
        })();
        chip8.Event = Event;        
    })(exports.chip8 || (exports.chip8 = {}));
    var chip8 = exports.chip8;
})
//@ sourceMappingURL=event.js.map

define(["require", "exports"], function(require, exports) {
    (function (chip8) {
        var Event = (function () {
            function Event() {
                this.handlers = [];
            }
            Event.prototype.raise = function () {
                var _this = this;
                var params = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    params[_i] = arguments[_i + 0];
                }
                this.handlers.forEach(function (callback) {
                    callback.apply(_this, params);
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

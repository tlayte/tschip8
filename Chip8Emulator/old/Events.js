define(["require", "exports"], function(require, exports) {
    var Event = (function () {
        function Event() {
            this.handlers = [];
        }
        Event.prototype.raise = function (eventArgs) {
            if (typeof eventArgs === "undefined") { eventArgs = null; }
            this.handlers.forEach(function (callback) {
                callback(eventArgs);
            });
        };
        Event.prototype.subscribe = function (callback) {
            this.handlers.push(callback);
        };
        return Event;
    })();
    exports.Event = Event;    
})
//@ sourceMappingURL=Events.js.map

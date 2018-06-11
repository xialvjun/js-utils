"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Channel = /** @class */ (function () {
    function Channel() {
        this.resources = [];
        this.requests = [];
    }
    Channel.prototype.push = function (obj) {
        var request = this.requests.shift();
        if (request) {
            request.resolve(obj);
            return;
        }
        this.resources.push(obj);
    };
    Channel.prototype.pull = function () {
        var _this = this;
        var resource = this.resources.shift();
        if (resource) {
            return Promise.resolve(resource);
        }
        return new Promise(function (resolve, reject) {
            _this.requests.push({ resolve: resolve, reject: reject });
        });
    };
    return Channel;
}());
exports.Channel = Channel;

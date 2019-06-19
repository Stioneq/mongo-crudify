"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var operations_1 = require("./operations");
var MongoCrudify = /** @class */ (function () {
    function MongoCrudify(client, dbName, collection) {
        this.client = client;
        this.dbName = dbName;
        this.collection = collection;
        this.middlewares = {};
    }
    /**
     * Helper function that retrieves collection instance
     */
    MongoCrudify.prototype.getCollection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client];
                    case 1:
                        _client = _a.sent();
                        return [2 /*return*/, _client
                                .db(this.dbName)
                                .collection(this.collection)];
                }
            });
        });
    };
    /**
     * Registers new action by using named function
     * @param func should be named function in order to extract the action name
     * @returns {crudify}
     */
    MongoCrudify.prototype.register = function (func) {
        var action = func.name;
        if (!func.name) {
            throw new Error('Function should be named');
        }
        var middlewares = this.middlewares;
        middlewares[action] = [];
        // @ts-ignore
        var that = this;
        this[func.name] = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var actionMiddlewares;
                var _this = this;
                return __generator(this, function (_a) {
                    actionMiddlewares = middlewares[action];
                    return [2 /*return*/, actionMiddlewares.reduce(function (acc, cur) {
                            return acc.then(function (data) {
                                return cur.call(_this, data);
                            });
                        }, Promise.resolve(data)).then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var collection;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, that.getCollection()];
                                    case 1:
                                        collection = _a.sent();
                                        return [2 /*return*/, func
                                                .call(that, data)
                                                .call(that, collection)];
                                }
                            });
                        }); })];
                });
            });
        };
        return this;
    };
    ;
    /**
     * Adds plugin to the given action. You can pass array [actionName, plugin function] or just two separate arguments
     * @returns {crudify}
     */
    MongoCrudify.prototype.use = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var middlewares = this.middlewares;
        var action;
        var middleware;
        if (arguments.length === 0) {
            throw new Error('middleware should be specified');
        }
        if (arguments.length === 1 && Array.isArray(args[0])) {
            _a = args[0], action = _a[0], middleware = _a[1];
        }
        else {
            action = args[0], middleware = args[1];
        }
        if (!middlewares[action]) {
            throw new Error('Action is not found. Please declare the action with register');
        }
        middlewares[action].push(middleware);
        return this;
    };
    ;
    return MongoCrudify;
}());
exports.default = (function (client, dbName, collection) {
    var crudify = new MongoCrudify(client, dbName, collection);
    crudify
        .register(operations_1.findAll)
        .register(operations_1.findOne)
        .register(operations_1.insertOne)
        .register(operations_1.updateOne)
        .register(operations_1.deleteOne);
    return crudify;
});
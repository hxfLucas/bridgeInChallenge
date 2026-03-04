"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestContextMiddleware = requestContextMiddleware;
function requestContextMiddleware(req, res, next) {
    // Attach a simple context object to the request for per-request state
    req.context = { requestId: req.headers['x-request-id'] || Date.now().toString() };
    next();
}
exports.default = requestContextMiddleware;

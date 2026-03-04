"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
function errorHandler(err, req, res, next) {
    console.error('Unhandled error handler:', err);
    const status = err?.status || 500;
    res.status(status).json({ message: err?.message || 'Internal Server Error' });
}

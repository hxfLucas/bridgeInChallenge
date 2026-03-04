"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCorsMiddleware;
const cors_1 = __importDefault(require("cors"));
function createCorsMiddleware() {
    const origins = process.env.CORS_ALLOWED_ORIGINS || '';
    const originList = origins ? origins.split(',').map(s => s.trim()) : undefined;
    return (0, cors_1.default)({ origin: originList || true, credentials: true });
}

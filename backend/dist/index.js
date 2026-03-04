"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./types/global.d.ts" />
const dotenv_1 = __importDefault(require("dotenv"));
const createApp_1 = require("./createApp");
const http_1 = __importDefault(require("http"));
const safe_shutdown_1 = __importDefault(require("./shared/safe-shutdown"));
dotenv_1.default.config();
(async function main() {
    const app = await (0, createApp_1.createApp)();
    const PORT = Number(process.env.PORT || 3000);
    const server = http_1.default.createServer(app);
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    //Prevent crash globally in very unexpected cases, and / or attempt graceful shutdown
    (0, safe_shutdown_1.default)(server);
})();

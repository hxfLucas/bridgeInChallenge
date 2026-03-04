"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("./shared/middleware/cors"));
const data_source_1 = require("./shared/database/data-source");
const errorHandler_1 = __importDefault(require("./shared/middleware/errorHandler"));
const contents_routes_1 = __importDefault(require("./modules/contents/contents.routes"));
const accounts_routes_1 = __importDefault(require("./modules/accounts/accounts.routes"));
const products_routes_1 = __importDefault(require("./modules/products/products.routes"));
const api_routes_1 = __importDefault(require("./modules/api/v1/api.routes"));
const requestContext_1 = require("./shared/auth/requestContext");
async function createApp(dataSource) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    // CORS - configured via CORS_ALLOWED_ORIGINS env or config
    app.use((0, cors_1.default)());
    app.use(requestContext_1.requestContextMiddleware);
    // if a test datasource is provided, install it as the app singleton
    if (dataSource) {
        (0, data_source_1.setAppDataSource)(dataSource);
    }
    const ds = dataSource ?? (0, data_source_1.getAppDataSource)();
    await ds.initialize().catch((err) => console.error('DataSource init error', err));
    app.use('/accounts', accounts_routes_1.default);
    app.use('/contents', contents_routes_1.default);
    app.use('/products', products_routes_1.default);
    app.use('/api/v1', api_routes_1.default);
    app.use(errorHandler_1.default);
    return app;
}
exports.default = createApp;

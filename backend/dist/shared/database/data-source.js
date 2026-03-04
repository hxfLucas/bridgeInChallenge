"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.baseDataSourceOptions = void 0;
exports.createDataSource = createDataSource;
exports.getAppDataSource = getAppDataSource;
exports.setAppDataSource = setAppDataSource;
require("reflect-metadata");
require("dotenv/config");
const typeorm_1 = require("typeorm");
exports.baseDataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    entities: [__dirname + '/../../**/*.entity.{ts,js}'],
    migrations: [__dirname + '/../../migrations/*.{ts,js}']
};
function createDataSource(overrides) {
    // allow loose overrides (from tests) and cast to DataSourceOptions for TypeORM
    const options = { ...exports.baseDataSourceOptions, ...(overrides || {}) };
    return new typeorm_1.DataSource(options);
}
// internal singleton instance (not exported directly)
let appDataSource = createDataSource();
exports.AppDataSource = appDataSource;
function getAppDataSource() {
    return appDataSource;
}
function setAppDataSource(ds) {
    appDataSource = ds;
}

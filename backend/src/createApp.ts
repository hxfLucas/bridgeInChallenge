import express from 'express';
import cookieParser from 'cookie-parser';
import createCorsMiddleware from './shared/middleware/cors';
import { getAppDataSource, setAppDataSource } from './shared/database/data-source';
import errorHandler from './shared/middleware/errorHandler';
import contentsRouter from './modules/contents/contents.routes';
import accountsRouter from './modules/accounts/accounts.routes';
import productsRouter from './modules/products/products.routes';
import apiRouter from './modules/api/v1/api.routes';
import { requestContextMiddleware } from './shared/auth/requestContext';

export async function createApp(dataSource?: any){
        const app = express();
        app.use(express.json());
        app.use(cookieParser());
        // CORS - configured via CORS_ALLOWED_ORIGINS env or config
        app.use(createCorsMiddleware());

        app.use(requestContextMiddleware);
        // if a test datasource is provided, install it as the app singleton
        if (dataSource) {
          setAppDataSource(dataSource);
        }

        const ds = dataSource ?? getAppDataSource();
        await ds.initialize().catch((err:any) => console.error('DataSource init error', err));

        app.use('/accounts', accountsRouter);
        app.use('/contents', contentsRouter);
        app.use('/products', productsRouter);
        app.use('/api/v1', apiRouter);
        app.use(errorHandler);
        return app;
}

export default createApp;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = attachProcessHandlers;
function attachProcessHandlers(server) {
    const shutdown = (reason) => {
        console.log('Shutting down server', reason || '');
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
        setTimeout(() => process.exit(1), 10000);
    };
    process.on('uncaughtException', (err) => {
        console.error('uncaughtException', err);
        shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (reason) => {
        console.error('unhandledRejection', reason);
        shutdown('unhandledRejection');
    });
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

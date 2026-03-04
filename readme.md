backend - the backend built in nodejs (express)
frontend - the frontend of the app built in reactJs

useful commands:

npx typeorm-ts-node-commonjs migration:generate -d src/shared/database/data-source.ts src/migrations/init

npx typeorm-ts-node-commonjs migration:run -d src/shared/database/data-source.ts
backend - the backend built in nodejs (express)
frontend - the frontend of the app built in reactJs

useful commands:

npx typeorm-ts-node-commonjs migration:generate -d src/shared/database/data-source.ts src/migrations/init

npx typeorm-ts-node-commonjs migration:run -d src/shared/database/data-source.ts

Dev environment setup:

Frontend:

cd frontend
npm install
npm run dev

rename .envExample to .env


Backend:



cd backend
rename .envExample to .env
Create a postgres database locally and replace the details from the  .envExample with it
npm install npm run dev
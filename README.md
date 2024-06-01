Steps to run:
1. Start client server
cd into client folder and run :
npm install
npm run dev

2. Start Server:
cd into server and run 
npm install
npm start


Docker containerization:
There are 3 separate files:
1. frontend.dockerfile
2. backend.dockerfile
3. docker-compose.yml

We need to do a few changes to make sure that we have proper configuration for docker:
1. change package.json of client -> change "dev": "vite --host" to "dev": "vite --host" : to expose host
2. change package.json of server -> change "start": "nodemon app.js" to "start": "nodemon server/app.js" and change from "main": "app.js" to "main": "server/app.js" : to make sure that we are following directory structure expected by the container.

Execution:
1. cd into chatGPT clone folder
2. Build backend image - docker build --file=server/backend.dockerfile  -t playground-web-backend_new .
3. Build frontend image -  docker build --file=client/frontend.dockerfile  -t playground-web-frontend_new .
4. Run the compose file - docker-compose -f docker-compose.yml up



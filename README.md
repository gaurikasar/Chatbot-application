# ChatGPT Clone Setup and Docker Containerization

## Environment Configuration
Ensure all API endpoints and credentials are added to the `.env` file.

## Steps to Run the Application

### Start Client Server
1. Navigate to the client folder:
    ```sh
    cd client
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the development server:
    ```sh
    npm run dev
    ```

### Start Server
1. Navigate to the server folder:
    ```sh
    cd server
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the server:
    ```sh
    npm start
    ```

## Docker Containerization

The project uses three separate files for Docker configuration:
1. `frontend.dockerfile`
2. `backend.dockerfile`
3. `docker-compose.yml`

### Required Changes for Docker Configuration

#### Client
1. In `package.json`, change:
    ```json
    "dev": "vite"
    ```
    to:
    ```json
    "dev": "vite --host"
    ```

#### Server
1. In `package.json`, change:
    ```json
    "start": "nodemon app.js"
    ```
    to:
    ```json
    "start": "nodemon server/app.js"
    ```
2. Also, change:
    ```json
    "main": "app.js"
    ```
    to:
    ```json
    "main": "server/app.js"
    ```

### Execution

1. Navigate to the root folder of the ChatGPT clone project:
    ```sh
    cd Gauri-Kasar-Answerai-Fullstack
    ```
2. Build the backend Docker image:
    ```sh
    docker build --file=server/backend.dockerfile -t playground-web-backend_new .
    ```
3. Build the frontend Docker image:
    ```sh
    docker build --file=client/frontend.dockerfile -t playground-web-frontend_new .
    ```
4. Run the Docker Compose file:
    ```sh
    docker-compose -f docker-compose.yml up
    ```

---

This README file guides you through the setup and Docker containerization process for the ChatGPT clone project. Follow the steps sequentially to ensure proper configuration and execution.


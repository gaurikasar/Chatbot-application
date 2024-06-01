# Features 
1. Login & signup: User can signup a link is sent out on email and then user can signup, and then user can login. I have used bcrypt to encrypt the password. Used MongoDB database to store the email, password, firstname and lastname. Also used 2 table to track this user table - entries for login, temp taable - when user just signs up and has not yet clicked on verification link.
2. Chat : User cnan store all the conversation and can also clear/delete them if required.
3. Token tracking limit: There is a token usage tracker implemented and you can see the tokens on the left side of the page and there is a limit of 5000 tokens for a user
4. Logout: once user logs out the session ends, JWT tokens are used to manage sessions.
   
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


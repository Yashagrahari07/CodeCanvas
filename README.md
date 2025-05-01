<div align="left">
  <h1 align="center">
    <img src="https://github.com/Yashagrahari07/CodeCanvas/blob/main/client/src/assets/logoCode.png" width="100" />
    <br>CodeCanvas
  </h1>
  <h3 align="center">A RealTime Code Editor</h3>
  
  <p align="center">
    <img src="https://img.shields.io/badge/React-61DAFB.svg?style&logo=React&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Express-000000.svg?style&logo=Express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-47A248.svg?style&logo=MongoDB&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style&logo=node.js&logoColor=white" alt="NodeJS"/>
    <img src="https://img.shields.io/badge/WebSocket-010101?style&logo=WebSocket&logoColor=white" alt="WebSocket" />
    <img src="https://img.shields.io/badge/Judge0_API-010101?style&logo&logoColor=white" alt="Judge0 API"/>


  </p>

---

## 🚀 Overview

CodeAlong is a dynamic and interactive code editor application which leverages the Monaco Editor for React to provide a robust coding environment where users can create and manage folders and files seamlessly.
Built with WebSocket API, this feature allows two or more users to engage in real-time coding. They can share the same editor space and see each other's changes instantly.
This project is designed to facilitate collaborative coding, making it an ideal tool for pair programming, coding interviews, and team-based coding projects.

---

## 🌟 Features

- **Folder and File Management**: Create and manage multiple folders and files within the editor.
    
- **Code Writing and Execution**: Write and execute code directly within the editor, supporting multiple programming languages.

- **Import/Export Functionality**: Import and export code files, input files, and output files seamlessly for easy sharing and backup.

- **Synchronized Editing**: - Two or more users can collaboratively edit the same code file in real-time, with instant updates reflecting changes made by any participant.
  
- **WebSocket Integration**: Utilizes the WebSocket API to ensure smooth and real-time communication between users, providing a seamless collaborative coding experience.

- **Editor Integration**: - Provides a feature-rich code editing interface with syntax highlighting, and other editing features.
  
- **Organizational Tools**: Users can organize their code and related files efficiently within the editor, enhancing productivity and ease of access.

---

## 🚀 Overview

**CodeCanvas** is a real-time, interactive code editor built to enable seamless collaborative coding. It leverages the Monaco Editor for React and the WebSocket API to allow users to write, share, and execute code together in real-time. Perfect for pair programming, coding interviews, and team-based projects.

---

## 🌟 Features

- **Folder and File Management**: Create and manage multiple folders and files within the editor.
- **Code Writing and Execution**: Write and execute code directly within the editor, supporting multiple programming languages.
- **Import/Export Functionality**: Import and export code, input files, and output files for easy sharing and backup.
- **Synchronized Editing**: Collaborate in real-time with multiple users editing the same file simultaneously.
- **WebSocket Integration**: Real-time updates and smooth communication using WebSocket API.
- **Editor Integration**: Rich code editor with syntax highlighting and other advanced features.
- **Organizational Tools**: Efficient file organization within the editor.

---

## 🛠️ Installation and Setup

### Backend API

1. **Clone the repository**
    ```sh
    git clone https://github.com/Yashagrahari07/CodeCanvas.git
    cd CodeCanvas/server
    ```

2. **Install dependencies**
    ```sh
    npm install --legacy-peer-deps
    ```

3. **Set up environment variables**
   Create a `.env` file in the `server` directory with the following environment variables:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    SECRET_KEY=your_jwt_secret
    BASE_URL=your_localhost_url
    ```

   - **MONGO_URI**: Your MongoDB connection string.
   - **SECRET_KEY**: Secret key for JWT authentication.
   - **BASE_URL**: Localhost URL (e.g., `http://localhost:5000`).

4. **If you're running the server locally**, update the `client` files:
   - **In the `client/src/socket.js` file**, update the WebSocket connection URL:
   
     ```js
     return io('http://localhost:5000', options);
     ```

   - **In the `client/src/api/api.js` file**, update the `baseURL` to `http://localhost:5000`.

5. **Start the backend server**
    ```sh
    npm start
    ```

### Frontend App

1. **Navigate to the frontend directory**
    ```sh
    cd ../client
    ```

2. **Install dependencies**
    ```sh
    npm install --legacy-peer-deps
    ```

3. **Start the frontend server**
    ```sh
    npm start
    ```

   By default, the frontend application will run at `http://localhost:5173`.

---

## 🚀 Usage

- Open the frontend application in your browser (usually at `http://localhost:5173`).
- Sign up for an account or sign in if you already have one.
   Example credentials for login:
   ```sh
   email: a@gmail.com
   password: a
- Navigate through the application and try real time coding experience with friends.
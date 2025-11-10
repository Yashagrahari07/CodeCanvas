<div align="left">
  <h1 align="center">
    <img src="https://github.com/Yashagrahari07/CodeCanvas/blob/main/client/src/assets/logoCode.png" width="100" />
    <br>CodeCanvas
  </h1>
  <h3 align="center">A Real-Time Collaborative Code Editor</h3>
  
  <p align="center">
    <img src="https://img.shields.io/badge/React-61DAFB.svg?style&logo=React&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Express-000000.svg?style&logo=Express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-47A248.svg?style&logo=MongoDB&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style&logo=node.js&logoColor=white" alt="NodeJS"/>
    <img src="https://img.shields.io/badge/WebSocket-010101?style&logo=WebSocket&logoColor=white" alt="WebSocket" />
    <img src="https://img.shields.io/badge/Judge0_API-010101?style&logo&logoColor=white" alt="Judge0 API"/>
    <img src="https://img.shields.io/badge/Vite-646CFF?style&logo=vite&logoColor=white" alt="Vite" />
  </p>

---

## 🚀 Overview

**CodeCanvas** is a real-time, interactive code editor built to enable seamless collaborative coding. It leverages the Monaco Editor for React and the WebSocket API to allow users to write, share, and execute code together in real-time. Perfect for pair programming, coding interviews, and team-based projects.

---

## 🌟 Features

- **Real-Time Collaboration**: Multiple users can edit code simultaneously with instant synchronization using WebSocket
- **Workspace Management**: Create and organize folders and files within the editor
- **Multi-Language Support**: Code in C++, Python, JavaScript, and Java
- **Code Execution**: Run and test code directly in the browser with Judge0 API integration
- **Input/Output Handling**: Test your code with custom input and view execution results
- **Import/Export Functionality**: Import and export code files, input files, and output files
- **Resizable Editor**: Draggable divider to adjust editor and input/output panel widths
- **Room-Based Collaboration**: Join coding rooms and collaborate with team members in real-time
- **User Authentication**: Secure sign up and sign in with JWT authentication
- **Modern UI**: Beautiful, responsive interface with dark/light theme support
- **Code Saving**: Save your code to workspaces for later access

---

## 🛠️ Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database (local or cloud)

### Backend Setup

1. **Navigate to the server directory**
    ```sh
    cd server
    ```

2. **Install dependencies**
    ```sh
    npm install
    ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string_here
    SECRET_KEY=your_jwt_secret_key_here
    CORS_ORIGIN=http://localhost:5173
    ```

   - **PORT**: Server port (default: 5000)
   - **MONGO_URI**: Your MongoDB connection string (e.g., `mongodb://localhost:27017/codecanvas` or MongoDB Atlas URI)
   - **SECRET_KEY**: Secret key for JWT token signing (use a strong random string)
   - **CORS_ORIGIN**: Allowed origin for CORS (use `http://localhost:5173` for local development, or comma-separated for multiple origins)

4. **Start the backend server**
    ```sh
    npm start
    ```
    
    For development with auto-reload:
    ```sh
    npm run dev
    ```

   The server will run on `http://localhost:5000` by default.

### Frontend Setup

1. **Navigate to the client directory**
    ```sh
    cd client
    ```

2. **Install dependencies**
    ```sh
    npm install
    ```

3. **Set up environment variables**
   
   Create a `.env` file in the `client` directory:
    ```env
    # API Configuration
    VITE_API_BASE_URL=http://localhost:5000

    # Socket.io Configuration
    VITE_SOCKET_URL=http://localhost:5000

    # Judge0 API Configuration
    VITE_JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com/submissions
    VITE_JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
    VITE_JUDGE0_API_KEY=your_judge0_api_key_here
    ```

   **Note**: In Vite, environment variables must be prefixed with `VITE_` to be exposed to client-side code.

   - **VITE_API_BASE_URL**: Backend API base URL
   - **VITE_SOCKET_URL**: WebSocket server URL
   - **VITE_JUDGE0_API_URL**: Judge0 API endpoint
   - **VITE_JUDGE0_API_HOST**: Judge0 API host
   - **VITE_JUDGE0_API_KEY**: Your Judge0 API key from RapidAPI

4. **Start the development server**
    ```sh
    npm run dev
    ```
    
    Or:
    ```sh
    npm start
    ```

   The frontend will run on `http://localhost:5173` by default.

5. **Build for production**
    ```sh
    npm run build
    ```

---

## 🚀 Usage

1. **Start both servers** (backend and frontend) as described above.

2. **Open the application** in your browser at `http://localhost:5173`.

3. **Sign Up** for a new account or **Sign In** if you already have one.

   **Guest Account for Testing**:
   ```sh
   email: yash@gmail.com
   password: yash1234
   ```
   You can use these credentials to quickly test the application without creating a new account.

4. **Create Workspaces**: 
   - After logging in, create folders and files to organize your code
   - Each workspace can contain multiple code files

5. **Code and Execute**:
   - Write code in the editor
   - Use the input section to provide test input
   - Click "Run" to execute your code
   - View output in the output section

6. **Collaborate in Rooms**:
   - Click "Join Room" to create or join a collaborative coding room
   - Share the room ID with others
   - Code together in real-time with synchronized editing

7. **Import/Export**:
   - Import code files from your computer
   - Export code, input, and output files
   - Save your code to workspaces

---

## 📁 Project Structure

```
CodeCanvas/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/          # API configuration
│   │   ├── service/      # Judge0 service
│   │   └── socket.js     # Socket.io client
│   ├── public/           # Static assets
│   └── package.json
├── server/                # Backend Express server
│   ├── controllers/      # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middlewares/     # Auth middleware
│   └── server.js        # Server entry point
└── README.md
```

---

## 🔧 Technologies Used

- **Frontend**: React, Vite, Monaco Editor, Socket.io Client, Axios
- **Backend**: Node.js, Express, Socket.io, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Code Execution**: Judge0 API (via RapidAPI)
- **Real-time Communication**: WebSocket (Socket.io)

---

## 📝 Environment Variables

### Server (.env)
- `PORT` - Server port number
- `MONGO_URI` - MongoDB connection string
- `SECRET_KEY` - JWT secret key
- `CORS_ORIGIN` - Allowed CORS origins

### Client (.env)
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_SOCKET_URL` - WebSocket server URL
- `VITE_JUDGE0_API_URL` - Judge0 API endpoint
- `VITE_JUDGE0_API_HOST` - Judge0 API host
- `VITE_JUDGE0_API_KEY` - Judge0 API key

---
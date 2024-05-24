# Chat App

A real-time chat application built with Node.js, Express, and Socket.IO.

## Features

- Real-time messaging
- User login with username
- Message history
- Typing indicators
- User list
- Private messaging
- Timestamps for messages
- Notification sounds for new messages

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app

2. Install the dependencies: npm start

3. Running the Application
To start the application, run: npm start

4. Accessing the Application
Open your web browser and navigate to: http://localhost:3000

Usage
1. Login: Enter your username and click "Login".
2. Send Messages: Type your message and click "Send". To send a private     message, start your message with @username.
3. Notifications: A sound will play when a new message is received.
4. Typing Indicator: See who is typing in real-time.
5. User List: View the list of currently connected users.

Project Structure
Ensure your project directory structure is as follows:
chat-app/
├── node_modules/
├── public/
│   ├── notification.mp3
│   ├── styles.css
│   └── script.js
├── .gitignore
├── package.json
├── vercel.json
├── README.md
├── server.js
└── index.html

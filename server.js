const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];
let messages = [];

app.use(express.static(__dirname)); // Serve static files from the root directory

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('set username', (username) => {
    socket.username = username;
    users.push(username);
    io.emit('user list', users);
    socket.emit('chat history', messages);
  });

  socket.on('chat message', (data) => {
    const message = { username: socket.username, message: data.message, timestamp: new Date() };
    messages.push(message);
    io.emit('chat message', message);
  });

  socket.on('private message', (data) => {
    const toUser = users.find(user => user === data.to);
    if (toUser) {
      const message = { from: socket.username, to: data.to, message: data.message, timestamp: new Date() };
      io.to(Array.from(io.sockets.sockets).find(([id, s]) => s.username === data.to)[0]).emit('private message', message);
    }
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing', { username: socket.username });
  });

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    users = users.filter(user => user !== socket.username);
    io.emit('user list', users);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

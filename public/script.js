document.addEventListener('DOMContentLoaded', () => {
  const loginPage = document.getElementById('loginPage');
  const chatPage = document.getElementById('chatPage');
  const usernameInput = document.getElementById('usernameInput');
  const loginButton = document.getElementById('loginButton');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const messages = document.getElementById('messages');
  const typingIndicator = document.getElementById('typingIndicator');
  const userList = document.getElementById('userList');

  const socket = io();

  let username = localStorage.getItem('username') || '';

  if (username) {
    loginPage.classList.remove('active');
    chatPage.classList.add('active');
    socket.emit('set username', username);
  }

  loginButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
      localStorage.setItem('username', username);
      loginPage.classList.remove('active');
      chatPage.classList.add('active');
      socket.emit('set username', username);
    }
  });

  sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    const isPrivate = message.startsWith('@');
    if (message) {
      if (isPrivate) {
        const [recipient, ...rest] = message.split(' ');
        const privateMessage = rest.join(' ');
        socket.emit('private message', { to: recipient.substring(1), message: privateMessage });
      } else {
        socket.emit('chat message', { username, message });
      }
      messageInput.value = '';
      socket.emit('stop typing');
    }
  });

  messageInput.addEventListener('input', () => {
    if (messageInput.value) {
      socket.emit('typing');
    } else {
      socket.emit('stop typing');
    }
  });

  socket.on('chat message', (data) => {
    const item = document.createElement('li');
    const timestamp = new Date(data.timestamp).toLocaleTimeString();
    item.textContent = `[${timestamp}] ${data.username}: ${data.message}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);

    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play();
  });

  socket.on('private message', (data) => {
    const item = document.createElement('li');
    const timestamp = new Date(data.timestamp).toLocaleTimeString();
    item.textContent = `[${timestamp}] [Private] ${data.from}: ${data.message}`;
    item.style.color = 'red';
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);

    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play();
  });

  socket.on('typing', (data) => {
    typingIndicator.textContent = `${data.username} is typing...`;
  });

  socket.on('stop typing', () => {
    typingIndicator.textContent = '';
  });

  socket.on('user list', (users) => {
    userList.innerHTML = '<h2>Users:</h2><ul>' + users.map(user => `<li>${user}</li>`).join('') + '</ul>';
  });

  socket.on('connect', () => {
    console.log('connected to server');
  });

  socket.on('disconnect', () => {
    console.log('disconnected from server');
  });
});

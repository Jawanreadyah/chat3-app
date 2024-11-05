import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5173"]
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
}

const users = new Map();
const messages = [];

io.on('connection', (socket) => {
  socket.on('join', (username) => {
    users.set(socket.id, { username, id: socket.id });
    io.emit('userList', Array.from(users.values()));
    socket.emit('previousMessages', messages);
  });

  socket.on('message', (message) => {
    const user = users.get(socket.id);
    const messageObj = {
      id: Date.now(),
      user,
      text: message,
      timestamp: new Date().toISOString()
    };
    messages.push(messageObj);
    if (messages.length > 100) messages.shift();
    io.emit('message', messageObj);
  });

  socket.on('typing', (isTyping) => {
    const user = users.get(socket.id);
    if (user) {
      socket.broadcast.emit('userTyping', { user, isTyping });
    }
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('userList', Array.from(users.values()));
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
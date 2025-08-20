// socket.js
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');

let io;

module.exports = {
  init: (httpServer) => {
    io = socketIo(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
          return next(new Error('Authentication error'));
        }
        socket.userId = decoded.userId;
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      console.log('User connected: ' + socket.userId);
      
      // Join room for user's own notifications
      socket.join(socket.userId);
      
      // Handle contact requests
      socket.on('contact-request', async (data) => {
        try {
          // Broadcast to the inventory owner
          io.to(data.inventoryOwner).emit('new-contact-request', {
            from: socket.user,
            inventoryId: data.inventoryId,
            message: data.message
          });
        } catch (error) {
          socket.emit('error', { message: 'Failed to send contact request' });
        }
      });
      
      // Handle status updates
      socket.on('update-status', async (data) => {
        try {
          // Broadcast to all interested parties
          io.to(data.inventoryId).emit('status-updated', {
            inventoryId: data.inventoryId,
            status: data.status,
            updatedBy: socket.user
          });
        } catch (error) {
          socket.emit('error', { message: 'Failed to update status' });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.userId);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
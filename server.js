// NodeModule imports
const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

// App specific imports
const formatMessage = require('./utils/messages');
const { 
    userJoin, 
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

// Config
dotenv.config();
const PORT = process.env.PORT || 3000;
const BOTNAME = process.env.BOTNAME || "ChatCord Bot";

// Bootstrapping
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Websocket Setup
io.on('connection', socket => {
    // Listen for joinRoom
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        // Join room
        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(BOTNAME, 'Welcome to ChatCord!'));

        // Broadcast when user connects
        socket.broadcast.to(user.room).emit('message', 
            formatMessage(BOTNAME, `${user.username} has joined the chat.`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', 
                formatMessage(BOTNAME, `${user.username} has left the chat.`));
            
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }        
    });
});

// Init Server
app.use(express.static(path.join(__dirname, 'public')));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

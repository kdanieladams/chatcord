// Imports
const socket = io();

// Elements
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get user/room data
const username = window.sessionStorage.getItem('username');
const room = window.sessionStorage.getItem('room');

if(!username || !room) {
    alert('You must specify both a username and a room!');
    window.location.href = '/';
}

// Join room
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUserList(users);
});

// Listen for new message
socket.on('message', msg => {
    // console.log(msg);
    outputMessage(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();    
    const input = e.target.elements.msg,
        msg = input.value;
    
    // Send message to server
    socket.emit('chatMessage', msg);

    // Clear input box
    input.value = '';
    input.focus();
});

// Ouput message to DOM
function outputMessage(msg) {
    const div = document.createElement('div');

    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
        <p class="text">${msg.text}</p>`;
    chatMessages.appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Update user list
function outputUserList(users) {
    userList.innerHTML = users.map(user => `<li>${user.username}</li>`).join('');
}

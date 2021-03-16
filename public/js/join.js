const joinForm = document.getElementById('join-form');
const nameInput = document.getElementById('username');
const roomSelect = document.getElementById('room');

joinForm.addEventListener('submit', e => {
    e.preventDefault();

    const username = nameInput.value,
        room = roomSelect.value;

    // clear data before updating ?
    sessionStorage.clear();

    // update session data
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('room', room);

    // send to chat room client
    window.location.href = "/chat.html";
});

window.addEventListener('load', () => {
    const username = sessionStorage.getItem('username'),
        room = sessionStorage.getItem('room');

    if(username != null)
        nameInput.value = username;

    if(room != null)
        roomSelect.value = room;
});
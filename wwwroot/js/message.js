"use strict"

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/messages")
    .build();

connection.on('ReceiveMessage', function(message) {
    const div = document.createElement('div');
    div.innerHTML = message + '<hr />';
    document.getElementById('messages').appendChild(div);
});

connection.start().catch(error => {
    console.error(error);
})

document.getElementById('sendButton').addEventListener('click', function(event) {
    const message = document.getElementById('message').value;
    connection.invoke('SendMessageToAll', message).catch(error => {
        console.error(error);
    });
    event.preventDefault();
})
"use strict"

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5001/messages")
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
    const groupElement = document.getElementById('group');
    const groupValue = groupElement.options[groupElement.selectedIndex].value;
    let method = 'SendMessageToAll';
    if(groupValue === 'Myself') {
        method = 'SendMessageToCaller';
    }
    const message = document.getElementById('message').value;
    connection.invoke(method, message).catch(error => {
        console.error(error);
    });
    event.preventDefault();
})
"use strict"

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5001/messages")
    .build();

connection.on('ReceiveMessage', function(message) {
    const div = document.createElement('div');
    div.innerHTML = message + '<hr />';
    document.getElementById('messages').appendChild(div);
});

// Any client who is already connected then its connectedId will not be in the list
// Only new connections will be in the list.
connection.on('UserConnected', connectionId => {
    const groupElement = document.getElementById('group');
    const option = document.createElement('option')
    option.text = connectionId;
    option.value = connectionId;
    groupElement.add(option);
});

connection.on('UserDisconnected', connectionId => {
    const groupElement = document.getElementById('group');
    for(let i = 0; groupElement.length; i++) {
        if (groupElement.options[i].value === connectionId) {
            groupElement.remove(i);
        }
    }
});

connection.start().catch(error => {
    console.error(error);
});

document.getElementById('sendButton').addEventListener('click', function(event) {
    const groupElement = document.getElementById('group');
    const groupValue = groupElement.options[groupElement.selectedIndex].value;
    const message = document.getElementById('message').value;

    if(groupValue === 'All' || groupValue === 'Myself') {
        const method = groupValue === 'All'? 'SendMessageToAll' : 'SendMessageToCaller';
        connection.invoke(method, message).catch(error => {
            console.error(error);
        });
    } else {
        connection.invoke('SendMessageToUser',  groupValue, message).catch(error => {
            console.error(error);
        });
    }

    event.preventDefault();
});
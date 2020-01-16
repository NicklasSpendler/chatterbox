var socket = io();
let chatMessage__form = document.querySelector('.chatMessage__form');
let chatMessage__usernameForm = document.querySelector('.chatMessage__usernameForm')
let mainChatViewElem = document.querySelector('.mainChatView');
let audio = new Audio('/assets/media/lyd.mp3');
let chosenUsername;
audio.play();

function explore(){
    console.log('Explore', )
}

function displayNotification(recievedMsg, msgdate) {
    if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function (reg) {
            var options = {
                body: recievedMsg,
                vibrate: [100, 50, 100],
                icon: '/assets/images/catter.png',
                data: {
                    dateOfArrival: msgdate,
                    primaryKey: 1
                },
                actions: [
                    {
                        action: 'explore()', title: 'Explore this new world',
                        icon: 'images/checkmark.png'
                    },
                    {
                        action: 'close', title: 'Close notification',
                        icon: 'images/xmark.png'
                    },
                ]

            };
            reg.showNotification('', options);
        });
    }
}


self.addEventListener('notificationclick', (e) => {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow('http://www.google.com');
        notification.close();
    }

});

Notification.requestPermission(function (status) {
    console.log('Notification permission status:', status);
});


checkUsername();
function checkUsername() {
    if (chosenUsername == undefined) {
        chatMessage__usernameForm.classList.remove("hidden");
        chatMessage__form.classList.add("hidden");
    } else {
        chatMessage__form.classList.remove("hidden");
        chatMessage__usernameForm.classList.add("hidden");
    }
}


chatMessage__usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    chosenUsername = chatMessage__usernameForm.username.value;

    socket.emit('logged in', chosenUsername)
    checkUsername();
});

document.querySelector('.chatMessage__form').addEventListener('submit', (e) => {
    e.preventDefault();

    let date = new Date();

    

    if (chatMessage__form.message.value != "") {


        let chatMessage = document.createElement("p");
        chatMessage.className = "mainChatView__me";
        chatMessage.textContent = chatMessage__form.message.value

        let timeStamp = document.createElement('small');
        timeStamp.className = "timestamp right";
        timeStamp.textContent = date.getHours() + ":" + date.getMinutes();

        mainChatViewElem.appendChild(timeStamp)
        mainChatViewElem.appendChild(chatMessage)

        // mainChatViewElem.innerHTML += `<p class="mainChatView__me">${chatMessage__inputElem.value}</p>`;

        // Kan også bruge socket.send - https://stackoverflow.com/questions/11498508/socket-emit-vs-socket-send
        socket.emit('chat message', { msg: chatMessage__form.message.value, time: date, username: chosenUsername });
        chatMessage__form.message.value = "";
        mainChatViewElem.scrollTop = mainChatViewElem.scrollHeight;
        audio.play();
    }
});

socket.on('chat message', (msg) => {

    let date = new Date(msg.time);
        if (document.visibilityState == "hidden" && 'Notification' in window && navigator.serviceWorker) {
            displayNotification(msg.msg, date);
        }


    let chatMessage = document.createElement("p");
    chatMessage.className = "mainChatView__other";
    chatMessage.textContent = msg.msg;

    let timeStamp = document.createElement('small');
    timeStamp.className = "timestamp left";
    timeStamp.textContent = date.getHours() + ":" + date.getMinutes();

    let userName = document.createElement('span');
    userName.className = "mainChatView__name";
    userName.textContent = msg.username;
    chatMessage.appendChild(userName);

    mainChatViewElem.appendChild(timeStamp)
    mainChatViewElem.appendChild(chatMessage)
    // mainChatViewElem.innerHTML += `<p class="mainChatView__other"><span class="mainChatView__name">Dem</span>${msg}</p>`;
    mainChatViewElem.scrollTop = mainChatViewElem.scrollHeight;
    audio.play();
})
socket.on("logged in", (username) => {
    let date = new Date()
    if (document.visibilityState == "hidden" && 'Notification' in window && navigator.serviceWorker) {
        displayNotification(`${username} has joined`, date)
    }

    let loginMessage = document.createElement('p');
    loginMessage.textContent = `${username} has logged in`;
    loginMessage.className = "loginMessage"
    mainChatViewElem.appendChild(loginMessage)
    console.log('', username)
})
var socket = io();
let chatMessage__form = document.querySelector('.chatMessage__form');
let chatMessage__usernameForm = document.querySelector('.chatMessage__usernameForm')
let mainChatViewElem = document.querySelector('.mainChatView');
let audio = new Audio('/assets/media/lyd.mp3');
let chosenUsername;
audio.play();

checkUsername();
function checkUsername(){
    if(chosenUsername == undefined){
        chatMessage__usernameForm.classList.remove("hidden");
        chatMessage__form.classList.add("hidden");
    }else{
        chatMessage__form.classList.remove("hidden");
        chatMessage__usernameForm.classList.add("hidden");
    }
}


chatMessage__usernameForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    chosenUsername = chatMessage__usernameForm.username.value;

    socket.emit('logged in', chosenUsername)
    checkUsername();
});

document.querySelector('.chatMessage__form').addEventListener('submit',(e)=>{
    e.preventDefault();
    if(chatMessage__form.message.value != ""){
        let date = new Date();

        let chatMessage = document.createElement("p");
        chatMessage.className = "mainChatView__me";
        chatMessage.textContent = chatMessage__form.message.value
        
        let timeStamp = document.createElement('small');
        timeStamp.className = "timestamp right";
        timeStamp.textContent = date.getHours() + ":" + date.getMinutes();
        
        mainChatViewElem.appendChild(timeStamp)
        mainChatViewElem.appendChild(chatMessage)
        
    // mainChatViewElem.innerHTML += `<p class="mainChatView__me">${chatMessage__inputElem.value}</p>`;
    socket.emit('chat message', {msg: chatMessage__form.message.value, time: date, username: chosenUsername});
    chatMessage__form.message.value = "";
    mainChatViewElem.scrollTop = mainChatViewElem.scrollHeight;
    audio.play();
}
});

socket.on('chat message', (msg)=>{
    let date = new Date(msg.time);

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
socket.on("logged in", (username)=>{
    let loginMessage = document.createElement('p');
    loginMessage.textContent = `${username} has logged in`;
    loginMessage.className = "loginMessage"
    mainChatViewElem.appendChild(loginMessage)
    console.log('', username)
})
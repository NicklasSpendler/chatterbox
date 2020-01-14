var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use(express.static("public"));

io.on("connection", handleSocketConnection);

server.listen(process.env.PORT || 3000, handlerServer);

function handleSocketConnection(socket) {
	console.log("A user connected");
	socket.on('disconnect',()=>{
		
		console.log("A user disconnected");
	});
	socket.on('chat message', (msg)=>{
		socket.broadcast.emit('chat message', msg)
	})
	socket.on('logged in', (username)=>{
		io.emit("logged in", username)
	})
}

function handlerServer() {
	console.log(`Listening on *:${server.address().port}`);
}

var express = require('express');
var app = express();
var serv = require('http').Server(app);
var THREE = require('three');
var assets = require("./assets");

app.get('/',function(req,res){
res.sendFile(__dirname+ "/views/index.html");
});
//app.use("/client", express.static(__dirname + "/client"));
app.use(express.static("public"));
app.use("/assets", assets);

serv.listen(3000);

console.log("hola server");

var SOCKET_LIST = {};
var position = new THREE.Vector3(0,0,0);
var rotation = new THREE.Vector3(0,0,0);
var id=0;

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.position = position;
	socket.rotation = rotation;
	//socket.id = Math.random();
	socket.id = id++;
	// socket.x = 0;
	// socket.y = 0;
	// socket.z = 0;
	// socket.position.x = 0;
	// socket.position.y = 0;
	// socket.position.z = 0;
	
	SOCKET_LIST[socket.id] = socket;
	
	console.log('socket conectado');
	
	socket.emit('tuId',{
		id:socket.id
	});
	
	
	socket.on('disconnect', function(){
		console.log('socket desconectado ' + socket.id);
		delete SOCKET_LIST[socket.id];
		console.log(SOCKET_LIST.length);
		for(var i in SOCKET_LIST){
			var sock = SOCKET_LIST[i];
			sock.emit('disconnected',{
				id:socket.id
			});			
		}
	});
	
	socket.on('orientation',function(data){
		//console.log("Posicion " + data.position.x);
		socket.position.x=data.position.x;
		socket.position.y=data.position.y;
		socket.position.z=data.position.z;
	});
});

setInterval(function(){
	var pack = [];
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		pack.push({
			position:socket.position,
			rotation:socket.rotation,
			id:socket.id
		});
		console.log("id del socket" + socket.id);
		console.log("z del socket" + socket.position.z);
	}
	
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('newPositions',pack);
	}
	
},1000);
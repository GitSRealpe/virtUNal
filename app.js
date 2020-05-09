var express = require('express');
var app = express();
var serv = require('http').Server(app);
var THREE = require('three');

app.get('/',function(req,res){
res.sendFile(__dirname+ "/client/index.html");
});
//app.use("/client", express.static(__dirname + "/client"));
app.use(express.static("client"));

serv.listen(3000);

console.log("hola server");

var SOCKET_LIST = {};
var position = new THREE.Vector3(0,0,0);
var rotation = new THREE.Vector3(0,0,0);
var id=0;

var PLAYER_LIST = {};

var Player = function(id){
	this.id=id;
	this.position=new THREE.Vector3(0,0,0);
	this.rotation=new THREE.Vector3(0,0,0);
	var self=this;
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.id = id++;
	
	SOCKET_LIST[socket.id] = socket;
	console.log('socket conectado');
	var player = new Player(socket.id);
	PLAYER_LIST[socket.id] = player;
	
	socket.emit('tuId',{
		id:socket.id
	});
	
	
	socket.on('disconnect', function(){
		console.log('socket desconectado ' + socket.id);
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
		for(var i in SOCKET_LIST){
			var sock = SOCKET_LIST[i];
			sock.emit('disconnected',{
				id:socket.id
			});			
		}
	});
	
	socket.on('orientation',function(data){
		//console.log("se recibe de id: " + player.id);
		player.position.x=data.position.x;
		player.position.y=data.position.y;
		player.position.z=data.position.z;
	});
});

setInterval(function(){
	var pack = [];
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];
		pack.push({
			id:player.id,
			position:player.position,
			rotation:player.rotation
		});
	}
	
	// for(var i in pack){
		// console.log(pack[i]);
	// }
	
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('newPositions',pack);
	}
	
},10);//milisegundos
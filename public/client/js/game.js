
var otherPlayers={};
var playerID;
var player;

function loadGame(){
	//cargar espacio
	loadEspacio();
	//cargar jugador
	initMainPlayer();
	
	listenToOtherPlayers();
	
	window.onunload = function(){
		
	};
	window.onbeforeunload = function(){
		
	};
}

function listenToPlayer( playerData ) {
	if(playerID!=playerData.id){
		otherPlayers[playerData.id].setOrientation( playerData.position, playerData.rotation );
	}
	
}
var coso;
function listenToOtherPlayers(){
	//player ha entrado
	socket.on('newPositions', function(data){
			coso = data;
			console.log("Numero de players " + data.length);
			for(var i=0; i < data.length; i++){
				if (data[i].id == playerID){
					console.log("tu id " + data[i].id);
					console.log("tu z " + data[i].position.z);
				}else{
					console.log("otro id " + data[i].id);
					//si es otroplayer nuevo crearlo
					if(otherPlayers[data[i].id]==null){
						otherPlayers[data[i].id] = new Player(data[i].id);
						otherPlayers[data[i].id].init();
					}
					console.log("otro z " + data[i].position.z);
					//aqui pasar datos a listenToPlayer
					listenToPlayer(data[i]);
				}
				
			}
		});
	
	//player ha salido
	socket.on('disconnected', function(data){
			console.log("Dejconejtado " + data.id);
			scene.remove(otherPlayers[data.id].mesh);
			delete otherPlayers[data.id];
		});
		
}

function initMainPlayer(){
	console.log("iniciando Main player");
	
	socket.on('tuId', function(data){
			console.log("Tu Id " + data.id);
			playerID=data.id;
		});
	player = new Player(playerID);
	player.isMainPlayer=true;
	player.init();
}

function loadEspacio(){
	var light = new THREE.AmbientLight( 0x909090 ); // soft white light
	scene.add( light );
	var sphere_geometry = new THREE.SphereGeometry(0.7);
	var sphere_material = new THREE.MeshNormalMaterial();
	var sphere = new THREE.Mesh(sphere_geometry,sphere_material);
	
	scene.add(sphere);
}
var container, scene, camera, renderer;

var controls;

init();
animate();

function init(){
	//basic setup
	container = document.getElementById('container');
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(50,window.innerWidth / window.innerHeight,1,1000);
	camera.position.z = 100;
	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	// Instantiate a loader de modelos 3d
	loader = new THREE.GLTFLoader();
	
	//caregar juego
	console.log("cargando");
	loadGame();
	
	//eventos
	window.addEventListener("resize",onWindowResize,false);
	
	container.appendChild(renderer.domElement);
	document.body.appendChild(container);
}

function animate(){
	requestAnimationFrame(animate);
	if(controls){
		controls.update();
	}
	
	render();
}

function render(){
	renderer.clear();
	renderer.render(scene,camera);
}

function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize(window.innerWidth,window.innerHeight);
}









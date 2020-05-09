var Player = function(playerID){
	this.playerID = playerID;
	this.isMainPlayer= false;
	this.mesh;
	
	var cube_geometry = new THREE.BoxGeometry(1,1,1);
	var cube_material = new THREE.MeshBasicMaterial({color: (Math.random() * 0xffffff), wireframe:false});
	
	var scope = this;
	
	this.init = function(){
		// scope.mesh = new THREE.Mesh(cube_geometry,cube_material);
		// scene.add(scope.mesh);
		
		// Load a glTF resource
			loader.load('/assets/mono.glb',
				function ( gltf ) {
					model=gltf.scene;
					scene.add(model);
		
					gltf.animations; // Array<THREE.AnimationClip>
					gltf.scene; // THREE.Group
					gltf.scenes; // Array<THREE.Group>
					gltf.cameras; // Array<THREE.Camera>
					gltf.asset; // Object
					scope.mesh=model;
					
					if(scope.isMainPlayer){
						//dar controles de esta instancia
						controls = new THREE.PlayerControls(camera, scope.mesh);
						controls.init();
					};
					
				},
				// called while loading is progressing
				function ( xhr ) {
					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				},
				// called when loading has errors
				function ( error ) {
					console.log( 'An error happened' );
				}
			);
			//
		
		
		
	};
	
	this.setOrientation = function(position, rotation){
		if(scope.mesh){
			scope.mesh.position.copy(position);
			scope.mesh.rotation.x=rotation.x;
			scope.mesh.rotation.y=rotation.y;
			scope.mesh.rotation.z=rotation.z
		}
	};
};

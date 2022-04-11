import * as THREE from "./js/three.module.js";
import { OBJLoader } from "./js/OBJLoader.js";
import { FBXLoader } from "./js/FBXLoader.js";

// load model for the image
// create boudning box for the model
// keep coordinates, rotation for the model

// dictionary with name of model and the object


export function loadModel(
	texturepath,
	modelpath,
	offset,
	scale,
	color,
	rotation,
	name,
    isOBJLoader,
    models,
    scene
) {
	var loader;
	if (isOBJLoader == 1) {
		loader = new OBJLoader();
	} else {
		loader = new FBXLoader();
    }
    
    var texture = new THREE.TextureLoader().load(texturepath);
    
	loader.load(
		modelpath,
		function (object) {
			object.position.x = offset[0];
			object.position.y = offset[1];
			object.position.z = offset[2];
			object.scale.x = scale[0];
			object.scale.y = scale[1];
			object.scale.z = scale[2];
			object.rotation.x = rotation[0];
			object.rotation.y = rotation[1];
			object.rotation.z = rotation[2];
			object.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material.map = texture;
					if (color[0] != 0) {
						child.material.color.r = color[0];
						child.material.color.g = color[1];
						child.material.color.b = color[2];
					}
				}
			});
            models[name] = object;
            scene.add(object);

		},
		function (xhr) {
            console.log("Loaded");
            
		},
		function (error) {
			console.log("An error happened");
		}
    );
    
}

export function addBoundingBox() {
    
}
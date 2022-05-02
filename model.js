import * as THREE from "./js/three.module.js";
import { OBJLoader } from "./js/OBJLoader.js";
import { FBXLoader } from "./js/FBXLoader.js";

// load model for the image
// create boudning box for the model
// keep coordinates, rotation for the model

// dictionary with name of model and the object

export async function loadModel(
	texturepath,
	modelpath,
	isOBJLoader,

) {
	return new Promise(async (resolve) => {
		var loader;
		if (isOBJLoader == 1) {
			loader = new OBJLoader();
		} else {
			loader = new FBXLoader();
		}

		var texture = new THREE.TextureLoader().load(texturepath);

		var object = await Promise.resolve(loader.loadAsync(modelpath));
		object.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				child.material.map = texture;
			}
		});
		resolve(object);
	});
}


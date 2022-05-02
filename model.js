import * as THREE from "./js/three.module.js";
import { OBJLoader } from "./js/OBJLoader.js";
import { FBXLoader } from "./js/FBXLoader.js";
import { MTLLoader } from "./js/MTLLoader.js";

// load model for the image
// create boudning box for the model
// keep coordinates, rotation for the model

// dictionary with name of model and the object

export async function loadModel(texturepath, modelpath, isOBJLoader) {
	return new Promise(async (resolve) => {
		var loader;

        if (isOBJLoader == 2) {

			var mtlLoader = new MTLLoader();
			mtlLoader.load(texturepath, function (materials) {
				materials.preload();

				var objLoader = new OBJLoader();
				objLoader.setMaterials(materials);
				objLoader.load(modelpath, function (object) {
					resolve(object);
				});
            });
            
		} else {
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
		}
	});
}

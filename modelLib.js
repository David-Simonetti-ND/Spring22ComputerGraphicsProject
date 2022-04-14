import * as THREE from "./js/three.module.js";
import { OBJLoader } from "./js/OBJLoader.js";
import { FBXLoader } from "./js/FBXLoader.js";

export class Model {
	constructor(model, BoundingBox) {
		this.model = model;
		this.BoundingBox = BoundingBox;
	}

	setModel(model) {
		this.model = model;
	}

	getModel() {
		return this.model;
	}

	setBoundingBox(BoundingBox) {
		this.BoundingBox = BoundingBox;
	}

	getBoundingBox() {
		return this.BoundingBox;
	}

	addToScene(scene) {
		scene.add(this.model);
	}

	translateModel(offset) {
		this.model.position.x += offset[0];
		this.model.position.y += offset[1];
		this.model.position.z += offset[2];
		this.BoundingBox = new THREE.Box3().setFromObject(this.model);
	}

	rotateModel(rotation) {
		this.model.rotation.x = rotation[0];
		this.model.rotation.y = rotation[1];
		this.model.rotation.z = rotation[2];
		this.BoundingBox = new THREE.Box3().setFromObject(this.model);
	}

	scaleModel(scale) {
		this.model.scale.x = scale[0];
		this.model.scale.y = scale[1];
		this.model.scale.z = scale[2];
		this.BoundingBox = new THREE.Box3().setFromObject(this.model);
    }
    
    clone() {
        return new Model(this.model.clone(), this.BoundingBox.clone());
    }
}



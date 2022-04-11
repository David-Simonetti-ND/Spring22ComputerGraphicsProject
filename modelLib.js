import * as THREE from "./js/three.module.js";
import { OBJLoader } from "./js/OBJLoader.js";
import { FBXLoader } from "./js/FBXLoader.js";

export class Model {
	constructor(model, BoundingBox, name, x, y, z) {
		this.model = model;
		this.BoundingBox = BoundingBox;
		this.name = name;
		this.x = x;
		this.y = y;
		this.z = z;
	}

	setModel(model) {
		this.model = model;
	}

	setBoundingBox(BoundingBox) {
		this.BoundingBox = BoundingBox;
    }
    
    getBoundingBox() {
        return this.BoundingBox;
    }

	setX(x) {
		this.model.position.x = x;
		this.x = x;
	}

	setY(y) {
		this.model.position.y = y;
		this.y = y;
	}

	setZ(z) {
		this.model.position.z = z;
		this.z = z;
	}

	addModel(scene) {
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
}



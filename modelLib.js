import * as THREE from "./js/three.module.js";

export class Model {
	constructor(model, BoundingBox, velocity) {
		this.model = model;
		this.BoundingBox = BoundingBox;
		this.velocity = velocity;
        this.lightSource = "";
        this.modelList = [];

	}

	setModel(model) {
		this.model = model;
    }
    
    addModel(model) {
        this.modelList.push(model);
    }

	getModel() {
		return this.model;
	}

	setVelocity(veloctiy) {
		this.velocity = veloctiy;
	}

	getVelocity() {
		return this.velocity
	}

	getRotation() {
		return this.model.rotation;
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
    
    setPosition(position) {
        this.model.position.x = position[0];
        this.model.position.y = position[1];
        this.model.position.z = position[2];

        this.BoundingBox = new THREE.Box3().setFromObject(this.model);
    }

    setPositionY(y) {
        this.model.position.y = y;
        this.y = y;
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



"use strict";
import * as THREE from "./js/three.module.js";
import { TrackballControls } from "./js/TrackballControls.js";
import { Model } from "./modelLib.js";
import * as model from "./model.js";

var scene;
var camera;
var light;
var renderer;
var trackballControls;
const WIDTH = window.innerWidth - 10;
const HEIGHT = window.innerHeight - 20;

let models = {};
let Mario = new Model();
let Barrel = new Model();

let allColliders = [];

async function loadAllModels() {
	
	return new Promise( async (resolve) => {
		Mario.setModel(
			await Promise.resolve( 
				model.loadModel(
					"./models/hat.png",
					"./models/Mario.FBX",
					[-30, -25, 0.0],
					[0.01, 0.01, 0.01],
					[0, 0, 0],
					[0, 0, 0],
					"MARIO",
					0,
					models,
					scene
				)
			)
		);

		Barrel.setModel(
			await Promise.resolve( 
				model.loadModel(
					"./models/barrel.png",
					"./models/barrel.obj",
					[0, 0, 0],
					[0.05, 0.05, 0.05],
					[0, 0, 0],
					[Math.PI / 2, 0, 0],
					"BARREL",
					1,
					models,
					scene
				)
			)
		);

		resolve();
	});

}

window.onload = async function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);

	camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
	camera.position.set(1.0, 1.0, 50);

	light = new THREE.AmbientLight(0x808080);
	scene.add(light);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	document.body.appendChild(renderer.domElement);

	trackballControls = new TrackballControls(camera, renderer.domElement);
	document.body.addEventListener("keydown", handleKeys);

	await Promise.resolve(loadAllModels());
	
	animate();
};

function animate() {
	trackballControls.update();
	renderer.render(scene, camera);
    requestAnimationFrame(animate);
    
	checkCollisions();
	setBoundingBox();
}

function setBoundingBox() {
    allColliders = [];
    // goes through the models and then creates a bounding box for each
    for (const [key, value] of Object.entries(models)) {
        let boundingBox = new THREE.Box3().setFromObject(value);
        allColliders.push(boundingBox);
    }
}


function handleKeys(event) {

	switch (event.keyCode) {
		case 77: // m to spawn monkey
			var temp = models["MARIO"].clone();
			temp.position.x = Math.random() * 100 - 50;
			temp.position.y = Math.random() * 100 - 50;
			models["MARIO" + Object.keys(models).length] = temp;
			scene.add(temp);
			break;
		case 65: // left arrow
			Mario.translateModel([-2, 0, 0]);
			Mario.rotateModel([0, (Math.PI * 3) / 2, 0]);
			break;
		case 87: // up arrow
			Mario.translateModel([0, 2, 0]);
			break;
		case 68: // right arrow
			Mario.translateModel([2, 0, 0]);
            Mario.rotateModel([0, Math.PI / 2, 0]);

			break;
		case 83: // down arrow
			Mario.translateModel([0, -2, 0]);
            break;
        
	}
}

// goes through the list of bounding boxes and checks for collisions
function checkCollisions() {
	for (let i = 0; i < allColliders.length; i++) {
		for (let j = 0; j < allColliders.length; j++) {
			if (i != j) {
				if (allColliders[i].intersectsBox(allColliders[j])) {
					console.log("Collision");
				}
			}
		}
	}
}

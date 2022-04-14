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

let Mario = new Model();
let Barrel = new Model();
let Floor = new Model();

let allBarrels = [];

async function loadAllModels() {
	return new Promise(async (resolve) => {
		// load model
		let MarioModel;
		Mario.setModel(
			await Promise.resolve(
				model.loadModel(
					"./models/hat.png",
					"./models/Mario.FBX",
					[0, 0, 0],
					0
				)
			).then(function (value) {
				MarioModel = value;
			})
		);

		// set starting position
		Mario.setModel(MarioModel);
		Mario.translateModel([-30, -25, 0.0]);
		Mario.scaleModel([0.01, 0.01, 0.01]);
		Mario.rotateModel([0, 0, 0]);
		Mario.addToScene(scene);

		let BarrelModel;
		Barrel.setModel(
			await Promise.resolve(
				model.loadModel(
					"./models/barrel.png",
					"./models/barrel.obj",
					[0, 0, 0],
					1
				)
			).then(function (value) {
				BarrelModel = value;
			})
		);

		Barrel.setModel(BarrelModel);
		Barrel.translateModel([0, 0, 0]);
		Barrel.scaleModel([0.05, 0.035, 0.05]);
		Barrel.rotateModel([Math.PI / 2, 0, 0]);
		Barrel.addToScene(scene);

		resolve();

		allBarrels.push(Barrel);

		let cube = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 0x00ff00 })
		);

		Floor.setModel(cube);
		Floor.translateModel([0, -30, 0]);
		Floor.scaleModel([100, 1, 100]);
		Floor.rotateModel([0, 0, 0]);
		Floor.addToScene(scene);
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

	gravity();
	checkCollisions();
}

function handleKeys(event) {
	switch (event.keyCode) {
		case 77: // m to spawn monkey
			var temp = Barrel.clone();
			temp.translateModel([
				Math.random() * 100 - 50,
				Math.random() * 100 - 50,
				0,
			]);
			temp.addToScene(scene);
			allBarrels.push(temp);
			break;
		case 65: // left arrow
			Mario.translateModel([-2, 0, 0]);
			Mario.rotateModel([0, (Math.PI * 3) / 2, 0]);
			break;
		case 87: // up arrow
            Mario.translateModel([0, 0, -2]);
			Mario.rotateModel([0, (Math.PI * 2) / 2, 0]);
            
			break;
		case 68: // right arrow
			Mario.translateModel([2, 0, 0]);
			Mario.rotateModel([0, Math.PI / 2, 0]);

			break;
		case 83: // down arrow
            Mario.translateModel([0, 0, 2]);
			Mario.rotateModel([0, (Math.PI*4) / 2, 0]);
            
			break;
		case 32: // spacebar
			gravityAcceleration = -0.1;
			gravityVelocity = 3;
	}
}

// goes through the list of bounding boxes and checks for collisions
function checkCollisions() {
	for (let i = 0; i < allBarrels.length; i++) {
		if (
			allBarrels[i].getBoundingBox().intersectsBox(Mario.getBoundingBox())
		) {
			console.log("Collision");
		}
	}
}

let gravityAcceleration = -0.1;
let gravityVelocity = 0;
// mario physics
function gravity() {
	gravityVelocity += gravityAcceleration;
	Mario.translateModel([0, gravityVelocity, 0]);

	if (Mario.getBoundingBox().intersectsBox(Floor.getBoundingBox())) {
		gravityVelocity = 0;
		gravityAcceleration = 0;
        Mario.translateModel([0, -gravityVelocity, 0]);
        Mario.setPositionY(-28.4);
	}
}

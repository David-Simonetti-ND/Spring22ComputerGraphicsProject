"use strict";
import * as THREE from "./js/three.module.js";
import { OBJLoader } from "./js/OBJLoader.js";
import { FBXLoader } from "./js/FBXLoader.js";
import { TrackballControls } from "./js/TrackballControls.js";

var scene;
var camera;
var light;
var renderer;
var trackballControls;
const WIDTH = window.innerWidth / 2;
const HEIGHT = window.innerHeight / 2;

let cube1, cube2;
let cube1B, cube2B;

window.onload = function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x87ceeb);

	camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.1, 1000);
	camera.position.set(3.0, 5.0, 30);

	light = new THREE.AmbientLight(0x808080);
	scene.add(light);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	document.body.appendChild(renderer.domElement);

	trackballControls = new TrackballControls(camera, renderer.domElement);

	setup();

	animate();
};

function animate() {
	trackballControls.update();
	renderer.render(scene, camera);

	cube2B.copy(cube2.geometry.boundingBox).applyMatrix4(cube2.matrixWorld);
	checkCollisions();

	requestAnimationFrame(animate);
}

function setup() {
	// Cubes
	cube1 = new THREE.Mesh(
		new THREE.BoxGeometry(1, 1, 1),
		new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	);

	cube1.position.set(3, 0, 0);
	cube1.caseshadow = true;
	cube1.receiveshadow = true;

	// Cube bounding
	cube1B = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
	cube1B.setFromObject(cube1);

	// Cubes
	cube2 = new THREE.Mesh(
		new THREE.BoxGeometry(1, 1, 1),
		new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	);

	cube2.position.set(-3, 0, 0);
	cube2.caseshadow = true;
	cube2.receiveshadow = true;

	// Cube bounding
	cube2B = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
	cube2B.setFromObject(cube2);

	scene.add(cube1, cube2);
}

document.onkeydown = function (event) {
	console.log(event.keyCode);
	if (event.keyCode == 37) {
		cube2.position.x -= 1;
	}
	if (event.keyCode == 39) {
		cube2.position.x += 1;
	}
	if (event.keyCode == 38) {
		cube2.position.y += 1;
	}
	if (event.keyCode == 40) {
		cube2.position.y -= 1;
	}
};

function checkCollisions() {
	if (cube1B.intersectsBox(cube2B)) {
		console.log("Collision!");
	}
}

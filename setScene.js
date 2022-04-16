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
		Mario.setVelocity([0.0, 0.0, 0.0]);

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

		let cube = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 0x00CC00 })
		);

		Floor.setModel(cube);
		Floor.translateModel([0, -30, 0]);
		Floor.scaleModel([300, 1, 300]);
		Floor.rotateModel([0, 0, 0]);
		Floor.addToScene(scene);

		resolve();
	});
}

window.onload = async function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);

	camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
	camera.position.set(1.0, 1.0, 50);

	light = new THREE.AmbientLight(0x202020);
	scene.add(light);

	const plight = new THREE.PointLight( 0x888888, 3 );
	plight.position.set( 50, 50, 50 );
	scene.add( plight );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	document.body.appendChild(renderer.domElement);

	trackballControls = new TrackballControls(camera, renderer.domElement);
	document.body.addEventListener("keydown", handleKeys);
	document.body.addEventListener("keyup", handleKeys);

	await Promise.resolve(loadAllModels());

	animate();
};

function animate() {
	//trackballControls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(animate);

	gravity();
	checkCollisions();
	updateModels();
	updateCamera();
}

function handleKeys(event) {
	let curr_velocity = Mario.getVelocity();
	if (event.type == "keydown")
	{
		switch (event.keyCode) {
			case 77: // m to spawn monkey
				spawnNewBarrel();
				break;
			case 65: // left arrow
				curr_velocity[0] = -0.4;
				Mario.setVelocity(curr_velocity);
				break;
			case 87: // up arrow
				curr_velocity[2] = -0.4;
				Mario.setVelocity(curr_velocity);
				break;
			case 68: // right arrow
				curr_velocity[0] = 0.4;
				Mario.setVelocity(curr_velocity);
				break;
			case 83: // down arrow
				curr_velocity[2] = 0.4;
				Mario.setVelocity(curr_velocity);
				break;
			case 32: // spacebar
				if (numberOfJumps >= 2)
				{
					break;
				}
				gravityAcceleration = -0.1;
				gravityVelocity = 3;
				numberOfJumps++;
				break;
		}
	}
	else if (event.type == "keyup")
	{
		switch (event.keyCode) {
			case 65: // left arrow
				curr_velocity[0] = 0.0;
				Mario.setVelocity(curr_velocity);
				break;
			case 87: // up arrow
				curr_velocity[2] = 0.0;
				Mario.setVelocity(curr_velocity);
				break;
			case 68: // right arrow
				curr_velocity[0] = 0.0;
				Mario.setVelocity(curr_velocity);
				break;
			case 83: // down arrow
				curr_velocity[2] = 0.0;
				Mario.setVelocity(curr_velocity);
				break;
			case 32:
				gravityVelocity = 0;
				break;
		}
	}
}

// goes through the list of bounding boxes and checks for collisions
function checkCollisions() {
	for (let i = 0; i < allBarrels.length; i++) {
		if (allBarrels[i] == "")
			{
				continue;
			}
		if (
			allBarrels[i].getBoundingBox().intersectsBox(Mario.getBoundingBox())
		) {
			console.log("Collision");
		}
	}
}

let gravityAcceleration = -0.1;
let gravityVelocity = 0;
let numberOfJumps = 0;
// mario physics
function gravity() {
	gravityVelocity += gravityAcceleration;
	Mario.translateModel([0, gravityVelocity, 0]);
	if (Mario.getBoundingBox().intersectsBox(Floor.getBoundingBox())) {
		gravityVelocity = 0;
		gravityAcceleration = 0;
        Mario.translateModel([0, -gravityVelocity, 0]);
        Mario.setPositionY(-25.4);
		numberOfJumps = 0;
	}
	let x, y, z;
	let key, barrel;
	for (key in allBarrels)
	{
		barrel = allBarrels[key];
		if (barrel == "")
		{
			continue;
		}
		x = barrel.model.rotation.x;
		y = barrel.model.rotation.y;
		z = barrel.model.rotation.z;
		y = y + Math.PI / 32;
		barrel.rotateModel([x, y, z]);
		[x, y, z] = barrel.getVelocity()
		if (y == 0) {
			continue;
		}
		y += -0.1;
		if (barrel.getBoundingBox().intersectsBox(Floor.getBoundingBox())) {
			y *= -3/5;
			barrel.setPositionY(-21);
		}
		if (y < 0 && y >= -0.01) {
			barrel.setPositionY(-21);
			y = 0;
		}
		barrel.translateModel([x, y, z]);
		barrel.setVelocity([x, y, z]);
	}
}

function updateModels() {
	let x, y, z;
	[x, y, z] = Mario.getVelocity()
	Mario.translateModel([x, y, z]);
	let rotate_angle = "";
	if (x == 0.4 && z == 0.4)
	{
		rotate_angle = Math.PI / 4;
	}
	else if (x == 0.4 && z == 0.0)
	{
		rotate_angle = Math.PI / 2;
	}
	else if (x == 0.4 && z == -0.4)
	{
		rotate_angle = Math.PI * 3 / 4;
	}
	else if (x == 0.0 && z == -0.4)
	{
		rotate_angle = Math.PI;
	}
	else if (x == 0.0 && z == 0.4)
	{
		rotate_angle = Math.PI * 2;
	}
	if (x == -0.4 && z == 0.4)
	{
		rotate_angle = Math.PI * 7 /  4;
	}
	else if (x == -0.4 && z == 0.0)
	{
		rotate_angle = Math.PI * 3 / 2;
	}
	else if (x == -0.4 && z == -0.4)
	{
		rotate_angle = Math.PI * 5 / 4;
	}
	if (rotate_angle != "")
	{
		Mario.rotateModel( [0, rotate_angle, 0] );
	}
	let key, barrel;
	for (key in allBarrels)
	{
		barrel = allBarrels[key];
		if (barrel == "")
		{
			continue;
		}
		if (Math.abs(barrel.model.position.x) >= 150 || Math.abs(barrel.model.position.z) >= 150)
		{
			scene.remove(barrel);
			if (barrel.lightSource != "")
			{
				scene.remove(barrel.lightSource);
			}
			allBarrels[key] = "";
		}
		[x, y, z] = barrel.getVelocity()
		barrel.translateModel([x, y, z]);
		if (barrel.lightSource != "")
		{
			barrel.lightSource.position.set(...[x, y, z]);
		}
	}
}

function updateCamera() {
	if (document.getElementById("third").checked == true) {
		camera.position.set(0.0, 50.0, 0.0);
		camera.lookAt(...Mario.model.position);
	}
    if (document.getElementById("first").checked == true) {
		let x, y, z;
		[x, y, z] = Mario.getVelocity();
		if (x != 0 || z != 0)
		{
			camera.lookAt(x * 1000 + Mario.model.position.x, Mario.model.position.y, z * 1000 + Mario.model.position.z);
		}
		camera.position.set(Mario.model.position.x, Mario.model.position.y + 3, Mario.model.position.z);
	}
	
}

function spawnNewBarrel() {
	let newBarrel = new Model();
	newBarrel.setModel(Barrel.getModel().clone(true));
	newBarrel.translateModel([
		Math.random() * 100 - 50,
		Math.random() * -25,
		Math.random() * 100 - 50,
	]);
	newBarrel.scaleModel([0.05, 0.035, 0.05]);
	newBarrel.rotateModel([Math.PI / 2, 0, 0]);
	newBarrel.setVelocity([Math.random() - 0.5, Math.random() * -2.0 - 1, Math.random() - 0.5]);
	let x, y, z;
	[x, y, z] = newBarrel.getVelocity()
	let rotate_angle = "";
	if (x >= 0 && z >= 0)
	{
		rotate_angle = Math.atan(x / z);
	}
	else if (x >= 0 && z == 0.0)
	{
		rotate_angle = Math.PI / 2;
	}
	else if (x >= 0 && z <= 0.0)
	{
		rotate_angle = Math.atan(z / x) + Math.PI;
	}
	else if (x == 0.0 && z <= 0.0)
	{
		rotate_angle = Math.PI;
	}
	else if (x == 0.0 && z >= 0)
	{
		rotate_angle = Math.PI * 2;
	}
	if (x <= 0.0 && z >= 0)
	{
		rotate_angle = Math.atan(z / x) + Math.PI * 2;
	}
	else if (x <= 0.0 && z == 0.0)
	{
		rotate_angle = Math.PI * 3 / 2;
	}
	else if (x <= 0.0 && z <= 0.0)
	{
		rotate_angle = Math.atan(z / x) + Math.PI;
	}
	if (rotate_angle != "")
	{
		newBarrel.rotateModel( [Math.PI / 2, 0.0, rotate_angle + Math.PI / 2] );
	}

	if (Math.round(Math.random() * 10) == 10)
	{
		newBarrel.lightSource = new THREE.PointLight( 0xff0000, 2, 100, 1 );
		newBarrel.lightSource.position.set( ...newBarrel.getModel().position );
		scene.add( newBarrel.lightSource );
		newBarrel.model.traverse(function (child) {
			if (child.isMesh)
			{
				child.material = child.material.clone();
				child.material.color.r = 0xff;
				child.material.color.g = 0x0;
				child.material.color.b = 0x0;
			}
		});
	}

	if (Math.round(Math.random() * 10) == 9)
	{
		newBarrel.lightSource = new THREE.PointLight( 0x0000ff, 2, 100, 1 );
		newBarrel.lightSource.position.set( ...newBarrel.getModel().position );
		scene.add( newBarrel.lightSource );
		newBarrel.model.traverse(function (child) {
			if (child.isMesh)
			{
				child.material = child.material.clone();
				child.material.color.r = 0x0;
				child.material.color.g = 0x0;
				child.material.color.b = 0xff;
			}
		});
	}

	if (Math.round(Math.random() * 10) == 8)
	{
		newBarrel.lightSource = new THREE.PointLight( 0x00ff00, 2, 100, 1 );
		newBarrel.lightSource.position.set( ...newBarrel.getModel().position );
		scene.add( newBarrel.lightSource );
		newBarrel.model.traverse(function (child) {
			if (child.isMesh)
			{
				child.material = child.material.clone();
				child.material.color.r = 0x0;
				child.material.color.g = 0xff;
				child.material.color.b = 0x0;
			}
		});
	}

	newBarrel.addToScene(scene);
	allBarrels.push(newBarrel);
}
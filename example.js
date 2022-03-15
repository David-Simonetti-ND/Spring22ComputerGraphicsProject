"use strict";
import * as THREE from "./js/three.module.js";
import { OBJLoader } from './js/OBJLoader.js';
import { FBXLoader } from './js/FBXLoader.js';
import { TrackballControls } from './js/TrackballControls.js';


var scene;
var camera;
var light;
var renderer;
var trackballControls;
const WIDTH = 600;
const HEIGHT = 600;

const KONG = 0;
const BARREL = 1;
const MARIO = 2;
const LADDER = 3;
const BEAM = 4;

var models = ["", "", "", "", ""];

function loadModel(texturepath, modelpath, offset, scale, color, rotation, modelIndex, isOBJLoader) {
    var loader;
    if (isOBJLoader == 1)
    {
        loader = new OBJLoader();
    }
    else
    {
        loader = new FBXLoader();
    }
    var texture = new THREE.TextureLoader().load(texturepath);
    return loader.load(modelpath, function ( object ) {
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
                if (color[0] != 0)
                {
                    child.material.color.r = color[0];
                    child.material.color.g = color[1];
                    child.material.color.b = color[2];
                }
            }
        });
		models[modelIndex] = object;
        scene.add( object );
	},
    function ( xhr ) { console.log( 'Loaded' ) },
	function ( error ) { console.log( 'An error happened' ); });
}

function loadAllModels()
{
    loadModel('./models/kong.png', './models/kong.obj', 
                [-25, 25, 1.0],  // translation
                [1.0, 1.0, 1.0], // scale
                [0, 0, 0],       // color (0 to ignore)
                [0, 0, 0],       // rotation
                KONG,            // model array index
                1);              // 1 for obj file, 0 for fbx file
    loadModel('./models/barrel.png', './models/barrel.obj', 
                [0, 0, 0], 
                [0.05, 0.05, 0.05], 
                [0, 0, 0],  
                [Math.PI / 2, 0, 0], 
                BARREL, 
                1);
    loadModel('./models/hat.png', './models/Mario.FBX',
                [-30, -25, 0.0], 
                [0.01, 0.01, 0.01], 
                [0, 0, 0],  
                [0, 0, 0], 
                MARIO, 
                0);
    loadModel('./models/metal.jpg', './models/beam.FBX',
                [-25, -25, 0.0], 
                [5, 5, 5], 
                [1.0, 1.0, 1.0],  
                [0, Math.PI * 3 / 2, 0 ], 
                BEAM, 
                0);
    loadModel('./models/purple.jpg', './models/ladder.FBX',
                [-10, -10, 0.0], 
                [0.01, 0.01, 0.01], 
                [1.0, 1.0, 1.0],  
                [0, Math.PI * 3 / 2, 0 ], 
                LADDER, 
                0);
}

function translateModel(object, offset)
{
    object.position.x += offset[0];
    object.position.y += offset[1];
    object.position.z += offset[2];
}

function rotateModel(object, rotation)
{
    object.rotation.x = rotation[0];
    object.rotation.y = rotation[1];
    object.rotation.z = rotation[2];
}

window.onload = function init() 
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );

    camera = new THREE.PerspectiveCamera( 75, WIDTH/HEIGHT, 0.1, 1000 );
    camera.position.set(1.0, 1.0, 50);
    
    light = new THREE.AmbientLight( 0x808080 ); 
    scene.add( light );
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( WIDTH, HEIGHT );
    document.body.appendChild( renderer.domElement );
    
    trackballControls = new TrackballControls(camera, renderer.domElement);
    document.body.addEventListener( 'keydown', handleKeys );
    loadAllModels();
    animate();
}

function animate() {
    trackballControls.update();
    renderer.render( scene, camera );
	requestAnimationFrame( animate );
}

function handleKeys(event){
    console.log(event.keyCode);
    switch( event.keyCode ) {
        case 77: // m to spawn monkey
            var temp = models[0].clone();
            temp.position.x = (Math.random() * 100 - 50);
            temp.position.y = (Math.random() * 100 - 50);
            scene.add(temp);
            break;
        case 65: // left arrow
            translateModel(models[MARIO], [-2, 0, 0]);
            rotateModel(models[MARIO], [0, 0, 0]);
            break;
        case 87: // up arrow
            translateModel(models[MARIO], [0, 2, 0]);
            rotateModel(models[MARIO], [0, Math.PI / 2, 0]);
            break;
        case 68: // right arrow
            translateModel(models[MARIO], [2, 0, 0]);
            rotateModel(models[MARIO], [0, Math.PI, 0]);
            break;
        case 83: // down arrow
            translateModel(models[MARIO], [0, -2, 0]);
            rotateModel(models[MARIO], [0, Math.PI * 3 / 2, 0]);
            break;
    }
       
    }

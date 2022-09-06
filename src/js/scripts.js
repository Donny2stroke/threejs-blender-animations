import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const dogUrl = new URL('../assets/doggo2.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
orbit.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const assetLoader = new GLTFLoader();

//variabile globale per l'animazione
let mixer; 
assetLoader.load(dogUrl.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    //AnimationMixer come la timeline di blender
    mixer = new THREE.AnimationMixer(model);
    //prende tutte le animazioni
    const clips = gltf.animations;
    /* //prende l'animazione tra le clips cercandola per nome (nome dato tramite blender)
    const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
    const action = mixer.clipAction(clip);
    action.play(); */

    //anima contemporaneamente tutte le clip
    clips.forEach(function (clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });

}, undefined, function(error) {
    console.error(error);
});

//serve per far scorrere il tempo della timeline
const clock = new THREE.Clock();
function animate() {
    //if mixer perchè la funzione assetLoader.load è asincrona, quindi potrebbe non esistere ancora la variabile mixer
    if(mixer)
        //muove la testina del tempo della timeline
        mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
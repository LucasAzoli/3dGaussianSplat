import * as THREE from 'three';
import * as GaussianSplats3D from './node_modules/@mkkellogg/gaussian-splats-3d/build/gaussian-splats-3d.module.js';
import { PointerLockControls } from './assets/PointerLockControls.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-1, 1.0, 0);

const viewer = new GaussianSplats3D.Viewer({
    'selfDrivenMode': false,
    'useBuiltInControls': false,
    'camera': camera,
    'renderer': renderer,
    'cameraUp': [0, -1, 0],
    'initialCameraPosition': [0, 1.6, 5],
    'sphericalHarmonicsDegree': 2,
    'sharedMemoryForWorkers': false
});

viewer.addSplatScene('assets/3dModels/smartclass3/point_cloud.ply', {
    'progressiveLoad': true,
    'position': [0, 1, 0],
    'rotation': [1, 0, 0, 0],
    'scale': [1.5, 1.5, 1.5]
}).then(() => {
    console.log('Modelo carregado com sucesso!');
    animate();
}).catch(err => console.error('Erro ao carregar modelo:', err));

const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const moveSpeed = 0.1;
let isRunning = false;
let isMoving = { forward: false, backward: false, left: false, right: false };

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW': isMoving.forward = true; break;
        case 'KeyS': isMoving.backward = true; break;
        case 'KeyA': isMoving.left = true; break;
        case 'KeyD': isMoving.right = true; break;
        case 'ShiftLeft': isRunning = true; break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW': isMoving.forward = false; break;
        case 'KeyS': isMoving.backward = false; break;
        case 'KeyA': isMoving.left = false; break;
        case 'KeyD': isMoving.right = false; break;
        case 'ShiftLeft': isRunning = false; break;
    }
});

function animate() {
    requestAnimationFrame(animate);

    const speed = isRunning ? moveSpeed * 2 : moveSpeed;
    direction.set(0, 0, 0);

    if (isMoving.forward) direction.z -= 1;
    if (isMoving.backward) direction.z += 1;
    if (isMoving.left) direction.x -= 1;
    if (isMoving.right) direction.x += 1;

    if (direction.length() > 0) direction.normalize();
    
    direction.applyQuaternion(camera.quaternion);
    direction.y = 0;
    direction.normalize();

    velocity.lerp(direction.multiplyScalar(speed), 0.1);
    
    camera.position.add(velocity);
    camera.position.y = 1.0;

    viewer.update();
    viewer.render();
}

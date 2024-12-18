import * as THREE from 'three';

import * as GaussianSplats3D from './node_modules/@mkkellogg/gaussian-splats-3d/build/gaussian-splats-3d.module.js';

const viewer = new GaussianSplats3D.Viewer({
    'cameraUp': [0, -1, -.17],
    'initialCameraPosition': [-5, -1, -1],
    'initialCameraLookAt': [-1.72477, 0.05395, -0.00147],
    'sphericalHarmonicsDegree': 2,
    'sharedMemoryForWorkers': false
});
let path = 'assets/3dModels/playroom/playroom.splat';
viewer.addSplatScene(path, {
  'progressiveLoad': false
})
.then(() => {
    viewer.start();
});
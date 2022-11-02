import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

console.log(OrbitControls);

//create Renderer
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement);

console.log(renderer)

//create Camera
const camera = new THREE.PerspectiveCamera (40, innerWidth/innerHeight, 0.1, 1000);
camera.position.z = 50;
camera.lookAt(0, 0, 0);

//create Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFECFB)

//orbit control
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// //add Light
// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(0, 0, 1);
// scene.add(light);

//add ambient light(soft background light)
const alight = new THREE.AmbientLight( 0x404040 );
//create hemisphere light(to make shadow)
const hlight = new THREE.HemisphereLight( 0xFFFFFF, 0x080820, 1 );
//add the light
scene.add(alight);
scene.add(hlight);

// //add axes
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

//create body
const body_geometry = new THREE.BoxGeometry(8, 4, 6);
const body_material = new THREE.MeshPhongMaterial({color: 0x79543D});
const body = new THREE.Mesh(body_geometry, body_material);
scene.add(body);

//create head
const head_geometry = new THREE.BoxGeometry(4, 3.5, 4);
const head_material = new THREE.MeshPhongMaterial({color: 0x79543D});
const head = new THREE.Mesh(head_geometry, head_material);
head.position.set(-2, 3.5, 0);
scene.add(head);

//create mouth
const mouth_geometry = new THREE.BoxGeometry(1.5, 1.5, 2);
const mouth_material = new THREE.MeshPhongMaterial({color: 0xB49671});
const mouth = new THREE.Mesh(mouth_geometry, mouth_material);
mouth.position.set(-4.5, 3, 0);
scene.add(mouth);

//create ear
const ear_geometry = new THREE.BoxGeometry(1, 1.5, 1);
const ear_material = new THREE.MeshPhongMaterial({color: 0xB49671});
const ear = new THREE.Mesh(ear_geometry, ear_material);
ear.position.set(-1, 5.5, 1);
scene.add(ear);

//create ear2
const ear2_geometry = new THREE.BoxGeometry(1, 1.5, 1);
const ear2_material = new THREE.MeshPhongMaterial({color: 0xB49671});
const ear2 = new THREE.Mesh(ear2_geometry, ear2_material);
ear2.position.set(-1, 5.5, -1);
scene.add(ear2);

//create nose
const nose_geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const nose_material = new THREE.MeshPhongMaterial({color: 0x000000});
const nose = new THREE.Mesh(nose_geometry, nose_material);
nose.position.set(-5, 4, 0);
scene.add(nose);

//create eye
const eye_geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const eye_material = new THREE.MeshPhongMaterial({color: 0x000000});
const eye = new THREE.Mesh(eye_geometry, eye_material);
eye.position.set(-4, 4.5, 1);
scene.add(eye);

//create eye2
const eye2_geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const eye2_material = new THREE.MeshPhongMaterial({color: 0x000000});
const eye2 = new THREE.Mesh(eye2_geometry, eye2_material);
eye2.position.set(-4, 4.5, -1);
scene.add(eye2);

//create leg
const leg_geometry = new THREE.BoxGeometry(1, 1, 1);
const leg_material = new THREE.MeshPhongMaterial({color: 0xB49671});
const leg = new THREE.Mesh(leg_geometry, leg_material);
let leg_position = [[1,1,1],[1,1,-1],[-1,1,1],[-1]]
leg.position.set(-3, -2.5, 1);
scene.add(leg);


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
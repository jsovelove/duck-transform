//duck model created by kitsuneko
//https://sketchfab.com/kitsuneko_3d
import './style.css'

import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import * as Tone from 'tone'



//texture and model URLs
const duck = new URL('duck.glb', import.meta.url);
const egg = new URL('egg.glb', import.meta.url);
const roast = new URL('roasted_duck.glb', import.meta.url);
const HDRTexture = new URL('quarry_01_puresky_4k.hdr', import.meta.url);
const terrain = new URL('floating_fantasy_island.glb', import.meta.url);
const bird1 = new URL('low_poly_bird.glb', import.meta.url)
const bed = new URL('low_poly_bed.glb', import.meta.url);
const clock = new URL('clock_low_poly.glb', import.meta.url);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  60
);


camera.position.set(6 , 3, 10);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth , window.innerHeight);
renderer.render(scene, camera);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const effectController = {

  focus: 1000.0,
  aperture: 200,
  maxblur: 1

};

const bokeh = new BokehPass( scene, camera, {
  focus: 1.0,
  aperture: 0.025,
  maxblur: 1.0,
  width: window.innerWidth, height : window.innerHeight
} );

composer.addPass(bokeh);

scene.background = new THREE.Color(0x000000);


const matChanger = function ( ) {

  bokeh.uniforms[ 'focus' ].value = effectController.focus;
  bokeh.uniforms[ 'aperture' ].value = effectController.aperture * 0.00001;
  bokeh.uniforms[ 'maxblur' ].value = effectController.maxblur;

};

const autoFilter = new Tone.AutoFilter({ frequency: 0.05, baseFrequency: 220, octaves: 2 }).toDestination().start();
const noise = new Tone.Noise({ type: "brown", volume: -22 }).connect(autoFilter).start();


const player = new Tone.Player("RU_PMGP_92_Plant_Moss_Opal_B.wav").toDestination();
const player2 = new Tone.Player("RU_PMGP_80_Plant_Lemon_Quartz_Bb.wav").toDestination();
// play as soon as the buffer is loaded
player.autostart = true;
player.loop = true;
player2.autostart = false;
player2.loop = true;


// const control = new OrbitControls(camera, renderer.domElement);
// control.enabled = false;



const ambientLight = new THREE.AmbientLight('#FABE6C', .7);
scene.add(ambientLight);
scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);


const light = new THREE.DirectionalLight(0xdfebff, 1.75);
light.position.set(10, 20, 10);
light.castShadow = true;
light.shadow.camera.near = 1;
light.shadow.camera.far = 50;
scene.add(light);

//particle system
let material;
const geometry = new THREE.BufferGeometry()
const vertices = []
const size = 100

for (let i = 0; i < 1000; i++) {
    const x = (Math.random() * size + Math.random() * size) / 2 - size / 2
    const y = (Math.random() * size + Math.random() * size) / 2 - size / 2
    const z = (Math.random() * size + Math.random() * size) / 2 - size / 2

    vertices.push(x, y, z)
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

material = new THREE.PointsMaterial({
    size: 0.2,
    color: 0xffffff,
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)


var geo = new THREE.PlaneGeometry(20, 1000);
var mat = new THREE.MeshBasicMaterial({ color:'brown', side: THREE.DoubleSide });
var plane = new THREE.Mesh(geo, mat);
scene.add(plane);
plane.rotation.x = Math.PI * 0.5;
plane.position.set(390, -0.5, 10);


//3d model loaders
const assetLoader = new GLTFLoader();
let mixer = new THREE.AnimationMixer();
let mixer2 = new THREE.AnimationMixer();
let duck_standing;

assetLoader.load(duck.href, function(gltf){
  duck_standing = gltf.scene;
  mixer = new THREE.AnimationMixer( duck_standing );
	var action = mixer.clipAction( gltf.animations[ 0 ] );
	action.play();
  
  scene.add(duck_standing);
  duck_standing.position.set(0, 0, 0);
  duck_standing.rotation.x = Math.PI * 0.05
  
  
}, undefined, function(error) {
  console.error(error);
});


assetLoader.load(terrain.href, function(gltf){
  let terrain = gltf.scene;
  terrain.scale.set(10, 10, 10);
  
  scene.add(terrain);
  terrain.position.set(-4, -3, -1);
  
  
}, undefined, function(error) {
  console.error(error);
});

let egg_model;

assetLoader.load(egg.href, function(gltf){
  egg_model = gltf.scene;
  egg_model.scale.set(0.3, 0.3 ,0.3);
  egg_model.rotation.z = Math.PI / 2;
  scene.add(egg_model);
  egg_model.position.set(10, -20, 13);
  
  
  
}, undefined, function(error) {
  console.error(error);
});

let roast_model;
assetLoader.load(roast.href, function(gltf){
  roast_model = gltf.scene;
  roast_model.scale.set(0.2, 0.2, 0.2);
  roast_model.rotation.z = Math.PI / 2;
  scene.add(roast_model);
  roast_model.position.set(-10,-30 ,0);
  roast_model.rotation.x = Math.PI / 2;
  
  
}, undefined, function(error) {
  console.error(error);
});

let robin;
assetLoader.load(bird1.href, function(gltf){
  robin = gltf.scene;
  scene.add(robin);
  robin.position.set(5, -7, -15);
  robin.scale.set(10, 10, 10);
  // model.rotation.y = Math.PI * 0.25
  
  
}, undefined, function(error) {
  console.error(error);
});

let bed_model;
assetLoader.load(bed.href, function(gltf){
  bed_model = gltf.scene;
  scene.add(bed_model);
  bed_model.position.set(390, 0, 10);
  
  
}, undefined, function(error) {
  console.error(error);
});

let clock_model;
assetLoader.load(clock.href, function(gltf){
  clock_model = gltf.scene;
  mixer2 = new THREE.AnimationMixer( clock_model );
	var action2 = mixer2.clipAction( gltf.animations[ 0 ] );
	action2.play();
  scene.add(clock_model);
  clock_model.position.set(10, -45, 5);
  clock_model.scale.set(10, 10, 10);
  clock_model.rotation.x = Math.PI * 0.25;
  clock_model.rotation.z = Math.PI * 0.25;
  
}, undefined, function(error) {
  console.error(error);
});


var loader = new THREE.TextureLoader();

var painting_mat = new THREE.MeshLambertMaterial({
  map: loader.load('duck painting.jpeg')
});
var painting_geo = new THREE.PlaneGeometry(10, 10*.75);
var pMesh = new THREE.Mesh(painting_geo, painting_mat);
scene.add(pMesh);
pMesh.position.set(385, 3.25, -10)
pMesh.rotation.y = Math.PI * 0.5;

var painting_mat1 = new THREE.MeshLambertMaterial({
  map: loader.load('duck painting 1.jpeg')
});
var painting_geo1 = new THREE.PlaneGeometry(10, 10*.75);
var pMesh = new THREE.Mesh(painting_geo1, painting_mat1);
scene.add(pMesh);
pMesh.position.set(385, 3.25, -30)
pMesh.rotation.y = Math.PI * 0.5;

var painting_mat2 = new THREE.MeshLambertMaterial({
  map: loader.load('duck painting 2.jpeg')
});
var painting_geo2 = new THREE.PlaneGeometry(10, 10*.75);
var pMesh = new THREE.Mesh(painting_geo2, painting_mat2);
scene.add(pMesh);
pMesh.position.set(385, 3.25, -50)
pMesh.rotation.y = Math.PI * 0.5;

var painting_mat3 = new THREE.MeshLambertMaterial({
  map: loader.load('duck painting 3.jpeg')
});
var painting_geo3 = new THREE.PlaneGeometry(10, 10*.75);
var pMesh = new THREE.Mesh(painting_geo3, painting_mat3);
scene.add(pMesh);
pMesh.position.set(385, 3.25, -70)
pMesh.rotation.y = Math.PI * 0.5;

var painting_mat4 = new THREE.MeshLambertMaterial({
  map: loader.load('duck painting 4.jpeg')
});
var painting_geo4 = new THREE.PlaneGeometry(10, 10*.75);
var pMesh = new THREE.Mesh(painting_geo4, painting_mat4);
scene.add(pMesh);
pMesh.position.set(385, 3.25, -70)
pMesh.rotation.y = Math.PI * 0.5;

var painting_mat5 = new THREE.MeshLambertMaterial({
  map: loader.load('duck painting 5.jpeg')
});
var painting_geo5 = new THREE.PlaneGeometry(10, 10*.75);
var pMesh = new THREE.Mesh(painting_geo5, painting_mat5);
scene.add(pMesh);
pMesh.position.set(385, 3.25, -90)
pMesh.rotation.y = Math.PI * 0.5;

var painting_mat6 = new THREE.MeshLambertMaterial({
  map: loader.load('duck painting 6.jpeg')
});
var painting_geo6 = new THREE.PlaneGeometry(10, 10*.75);
var pMesh = new THREE.Mesh(painting_geo6, painting_mat6);
scene.add(pMesh);
pMesh.position.set(385, 3.25, -110)
pMesh.rotation.y = Math.PI * 0.5;

var painting_mat7 = new THREE.MeshLambertMaterial({
  map: loader.load('duck painting 7.jpeg')
});
var painting_geo7 = new THREE.PlaneGeometry(10, 10*.75);
var pMesh = new THREE.Mesh(painting_geo7, painting_mat7);
scene.add(pMesh);
pMesh.position.set(385, 3.25, -130)
pMesh.rotation.y = Math.PI * 0.5;

var painting_mat8 = new THREE.MeshLambertMaterial({
  map: loader.load('duck 8.jpeg')
});
var painting_geo8 = new THREE.PlaneGeometry(10, 10*.75);
var pMesh = new THREE.Mesh(painting_geo8, painting_mat8);
scene.add(pMesh);
pMesh.position.set(385, 3.25, -130)
pMesh.rotation.y = Math.PI * 0.5;

//Button which changes aperture and focus of Bokeh Shader on click
const btn1 = document.getElementById('btn1')
const introText = document.getElementById('intro-text')
introText.style.display = 'none';
btn1.addEventListener('click', enter_dream, false)
function enter_dream(){
  effectController.focus = 10;
  effectController.aperture = 0.9;
  btn1.style.display = 'none';
  introText.style.display = 'block';
  if (Tone.context.state !== 'running') {
    Tone.context.resume();
  }
  Audioplayer.start();
  
}

const WakeupText = document.getElementById('wakeup-text')
WakeupText.style.display = 'none';

const btn2 = document.getElementById('btn2');
btn2.addEventListener('click', wake_up, false)
function wake_up(){
  //HDR init
  camera.position.x = 400;
  duck_standing.position.set(392, 1, 10);
  duck_standing.rotation.y = Math.PI;
  const HDRLoader = new RGBELoader();
  HDRLoader.load(HDRTexture, function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
  })
  btn2.style.display = 'none';
  introText.style.display = 'none';
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  WakeupText.style.display = 'block';
  player.stop();
  player2.start();
  document.getElementsByTagName("body")[0].style = 'min-height: initial';
}



function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.y = -t * -0.02 + 3;

}
document.body.onscroll = moveCamera


const clock_tick = new THREE.Clock(true);


function animate(time) {
  const dt = clock_tick.getDelta();
  camera.lookAt(0, 0, 0);
  window.addEventListener("keydown", side_scroll);
  function side_scroll(event) {
    if (event.keyCode === 39) {
      camera.position.z -= dt * 0.019;
      camera.updateProjectionMatrix;
      }
    if (event.keyCode === 37) {
      camera.position.z += dt * 0.019;
      camera.updateProjectionMatrix;
      }
  }
  
  
  if(roast_model){
    roast_model.rotation.z = time / 1000;
  }
  if(egg_model){
    egg_model.rotation.z = time / 2000;
  }
  particles.rotation.x = time / 20000;
  particles.rotation.y = time / 20000;

  if(mixer){
    mixer.update(0.009)        
  }
  if(mixer2){
    mixer2.update(0.009)        

  }
  if(robin){
    robin.position.z += time / 300000;

  }
  matChanger();
  composer.render(scene, camera);
  // console.log(camera.position);
}
renderer.setAnimationLoop(animate);

//window resize handler 
window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

})





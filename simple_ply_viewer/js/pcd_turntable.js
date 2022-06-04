import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.138.3/examples/jsm/controls/OrbitControls.js';
import { PLYLoader } from 'https://unpkg.com/three@0.138.3/examples/jsm/loaders/PLYLoader.js';


function createScene() {
  const scene = new THREE.Scene();
  return scene;
}

function createCamera(initialPosition) {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);

  return camera;
}

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  return renderer;
}

function addPointCloudToScene(geometry, context) {
  var material = new THREE.PointsMaterial({ size: 0.005 });
  material.vertexColors = geometry.attributes.color.count > 0;
  var mesh = new THREE.Points(geometry, material);

  context.scene.add(mesh);
}

function loadPly(plyfile, callback, context) {
  new PLYLoader().load(plyfile, function (geometry) {
    callback(geometry, context);
  });
}

function init() {
  const controlPanel = document.getElementById("controlPanel");
  controlPanel.style.backgroundColor = panelColor;

  scene = createScene();
  camera = createCamera(initialCameraPosition);
  renderer = createRenderer();

  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.backgroundColor = backgroundColor;

  controls = new OrbitControls(camera, renderer.domElement);

  const rotSpeedSlider = document.getElementById("rotationSpeedSlider");
  rotSpeed = rotSpeedSlider.value * rotationScale;
  rotSpeedSlider.oninput = function () { rotSpeed = rotSpeedSlider.value * rotationScale };

  const ptSizeSlider = document.getElementById("pointSizeSlider");
  ptSize = ptSizeSlider.value * ptSizeScale;
  ptSizeSlider.oninput = function () { ptSize = ptSizeSlider.value * ptSizeScale };
}

function animate() {
  requestAnimationFrame(animate);

  for (const obj of scene.children) {
    obj.rotation.y += rotSpeed;
    obj.material.size = ptSize;
  }

  controls.update();
  renderer.render(scene, camera);
};

const backgroundColor = "#cccccc";
const panelColor = "#cccccc";

const rotationScale = 0.0005;
const ptSizeScale = 0.0005;

const initialCameraPosition = new THREE.Vector3(0, 0, 2);

var scene, camera, renderer, controls;
var rotSpeed, ptSize;

init();
animate();
loadPly('/data/C_merged.ply', addPointCloudToScene, { scene: scene });

//Import the THREE.js library
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';


//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'japanese_street_at_night';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/japanese_street_at_night/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);



//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

camera.position.y = 2

const rgbeLoader = new RGBELoader();
rgbeLoader.load('path_to_hdri.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; // Set environment lighting
    scene.background = texture;  // Optional: Use HDRI as a background
});

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 3); // Brighter intensity
topLight.position.set(4, 500, 10); // Place the light closer to the scene
topLight.castShadow = true; // Enable shadows
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Intensity of 1.5
scene.add(ambientLight);

topLight.shadow.mapSize.width = 2048;
topLight.shadow.mapSize.height = 2048;
topLight.shadow.camera.near = 0.5;
topLight.shadow.camera.far = 100;

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "japanese_street_at_night") {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.mouseButtons.LEFT = THREE.MOUSE.PAN; // Change left-click to pan instead of rotate
  controls.enableZoom = false;
  controls.enablePan = false; // Disable pan (dragging the mouse to move the camera)
  
}
//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object && objToRender === "japanese_street_at_night") {
    //I've played with the constants here until it looked good 
    object.rotation.y = 0 + mouseX / window.innerWidth * 0.2;
    object.rotation.x = -1.5 + mouseY * 0.3 / window.innerHeight;
    
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();

// Create an audio object
const hoverSound = new Audio('soundeffects/clickpersonasfx.mp3');

// Select all boxes
const tablinks = document.querySelectorAll('.tablinks');

// Add event listeners to each box
tablinks.forEach(tablink => {
    tablink.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0; // Restart sound if already playing
        hoverSound.play();
    });
});


document.addEventListener("DOMContentLoaded", () => {
  const hiddenElements = document.querySelectorAll(".hidden");

  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target); // Stop observing once it's visible
          }
      });
  });

  hiddenElements.forEach((el) => observer.observe(el));
});

document.getElementById("guestbook-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  // Get input values
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name && message) {
    // Create a new list item for the message
    const messageItem = document.createElement("li");
    messageItem.innerHTML = `<strong>${name}</strong>: ${message}`;
    
    // Append the message to the message list
    document.getElementById("message-list").appendChild(messageItem);

    // Clear the form
    document.getElementById("guestbook-form").reset();
  }
});

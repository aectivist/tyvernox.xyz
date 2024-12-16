//Import the THREE.js library
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';

// Loading Screen Setup
const loadingScene = new THREE.Scene();
const loadingCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loadingRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
loadingRenderer.setSize(window.innerWidth, window.innerHeight);
loadingRenderer.setPixelRatio(window.devicePixelRatio * 0.8); // Reduce resolution slightly
loadingRenderer.setClearColor(0x000000, 0); // Set clear color with alpha
loadingRenderer.powerPreference = "high-performance";
document.querySelector('.loading-mask-container').appendChild(loadingRenderer.domElement);

let loadingMask;
const loadingMaskLoader = new GLTFLoader();
loadingMaskLoader.load(
  'models/joker_mask_persona_5/scene.gltf', // Verify this path
  function (gltf) {
    loadingMask = gltf.scene;
    loadingMask.scale.set(1, 1, 1);
    loadingMask.position.set(0, 0.58, 0);
    
    // Optimize the geometry
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = true; // Enable frustum culling
        child.matrixAutoUpdate = false; // Disable automatic matrix updates
      }
    });
    
    loadingScene.add(loadingMask);
    
    // Simplified lighting
    const loadingAmbientLight = new THREE.AmbientLight(0x7b0ab0, 3);
    const loadingDirectionalLight = new THREE.DirectionalLight(0x7b0ab0, 4);
    loadingDirectionalLight.position.set(0, 1, 0.2);
    loadingScene.add(loadingAmbientLight, loadingDirectionalLight);
  },
  undefined,
  function (error) {
    console.error('An error happened while loading the model:', error);
  }
);

loadingCamera.position.set(0, 0.3, 0.8); // Fixed camera position

let animationFrameId;

function animateLoadingScreen() {
  animationFrameId = requestAnimationFrame(animateLoadingScreen);
  
  if (loadingMask) {
    if (loadingMask.scale.x < 30) {
      const remainingDistance = 30 - loadingMask.scale.x;
      // Reduced scaling speed for slower animation
      const scalingSpeed = Math.max(0.1, remainingDistance * 0.08); // reduced from 0.3 to 0.1, and 0.15 to 0.08
      const newScale = loadingMask.scale.x + scalingSpeed;
      
      loadingMask.scale.set(newScale, newScale, newScale);
      loadingMask.updateMatrix();
    }
  }
  loadingRenderer.render(loadingScene, loadingCamera);
}

// Clean up animation when loading is complete
function stopLoadingAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

animateLoadingScreen();

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
  'models/japanese_street_at_night/scene.gltf', // Verify this path
  function (gltf) {
    object = gltf.scene;
    
    // Adjust material tint to be more subtle
    object.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0x2a0845);
        child.material.emissiveIntensity = 0.1; // Reduced from 0.2
      }
    });
    
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error('An error happened while loading the model:', error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

camera.position.y = 2

const rgbeLoader = new RGBELoader();
rgbeLoader.load('path_to_hdri.hdr', (texture) => { // Verify this path
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; // Set environment lighting
    scene.background = texture;  // Optional: Use HDRI as a background
}, undefined, (error) => {
    console.error('An error happened while loading the HDRI:', error);
});

// Modified lighting setup for more dramatic Persona-like atmosphere
const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
topLight.position.set(4, 500, 10);
topLight.castShadow = true;
scene.add(topLight);

// Deep purple ambient light
const ambientLight = new THREE.AmbientLight(0x2a0845, 0.6);
scene.add(ambientLight);

// Red accent light from the side (Persona's signature red)
const redAccent = new THREE.PointLight(0xff0000, 0.3);
redAccent.position.set(-15, 5, 0);
scene.add(redAccent);

// Blue accent light (Persona's blue tones)
const blueAccent = new THREE.PointLight(0x0077ff, 0.3);
blueAccent.position.set(15, 5, 0);
scene.add(blueAccent);

// Mysterious fog effect
scene.fog = new THREE.FogExp2(0x150522, 0.02);

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
    const time = Date.now() * 0.001;
    
    // Existing movement
    object.rotation.y = 0 + mouseX / window.innerWidth * 0.2;
    object.rotation.x = -1.5 + mouseY * 0.3 / window.innerHeight;
    object.position.y = Math.sin(time) * 0.1;
    object.rotation.z = Math.sin(time * 0.5) * 0.05;
    
    // Animate accent lights
    redAccent.intensity = 0.3 + Math.sin(time) * 0.1;
    blueAccent.intensity = 0.3 + Math.sin(time + Math.PI) * 0.1;
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
// animate();

// Main content loading
window.addEventListener('load', () => {
  // Initialize your main Three.js scene and other resources here
  // ...existing initialization code...

  // Once everything is loaded, hide the loading screen
  setTimeout(() => {
    stopLoadingAnimation();
    document.querySelector('.loading-screen').style.display = 'none';
    document.querySelector('.main-content').classList.add('loaded');
    // Start your main animation loop
    animate();
  }, 3000); // Minimum 3 seconds loading screen
});

// Create an audio object
const hoverSound = new Audio('soundeffects/clickpersonasfx.mp3');

// Select all boxes
const tablinks = document.querySelectorAll('.tablinks');

// Add event listeners to each box
tablinks.forEach(tablink => {
    tablink.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0; // Restart sound if already playing
        hoverSound.play().catch(error => {
            if (error.name === 'NotAllowedError') {
                console.log('Audio play was prevented. User interaction is required.');
            } else {
                console.error('Audio play error:', error);
            }
        });
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

document.addEventListener("DOMContentLoaded", () => {
  const guestbookForm = document.getElementById("guestbook-form");
  if (guestbookForm) {
    guestbookForm.addEventListener("submit", function (event) {
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
  }
});

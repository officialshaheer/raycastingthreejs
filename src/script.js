import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap';

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(1,1.3);

for(let i = 1; i < 5; i++) {
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`/photographs/${i}.jpg`)
    })

    const img = new THREE.Mesh(geometry, material);
    img.position.set(Math.random(),i*-1.8)

    scene.add(img);
}

// create array for storing objects in the scene
let objs = [];

// we are going to access the objects in the scene
scene.traverse((object) => {
    if(object.isMesh) {
        objs.push(object);
    }
})

// Materials


// Mesh


// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

gui.add(camera.position, 'y').min(-10).max(10);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Mouse

window.addEventListener("wheel", onMouseWheel);

let y = 0;
let position = 0;

function onMouseWheel(event) {
    y = event.deltaY * 0.0007;
}

// Vector2 is to store x and y values of mouse for using in raycasting
const mouse = new THREE.Vector2();

// This is for getting the mouse x, y value from the browser to use with raycasting.
window.addEventListener('mousemove', (event) => {

    //mouse.x is the first vector which has access to x values 
    // of mouse divided by the total width of the browser screen(sizes.width).
    mouse.x = event.clientX / sizes.width * 2 - 1;

    //mouse.y is the second vector which has access to y values. we need to 
    // minus (-) the divided mouseY and screen size of Y to scroll down.
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;
})

/**
 * Animate
 */

const raycaster = new THREE.Raycaster();

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    position += y;
    y *= .9;

    // Raycaster

    raycaster.setFromCamera(mouse,camera);
    const intersects = raycaster.intersectObjects(objs);

    for(const intersect of intersects) {
        // intersect.object.scale.set(1.1,1.1);
        gsap.to(intersect.object.scale, {x:1.7, y:1.7});
        gsap.to(intersect.object.rotation, {y:-.5});
    }

    for (const object of objs) {
        if(!intersects.find(intersect => intersect.object === object)) {
            gsap.to(object.scale, {x: 1, y:1});
            gsap.to(object.rotation, {y:0});
        }
    }

    camera.position.y = position;


    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
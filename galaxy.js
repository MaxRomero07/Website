import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

// 1. DOM
const container = document.getElementById('canvas-container');
const canvas = document.querySelector('canvas.webgl');

// 2. Scene
const scene = new THREE.Scene();

// 3. Paramètres (Vos maths + Vos couleurs Or)
const parameters = {}
parameters.count = 50000;
parameters.size = 0.015;
parameters.radius = 2.15; 
parameters.branches = 3; 
parameters.spin = 3;
parameters.randomness = 5;
parameters.randomnessPower = 4;
parameters.insideColor = '#d69656'; // Or
parameters.outsideColor = '#1b3a4b'; // Bleu nuit

let material = null; 
let geometry = null; 
let points = null; 

const generateGalaxy = () => {
    if(points !== null){
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for(let i=0; i<parameters.count; i++){
        const i3 = i*3;
        const radius = Math.pow(Math.random()*parameters.randomness, Math.random()*parameters.radius);
        const spinAngle = radius*parameters.spin;
        const branchAngle = ((i%parameters.branches)/parameters.branches)*Math.PI*2;
        
        const negPos = [1,-1];
        const randomX = Math.pow(Math.random(), parameters.randomnessPower)*negPos[Math.floor(Math.random() * negPos.length)];
        const randomY = Math.pow(Math.random(), parameters.randomnessPower)*negPos[Math.floor(Math.random() * negPos.length)];
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower)*negPos[Math.floor(Math.random() * negPos.length)];

        positions[i3] = Math.cos(branchAngle + spinAngle)*(radius) + randomX;
        positions[i3+1] = randomY;
        positions[i3+2] = Math.sin(branchAngle + spinAngle)*(radius) + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, Math.random()*radius/parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3+1] = mixedColor.g;
        colors[i3+2] = mixedColor.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    points = new THREE.Points(geometry, material);
    scene.add(points);
}

generateGalaxy();

// 4. Sizes
const sizes = {
    width: container.clientWidth,
    height: container.clientHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = container.clientWidth;
    sizes.height = container.clientHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// 5. Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
// On positionne la caméra en hauteur (y=3)
camera.position.set(0, 3, 0); 
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// 6. Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true 
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 7. Animation
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // --- C'EST ICI QUE JE REPRENDS VOTRE CODE PRÉFÉRÉ ---
    
    // Je définis une distance (rayon) de rotation.
    // Dans votre exemple c'était 1 (trop près). Je mets 4 pour bien voir la galaxie.
    const cameraRadius = 4;
    const speed = 0.05; // Vitesse de rotation

    camera.position.x = Math.cos(elapsedTime * speed) * cameraRadius;
    camera.position.z = Math.sin(elapsedTime * speed) * cameraRadius;
    
    // La caméra reste toujours fixée sur le centre, mais tourne autour
    camera.lookAt(0, 0, 0);

    // Note : Comme on force la position de la caméra ici, 
    // le zoom manuel de la souris sera "écrasé" par l'animation. 
    // C'est le comportement normal de ce type d'animation cinématique.

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();
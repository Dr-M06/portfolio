import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.querySelector('.background-canvas-container').appendChild(renderer.domElement);

// Particles
const particlesCount = 800;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

const colorPalette = [
    new THREE.Color(0x5f6fff), // accent color
    new THREE.Color(0x7f8fff),
    new THREE.Color(0xa6adff),
    new THREE.Color(0xe6a0ff)
];

for (let i = 0; i < particlesCount; i++) {
    // Position
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    
    // Color
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
}

// Particles geometry
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Particles material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.6,
    vertexColors: true,
    blending: THREE.AdditiveBlending
});

// Create particles
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Create connection lines between nearby particles
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x5f6fff,
    transparent: true,
    opacity: 0.1
});

let lines = [];
const maxDistance = 1.2;

function updateConnections() {
    // Remove old lines
    lines.forEach(line => {
        scene.remove(line);
    });
    lines = [];
    
    // Create new connections
    const positions = particlesGeometry.attributes.position.array;
    
    for (let i = 0; i < particlesCount; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];
        
        for (let j = i + 1; j < particlesCount; j++) {
            const x2 = positions[j * 3];
            const y2 = positions[j * 3 + 1];
            const z2 = positions[j * 3 + 2];
            
            const distance = Math.sqrt(
                Math.pow(x2 - x1, 2) + 
                Math.pow(y2 - y1, 2) + 
                Math.pow(z2 - z1, 2)
            );
            
            if (distance < maxDistance) {
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(x1, y1, z1),
                    new THREE.Vector3(x2, y2, z2)
                ]);
                
                const line = new THREE.Line(lineGeometry, lineMaterial);
                scene.add(line);
                lines.push(line);
                
                // Limit the number of lines for performance
                if (lines.length > 500) break;
            }
        }
        
        // Limit the number of lines for performance
        if (lines.length > 500) break;
    }
}

// Camera position
camera.position.z = 5;

// Animation
let mouseX = 0;
let mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.0002;
    mouseY = (event.clientY - windowHalfY) * 0.0002;
});

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animate
let frame = 0;
function animate() {
    requestAnimationFrame(animate);
    
    frame++;
    
    // Rotate particles
    particles.rotation.x += 0.0001;
    particles.rotation.y += 0.0002;
    
    // Move particles based on mouse position
    particles.rotation.x += mouseY * 0.05;
    particles.rotation.y += mouseX * 0.05;
    
    // Update connections less frequently for better performance
    if (frame % 120 === 0) {
        updateConnections();
    }
    
    renderer.render(scene, camera);
}

animate(); 
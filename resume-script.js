// Resume Page Scripts
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme mode
    initTheme();
    
    // Initialize loader
    initLoader();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize animations
    initAnimations();
    
    // Initialize skill bars
    initSkillBars();
    
    // Initialize skills chart
    initSkillsChart();
    
    // Initialize background canvas (Three.js)
    initBackgroundCanvas();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize text rotation
    initTextRotation();
    
    // Initialize CV download button
    initCVDownload();
});

// Theme toggle functionality
function initTheme() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const storedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply stored theme on load
    if (storedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Toggle theme on click for all theme toggle buttons
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            // Store theme preference
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
            
            // Force text colors to update by triggering a repaint
            document.body.style.display = 'none';
            // This line forces a repaint
            void document.body.offsetHeight;
            document.body.style.display = '';
            
            // Reinitialize the canvas to update particle colors
            initBackgroundCanvas();
            
            // Reinitialize skills chart with theme-appropriate colors
            initSkillsChart();
        });
    });
}

// Text rotation animation for hero section
function initTextRotation() {
    const elements = document.getElementsByClassName('txt-rotate');
    if (elements.length === 0) return;
    
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TextRotator(elements[i], JSON.parse(toRotate), period);
        }
    }
}

class TextRotator {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.isDeleting = false;
        this.tick();
    }
    
    tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];
        
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        this.el.innerHTML = this.txt;
        
        let delta = 200 - Math.random() * 100;
        
        if (this.isDeleting) {
            delta /= 2;
        }
        
        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }
        
        setTimeout(() => {
            this.tick();
        }, delta);
    }
}

// Loader functionality
function initLoader() {
    const loader = document.querySelector('.loader');
    const loaderText = document.querySelector('.loader-text');
    let progress = 0;
    
    // Simulate loading progress
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        
        loaderText.textContent = `Loading... ${Math.floor(progress)}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
            }, 500);
        }
    }, 200);
}

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.nav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Toggle mobile menu
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        // Skip if clicking on menu button itself (handled by above listener)
        if (menuBtn.contains(e.target)) {
            return;
        }
        
        // Close menu when clicking outside menu or toggle
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !themeToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            
            // Scroll to the section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Account for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Sticky navigation on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Update active navigation link based on scroll position
        updateActiveNavLink();
    });
    
    // Close mobile menu on window resize if screen size becomes larger
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.resume-section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Animations functionality
function initAnimations() {
    // Intersection Observer for fade-in, slide-in, and scale-in animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(element => {
        observer.observe(element);
    });
}

// Initialize skill bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percentage = entry.target.getAttribute('data-percentage');
                entry.target.style.width = `${percentage}%`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize skills chart
function initSkillsChart() {
    const chartCanvas = document.getElementById('skills-chart');
    
    if (chartCanvas) {
        try {
            const ctx = chartCanvas.getContext('2d');
            const labels = JSON.parse(chartCanvas.getAttribute('data-labels'));
            const values = JSON.parse(chartCanvas.getAttribute('data-values'));
            
            // Get current theme for chart colors
            const isDarkTheme = document.body.classList.contains('dark-theme');
            
            // Set colors based on theme
            const backgroundColor = isDarkTheme ? 'rgba(114, 137, 253, 0.2)' : 'rgba(74, 108, 247, 0.2)';
            const borderColor = isDarkTheme ? 'rgba(114, 137, 253, 1)' : 'rgba(74, 108, 247, 1)';
            const pointBackgroundColor = isDarkTheme ? 'rgba(114, 137, 253, 1)' : 'rgba(74, 108, 247, 1)';
            const pointHoverBorderColor = isDarkTheme ? 'rgba(114, 137, 253, 1)' : 'rgba(74, 108, 247, 1)';
            const textColor = isDarkTheme ? '#e2e8f0' : '#333';
            
            // Destroy existing chart if it exists
            if (window.skillsChart) {
                window.skillsChart.destroy();
            }
            
            // Create new chart
            window.skillsChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Skill Level',
                        data: values,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 2,
                        pointBackgroundColor: pointBackgroundColor,
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: pointHoverBorderColor
                    }]
                },
                options: {
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                color: textColor
                            },
                            pointLabels: {
                                color: textColor
                            },
                            grid: {
                                color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                            },
                            angleLines: {
                                color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing chart:', error);
        }
    }
}

// Background canvas with Three.js
function initBackgroundCanvas() {
    const container = document.querySelector('.background-canvas-container');
    
    if (!container) return;
    
    // Clear previous canvas if it exists
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    try {
        // Check if THREE is available
        if (typeof THREE === 'undefined') {
            console.error('THREE.js is not loaded');
            return;
        }
        
        // Create scene
        const scene = new THREE.Scene();
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 40;
        
        // Create renderer with better quality
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for performance
        container.appendChild(renderer.domElement);
        
        // Determine color theme
        const isDarkTheme = document.body.classList.contains('dark-theme');
        
        // Create more diverse particle types for polish
        const particleSystems = [];
        
        // Main skill nodes (larger, brighter particles)
        const nodePositions = [
            { x: 0, y: 15, z: 0, name: 'JavaScript' },
            { x: 12, y: 8, z: -5, name: 'React' },
            { x: -12, y: 8, z: -5, name: 'TypeScript' },
            { x: 15, y: 0, z: 5, name: 'HTML/CSS' },
            { x: -15, y: 0, z: 5, name: 'Node.js' },
            { x: 10, y: -8, z: -5, name: 'MongoDB' },
            { x: -10, y: -8, z: -5, name: 'AWS' },
            { x: 0, y: -15, z: 0, name: 'Vue.js' },
        ];
        
        // Create central skill nodes (larger particles)
        const nodeGroup = createSkillNodes(
            nodePositions, 
            isDarkTheme ? 0x7289fd : 0x4a6cf7
        );
        scene.add(nodeGroup);
        particleSystems.push(nodeGroup);
        
        // Create connections between skill nodes
        const connectionLines = createConnectionLines(
            nodePositions,
            isDarkTheme ? 0x7289fd : 0x4a6cf7
        );
        scene.add(connectionLines);
        
        // Create ambient particle cloud (smaller particles)
        const particleCloud = createParticleCloud(
            1500, 
            isDarkTheme ? 0x7289fd : 0x4a6cf7,
            0.07
        );
        scene.add(particleCloud);
        particleSystems.push(particleCloud);
        
        // Create ambient dust particles (tiny particles)
        const ambientDust = createAmbientDust(
            2000, 
            isDarkTheme ? 0x7289fd : 0x4a6cf7,
            0.03
        );
        scene.add(ambientDust);
        particleSystems.push(ambientDust);
        
        // Create glow effect for nodes
        const nodeGlow = createGlowEffect(
            nodePositions,
            isDarkTheme ? 0x7289fd : 0x4a6cf7,
            3
        );
        scene.add(nodeGlow);
        particleSystems.push(nodeGlow);
        
        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        
        // Track mouse movement
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Add scroll effect
        let scrollY = 0;
        let targetScrollY = 0;
        
        window.addEventListener('scroll', () => {
            targetScrollY = window.scrollY * 0.0005;
        });
        
        // Animation timing
        const clock = new THREE.Clock();
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();
            
            // Smooth mouse tracking
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;
            
            // Smooth scroll effect
            scrollY += (targetScrollY - scrollY) * 0.05;
            
            // Rotate and animate the entire scene based on mouse position
            scene.rotation.y = targetX * 0.3;
            scene.rotation.x = targetY * 0.2;
            
            // Additional subtle rotation for dynamic feeling
            scene.rotation.y += delta * 0.05;
            
            // Animate skill nodes
            nodeGroup.children.forEach((node, i) => {
                // Subtle floating animation
                node.position.y += Math.sin(elapsedTime * 0.5 + i) * 0.005;
                // Pulse scale effect
                const scale = 1 + 0.1 * Math.sin(elapsedTime * 0.8 + i * 0.5);
                node.scale.set(scale, scale, scale);
            });
            
            // Animate connection lines
            connectionLines.children.forEach((line, i) => {
                const opacity = 0.3 + 0.1 * Math.sin(elapsedTime * 0.5 + i * 0.2);
                line.material.opacity = opacity;
            });
            
            // Animate ambient dust
            ambientDust.rotation.y += delta * 0.02;
            ambientDust.rotation.x += delta * 0.01;
            
            // Animate glow effect
            nodeGlow.children.forEach((glow, i) => {
                const scale = 1 + 0.2 * Math.sin(elapsedTime * 0.5 + i * 0.5);
                glow.scale.set(scale, scale, scale);
                glow.material.opacity = 0.2 + 0.1 * Math.sin(elapsedTime * 0.8 + i);
            });
            
            // Pulse effect for the particle cloud
            particleCloud.scale.x = 1 + 0.05 * Math.sin(elapsedTime * 0.3);
            particleCloud.scale.y = 1 + 0.05 * Math.sin(elapsedTime * 0.3);
            particleCloud.scale.z = 1 + 0.05 * Math.sin(elapsedTime * 0.3);
            
            // Slow rotation of the entire particle cloud
            particleCloud.rotation.y += delta * 0.03;
            particleCloud.rotation.x += delta * 0.01;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Helper function to create skill nodes
        function createSkillNodes(nodes, color) {
            const group = new THREE.Group();
            
            nodes.forEach((node) => {
                // Create sphere for each skill node
                const geometry = new THREE.SphereGeometry(1, 16, 16);
                const material = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.8
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(node.x, node.y, node.z);
                group.add(mesh);
            });
            
            return group;
        }
        
        // Helper function to create connection lines between skill nodes
        function createConnectionLines(nodes, color) {
            const group = new THREE.Group();
            
            // Create connections between nodes (polygon)
            for (let i = 0; i < nodes.length; i++) {
                const nextIndex = (i + 1) % nodes.length;
                
                const start = new THREE.Vector3(nodes[i].x, nodes[i].y, nodes[i].z);
                const end = new THREE.Vector3(nodes[nextIndex].x, nodes[nextIndex].y, nodes[nextIndex].z);
                
                const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
                const material = new THREE.LineBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.3,
                    linewidth: 1
                });
                
                const line = new THREE.Line(geometry, material);
                group.add(line);
            }
            
            return group;
        }
        
        // Helper function to create a cloud of particles
        function createParticleCloud(count, color, size) {
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);
            
            for (let i = 0; i < count * 3; i += 3) {
                // Create particles in a spherical distribution
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const radius = 10 + Math.random() * 25;
                
                positions[i] = radius * Math.sin(phi) * Math.cos(theta);     // x
                positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
                positions[i + 2] = radius * Math.cos(phi);                   // z
            }
            
            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            // Use custom shader material for better looking particles
            const material = new THREE.PointsMaterial({
                size: size,
                color: color,
                transparent: true,
                opacity: 0.4,
                sizeAttenuation: true
            });
            
            return new THREE.Points(particles, material);
        }
        
        // Helper function to create ambient dust particles
        function createAmbientDust(count, color, size) {
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);
            
            for (let i = 0; i < count * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 80;     // x
                positions[i + 1] = (Math.random() - 0.5) * 80; // y
                positions[i + 2] = (Math.random() - 0.5) * 80; // z
            }
            
            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const material = new THREE.PointsMaterial({
                size: size,
                color: color,
                transparent: true,
                opacity: 0.2,
                sizeAttenuation: true
            });
            
            return new THREE.Points(particles, material);
        }
        
        // Helper function to create glow effect for nodes
        function createGlowEffect(nodes, color, size) {
            const group = new THREE.Group();
            
            nodes.forEach((node) => {
                const geometry = new THREE.SphereGeometry(size, 16, 16);
                const material = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.15
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(node.x, node.y, node.z);
                group.add(mesh);
            });
            
            return group;
        }
        
    } catch (error) {
        console.error('Error initializing Three.js background:', error);
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Validate form data
            const isValid = validateForm(formValues);
            
            if (isValid) {
                // Simulate form submission
                // In a real application, you would send this data to a backend service
                console.log('Form submitted:', formValues);
                
                // Show success message
                alert('Message sent successfully! I will get back to you soon.');
                
                // Reset form
                contactForm.reset();
            }
        });
    }
}

// Form validation
function validateForm(formData) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name || formData.name.trim() === '') {
        alert('Please enter your name');
        isValid = false;
    } else if (!formData.email || !emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        isValid = false;
    } else if (!formData.message || formData.message.trim() === '') {
        alert('Please enter your message');
        isValid = false;
    }
    
    return isValid;
}

// Back to top button functionality
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Handle CV download button functionality
function initCVDownload() {
    const downloadBtn = document.querySelector('.hero-cta .btn-outline');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            const filePath = this.getAttribute('href');
            const fileName = this.getAttribute('download') || 'resume.pdf';
            
            // Show download confirmation
            showDownloadConfirmation();
            
            // Check if download attribute is supported
            if ('download' in document.createElement('a')) {
                // Modern browsers will use the download attribute (already set in HTML)
                return;
            } else {
                // For browsers that don't support the download attribute
                e.preventDefault();
                
                // Create a hidden iframe to trigger download
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = filePath;
                document.body.appendChild(iframe);
                
                // Remove iframe after download is initiated
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }
        });
    }
}

// Function to show download confirmation
function showDownloadConfirmation() {
    // Check if confirmation already exists
    if (document.querySelector('.download-confirmation')) {
        return;
    }
    
    // Create confirmation element
    const confirmation = document.createElement('div');
    confirmation.className = 'download-confirmation';
    confirmation.innerHTML = `
        <div class="download-confirmation-content">
            <i class="fas fa-check-circle"></i>
            <p>Download started</p>
        </div>
    `;
    
    // Add styles
    confirmation.style.position = 'fixed';
    confirmation.style.bottom = '20px';
    confirmation.style.left = '50%';
    confirmation.style.transform = 'translateX(-50%)';
    confirmation.style.backgroundColor = 'var(--primary-color)';
    confirmation.style.color = 'white';
    confirmation.style.padding = '10px 20px';
    confirmation.style.borderRadius = 'var(--border-radius)';
    confirmation.style.boxShadow = 'var(--box-shadow)';
    confirmation.style.zIndex = '9999';
    confirmation.style.opacity = '0';
    confirmation.style.transition = 'opacity 0.3s ease';
    
    // Style the content
    const content = confirmation.querySelector('.download-confirmation-content');
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    content.style.gap = '10px';
    
    // Style the icon
    const icon = confirmation.querySelector('i');
    icon.style.fontSize = '1.8rem';
    
    // Style the text
    const text = confirmation.querySelector('p');
    text.style.margin = '0';
    text.style.fontSize = '1.4rem';
    
    // Add to document
    document.body.appendChild(confirmation);
    
    // Show with animation
    setTimeout(() => {
        confirmation.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        confirmation.style.opacity = '0';
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.parentNode.removeChild(confirmation);
            }
        }, 300);
    }, 3000);
} 
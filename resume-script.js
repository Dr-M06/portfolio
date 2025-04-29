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
    
    // Add responsive handlers
    handleWindowResize();
    initExistingFunctionMods();
    
    // Trigger a resize event to apply responsive settings
    window.dispatchEvent(new Event('resize'));
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
    try {
        const canvasContainer = document.querySelector('.background-canvas-container');
        if (!canvasContainer) return;
        
        // Clear any existing canvas
        while (canvasContainer.firstChild) {
            canvasContainer.removeChild(canvasContainer.firstChild);
        }
        
        // Determine if we're on a mobile device
        const isMobile = window.innerWidth <= 768;
        
        // Use reduced complexity for mobile devices
        const particleCount = isMobile ? 50 : 150;
        const nodeCount = isMobile ? 5 : 15;
        
        // Create scene with reduced complexity for mobile
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;
        
        // Make camera and renderer accessible globally for resize handler
        window.threeJsCamera = camera;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(isMobile ? 1 : window.devicePixelRatio);
        window.threeJsRenderer = renderer;
        
        canvasContainer.appendChild(renderer.domElement);
        
        // The rest of your existing background canvas code...
        // ... but with optimized parameters for mobile

        // Add throttled resize event listener
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Throttle resize to improve performance
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }, 250); // Throttle to 250ms
        });
        
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

// Function to handle window resize for responsiveness
function handleWindowResize() {
    // Check if function already exists in the file
    if (typeof handleWindowResize !== 'undefined') return;
    
    window.addEventListener('resize', () => {
        // Reinitialize charts if they exist
        if (typeof initSkillsChart === 'function') {
            initSkillsChart();
        }
        
        // Adjust canvas size for Three.js background if it exists
        if (window.threeJsRenderer && window.threeJsCamera) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            window.threeJsRenderer.setSize(width, height);
            window.threeJsCamera.aspect = width / height;
            window.threeJsCamera.updateProjectionMatrix();
        }
        
        // Adjust animation timing based on screen size
        const isMobile = window.innerWidth <= 768;
        document.documentElement.style.setProperty('--animation-speed', isMobile ? '0.3s' : '0.5s');
    });
}

// Add responsive adjustments to existing functions
function initExistingFunctionMods() {
    // Fix contact form on mobile
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Ensure form fits on small screens
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                // On mobile, scroll to the input when focused
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            });
        });
    }
    
    // Improve mobile menu behavior
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Add any specific mobile menu behavior here
            const mobileMenu = document.querySelector('.mobile-menu');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            if (mobileMenu && menuBtn) {
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    });
} 
// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// Track mouse position
document.addEventListener('mousemove', (e) => {
    if (cursor && cursorFollower) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Add slight delay to follower for smooth trailing effect
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    }
});

// Click effect
document.addEventListener('mousedown', () => {
    if (cursor && cursorFollower) {
        cursor.classList.add('click');
        cursorFollower.classList.add('active');
    }
});

document.addEventListener('mouseup', () => {
    if (cursor && cursorFollower) {
        cursor.classList.remove('click');
        cursorFollower.classList.remove('active');
    }
});

// Hover effects for interactive elements
const hoverElements = document.querySelectorAll('.cursor-hover');

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor && cursorFollower) {
            if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.classList.contains('project-card')) {
                cursor.classList.add('active');
                cursorFollower.classList.add('active');
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                cursor.classList.add('hover-text');
                cursorFollower.classList.add('hover-text');
            }
        }
    });
    
    el.addEventListener('mouseleave', () => {
        if (cursor && cursorFollower) {
            cursor.classList.remove('active', 'hover-text');
            cursorFollower.classList.remove('active', 'hover-text');
        }
    });
});

// Mobile menu toggle with animation
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.querySelector('.hamburger-icon');

if (mobileMenuButton && mobileMenu && hamburgerIcon) {
    mobileMenuButton.addEventListener('click', function(event) {
        event.stopPropagation();
        mobileMenu.classList.toggle('hidden');
        hamburgerIcon.classList.toggle('active');

        if (mobileMenu.classList.contains('hidden')) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            hamburgerIcon.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            hamburgerIcon.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize Three.js scene with enhanced animations
let scene, camera, renderer, cube, sphere, torus, particles, particleSystem;
let mouseX = 0, mouseY = 0;
let scrollY = 0;
let animationId;

function initThreeScene() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera with dynamic positioning
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Create renderer with enhanced settings
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('three-container').appendChild(renderer.domElement);
    
    // Create enhanced objects with better materials
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-15, 5, -10);
    cube.castShadow = true;
    scene.add(cube);
    
    const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(10, -5, -15);
    sphere.castShadow = true;
    scene.add(sphere);
    
    const torusGeometry = new THREE.TorusGeometry(3, 1, 16, 32);
    const torusMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(0, 10, -20);
    torus.castShadow = true;
    scene.add(torus);
    
    // Add particle system for background effects
    createParticleSystem();
    
    // Add lighting for better visual appeal
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1, 100);
    pointLight2.position.set(10, -10, 10);
    scene.add(pointLight2);
    
    // Add floating cube in about section with enhanced effects
    const floatingCubeElement = document.getElementById('floating-cube');
    if (floatingCubeElement && window.innerWidth > 768) {
        createFloatingCube(floatingCubeElement);
    }
    
    // Mouse movement tracking for interactive effects
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('scroll', onScroll);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function createParticleSystem() {
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;
        
        colors[i] = Math.random() * 0.5 + 0.5;
        colors[i + 1] = Math.random() * 0.5 + 0.5;
        colors[i + 2] = Math.random() * 0.5 + 0.5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });
    
    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

function createFloatingCube(element) {
    const floatingCubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const floatingCubeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
        shininess: 100
    });
    const floatingCube = new THREE.Mesh(floatingCubeGeometry, floatingCubeMaterial);
    
    const floatingCubeScene = new THREE.Scene();
    const floatingCubeCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    floatingCubeCamera.position.z = 5;
    floatingCubeScene.add(floatingCube);
    
    // Add lighting to floating cube
    const floatingLight = new THREE.PointLight(0x8b5cf6, 1, 10);
    floatingLight.position.set(0, 0, 5);
    floatingCubeScene.add(floatingLight);
    
    const floatingCubeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    floatingCubeRenderer.setSize(96, 96);
    element.appendChild(floatingCubeRenderer.domElement);
    
    // Enhanced animation for floating cube
    function animateFloatingCube() {
        requestAnimationFrame(animateFloatingCube);
        
        const time = Date.now() * 0.001;
        floatingCube.rotation.x = Math.sin(time) * 0.3;
        floatingCube.rotation.y = Math.cos(time) * 0.3;
        floatingCube.position.y = Math.sin(time * 2) * 0.5;
        
        // Dynamic color change
        floatingCube.material.color.setHSL((time * 0.1) % 1, 0.7, 0.5);
        
        floatingCubeRenderer.render(floatingCubeScene, floatingCubeCamera);
    }
    
    animateFloatingCube();
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onScroll() {
    scrollY = window.scrollY;
}

function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

function animate() {
    if (scene && camera && renderer) {
        animationId = requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);
        
        // Enhanced cube animation
        if (cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.015;
            cube.rotation.z += 0.005;
            
            // Dynamic scaling based on scroll
            const scale = 1 + Math.sin(time * 2) * 0.1;
            cube.scale.set(scale, scale, scale);
            
            // Color animation
            cube.material.color.setHSL((time * 0.1) % 1, 0.7, 0.5);
            
            // Position animation based on mouse
            cube.position.x += (mouseX * 5 - cube.position.x) * 0.01;
            cube.position.y += (mouseY * 5 - cube.position.y) * 0.01;
        }
        
        // Enhanced sphere animation
        if (sphere) {
            sphere.rotation.y += 0.02;
            sphere.rotation.x += 0.01;
            
            // Bouncing effect
            sphere.position.y += Math.sin(time * 3) * 0.1;
            
            // Dynamic color
            sphere.material.color.setHSL((time * 0.1 + 0.3) % 1, 0.7, 0.5);
            
            // Mouse interaction
            sphere.position.x += (mouseX * 3 - sphere.position.x) * 0.005;
        }
        
        // Enhanced torus animation
        if (torus) {
            torus.rotation.x += 0.015;
            torus.rotation.y += 0.01;
            torus.rotation.z += 0.005;
            
            // Morphing effect
            torus.scale.x = 1 + Math.sin(time * 1.5) * 0.2;
            torus.scale.y = 1 + Math.cos(time * 1.5) * 0.2;
            
            // Dynamic color
            torus.material.color.setHSL((time * 0.1 + 0.6) % 1, 0.7, 0.5);
        }
        
        // Particle system animation
        if (particleSystem) {
            particleSystem.rotation.y += 0.001;
            particleSystem.rotation.x += 0.0005;
            
            // Particles move based on scroll
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += Math.sin(time + i) * 0.01;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        // Camera movement based on scroll and mouse
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.01;
        camera.position.y += (mouseY * 2 - camera.position.y) * 0.01;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
}

// Enhanced GSAP scroll animations
function initScrollAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Enhanced cube scroll animation
    if (cube) {
        gsap.to(cube.position, {
            x: 20,
            y: -10,
            scrollTrigger: {
                trigger: "#about",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    cube.rotation.z = self.progress * Math.PI * 2;
                }
            }
        });
        
        gsap.to(cube.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            scrollTrigger: {
                trigger: "#about",
                start: "top bottom",
                end: "center center",
                scrub: 1
            }
        });
    }
    
    // Enhanced sphere scroll animation
    if (sphere) {
        gsap.to(sphere.position, {
            y: 15,
            x: -15,
            scrollTrigger: {
                trigger: "#skills",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    sphere.rotation.x = self.progress * Math.PI * 4;
                }
            }
        });
        
        gsap.to(sphere.scale, {
            x: 2,
            y: 2,
            z: 2,
            scrollTrigger: {
                trigger: "#skills",
                start: "top bottom",
                end: "center center",
                scrub: 1
            }
        });
    }
    
    // Enhanced torus scroll animation
    if (torus) {
        gsap.to(torus.position, {
            z: 0,
            y: -5,
            scrollTrigger: {
                trigger: "#projects",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    torus.rotation.y = self.progress * Math.PI * 6;
                }
            }
        });
        
        gsap.to(torus.scale, {
            x: 1.8,
            y: 1.8,
            z: 1.8,
            scrollTrigger: {
                trigger: "#projects",
                start: "top bottom",
                end: "center center",
                scrub: 1
            }
        });
    }
    
    // Particle system scroll animation
    if (particleSystem) {
        gsap.to(particleSystem.rotation, {
            y: Math.PI * 2,
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });
    }
    
    
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.querySelector('#contact form');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    
    if (!contactForm || !submitButton) {
        console.warn('Contact form not found');
        return;
    }
    
    // Show loading state
    function showLoading() {
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        return originalText;
    }
    
    // Hide loading state
    function hideLoading(originalText) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    }
    
    // Show success message
    function showSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center';
        successMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        
        contactForm.appendChild(successMessage);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 5000);
    }
    
    // Show error message
    function showError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-center';
        errorMessage.textContent = message || 'Failed to send message. Please try again.';
        
        contactForm.appendChild(errorMessage);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.remove();
            }
        }, 5000);
    }
    
    // Validate form
    function validateForm(formData) {
        const required = ['name', 'email', 'subject', 'message'];
        const errors = [];
        
        required.forEach(field => {
            if (!formData.get(field) || formData.get(field).trim() === '') {
                errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
            }
        });
        
        // Validate email format
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }
        
        return errors;
    }
    
    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const errors = validateForm(formData);
        
        if (errors.length > 0) {
            showError(errors.join(', '));
            return;
        }
        
        const originalText = showLoading();
        
        try {
           
           
                const response = await fetch('https://formspree.io/f/mgvyrdbp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        subject: formData.get('subject'),
                        message: formData.get('message')
                    })
                });
                
                if (response.ok) {
                    showSuccess();
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            
        } catch (error) {
            console.error('Error sending message:', error);
            showError('Failed to send message. Please try again or contact me directly at vaibhavmehar16@gmail.com');
        } finally {
            hideLoading(originalText);
        }
    });
    
    // Add input validation feedback
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('border-red-500');
                this.classList.remove('border-gray-600');
            } else {
                this.classList.remove('border-red-500');
                this.classList.add('border-gray-600');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('border-red-500');
                this.classList.add('border-gray-600');
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThreeScene();
    initScrollAnimations();
    initContactForm();
    
    // Add loading animation
    const loadingScreen = document.createElement('div');
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0f172a;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    loadingScreen.innerHTML = '<div class="gradient-text text-2xl">Loading...</div>';
    document.body.appendChild(loadingScreen);
    
    // Remove loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loadingScreen);
            }, 500);
        }, 1000);
    });
});

// Handle mobile-specific interactions
if ('ontouchstart' in window) {
    // Disable custom cursor on touch devices
    if (cursor) cursor.style.display = 'none';
    if (cursorFollower) cursorFollower.style.display = 'none';
    
    // Add touch feedback
    document.querySelectorAll('.cursor-hover').forEach(el => {
        el.addEventListener('touchstart', () => {
            el.style.transform = 'scale(0.95)';
        });
        
        el.addEventListener('touchend', () => {
            el.style.transform = 'scale(1)';
        });
    });
} 
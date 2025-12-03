// JavaScript Document  

// Neural Network Background Animation
        const canvas = document.getElementById('neural-bg');
        const ctx = canvas.getContext('2d');
        let nodes = [];
        let mouse = { x: 0, y: 0 };

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Node {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.originX = x;
                this.originY = y;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 3 + 1;
                this.friction = 0.99; // <--- facteur d’amortissement
            }

            update() {
                // Effet ressort (ramener vers la position d'origine)
                const spring = 0.002;
                this.vx += (this.originX - this.x) * spring;
                this.vy += (this.originY - this.y) * spring;
            
                // Appliquer friction
                this.vx *= this.friction;
                this.vy *= this.friction;
            
                // Limiter la vitesse
                const maxSpeed = 1.5;
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > maxSpeed) {
                    this.vx = (this.vx / speed) * maxSpeed;
                    this.vy = (this.vy / speed) * maxSpeed;
                }
            
                // Mettre à jour la position
                this.x += this.vx;
                this.y += this.vy;
            
                // Rebonds sur les bords du canvas
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#00ffff';
                ctx.fill();
            }
        }

        function init() {
            nodes = [];
            for (let i = 0; i < 120; i++) {
                nodes.push(new Node(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                ));
            }
        }

        function connectNodes() {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / 150})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }
        // Paramètres
const repelRadius = 120;   // distance autour de la souris où les nœuds sont repoussés
const repelForce = 0.5;   // intensité de la force de répulsion


function repelNodes() {
    // --- AJOUT : STOP si c'est un écran tactile/petit ---
    // Si la largeur de la fenêtre est inférieure à 1024px (couvre mobiles et tablettes verticales)
    if (window.innerWidth < 1024) return; 
    // ----------------------------------------------------

    nodes.forEach(node => {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repelRadius && distance > 0) {
            const nx = dx / distance;
            const ny = dy / distance;
            const force = (repelRadius - distance) * repelForce / distance;
            node.vx += nx * force;
            node.vy += ny * force;
        }
    });
}

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Appliquer la répulsion
    repelNodes();

            nodes.forEach(node => {
                node.update();
                node.draw();
            });

            connectNodes();
            requestAnimationFrame(animate);
        }

        // Initialize and start animation
        init();
        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        // Mouse move effect
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');

        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Fade in sections
            const sections = document.querySelectorAll('.fade-in');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    section.classList.add('visible');
                }
            });
        });

        // Form submission
        document.querySelector('.contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Message sent! (This is a demo)');
        });
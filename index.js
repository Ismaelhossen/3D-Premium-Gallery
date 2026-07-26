 // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        //  0.  Floating CSS Particles
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        (function createFloatParticles() {
            const container = document.getElementById('float-particles');
            const count = 25;
            for (let i = 0; i < count; i++) {
                const el = document.createElement('div');
                el.className = 'float-particle';
                const size = 2 + Math.random() * 6;
                el.style.width = size + 'px';
                el.style.height = size + 'px';
                el.style.left = Math.random() * 100 + '%';
                el.style.animationDuration = 15 + Math.random() * 25 + 's';
                el.style.animationDelay = Math.random() * 20 + 's';
                el.style.opacity = 0.2 + Math.random() * 0.3;
                container.appendChild(el);
            }
        })();

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        //  1.  Background Particles (enhanced)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let W, H;
        const particles = [];
        const COUNT = 180;

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.r = Math.random() * 2.5 + 0.3;
                this.dx = (Math.random() - 0.5) * 0.35;
                this.dy = (Math.random() - 0.5) * 0.35;
                this.alpha = Math.random() * 0.5 + 0.05;
                this.pulse = Math.random() * Math.PI * 2;
                this.speed = 0.004 + Math.random() * 0.018;
                this.hue = 230 + Math.random() * 70;
            }
            update() {
                this.x += this.dx;
                this.y += this.dy;
                this.pulse += this.speed;
                if (this.x < 0 || this.x > W) this.dx *= -1;
                if (this.y < 0 || this.y > H) this.dy *= -1;
            }
            draw() {
                const a = this.alpha * (0.5 + 0.5 * Math.sin(this.pulse));
                const r = this.r * (0.7 + 0.3 * Math.sin(this.pulse * 0.6));
                ctx.beginPath();
                ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
                gradient.addColorStop(0, `hsla(${this.hue}, 90%, 85%, ${a})`);
                gradient.addColorStop(1, `hsla(${this.hue}, 70%, 70%, ${a * 0.2})`);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Outer glow
                if (r > 1.0) {
                    ctx.shadowColor = `hsla(${this.hue}, 80%, 80%, ${a * 0.2})`;
                    ctx.shadowBlur = 20;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        }

        for (let i = 0; i < COUNT; i++) particles.push(new Particle());

        function drawParticles() {
            ctx.clearRect(0, 0, W, H);

            // Connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const alpha = (1 - dist / 150) * 0.04;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const gradient = ctx.createLinearGradient(
                            particles[i].x, particles[i].y,
                            particles[j].x, particles[j].y
                        );
                        gradient.addColorStop(0, `rgba(160, 140, 255, ${alpha})`);
                        gradient.addColorStop(1, `rgba(200, 160, 255, ${alpha * 0.5})`);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => { p.update();
                p.draw(); });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        //  2.  Gallery Logic
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        const gallery = document.getElementById('gallery');
        const total = 8;
        let current = 0;
        let isPaused = false;
        let autoRotate = true;

        // ─── Dots ───
        const dotsContainer = document.getElementById('dots');
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
        const dots = dotsContainer.querySelectorAll('.dot');
        const idxDisplay = document.getElementById('currentIdx');
        const spans = gallery.querySelectorAll('span');

        function updateDots() {
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
            idxDisplay.textContent = current + 1;
            spans.forEach((span, i) => {
                span.classList.toggle('active', i === current);
            });
        }

        // ─── Navigation ───
        function goTo(index) {
            current = ((index % total) + total) % total;
            const targetAngle = current * 45;
            const start = angleDeg;
            const diff = ((targetAngle - start) % 360 + 540) % 360 - 180;
            const endAngle = start + diff;
            const duration = 650;
            const startTime = performance.now();

            autoRotate = false;

            function animateStep(time) {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = progress < 0.5 ?
                    4 * progress * progress * progress :
                    1 - Math.pow(-2 * progress + 2, 3) / 2;
                angleDeg = ((start + diff * ease) % 360 + 360) % 360;
                if (progress < 1) {
                    requestAnimationFrame(animateStep);
                } else {
                    angleDeg = ((endAngle % 360) + 360) % 360;
                    autoRotate = true;
                }
                updateDots();
            }
            requestAnimationFrame(animateStep);
            updateDots();
        }

        function next() {
            autoRotate = false;
            goTo(current + 1);
            setTimeout(() => { autoRotate = true; }, 700);
        }

        function prev() {
            autoRotate = false;
            goTo(current - 1);
            setTimeout(() => { autoRotate = true; }, 700);
        }

        // ─── Button events ───
        document.getElementById('nextBtn').addEventListener('click', next);
        document.getElementById('prevBtn').addEventListener('click', prev);

        // ─── Keyboard ───
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault();
                next(); }
            if (e.key === 'ArrowLeft') { e.preventDefault();
                prev(); }
            if (e.key === ' ') { e.preventDefault();
                togglePause(); }
        });

        // ─── Pause toggle ───
        function togglePause() {
            isPaused = !isPaused;
            if (isPaused) {
                gallery.style.animationPlayState = 'paused';
            } else {
                gallery.style.animationPlayState = 'running';
            }
        }

        // ─── Hover pause ───
        gallery.addEventListener('mouseenter', () => {
            if (!isPaused) {
                gallery.style.animationPlayState = 'paused';
                isPaused = true;
            }
        });
        gallery.addEventListener('mouseleave', () => {
            if (isPaused) {
                gallery.style.animationPlayState = 'running';
                isPaused = false;
            }
        });

        // ─── Touch support ───
        let touchStartX = 0;
        let touchStartY = 0;
        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            gallery.style.animationPlayState = 'paused';
            isPaused = true;
        }, { passive: true });

        gallery.addEventListener('touchmove', (e) => {
            // prevent scrolling
            e.preventDefault();
        }, { passive: false });

        gallery.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 0.6) {
                if (dx > 0) prev();
                else next();
            }
            gallery.style.animationPlayState = 'running';
            isPaused = false;
        }, { passive: true });

        // ─── Mouse tilt ───
        let targetRotX = 0,
            targetRotY = 0;
        let currentRotX = 0,
            currentRotY = 0;
        let tiltActive = true;

        document.addEventListener('mousemove', (e) => {
            const mx = (e.clientX / window.innerWidth - 0.5) * 2;
            const my = (e.clientY / window.innerHeight - 0.5) * 2;
            targetRotY = mx * 3.5;
            targetRotX = -my * 3;
        });

        // ─── JS-Driven Rotation ───
        let angleDeg = 0;
        let lastTime = 0;
        const speed = 0.10;

        function jsRotation(time) {
            if (!lastTime) lastTime = time;
            const delta = time - lastTime;
            lastTime = time;

            currentRotX += (targetRotX - currentRotX) * 0.05;
            currentRotY += (targetRotY - currentRotY) * 0.05;

            if (autoRotate && !isPaused) {
                angleDeg += speed * (delta / 16);
                if (angleDeg > 360) angleDeg -= 360;
            }

            const normalized = ((angleDeg % 360) + 360) % 360;
            const idx = Math.round(normalized / 45) % total;
            if (idx !== current) {
                current = idx;
                updateDots();
            }

            const tiltX = currentRotX;
            const tiltY = currentRotY;
            const transform =
                `perspective(1000px) rotateY(${-angleDeg}deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

            gallery.style.transform = transform;
            gallery.style.animation = 'none';

            requestAnimationFrame(jsRotation);
        }

        requestAnimationFrame(jsRotation);
        updateDots();

        // ─── Re-bind dots ───
        dots.forEach((dot, i) => {
            dot.onclick = () => goTo(i);
        });

        // ─── Window resize handler ───
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalculate positions if needed
            }, 200);
        });

        console.log('✨ 3D Gallery · isMaIL — Premium Edition');
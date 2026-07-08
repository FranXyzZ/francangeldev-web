document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = document.getElementsByClassName("close")[0];

  // Algunas páginas no tienen el modal de imagen (solo el index lo usa)
  if (modal && modalImg && closeBtn) {
    // Abrir modal al hacer clic en una imagen
    document.querySelectorAll(".img-clickable").forEach(img => {
      img.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = img.src;
      });
    });

    // Cerrar modal al hacer clic en la X
    closeBtn.onclick = function () {
      modal.style.display = "none";
    };

    // Cerrar modal al hacer clic fuera de la imagen
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});

// ------------------------------------------------------------------
// Fondo animado de partículas del header (solo corre si existe el
// <canvas id="particles">; páginas como contacto/crew no lo tienen).
// ------------------------------------------------------------------
const canvas = document.getElementById("particles");

if (canvas) {
  const ctx = canvas.getContext("2d");

  let particles = [];
  let numParticles;
  let maxDistance;
  let animationFrameId = null;

  // Clase para representar cada partícula
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 2;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = (Math.random() - 0.5) * 1.5;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.6)"; // un poco más translúcida
      ctx.fill();
    }
  }

  // Inicializa partículas
  function initParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }
  }

  // Conecta partículas solo si están cerca, con opacidad baja
  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 0.1 * (1 - distance / maxDistance); // opacidad más baja
          ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
          ctx.lineWidth = 0.8; // línea más fina
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animación
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => p.update());
    particles.forEach(p => p.draw());
    connectParticles();

    animationFrameId = requestAnimationFrame(animate);
  }

  // Ajusta el canvas y reinicia partículas
  function resizeAndInitCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (window.innerWidth < 768) {
      numParticles = 50;
      maxDistance = 120; // distancia más corta en móviles
    } else {
      numParticles = 120;
      maxDistance = 180; // distancia más larga en escritorio
    }

    initParticles();

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animate();
  }

  window.addEventListener("resize", resizeAndInitCanvas);
  resizeAndInitCanvas();
}

// ------------------------------------------------------------------
// Fondo neón interactivo de toda la página (las dos capas moradas
// fijas definidas en custom.css). Esto NO es el canvas de partículas
// de arriba: solo actualiza dos variables CSS (--mx / --my) para que
// el resplandor siga muy sutilmente al cursor. En "reducir
// movimiento" no se activa.
// ------------------------------------------------------------------
(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const root = document.documentElement;
  let ticking = false;
  let lastX = 50;
  let lastY = 40;

  function applyGlowPosition() {
    root.style.setProperty("--mx", lastX.toFixed(2) + "%");
    root.style.setProperty("--my", lastY.toFixed(2) + "%");
    ticking = false;
  }

  function handlePointerMove(event) {
    lastX = (event.clientX / window.innerWidth) * 100;
    lastY = (event.clientY / window.innerHeight) * 100;

    if (!ticking) {
      requestAnimationFrame(applyGlowPosition);
      ticking = true;
    }
  }

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
})();

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = document.getElementsByClassName("close")[0];

  // Abrir modal al hacer clic en una imagen
  document.querySelectorAll(".img-clickable").forEach(img => {
    img.addEventListener("click", () => {
      modal.style.display = "block";
      modalImg.src = img.src;
    });
  });

  // Cerrar modal al hacer clic en la X
  closeBtn.onclick = function() {
    modal.style.display = "none";
  }

  // Cerrar modal al hacer clic fuera de la imagen
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }
});

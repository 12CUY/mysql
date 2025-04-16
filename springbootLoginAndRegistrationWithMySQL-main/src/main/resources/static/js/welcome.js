
// Lógica para el modal de selección de nivel
const modal = document.getElementById('level-modal');
const playButton = document.getElementById('play-button');
const closeButton = document.querySelector('.close-button');

playButton.addEventListener('click', () => {
    modal.style.display = 'block'; // Mostrar el modal al hacer clic en "Jugar de nuevo"
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none'; // Cerrar el modal al hacer clic en la "X"
});

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none'; // Cerrar el modal si se hace clic fuera de él
    }
}

// Función para seleccionar el nivel
function selectLevel(level) {
    window.location.href = `${level}`; // Redirigir al nivel seleccionado
}

//nva

fetch("/templates/nav.html")
    .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar el navbar.");
        return response.text();
    })
    .then(html => {
        document.getElementById("nav-container").innerHTML = html;
    })
    .catch(error => console.error("Error al cargar el nav:", error));

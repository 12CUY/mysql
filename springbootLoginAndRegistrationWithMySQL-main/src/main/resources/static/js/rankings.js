// Cargar el nav dinámicamente
fetch("/templates/nav.html")
    .then((response) => {
        if (!response.ok) throw new Error("No se pudo cargar el navbar.");
        return response.text();
    })
    .then((html) => {
        document.getElementById("nav-container").innerHTML = html;
    })
    .catch((error) => console.error("Error al cargar el nav:", error));
// Función para obtener los datos del dashboard y la tienda
function getRankingsData() {
    const username = localStorage.getItem("username") || "Usuario";
    const resultsFacil = JSON.parse(
        localStorage.getItem("results-facil")
    ) || { score: 0, time: 0, attempts: 0 };
    const resultsMedio = JSON.parse(
        localStorage.getItem("results-medio")
    ) || { score: 0, time: 0, attempts: 0 };
    const resultsDificil = JSON.parse(
        localStorage.getItem("results-dificil")
    ) || { score: 0, time: 0, attempts: 0 };

    // Verificar si el ícono sorpresa está desbloqueado
    const iconoSorpresa =
        localStorage.getItem("icon-sorpresa") === "purchased" ? "🎉" : "❌";

    // Contar los íconos comprados
    const iconosComprados = ["avocado", "apple", "banana"].filter(
        (icon) => localStorage.getItem(`icon-${icon}`) === "purchased"
    ).length;

    return {
        name: username,
        facil: resultsFacil.score,
        medio: resultsMedio.score,
        dificil: resultsDificil.score,
        facilTime: resultsFacil.time,
        medioTime: resultsMedio.time,
        dificilTime: resultsDificil.time,
        facilAttempts: resultsFacil.attempts,
        medioAttempts: resultsMedio.attempts,
        dificilAttempts: resultsDificil.attempts,
        iconosComprados: iconosComprados,
        iconoSorpresa: iconoSorpresa,
    };
}

// Función para formatear el tiempo en MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
}

// Función para generar el ícono de ranking (oro, plata, bronce)
function getRankIcon(position) {
    if (position === 1)
        return '<i class="fas fa-trophy rank-icon gold"></i>';
    if (position === 2)
        return '<i class="fas fa-trophy rank-icon silver"></i>';
    if (position === 3)
        return '<i class="fas fa-trophy rank-icon bronze"></i>';
    return position;
}

// Función para renderizar la tabla de rankings
function renderRankings() {
    const tableBody = document.querySelector("#rankings-table tbody");

    // Obtener los datos del usuario actual
    const userData = getRankingsData();

    // Limpiar la tabla
    tableBody.innerHTML = "";

    // Agregar fila a la tabla
    const row = document.createElement("tr");
    row.innerHTML = `
                <td>${getRankIcon(1)}</td>
                <td>${userData.name}</td>
                <td>${userData.facil} / ${formatTime(userData.facilTime)} / ${userData.facilAttempts
        }</td>
                <td>${userData.medio} / ${formatTime(userData.medioTime)} / ${userData.medioAttempts
        }</td>
                <td>${userData.dificil} / ${formatTime(
            userData.dificilTime
        )} / ${userData.dificilAttempts}</td>
                <td>${userData.iconosComprados}</td>
                <td class="icono-sorpresa">${userData.iconoSorpresa}</td>
            `;

    tableBody.appendChild(row);
}

// Renderizar la tabla al cargar la página
renderRankings();

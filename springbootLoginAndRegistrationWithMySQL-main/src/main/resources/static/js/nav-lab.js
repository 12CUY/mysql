fetch("/templates/nav.html")
    .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar el navbar.");
        return response.text();
    })
    .then(html => {
        document.getElementById("nav-container").innerHTML = html;
    })
    .catch(error => console.error("Error al cargar el nav:", error));

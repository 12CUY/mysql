
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
// Función para verificar si un nivel está completado
function isLevelCompleted(level) {
    const results = JSON.parse(localStorage.getItem(`results-${level}`)) || { score: 0 };
    return results.score === 3; // Asumiendo que 3 es la puntuación máxima
}

// Función para comprar un ícono
function buyIcon(icon) {
    let levelRequired = '';
    let iconName = '';
    switch (icon) {
        case 'avocado':
            levelRequired = 'facil';
            iconName = '🥑';
            break;
        case 'apple':
            levelRequired = 'medio';
            iconName = '🍎';
            break;
        case 'banana':
            levelRequired = 'dificil';
            iconName = '🍌';
            break;
        default:
            alert('Ícono no válido.');
            return;
    }

    // Verificar si el nivel está completado
    if (!isLevelCompleted(levelRequired)) {
        Swal.fire({
            title: 'Nivel no completado',
            text: `Completa el nivel ${levelRequired.toUpperCase()} para desbloquear este ícono.`,
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Verificar si el ícono ya fue canjeado
    if (localStorage.getItem(`icon-${icon}`) === 'purchased') {
        Swal.fire({
            title: `¡Ya has canjeado el ícono de ${iconName}!`,
            text: 'No puedes canjearlo nuevamente.',
            icon: 'info',
            showClass: {
                popup: 'animate__animated animate__tada'
            },
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Canjear el ícono
    Swal.fire({
        title: `¡Has canjeado el ícono de ${iconName}!`,
        icon: 'success',
        showClass: {
            popup: 'animate__animated animate__rubberBand'
        },
        confirmButtonText: '¡Genial!'
    });
    localStorage.setItem(`icon-${icon}`, 'purchased');
    updateShop();
}

// Función para actualizar la vista de la tienda
function updateShop() {
    const icons = [
        { id: 'avocado', level: 'facil' },
        { id: 'apple', level: 'medio' },
        { id: 'banana', level: 'dificil' }
    ];

    icons.forEach(icon => {
        const iconCard = document.getElementById(`${icon.id}-icon`);
        const requirement = document.getElementById(`${icon.id}-requirement`);
        const button = iconCard.querySelector('.buy-button');

        if (isLevelCompleted(icon.level)) {
            requirement.style.display = 'none';
        } else {
            requirement.style.display = 'block';
        }

        if (localStorage.getItem(`icon-${icon.id}`) === 'purchased') {
            button.textContent = 'Canjeado';
        }
    });
}

// Función para verificar si todos los niveles están completados
function checkSorpresa() {
    if (isLevelCompleted('facil') && isLevelCompleted('medio') && isLevelCompleted('dificil')) {
        Swal.fire({
            title: '¡Felicidades!',
            text: 'Has completado todos los niveles. ¡Aquí tienes un ícono sorpresa! 🎉',
            icon: 'success',
            showClass: {
                popup: 'animate__animated animate__heartBeat'
            },
            confirmButtonText: '¡Gracias!'
        });
        // Regalar un ícono sorpresa
        localStorage.setItem('icon-sorpresa', 'purchased');
    } else {
        Swal.fire({
            title: 'Oops...',
            text: 'Completa todos los niveles para obtener un ícono sorpresa.',
            icon: 'info',
            confirmButtonText: 'Entendido'
        });
    }
}

// Actualizar la tienda al cargar la página
updateShop();

// Mostrar el nombre del usuario (opcional)
const username = localStorage.getItem('username') || 'Usuario';
document.getElementById('username').textContent = username;

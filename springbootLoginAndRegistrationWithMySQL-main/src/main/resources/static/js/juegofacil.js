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
// Cargar animación JSON con Lottie
lottie.loadAnimation({
    container: document.getElementById("lottie"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "/animation/animation-login.json",
  });

 // Obtener preguntas del backend
fetch('/api-facil')
.then(response => {
    if (!response.ok) throw new Error('Error al obtener preguntas');
    return response.json();
})
.then(data => {
    const questions = data;
    
    let currentQuestionIndex = 0;
    let score = 0;
    let startTime = Date.now();
    let timerInterval;
    const level = 'facil';

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        document.getElementById('question-number').textContent = currentQuestionIndex + 1;
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('desc').textContent = question.description;
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = answer.answer;
            button.addEventListener('click', () => selectAnswer(index, answer.isCorrect));
            optionsContainer.appendChild(button);
        });
    }

    function selectAnswer(selectedIndex, isCorrect) {
        if (isCorrect) {
            score++;
            Swal.fire({
                title: '¡Correcto!',
                text: 'Has seleccionado la respuesta correcta.',
                icon: 'success',
                confirmButtonText: 'Siguiente'
            });
        } else {
            const correctAnswer = questions[currentQuestionIndex].answers.find(a => a.isCorrect).answer;
            Swal.fire({
                title: 'Incorrecto',
                text: `La respuesta correcta es: ${correctAnswer}`,
                icon: 'error',
                confirmButtonText: 'Siguiente'
            });
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setTimeout(showQuestion, 1500);
        } else {
            endGame();
        }
    }

    function endGame() {
        clearInterval(timerInterval);
        const endTime = Date.now();
        const totalTime = Math.floor((endTime - startTime) / 1000);
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;

        // Guardar resultados en localStorage
        const results = {
            score: score,
            time: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            attempts: 1
        };
        localStorage.setItem('results-facil', JSON.stringify(results));

        Swal.fire({
            title: '¡Juego terminado!',
            html: `
                <p>Puntuación: ${score} / ${questions.length}</p>
                <p>Tiempo total: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</p>
            `,
            icon: 'info',
            confirmButtonText: 'Volver al dashboard'
        }).then(() => {
            window.location.href = '/dashboard';
        });
    }

    function startTimer() {
        const timerElement = document.getElementById('time-left');
        timerInterval = setInterval(() => {
            const currentTime = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(currentTime / 60);
            const seconds = currentTime % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Iniciar el juego
    showQuestion();
    startTimer();
})
.catch(error => {
    console.error('Error al cargar las preguntas:', error);
    Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cargar las preguntas desde el servidor.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        window.location.href = '/dashboard';
    });
});
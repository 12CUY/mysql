import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const questionsByDifficulty = {
  'Fácil': [
    {
      question: "¿Cuál es la capital de Francia?",
      options: ["Madrid", "París", "Berlín", "Roma"],
      correctAnswer: 1
    },
    {
      question: "¿Cuántos planetas hay en el sistema solar?",
      options: ["7", "8", "9", "10"],
      correctAnswer: 1
    },
    {
      question: "¿Qué elemento químico tiene el símbolo 'O'?",
      options: ["Oro", "Osmio", "Oxígeno", "Oganesón"],
      correctAnswer: 2
    }
  ],
  'Medio': [
    {
      question: "¿En qué año llegó el hombre a la Luna?",
      options: ["1965", "1969", "1972", "1975"],
      correctAnswer: 1
    },
    {
      question: "¿Quién pintó 'La noche estrellada'?",
      options: ["Pablo Picasso", "Vincent van Gogh", "Salvador Dalí", "Claude Monet"],
      correctAnswer: 1
    },
    {
      question: "¿Cuál es el río más largo del mundo?",
      options: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"],
      correctAnswer: 0
    }
  ],
  'Difícil': [
    {
      question: "¿Cuál es el elemento más abundante en el universo?",
      options: ["Oxígeno", "Carbono", "Hidrógeno", "Hierro"],
      correctAnswer: 2
    },
    {
      question: "¿En qué año se fundó Google?",
      options: ["1996", "1998", "2000", "2002"],
      correctAnswer: 1
    },
    {
      question: "¿Qué país tiene forma de bota?",
      options: ["España", "Italia", "Francia", "Portugal"],
      correctAnswer: 1
    }
  ]
};

export default function QuizScreen({ difficulty, onComplete, onCancel }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  const questions = questionsByDifficulty[difficulty] || questionsByDifficulty['Fácil'];

  useEffect(() => {
    const timer = setInterval(() => {
      if (timerActive) {
        setTime(prevTime => prevTime + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive]);

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setTimerActive(false);
        onComplete(score + (answerIndex === questions[currentQuestion].correctAnswer ? 1 : 0), time + 1);
      }
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <MaterialIcons name="arrow-back" size={24} color="#2e7d32" />
        </TouchableOpacity>
        <Text style={styles.difficultyText}>{difficulty}</Text>
        <Text style={styles.timerText}>{time}s</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Pregunta {currentQuestion + 1} de {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill, 
            { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
          ]} />
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {questions[currentQuestion].question}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {questions[currentQuestion].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && styles.selectedOption,
              selectedAnswer !== null && 
                index === questions[currentQuestion].correctAnswer && 
                styles.correctOption,
              selectedAnswer !== null && 
                selectedAnswer === index && 
                selectedAnswer !== questions[currentQuestion].correctAnswer && 
                styles.wrongOption
            ]}
            onPress={() => handleAnswer(index)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
            {selectedAnswer !== null && index === questions[currentQuestion].correctAnswer && (
              <MaterialIcons name="check" size={20} color="white" style={styles.optionIcon} />
            )}
            {selectedAnswer === index && selectedAnswer !== questions[currentQuestion].correctAnswer && (
              <MaterialIcons name="close" size={20} color="white" style={styles.optionIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  difficultyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  timerText: {
    fontSize: 16,
    color: '#2e7d32',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2e7d32',
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  optionIcon: {
    marginLeft: 10,
  },
  selectedOption: {
    opacity: 0.8,
  },
  correctOption: {
    backgroundColor: '#4caf50',
  },
  wrongOption: {
    backgroundColor: '#f44336',
  },
});
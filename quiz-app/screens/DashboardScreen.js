import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import QuizScreen from './QuizScreen';

export default function DashboardScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [difficulty, setDifficulty] = useState('');
  const [results, setResults] = useState({
    'Fácil': { score: 0, time: 0, completed: false },
    'Medio': { score: 0, time: 0, completed: false },
    'Difícil': { score: 0, time: 0, completed: false }
  });

  const handleQuizComplete = (correctAnswers, timeTaken) => {
    setResults(prev => ({
      ...prev,
      [difficulty]: {
        score: correctAnswers,
        time: timeTaken,
        completed: true
      }
    }));
    setShowQuiz(false);
  };

  const startQuiz = (difficulty) => {
    setDifficulty(difficulty);
    setModalVisible(false);
    setShowQuiz(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {showQuiz ? (
        <QuizScreen 
          difficulty={difficulty} 
          onComplete={handleQuizComplete} 
          onCancel={() => setShowQuiz(false)}
        />
      ) : (
        <>
          <View style={styles.header}>
            <MaterialIcons name="dashboard" size={40} color="#2e7d32" />
            <Text style={styles.headerText}>Dashboard</Text>
          </View>

          <View style={styles.resultsContainer}>
            {Object.entries(results).map(([difficulty, result]) => (
              <View 
                key={difficulty} 
                style={[
                  styles.resultCard,
                  !result.completed && styles.incompleteCard
                ]}
              >
                <MaterialIcons 
                  name={result.completed ? "emoji-events" : "help-outline"} 
                  size={40} 
                  color={result.completed ? "#ffd700" : "#ccc"} 
                />
                <Text style={styles.resultTitle}>{difficulty}</Text>
                
                {result.completed ? (
                  <>
                    <Text style={styles.resultText}>Preguntas correctas: {result.score}/3</Text>
                    <Text style={styles.resultText}>Tiempo: {result.time} segundos</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${(result.score/3)*100}%` }]} />
                    </View>
                  </>
                ) : (
                  <Text style={styles.incompleteText}>No completado</Text>
                )}

                <TouchableOpacity 
                  style={styles.cardButton}
                  onPress={() => {
                    setDifficulty(difficulty);
                    setShowQuiz(true);
                  }}
                >
                  <Text style={styles.cardButtonText}>
                    {result.completed ? 'Intentar de nuevo' : 'Comenzar'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecciona dificultad</Text>
                
                <TouchableOpacity 
                  style={styles.difficultyButton}
                  onPress={() => startQuiz('Fácil')}
                >
                  <MaterialIcons name="mood" size={24} color="white" />
                  <Text style={styles.difficultyButtonText}>Fácil</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.difficultyButton, { backgroundColor: '#ff9800' }]}
                  onPress={() => startQuiz('Medio')}
                >
                  <MaterialIcons name="sentiment-neutral" size={24} color="white" />
                  <Text style={styles.difficultyButtonText}>Medio</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.difficultyButton, { backgroundColor: '#f44336' }]}
                  onPress={() => startQuiz('Difícil')}
                >
                  <MaterialIcons name="mood-bad" size={24} color="white" />
                  <Text style={styles.difficultyButtonText}>Difícil</Text>
                </TouchableOpacity>
                
                <Button 
                  title="Cancelar" 
                  onPress={() => setModalVisible(false)}
                  color="#2e7d32"
                />
              </View>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e8f5e9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 10,
  },
  resultsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    alignItems: 'center',
    borderColor: '#2e7d32',
    borderWidth: 1,
  },
  incompleteCard: {
    borderColor: '#ccc',
    opacity: 0.8,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 10,
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 3,
  },
  incompleteText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 10,
  },
  progressBar: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2e7d32',
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  difficultyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  cardButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  cardButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
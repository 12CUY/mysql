import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  Button,
  Animated,
  Easing,
  BackHandler,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import QuizScreen from './QuizScreen';

export default function DashboardScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [difficulty, setDifficulty] = useState('');
  const [results, setResults] = useState({
    'Fácil': { score: 0, time: 0, completed: false, perfect: false },
    'Medio': { score: 0, time: 0, completed: false, perfect: false },
    'Difícil': { score: 0, time: 0, completed: false, perfect: false }
  });

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const slideAnim = useState(new Animated.Value(300))[0];
  const rotateAnim = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    ]).start();

    // Configurar el botón de retroceso físico
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    Alert.alert(
      'Salir',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Sí', onPress: () => navigation.navigate('Login') },
      ]
    );
    return true;
  };

  const allCompleted = Object.values(results).every(result => result.completed);

  const handleQuizComplete = (correctAnswers, timeTaken) => {
    const isPerfect = correctAnswers === 3;
    const newResults = {
      ...results,
      [difficulty]: {
        score: correctAnswers,
        time: timeTaken,
        completed: true,
        perfect: isPerfect
      }
    };
    
    setResults(newResults);
    setShowQuiz(false);
    
    // Animación de celebración al completar
    if (Object.values(newResults).every(r => r.completed)) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();
    }
  };

  const startQuiz = (difficulty) => {
    setDifficulty(difficulty);
    setModalVisible(false);
    setShowQuiz(true);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <MaterialIcons name="dashboard" size={40} color="#2e7d32" />
            <Text style={styles.headerText}>Dashboard</Text>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleBackPress}
            >
              <MaterialIcons name="exit-to-app" size={28} color="#d32f2f" />
            </TouchableOpacity>
          </Animated.View>

          {allCompleted && (
            <Animated.View 
              style={[
                styles.completionBanner,
                {
                  transform: [
                    { rotate: rotateInterpolate },
                    { scale: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05]
                    })}
                  ]
                }
              ]}
            >
              <MaterialIcons name="stars" size={30} color="#ffd700" />
              <Text style={styles.completionText}>¡Has completado todos los niveles!</Text>
            </Animated.View>
          )}

          <View style={styles.resultsContainer}>
            {Object.entries(results).map(([difficulty, result], index) => (
              <Animated.View 
                key={difficulty} 
                style={[
                  styles.resultCard,
                  !result.completed && styles.incompleteCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideAnim },
                      { scale: scaleAnim }
                    ],
                    marginTop: index === 0 ? 0 : 20
                  }
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
                      <Animated.View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${(result.score/3)*100}%`,
                            transform: [{
                              scaleX: scaleAnim.interpolate({
                                inputRange: [0.8, 1],
                                outputRange: [0, 1]
                              })
                            }]
                          }
                        ]} 
                      />
                    </View>
                    {result.perfect && (
                      <Text style={styles.perfectText}>¡Perfecto!</Text>
                    )}
                  </>
                ) : (
                  <Text style={styles.incompleteText}>No completado</Text>
                )}

                <TouchableOpacity 
                  style={[
                    styles.cardButton,
                    result.perfect && styles.disabledButton
                  ]}
                  onPress={() => {
                    if (!result.perfect) {
                      setDifficulty(difficulty);
                      setShowQuiz(true);
                    }
                  }}
                  disabled={result.perfect}
                >
                  <Text style={styles.cardButtonText}>
                    {result.completed ? 
                      (result.perfect ? 'Completado perfecto' : 'Intentar de nuevo') 
                      : 'Comenzar'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <TouchableOpacity 
              style={styles.storeButton}
              onPress={() => navigation.navigate('Store', { 
                results: results,
                allCompleted: allCompleted 
              })}
            >
              <MaterialIcons name="store" size={24} color="white" />
              <Text style={styles.storeButtonText}>Ir a la Tienda</Text>
            </TouchableOpacity>
          </Animated.View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Animated.View 
                style={[
                  styles.modalContent,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: fadeAnim
                  }
                ]}
              >
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
              </Animated.View>
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
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 10,
    flex: 1,
  },
  logoutButton: {
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  completionBanner: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: '#ffd700',
    borderWidth: 2,
  },
  completionText: {
    fontSize: 16,
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
  perfectText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 5,
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
  disabledButton: {
    backgroundColor: '#9E9E9E',
  },
  cardButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff5722',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
  },
  storeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});
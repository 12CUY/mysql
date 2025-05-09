import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const avocadoScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      })
    ]).start();

    // Animación de pulso para el aguacate
    Animated.loop(
      Animated.sequence([
        Animated.timing(avocadoScale, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(avocadoScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    // Animación al presionar el botón
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const response = await axios.post('http://192.168.1.11:8080/api/auth/signin', {
        usernameOrEmail: usernameOrEmail.trim(),
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Respuesta de login:', response.data);
      
      // Guardar el token en AsyncStorage
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        
        // Guardar información del usuario si está disponible
        if (response.data.id) {
          const userData = {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            roles: response.data.roles
          };
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
        }
        
        // Navegar al dashboard
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } else {
        throw new Error('No se recibió token de autenticación');
      }

    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      
      let errorMessage = 'Error al iniciar sesión';
      if (error.response) {
        // Manejo de errores específicos del backend
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 401) {
          errorMessage = 'Credenciales inválidas';
        } else if (error.response.status === 400) {
          errorMessage = 'Datos inválidos';
        }
      } else if (error.request) {
        errorMessage = 'No se recibió respuesta del servidor';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    // Animación al ir al registro
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => navigation.navigate('Register'));
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View 
        style={[
          styles.header,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <Animated.View style={{ transform: [{ scale: avocadoScale }] }}>
          <LottieView
            source={require('../assets/Agucate.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </Animated.View>
        <Text style={styles.title}>Taxation Land</Text>
        <Text style={styles.subtitle}>Iniciar Sesión</Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.formContainer,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <Animated.View style={[styles.inputWrapper, { opacity: fadeAnim }]}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Usuario o correo electrónico"
              placeholderTextColor="#999"
              value={usernameOrEmail}
              onChangeText={setUsernameOrEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.inputWrapper, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity 
          onPress={goToRegister}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c9df8f',
    justifyContent: 'center',
    padding: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  lottieAnimation: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#495057',
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: '#2e7d32',
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#495057',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2e7d32',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 25,
    alignSelf: 'center',
  },
  registerText: {
    color: '#2e7d32',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
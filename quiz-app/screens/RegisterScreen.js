import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated, Easing, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState(''); // Cambiado de name a username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const avocadoScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Configuración inicial de animaciones
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

    // Animación de pulso para el logo
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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    // Validaciones básicas
    if (!username || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    if (password.length < 6 || password.length > 40) {
      Alert.alert('Error', 'La contraseña debe tener entre 6 y 40 caracteres');
      return;
    }

    setLoading(true);

    // Animación del botón
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
      const response = await axios.post('http://192.168.1.11:8080/api/auth/signup', {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Respuesta del servidor:', response.data);
      
      // Manejo de respuesta exitosa
      if (response.data && response.data.message) {
        Alert.alert('Éxito', response.data.message);
        navigation.navigate('Login'); // Redirige a login después de registro
      } else {
        Alert.alert('Éxito', 'Registro completado correctamente');
        navigation.navigate('Login');
      }

    } catch (error) {
      console.error('Error completo:', error.response?.data || error.message);
      
      let errorMessage = 'Error al registrar el usuario';
      if (error.response) {
        // Manejo de errores específicos del backend
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = 'Datos inválidos enviados al servidor';
        } else if (error.response.status === 409) {
          errorMessage = 'El usuario o email ya existe';
        }
      } else if (error.request) {
        errorMessage = 'No se recibió respuesta del servidor';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => navigation.navigate('Login'));
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
        <Animated.View style={{ transform: [{ scale: avocadoScale }] }}>
          <LottieView
            source={require('../assets/Agucate.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </Animated.View>
        <Text style={styles.title}>Taxation Land</Text>
        <Text style={styles.subtitle}>Regístrate</Text>
      </Animated.View>

      <Animated.View style={[styles.formContainer, { transform: [{ translateY: slideAnim }] }]}>
        <Animated.View style={[styles.inputWrapper, { opacity: fadeAnim }]}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </Animated.View>

        <Animated.View style={[styles.inputWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCompleteType="email"
            />
          </View>
        </Animated.View>

        <Animated.View style={[styles.inputWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña (6-40 caracteres)"
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
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity onPress={goToLogin} style={styles.loginLink}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 25,
    alignSelf: 'center',
  },
  loginText: {
    color: '#2e7d32',
    fontSize: 16,
    textDecorationLine: 'none',
  },
});
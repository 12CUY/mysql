import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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

  const handleLogin = () => {
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
    ]).start(() => {
      // Aquí iría la lógica de autenticación
      navigation.navigate('Dashboard');
    });
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
            <MaterialIcons name="email" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
            />
          </View>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Ingresar</Text>
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
    textDecorationLine: 'none',
  },
});
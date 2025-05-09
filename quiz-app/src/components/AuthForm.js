import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AuthForm = ({
  fields,
  onSubmit,
  submitText,
  isLoading,
  children,
}) => {
  const [formData, setFormData] = React.useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      {fields.map((field) => (
        <View key={field.name} style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <MaterialIcons name={field.icon} size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor="#999"
              value={formData[field.name]}
              onChangeText={(text) => handleChange(field.name, text)}
              secureTextEntry={field.secureTextEntry}
              autoCapitalize={field.autoCapitalize || 'none'}
              keyboardType={field.keyboardType || 'default'}
            />
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Procesando...' : submitText}
        </Text>
      </TouchableOpacity>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AuthForm;
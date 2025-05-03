import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const StoreScreen = ({ route }) => {
  // Obtener datos del dashboard
  const { results = {}, allCompleted = false } = route.params || {};

  // Definir recompensas
  const rewards = [
    {
      id: 1,
      name: 'Icono Fácil',
      description: 'Completa el nivel Fácil',
      icon: <FontAwesome name="smile-o" size={50} color="#4CAF50" />,
      unlocked: results['Fácil']?.completed || false
    },
    {
      id: 2,
      name: 'Icono Medio',
      description: 'Completa el nivel Medio',
      icon: <FontAwesome name="meh-o" size={50} color="#FFC107" />,
      unlocked: results['Medio']?.completed || false
    },
    {
      id: 3,
      name: 'Icono Difícil',
      description: 'Completa el nivel Difícil',
      icon: <FontAwesome name="frown-o" size={50} color="#F44336" />,
      unlocked: results['Difícil']?.completed || false
    },
    {
      id: 4,
      name: 'Icono Especial',
      description: 'Completa todos los niveles',
      icon: <MaterialIcons name="stars" size={50} color="#FFD700" />,
      unlocked: allCompleted
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tienda de Recompensas</Text>
      
      <View style={styles.grid}>
        {rewards.map((reward) => (
          <View key={reward.id} style={[
            styles.card, 
            reward.unlocked ? styles.unlocked : styles.locked
          ]}>
            <View style={styles.icon}>
              {reward.unlocked ? reward.icon : (
                <MaterialIcons name="lock" size={50} color="#9E9E9E" />
              )}
            </View>
            <Text style={styles.name}>{reward.name}</Text>
            <Text style={styles.description}>{reward.description}</Text>
            <Text style={reward.unlocked ? styles.unlockedText : styles.lockedText}>
              {reward.unlocked ? 'Desbloqueado' : 'Bloqueado'}
            </Text>
          </View>
        ))}
      </View>

      {allCompleted && (
        <View style={styles.congrats}>
          <MaterialIcons name="celebration" size={40} color="#FFD700" />
          <Text style={styles.congratsText}>¡Has desbloqueado todas las recompensas!</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e8f5e9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  unlocked: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  locked: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    opacity: 0.7,
  },
  icon: {
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 10,
    textAlign: 'center',
  },
  unlockedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  lockedText: {
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
  congrats: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  congratsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 10,
  },
});

export default StoreScreen;
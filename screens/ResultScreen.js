// screens/ResultScreen.js - CÓDIGO COMPLETO E ATUALIZADO
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addScore } from '../database/database'; // Importa a função do banco de dados

export default function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { finalScore } = route.params; // Recebe a pontuação final
  const [playerName, setPlayerName] = useState('');

  const handleSaveScore = async () => {
    if (playerName.trim().length === 0) {
      Alert.alert("Erro", "Por favor, insira seu nome para salvar a pontuação.");
      return;
    }
    try {
      await addScore(playerName, finalScore);
      Alert.alert("Sucesso", "Pontuação salva!");
      navigation.navigate('History'); // Navega para o histórico após salvar
    } catch (err) {
      console.error("Erro ao salvar pontuação:", err);
      Alert.alert("Erro", "Não foi possível salvar a pontuação.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Finalizado!</Text>
      <Text style={styles.scoreText}>Sua pontuação: {finalScore}</Text>

      <TextInput
        style={styles.input}
        placeholder="Seu nome"
        value={playerName}
        onChangeText={setPlayerName}
      />
      <Button title="Salvar Pontuação" onPress={handleSaveScore} />

      <View style={styles.buttonGroup}>
        <Button title="Jogar Novamente" onPress={() => navigation.replace('Quiz')} />
        <Button title="Ver Histórico" onPress={() => navigation.navigate('History')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e0ffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#005f73',
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 30,
    color: '#0a9396',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    width: '80%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonGroup: {
    marginTop: 30,
    flexDirection: 'row',
    gap: 10,
  }
});
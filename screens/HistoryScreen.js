// screens/HistoryScreen.js - CÓDIGO COMPLETO E ATUALIZADO
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { getScores } from '../database/database'; // Importa a função do banco de dados

export default function HistoryScreen() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadScores = useCallback(async () => {
    setLoading(true);
    try {
      const loadedScores = await getScores();
      setScores(loadedScores);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
      Alert.alert("Erro", "Não foi possível carregar o histórico de pontuações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Pontuações</Text>
      {scores.length === 0 ? (
        <Text>Nenhuma pontuação registrada ainda.</Text>
      ) : (
        <FlatList
          data={scores}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.scoreItem}>
              <Text style={styles.playerName}>{item.playerName}</Text>
              <Text style={styles.playerScore}>Pontuação: {item.score}</Text>
              <Text style={styles.scoreDate}>Data: {item.date}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5dc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4a2a0a',
  },
  scoreItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  playerScore: {
    fontSize: 16,
    color: '#666',
  },
  scoreDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  }
});
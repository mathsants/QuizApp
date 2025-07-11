// App.js - na raiz do projeto (CÓDIGO COMPLETO E FINAL)
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, Alert, LogBox } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { initDatabase, populateQuestions } from './database/database';
import { registerRootComponent } from 'expo';

// LINHA ADICIONADA PARA SUPRIMIR O AVISO "NativeEventEmitter"
LogBox.ignoreLogs(['new NativeEventEmitter() was called with a non-null argument']);

export function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        await initDatabase();
        // console.log("Banco de dados inicializado."); // REMOVIDO
        await populateQuestions();
        setDbInitialized(true);
      } catch (err) {
        console.error("Erro ao inicializar o banco de dados:", err);
        Alert.alert("Erro", "Não foi possível inicializar o banco de dados. Verifique o console para mais detalhes.");
      }
    }
    initialize();
  }, []);

  if (!dbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando aplicativo...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

// Esta linha registra o componente App como o principal do seu aplicativo.
registerRootComponent(App);
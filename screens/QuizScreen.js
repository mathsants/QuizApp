// screens/QuizScreen.js - CÓDIGO COMPLETO E FINAL (SEM CONSOLE.LOGS)
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getQuestions } from '../database/database'; // Importa a função do banco de dados

export default function QuizScreen() {
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Carrega as perguntas do banco de dados ao iniciar
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const loadedQuestions = await getQuestions();
      if (loadedQuestions.length === 0) {
        Alert.alert("Erro", "Nenhuma pergunta encontrada. Por favor, reinicie o aplicativo ou verifique a população do banco de dados.");
        setLoading(false);
        return;
      }
      // Garante que as perguntas são embaralhadas para um quiz diferente a cada vez
      const shuffledQuestions = loadedQuestions.sort(() => 0.5 - Math.random());
      setQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0); // Reinicia o índice da pergunta para o início
      setScore(0); // Reinicia a pontuação
    } catch (err) {
      console.error("Erro ao carregar perguntas:", err);
      Alert.alert("Erro", "Não foi possível carregar as perguntas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleAnswer = (selectedAnswer) => {
    // console.log("Opção clicada:", selectedAnswer); // REMOVIDO
    // console.log("Pontuação atual:", score); // REMOVIDO
    // console.log("Pergunta atual:", questions[currentQuestionIndex].question); // REMOVIDO
    // console.log("Resposta correta esperada:", questions[currentQuestionIndex].correctAnswer); // REMOVIDO


    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
      // console.log("Resposta CORRETA! Nova pontuação:", score + 1); // REMOVIDO
    } else {
      // console.log("Resposta INCORRETA."); // REMOVIDO
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      const finalScoreCalculated = score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0);
      // console.log("Fim do Quiz! Pontuação final a enviar:", finalScoreCalculated); // REMOVIDO
      navigation.replace('Result', { finalScore: finalScoreCalculated });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando perguntas...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Nenhuma pergunta disponível.</Text>
        <Button title="Recarregar Perguntas" onPress={loadQuestions} />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        {currentQuestionIndex + 1}. {currentQuestion.question}
      </Text>
      <View style={styles.optionsContainer}>
        {/* Usando TouchableOpacity para opções clicáveis */}
        {['optionA', 'optionB', 'optionC', 'optionD'].map((optionKey) => (
          <TouchableOpacity
            key={optionKey} // Chave única para cada item na lista
            style={styles.optionButton}
            onPress={() => handleAnswer(currentQuestion[optionKey])}
          >
            {/* O TEXTO DA OPÇÃO PRECISA ESTAR DENTRO DE <Text> */}
            <Text style={styles.optionButtonText}>
              {currentQuestion[optionKey]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.scoreDisplay}>Score: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E0FFFF', // Exemplo: azul claro pastel para a tela
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24, // Pergunta um pouco maior
    fontWeight: 'bold',
    marginBottom: 35,
    textAlign: 'center',
    color: '#4682B4', // Azul aço para a pergunta
  },
  optionsContainer: {
    width: '80%', // Limita a largura do contêiner de opções
    gap: 15, // Espaçamento entre os botões (nova propriedade do React Native)
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButton: { // Estilos para os botões de opção
    backgroundColor: '#7FFFD4', // Verde água para os botões
    paddingVertical: 18, // Um pouco mais de padding vertical
    paddingHorizontal: 25, // Aumenta a largura clicável
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Garante que o botão ocupe a largura total do container
    marginVertical: 5, // Espaçamento vertical entre os botões
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionButtonText: {
    fontSize: 19, // Texto da opção um pouco maior
    fontWeight: 'bold',
    color: '#2F4F4F', // Cor de texto mais escura
    textAlign: 'center',
  },
  scoreDisplay: {
    fontSize: 20, // Pontuação um pouco maior
    marginTop: 25,
    color: '#8B0000', // Cor vermelha escura para a pontuação
    fontWeight: 'bold',
  }
});
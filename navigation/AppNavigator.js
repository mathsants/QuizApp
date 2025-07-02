// navigation/AppNavigator.js - CÓDIGO COMPLETO E ATUALIZADO
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Quiz">
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Resultado' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
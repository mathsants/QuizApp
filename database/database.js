// database/database.js - CÓDIGO COMPLETO E ATUALIZADO (SEM COMENTÁRIOS EXTRAS)
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('quiz.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, optionA TEXT, optionB TEXT, optionC TEXT, optionD TEXT, correctAnswer TEXT);',
        [],
        () => {
          console.log('Tabela "questions" verificada/criada.');
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, playerName TEXT, score INTEGER, date TEXT);',
            [],
            () => {
              console.log('Tabela "scores" verificada/criada.');
              resolve();
            },
            (_, error) => {
              console.error('Erro ao criar tabela "scores":', error);
              reject(error);
            }
          );
        },
        (_, error) => {
          console.error('Erro ao criar tabela "questions":', error);
          reject(error);
        }
      );
    });
  });
};

export const populateQuestions = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM questions;',
        [],
        (_, result) => {
          if (result.rows.item(0).count === 0) {
            console.log('Nenhuma pergunta existente, populando novamente.');

            const questionsToInsert = [
              {
                question: "Qual sistema operacional é mais comum em dispositivos embarcados de baixo custo?",
                optionA: "Android",
                optionB: "iOS",
                optionC: "Linux Embarcado",
                optionD: "Windows Mobile",
                correctAnswer: "Linux Embarcado"
              },
              {
                question: "Qual protocolo é frequentemente usado para comunicação sem fio em dispositivos IoT (Internet das Coisas)?",
                optionA: "HTTP",
                optionB: "FTP",
                optionC: "MQTT",
                optionD: "SMTP",
                correctAnswer: "MQTT"
              },
              {
                question: "Qual componente é o 'cérebro' de um sistema embarcado, responsável por executar as instruções?",
                optionA: "Memória RAM",
                optionB: "Processador (CPU/MCU)",
                optionC: "Sensor",
                optionD: "Atuador",
                correctAnswer: "Processador (CPU/MCU)"
              },
              {
                question: "Qual das opções a seguir NÃO é um exemplo comum de dispositivo embarcado?",
                optionA: "Máquina de lavar roupa",
                optionB: "Smartwatch",
                optionC: "Servidor de data center",
                optionD: "Roteador Wi-Fi",
                correctAnswer: "Servidor de data center"
              },
              {
                question: "Qual linguagem de programação é amplamente utilizada para desenvolver firmware em sistemas embarcados?",
                optionA: "Python",
                optionB: "Java",
                optionC: "C/C++",
                optionD: "JavaScript",
                correctAnswer: "C/C++"
              },
              {
                question: "O que significa a sigla RTOS em sistemas embarcados?",
                optionA: "Real-Time Operating System",
                optionB: "Remote Terminal Operating System",
                optionC: "Routine Task Optimization System",
                optionD: "Robust Technology Operating Solution",
                correctAnswer: "Real-Time Operating System"
              },
              {
                question: "Qual tecnologia de comunicação sem fio tem maior alcance e é usada em redes de área ampla para IoT?",
                optionA: "Bluetooth",
                optionB: "NFC",
                optionC: "LoRaWAN",
                optionD: "Wi-Fi",
                correctAnswer: "LoRaWAN"
              },
              {
                question: "Qual é a principal característica de um sistema embarcado em tempo real (real-time)?",
                optionA: "Processamento de dados em alta velocidade",
                optionB: "Garantia de que as tarefas sejam concluídas dentro de prazos específicos",
                optionC: "Capacidade de executar múltiplos sistemas operacionais",
                optionD: "Baixo consumo de energia",
                correctAnswer: "Garantia de que as tarefas sejam concluídas dentro de prazos específicos"
              },
              {
                question: "Qual é o nome do microcontrolador popularmente usado em projetos de prototipagem e educação?",
                optionA: "Raspberry Pi",
                optionB: "Arduino",
                optionC: "NVIDIA Jetson",
                optionD: "Intel Edison",
                correctAnswer: "Arduino"
              },
              {
                question: "Qual é a função de um sensor em um dispositivo embarcado?",
                optionA: "Executar cálculos complexos",
                optionB: "Armazenar grandes volumes de dados",
                optionC: "Converter energia elétrica em movimento",
                optionD: "Detectar e medir grandezas físicas do ambiente",
                correctAnswer: "Detectar e medir grandezas físicas do ambiente"
              }
            ];

            const insertPromises = questionsToInsert.map(q => {
              return new Promise((res, rej) => {
                tx.executeSql(
                  'INSERT INTO questions (question, optionA, optionB, optionC, optionD, correctAnswer) VALUES (?, ?, ?, ?, ?, ?);',
                  [q.question, q.optionA, q.optionB, q.optionC, q.optionD, q.correctAnswer],
                  () => res(),
                  (_, error) => rej(error)
                );
              });
            });

            Promise.all(insertPromises)
              .then(() => {
                console.log('Perguntas populadas com sucesso!');
                resolve();
              })
              .catch(error => {
                console.error('Erro ao popular perguntas:', error);
                reject(error);
              });
          } else {
            console.log('Perguntas já existem, não populando novamente.');
            resolve();
          }
        },
        (_, error) => {
          console.error('Erro ao verificar perguntas existentes:', error);
          reject(error);
        }
      );
    });
  });
};

export const getQuestions = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM questions;',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          console.error('Erro ao obter perguntas:', error);
          reject(error);
        }
      );
    });
  });
};

export const addScore = (playerName, score) => {
  return new Promise((resolve, reject) => {
    const date = new Date().toLocaleString();
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO scores (playerName, score, date) VALUES (?, ?, ?);',
        [playerName, score, date],
        () => resolve(),
        (_, error) => {
          console.error('Erro ao adicionar score:', error);
          reject(error);
        }
      );
    });
  });
};

export const getScores = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM scores ORDER BY score DESC, date DESC;',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          console.error('Erro ao obter scores:', error);
          reject(error);
        }
      );
    });
  });
};

export const clearQuestions = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM questions;',
        [],
        () => {
          console.log('Todas as perguntas foram removidas.');
          resolve();
        },
        (_, error) => {
          console.error('Erro ao remover perguntas:', error);
          reject(error);
        }
      );
    });
  });
};

export const clearScores = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM scores;',
        [],
        () => {
          console.log('Todos os scores foram removidos.');
          resolve();
        },
        (_, error) => {
          console.error('Erro ao remover scores:', error);
          reject(error);
        }
      );
    });
  });
};
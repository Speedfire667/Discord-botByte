const mineflayer = require('mineflayer');

// Função para criar o bot
function createBot() {
  const bot = mineflayer.createBot({
    host: 'BYTEServer.aternos.me',   // IP do servidor Aternos
    port: 12444,                     // Porta do servidor
    version: '1.16.4',               // Versão do servidor Minecraft (ajuste conforme necessário)
    auth: 'offline',                 // Modo offline (não precisa de conta premium)
    username: 'Bot',                 // Nome do bot
  });

  let lastMoveTime = Date.now(); // Marca o tempo da última movimentação
  const inactivityThreshold = 60000; // Limite de inatividade (1 minuto)

  bot.on('spawn', () => {
    console.log('Bot entrou no servidor!');
    
    // Exemplo: mover o bot em um padrão 3x3
    setInterval(() => {
      bot.setControlState('forward', true); // Andar para frente
      setTimeout(() => {
        bot.setControlState('forward', false);
        bot.setControlState('left', true); // Virar à esquerda
      }, 1000); // Mover por 1 segundo em cada direção
      setTimeout(() => {
        bot.setControlState('left', false);
        bot.setControlState('back', true); // Andar para trás
      }, 2000); // Mover por 1 segundo
      setTimeout(() => {
        bot.setControlState('back', false);
        bot.setControlState('right', true); // Virar à direita
      }, 3000); // Mover por 1 segundo
      setTimeout(() => {
        bot.setControlState('right', false);
      }, 4000); // Finaliza o ciclo

      // Atualiza o tempo da última movimentação
      lastMoveTime = Date.now();
    }, 5000); // Repete a cada 5 segundos

    // Enviar mensagens aleatórias no console a cada 5 segundos
    const messages = [
      "Bot está ativo!",
      "Olhando ao redor...",
      "Eu sou um bot, mas também sou legal!",
      "Por que o creeper não gosta de festas?",
      "Se eu fosse um bloco, seria de diamante!",
      "A mineração é minha paixão!",
      "Cuidado com a lava, sempre!",
    ];

    setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      console.log(randomMessage);
    }, 5000); // Envia uma mensagem a cada 5 segundos
  });

  bot.on('error', (err) => {
    console.log('Erro: ', err);
  });

  bot.on('end', () => {
    console.log('Bot desconectado.');
    
    // Verifica se o motivo foi inatividade
    if (Date.now() - lastMoveTime >= inactivityThreshold) {
      console.log('Desconectado por inatividade. Tentando reconectar...');
      attemptReconnect();  // Tenta reconectar automaticamente por inatividade
    } else {
      console.log('Desconectado por outro motivo. Não tentaremos reconectar.');
    }
  });

  // Função para tentar reconectar automaticamente após desconexão por inatividade
  function attemptReconnect() {
    setTimeout(() => {
      createBot();  // Cria uma nova instância do bot
    }, 5000);  // Tenta reconectar após 5 segundos
  }
}

// Cria a primeira instância do bot
createBot();

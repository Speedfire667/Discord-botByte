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

  bot.on('spawn', () => {
    console.log('Bot entrou no servidor! Iniciando movimento e mensagens.');

    // Lista de mensagens para enviar no console
    const messages = [
      "Explorando o mundo!",
      "Correndo em quadrado 3x3.",
      "Sou apenas um bot se divertindo no servidor!",
      "Minecraft é ótimo para bots também!",
      "Procurando por aventuras automáticas...",
      "Construir? Talvez depois, agora é hora de correr!",
    ];

    // Envia mensagens aleatórias no console a cada 5 segundos
    setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      console.log(randomMessage);
    }, 5000); // Intervalo de 5 segundos para as mensagens

    // Função para movimentar o bot em um padrão de quadrado 3x3
    function moveSquare() {
      bot.setControlState('sprint', true); // Ativa o modo de correr

      bot.setControlState('forward', true);
      setTimeout(() => {
        bot.setControlState('forward', false);

        bot.setControlState('left', true);
        setTimeout(() => {
          bot.setControlState('left', false);

          bot.setControlState('back', true);
          setTimeout(() => {
            bot.setControlState('back', false);

            bot.setControlState('right', true);
            setTimeout(() => {
              bot.setControlState('right', false);

              // Continua o movimento em loop
              moveSquare();
            }, 500); // Tempo para virar à direita
          }, 1000); // Tempo para andar para trás
        }, 500); // Tempo para virar à esquerda
      }, 1000); // Tempo para andar para frente
    }

    moveSquare(); // Inicia o padrão de movimento
  });

  bot.on('error', (err) => {
    console.log('Erro no bot:', err.message);
  });

  bot.on('end', () => {
    console.log('Bot foi desconectado. Ele não tentará reconectar.');
  });
}

// Cria a instância do bot
createBot();

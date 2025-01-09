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

  let reconnectionInterval = 5000; // Intervalo de reconexão em milissegundos

  bot.on('spawn', () => {
    console.log('Bot entrou no servidor!');
  });

  bot.on('end', () => {
    console.log('Bot foi desconectado. Tentando reconectar...');
    attemptReconnect(); // Tenta reconectar
  });

  bot.on('kicked', (reason) => {
    console.log('Bot foi expulso do servidor:', reason);
    attemptReconnect(); // Tenta reconectar após ser expulso
  });

  bot.on('error', (err) => {
    console.log('Erro no bot:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.log('Servidor ainda não está disponível. Tentando reconectar...');
      attemptReconnect(); // Tenta reconectar se o servidor não está disponível
    }
  });

  // Função para tentar reconectar
  function attemptReconnect() {
    setTimeout(() => {
      console.log('Reconectando...');
      createBot(); // Cria uma nova instância do bot
    }, reconnectionInterval);
  }
}

// Cria a primeira instância do bot
createBot();

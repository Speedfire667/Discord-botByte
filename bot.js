const mineflayer = require('mineflayer');
const Movements = require('mineflayer-pathfinder').Movements;
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const config = require('./settings.json');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running');
});

app.listen(8000, () => {
  console.log('Server started');
});

function createBot() {
  const bot = mineflayer.createBot({
    username: config['bot-account']['username'],
    password: config['bot-account']['password'],
    auth: config['bot-account']['type'],
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version,
  });

  bot.loadPlugin(pathfinder);
  const mcData = require('minecraft-data')(bot.version);

  bot.once('spawn', () => {
    console.log('\x1b[33m[AfkBot] Bot joined the server', '\x1b[0m');

    // Configuração anti-AFK
    if (config.utils['anti-afk'].enabled) {
      console.log('\x1b[32m[INFO] Starting anti-AFK movement\x1b[0m');
      antiAfkMovement(
        bot,
        config.utils['anti-afk']['square-size'],
        config.utils['anti-afk']['sneak'],
        config.utils['anti-afk']['chat'],
        config.utils['anti-afk']['delay']
      );
    }
  });

  bot.on('chat', (username, message) => {
    if (config.utils['chat-log']) {
      console.log(`[ChatLog] <${username}> ${message}`);
    }
  });

  bot.on('error', (err) =>
    console.log(`\x1b[31m[ERROR] ${err.message}`, '\x1b[0m')
  );

  bot.on('end', () => {
    if (config.utils['auto-reconnect']) {
      console.log('\x1b[33m[INFO] Reconnecting...\x1b[0m');
      setTimeout(createBot, config.utils['auto-recconect-delay']);
    }
  });
}

// Função para o bot andar em um quadrado com configurações de sneak e chat
function antiAfkMovement(bot, size, sneak, chatConfig, delay) {
  const startPosition = bot.entity.position.clone();
  const path = [
    { x: size, z: 0 }, // Para frente
    { x: 0, z: size }, // Para a direita
    { x: -size, z: 0 }, // Para trás
    { x: 0, z: -size }, // Para a esquerda
  ];

  let step = 0;

  setInterval(() => {
    const move = path[step];
    const targetPosition = startPosition.offset(move.x, 0, move.z);
    bot.pathfinder.setMovements(new Movements(bot, require('minecraft-data')(bot.version)));
    bot.pathfinder.setGoal(new pathfinder.goals.GoalBlock(targetPosition.x, targetPosition.y, targetPosition.z));
    console.log(`\x1b[33m[INFO] Moving to ${targetPosition.x}, ${targetPosition.y}, ${targetPosition.z}\x1b[0m`);

    // Ativar ou desativar sneak
    if (sneak) {
      bot.setControlState('sneak', true);
    }

    // Enviar mensagem no chat (se habilitado)
    if (chatConfig.enabled) {
      bot.chat(chatConfig.message);
      console.log(`\x1b[32m[INFO] Sent chat message: "${chatConfig.message}"\x1b[0m`);
    }

    // Próximo passo no quadrado
    step = (step + 1) % path.length;
  }, delay * 1000); // Tempo de espera entre movimentos
}

createBot();

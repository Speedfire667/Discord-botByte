const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'BYTEserver.aternos.me',
  port: 12444,
  username: 'seu_usuario'
});

bot.on('login', () => {
  console.log('Bot conectado');
  andarEmQuadrado();
});

function andarEmQuadrado() {
  const movimentos = [
    { x: 1, z: 0 },
    { x: 0, z: 1 },
    { x: -1, z: 0 },
    { x: 0, z: -1 }
  ];

  let i = 0;

  function moveBot() {
    const movimento = movimentos[i];
    bot.setControlState('forward', true);
    bot.setControlState('jump', true);

    setTimeout(() => {
      bot.setControlState('forward', false);
      bot.setControlState('jump', false);
      i = (i + 1) % movimentos.length;
      setTimeout(moveBot, 5000);
    }, 5000);
  }

  moveBot();
}

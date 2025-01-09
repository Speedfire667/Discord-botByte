const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'BYTEserver.aternos.me',  // Endereço do servidor
  port: 12444,                    // Porta do servidor
  username: 'BotName',            // Nome do bot (não precisa ser uma conta real)
  version: false,                 // Detecta a versão automaticamente
  auth: 'mojang',                 // Usado para contas premium, mas não necessário aqui
  offline: true                   // Indica que o bot deve se conectar de forma offline
});

bot.on('spawn', () => {
  console.log('Bot entrou no servidor!');
  
  // Função para fazer o quadrado 3x3
  function fazerQuadrado() {
    const startPos = bot.entity.position; // Posição inicial
    
    // Criação do quadrado 3x3
    for (let x = 0; x < 3; x++) {
      for (let z = 0; z < 3; z++) {
        bot.setBlock(new mineflayer.Vec3(startPos.x + x, startPos.y, startPos.z + z), 1); // Coloca bloco de pedra (ID 1)
      }
    }

    // Movendo-se em torno do quadrado 3x3
    bot.setControlState('forward', true); // Começa a andar para frente
    setTimeout(() => bot.setControlState('forward', false), 2000); // Para após 2 segundos
  }

  fazerQuadrado();
});

bot.on('error', err => console.log(err));
bot.on('end', () => console.log('Bot desconectado do servidor.'));

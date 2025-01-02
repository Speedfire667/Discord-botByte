const mineflayer = require('mineflayer');
const express = require('express');
const Movements = require('mineflayer-pathfinder').Movements;
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const { GoalBlock, GoalXZ } = require('mineflayer-pathfinder').goals;

const config = require('./settings.json');
const loggers = require('./logging.js');
const logger = loggers.logger;
const app = express();

const messages = {
  button1: 'Mensagem do botão 1!',
  button2: 'Mensagem do botão 2!',
  button3: 'Mensagem do botão 3!',
  button4: '/time set day',
  button5: '/effect give @a night_vision 999 255',
  button6: '/weather clear'
};

// Configuração para servir arquivos estáticos
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
  const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  res.send(`
    <div class="container">
      <header>
        <h1>Your Bot Is Ready!</h1>
        <p>creditos á: <a href="https://youtube.com/@H2N_OFFICIAL?si=UOLwjqUv-C1mWkn4">H2N OFFICIAL</a></p>
        <p>Link Web For Uptime: <a href="${currentUrl}">${currentUrl}</a></p>
      </header>
      <div class="buttons">
        <button id="button1" onclick="sendChatMessage('button1')">
          <img src="/images/imagem1.png" alt="Imagem 1">
        </button>
        <button id="button2" onclick="sendChatMessage('button2')">
          <img src="/images/imagem2.png" alt="Imagem 2">
        </button>
        <button id="button3" onclick="sendChatMessage('button3')">
          <img src="/images/imagem3.png" alt="Imagem 3">
        </button>
        <button id="button4" onclick="sendChatMessage('button4')">
          <img src="/images/imagem4.png" alt="Imagem 4">
        </button>
        <button id="button5" onclick="sendChatMessage('button5')">
          <img src="/images/imagem5.png" alt="Imagem 5">
        </button>
        <button id="button6" onclick="sendChatMessage('button6')">
          <img src="/images/imagem6.png" alt="Imagem 6">
        </button>
      </div>
    </div>

    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f0f0f0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        text-align: center;
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      header {
        margin-bottom: 20px;
      }
      h1 {
        margin: 0;
        font-size: 24px;
        color: #333;
      }
      p {
        margin: 10px 0;
        color: #666;
      }
      .buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
      }
      button {
        position: relative;
        width: 100px;
        height: 100px;
        padding: 0;
        background: linear-gradient(135deg, #32a852, #1e90ff);
        border: none;
        border-radius: 10px;
        cursor: pointer;
        overflow: hidden;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s ease, background-color 0.3s ease;
      }
      button:hover {
        transform: translateY(-5px);
        background: linear-gradient(135deg, #1e90ff, #32a852);
      }
      button img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.8;
      }
      button:hover img {
        opacity: 1;
      }
      a {
        color: #1a73e8;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>

    <script>
      function sendChatMessage(button) {
        fetch('/send-chat-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ button: button })
        });
      }
    </script>
  `);
});

app.use(express.json());
app.post('/send-chat-message', (req, res) => {
  const { button } = req.body;
  if (global.bot && messages[button]) {
    global.bot.chat(messages[button]);
  }
  res.sendStatus(200);
});

app.listen(3000);

function createBot() {
  const bot = mineflayer.createBot({
    username: config['bot-account']['username'],
    password: config['bot-account']['password'],
    auth: config['bot-account']['type'],
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version,
  });

  global.bot = bot;

  bot.loadPlugin(pathfinder);
  const mcData = require('minecraft-data')(bot.version);
  const defaultMove = new Movements(bot, mcData);
  bot.settings.colorsEnabled = false;
  bot.pathfinder.setMovements(defaultMove);

  bot.once('spawn', () => {
    logger.info("Bot joined to the server");
  });

  bot.on('error', (err) => logger.error(`${err.message}`));
}

createBot();
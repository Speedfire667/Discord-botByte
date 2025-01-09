const mineflayer = require('mineflayer');
const express = require('express');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const Movements = require('mineflayer-pathfinder').Movements;

const config = require('./settings.json');
const loggers = require('./logging.js');
const logger = loggers.logger;
const app = express();

app.use('/images', express.static('images'));
app.use(express.json());

const actions = {
  walkForward: false,
  circle: false,
  jump: false,
};

const messages = {
  button1: '/oa accept',
  button2: 'Mensagem do botão 2!',
  button3: 'Mensagem do botão 3!',
  button4: '/time set day',
  button5: '/effect give @a night_vision 999 255',
  button6: '/weather clear',
};

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bot Controller</title>
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
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          text-align: center;
        }
        header h1 {
          font-size: 24px;
          color: #333;
        }
        .buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 20px 0;
        }
        button {
          position: relative;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #32a852, #1e90ff);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease, background-color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        button:hover {
          transform: translateY(-5px);
          background: linear-gradient(135deg, #1e90ff, #32a852);
        }
        button img {
          width: 70%;
          height: 70%;
          object-fit: cover;
          border-radius: 50%;
        }
        .selectors {
          margin: 20px 0;
        }
        label {
          display: block;
          margin: 5px 0;
          font-weight: bold;
          color: #555;
        }
        select {
          width: 100%;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        #sendButton {
          padding: 10px 20px;
          background: #1e90ff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        #sendButton:hover {
          background: #32a852;
        }
        .actionControls {
          margin-top: 20px;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .actionControls h3 {
          margin-bottom: 10px;
          color: #333;
        }
        .actionButton {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
        }
        .actionButton label {
          flex: 1;
          text-align: left;
          color: #555;
          font-weight: bold;
        }
        .slider {
          position: relative;
          cursor: pointer;
          width: 60px;
          height: 34px;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #4CAF50;
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        footer {
          margin-top: 20px;
        }
        footer a {
          color: #1a73e8;
          text-decoration: none;
        }
        footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>Your Bot Is Ready!</h1>
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

        <div class="selectors">
          <label for="fromPerson">Pessoa de Origem:</label>
          <select id="fromPerson">
            <option value="Steve">Steve</option>
            <option value="Alex">Alex</option>
            <option value="Herobrine">Herobrine</option>
            <option value="Villager">Villager</option>
          </select>
          <label for="toPerson">Pessoa de Destino:</label>
          <select id="toPerson">
            <option value="Steve">Steve</option>
            <option value="Alex">Alex</option>
            <option value="Herobrine">Herobrine</option>
            <option value="Villager">Villager</option>
          </select>
          <button id="sendButton" onclick="sendTeleportMessage()">Enviar</button>
        </div>

        <div class="actionControls">
          <h3>Controles de Ação</h3>
          <div class="actionButton">
            <label for="walkForward">Andar para Frente</label>
            <input type="checkbox" id="walkForward" onclick="toggleAction('walkForward')">
            <span class="slider"></span>
          </div>
          <div class="actionButton">
            <label for="circle">Circular</label>
            <input type="checkbox" id="circle" onclick="toggleAction('circle')">
            <span class="slider"></span>
          </div>
          <div class="actionButton">
            <label for="jump">Pular</label>
            <input type="checkbox" id="jump" onclick="toggleAction('jump')">
            <span class="slider"></span>
          </div>
        </div>

        <footer>
          <p>Créditos à: <a href="https://youtube.com/@H2N_OFFICIAL?si=UOLwjqUv-C1mWkn4">H2N OFFICIAL</a></p>
        </footer>
      </div>

      <script>
        function toggleAction(action) {
          fetch('/toggle-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action }),
          }).then(res => res.json()).then(data => {
            console.log(data);
          });
        }

function sendTeleportMessage() {
          const fromPerson = document.getElementById('fromPerson').value;
          const toPerson = document.getElementById('toPerson').value;
          fetch('/send-tp-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fromPerson, toPerson }),
          });
        }
      </script>
    </body>
    </html>
  `);
});

app.post('/send-chat-message', (req, res) => {
  const { button } = req.body;
  if (global.bot && messages[button]) {
    global.bot.chat(messages[button]);
  }
  res.sendStatus(200);
});

app.post('/send-tp-message', (req, res) => {
  const { fromPerson, toPerson } = req.body;
  if (global.bot) {
    global.bot.chat(`/tp ${fromPerson} ${toPerson}`);
  }
  res.sendStatus(200);
});

app.post('/toggle-action', (req, res) => {
  const { action } = req.body;
  if (actions.hasOwnProperty(action)) {
    actions[action] = !actions[action];
    controlBotActions();
  }
  res.json({ action, state: actions[action] });
});

function controlBotActions() {
  if (global.bot) {
    global.bot.setControlState('forward', actions.walkForward);
    if (actions.circle) {
      global.bot.setControlState('forward', true);
      global.bot.setControlState('left', true);
    } else {
      global.bot.setControlState('left', false);
    }
    global.bot.setControlState('jump', actions.jump);
  }
}

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
  defaultMove.canDig = false;  // Desabilita cavar para maior velocidade

  bot.pathfinder.setMovements(defaultMove);

  bot.once('spawn', () => {
    logger.info("Bot joined to the server");
  });

  bot.on('error', (err) => logger.error(err.message));
}

createBot();

const msgDiv = document.getElementById('messages');
const addMessage = function(/* string */ message) {
  const msgElement = document.createElement('p');
  msgElement.innerText = message;
  msgDiv.appendChild(msgElement);
  msgDiv.scrollTop = msgDiv.scrollHeight;
}

document.getElementById('printBtn').addEventListener('click', () => window.print());

const ipc = require('electron').ipcRenderer;
document.getElementById('pdfBtn').addEventListener('click', () => ipc.send('pdf'));
ipc.on('wrote-pdf', function (event, path) {
  addMessage(`Wrote PDF to: ${path}`);
});
ipc.on('failed-pdf', function (event, error) {
  addMessage(`No PDF created: ${error}`);
});

const cleanUp = function() {
  const elements = document.getElementsByClassName("disposable");
  while (elements.length > 0) elements[0].remove();
}

const displayCards = function() {
  cleanUp();
  const cardDescriptions = require("./data/cards.json");
  const card = require('./assets/card');
  const div = document.getElementById('drawing');
  const params = cardDescriptions.parameters;
  cardDescriptions.cards.forEach(function(cardDescription) {
    for (let idx=0; idx<cardDescription.count; idx++) {
      const canvas = document.createElement('canvas');
      canvas.classList.add('disposable');
      canvas.classList.add('card_frame');
      Object.assign(canvas.style, params.size);
      Object.assign(canvas, params.resolution);
      if (!canvas.getContext) {
        alert("Canvas unsupported");
        break;
      }
      card.draw(canvas.getContext('2d'), params, cardDescription);
      div.appendChild(canvas);
    }
  });
  addMessage("Cards displayed");
};

document.getElementById('cardsBtn').addEventListener('click', displayCards);

displayBoard = function() {
  cleanUp();
  addMessage("Cards displayed");
};

document.getElementById('boardBtn').addEventListener('click', displayBoard);

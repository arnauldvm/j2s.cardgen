const msgDiv = document.getElementById('messages');
const addMessage = function(/* string */ message) {
  const msgElement = document.createElement('p');
  msgElement.innerText = message;
  msgDiv.appendChild(msgElement);
  msgDiv.scrollTop = msgDiv.scrollHeight;
}

document.getElementById('printBtn').addEventListener('click', () => window.print());

let pdfOptions = {};

const ipc = require('electron').ipcRenderer;
document.getElementById('pdfBtn').addEventListener('click', () => ipc.send('pdf', pdfOptions));
ipc.on('wrote-pdf', function (event, path) {
  addMessage(`Wrote PDF to: ${path}`);
});
ipc.on('failed-pdf', function (event, errorMessage) {
  addMessage(`No PDF created: ${errorMessage}`);
});

const cleanUp = function() {
  const div = document.getElementById('drawing');
  while (div.hasChildNodes()) {
    div.removeChild(div.lastChild);
  }
  return div;
};

const Card = require('./assets/card');
const displayCards = function() {
  const div = cleanUp();
  const cardDescriptions = require("./data/cards.json");
  const params = cardDescriptions.parameters;
  pdfOptions.name = params.defaultPdfName;
  pdfOptions.pageSize = params.pdfPageSize;
  cardDescriptions.cards.forEach(function(cardDescription) {
    for (let idx=0; idx<cardDescription.count; idx++) {
      const canvas = document.createElement('canvas');
      canvas.classList.add('card_frame');
      Object.assign(canvas.style, params.size);
      Object.assign(canvas, params.resolution);
      if (!canvas.getContext) {
        alert("Canvas unsupported");
        break;
      }
      Card.draw(canvas.getContext('2d'), params, cardDescription);
      div.appendChild(canvas);
    }
  });
  addMessage("Cards displayed");
};

document.getElementById('cardsBtn').addEventListener('click', displayCards);

const Board = require('./assets/board');
displayBoard = function() {
  const div = cleanUp();
  const boardDescriptions = require("./data/board.json");
  const params = boardDescriptions.parameters;
  pdfOptions.name = params.defaultPdfName;
  pdfOptions.pageSize = params.pdfPageSize;
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, params.size);
  Object.assign(canvas, params.resolution);
  if (!canvas.getContext) {
    alert("Canvas unsupported");
    return;
  }
  Board.draw(canvas.getContext('2d'), params, boardDescriptions);
  div.appendChild(canvas);
  addMessage("Board displayed");
};

document.getElementById('boardBtn').addEventListener('click', displayBoard);

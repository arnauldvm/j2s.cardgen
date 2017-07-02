const printBtn = document.getElementById('print');
printBtn.addEventListener('click', function (event) {
  window.print();
});

const ipc = require('electron').ipcRenderer;
const printPDFBtn = document.getElementById('pdf');
printPDFBtn.addEventListener('click', function (  ) {
  ipc.send('pdf')
});
ipc.on('wrote-pdf', function (event, path) {
  alert(`Wrote PDF to: ${path}`);
});
ipc.on('failed-pdf', function (event, error) {
  alert(`No PDF created: ${error}`);
});


const cardDescriptions = require("./data/cards.json");

const card = require('./assets/card');

const div = document.getElementById('cards');
cardDescriptions.forEach(function(cardDescription) {
  for (let idx=0; idx<cardDescription.count; idx++) {
    const canvas = document.createElement('canvas');
    canvas.classList.add('card_frame');
    canvas.style.width = "6cm";
    canvas.style.height = "4cm";
    canvas.width = 300;
    canvas.height = 200;
    if (!canvas.getContext) {
      alert("Canvas unsupported");
      break;
    }
    card.draw(canvas.getContext('2d'), cardDescription);
    div.appendChild(canvas);
  }
});

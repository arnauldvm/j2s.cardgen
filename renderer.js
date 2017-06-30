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


const cardDescription = require("./data/card.json");

const card = require('./assets/card');

const canvas = document.getElementById('card');
if (canvas.getContext) {
  const ctx = canvas.getContext('2d');
  card.draw(ctx, cardDescription);
} else {
  // canvas unsupported
}

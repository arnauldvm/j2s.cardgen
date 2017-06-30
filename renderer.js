const printBtn = document.getElementById('print');
printBtn.addEventListener('click', function (event) {
  window.print();
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

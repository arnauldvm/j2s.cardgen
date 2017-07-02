'use strict';

const { dialog } = require('electron')
const fs = require('fs')
const { sep } = require('path');

module.exports.save = function(options, callback /* (pdfFilepath, error) */) {
  if (!options.window) {
      callback(undefined, "No content window provided");
      return;
  }

  const mkdirPromise = new Promise((resolve, reject) => {
    if (!options.dirpath) resolve();
    fs.mkdir(options.dirpath, (error) => {
      if (!error) resolve();
      else if (error.code === "EEXIST") resolve();
      else reject(error.message);
    });
  });

  const filePromise = mkdirPromise.then(() => new Promise((resolve, reject) => {
    dialog.showSaveDialog(options.window, {
      title: "Select PDF file path",
      defaultPath: (options.dirpath?options.dirpath:".")+sep+(options.name?options.name:"."),
      filters: [{name: "PDF", extensions: ["pdf"]}]
    }, (filepath) => {
      if (filepath) resolve(filepath);
      else reject("No file path selected, abort.");
    });
  }));
  
  const renderPromise = filePromise.then((filepath) => new Promise((resolve, reject) => {
    options.window.webContents.printToPDF({
      marginsType: 2, // minimal
      pageSize: "A4",
      landscape: false
    }, (error, data) => {
      if (error) reject(error);
      else resolve([data, filepath]);
    });
  }));

  renderPromise.then(([data, filepath]) => {
    fs.writeFile(filepath, data, (error) => {
      if (error) callback(undefined, error);
      else callback(filepath, undefined);
    });
  });
    
};

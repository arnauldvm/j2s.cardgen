const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

app.setName('CardGen - Cards Generator')

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600, title: app.getName(),
                webPreferences: {experimentalCanvasFeatures: true}})
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform !== 'darwin') {
    app.quit()
  //}
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

const electron = require('electron');
const ipc = electron.ipcMain;
const pdf = require('./assets/pdf');

const doSavePdf = function (client) {
  pdf.save({
    window: BrowserWindow.fromWebContents(client),
    dirpath: "./output",
    name: "cards"
  }, (filepath, error) => {
    if (!error) {
      client.send('wrote-pdf', filepath);
      console.log(`Wrote PDF successfully to ${filepath}`);
    } else {
      console.error("PDF error:", error);
      client.send('failed-pdf', error);
    }
  });
};

ipc.on('pdf', (event) => doSave(event.sender));

const inputMatch = function(input, inputMask) {
  return !Object.keys(inputMask).some((key)=>{
    return input[key] !== inputMask[key];
  });
}
const CtrlP = {key: 'p', control: true, alt: false, meta: false, shift: false, meta: false, shift: false};
const MetaP = {key: 'p', control: false, alt: false, meta: false, shift: false, meta: true, shift: false};
const CmdP = MetaP;

const printShortcut = (process.platform=='darwin')?CmdP:CtrlP;

app.on('web-contents-created', function (event, contents) {
  contents.on('before-input-event', function (event, input) {
    if (inputMatch(input, printShortcut)) {
      doSavePdf(event.sender);
      event.preventDefault();
    }
  });
});

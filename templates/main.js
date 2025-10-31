
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

function findHtmlFile(root) {
  // Try common names at root
  const candidates = ['index.html', 'genially.html', 'Genially.html'];
  for (const c of candidates) {
    if (fs.existsSync(path.join(root, c))) return c;
  }
  // Otherwise search first *.html file in tree
  const list = fs.readdirSync(root).filter(f => f.toLowerCase().endsWith('.html'));
  if (list.length) return list[0];
  return 'index.html';
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });
  const html = findHtmlFile(__dirname);
  win.removeMenu();
  win.loadFile(html);
}
app.whenReady().then(createWindow);

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  let startUrl;
  if (isDev) {
    // In development, try common dev server ports
    // This will find whichever port Vite is running on
    startUrl = 'http://localhost:5174'; // Will auto-fallback if not available
  } else {
    startUrl = `file://${path.join(__dirname, '../dist/index.html')}`;
  }

  mainWindow.loadURL(startUrl).catch(err => {
    console.error('Failed to load URL:', startUrl, err);
    // Try alternate port
    if (isDev && startUrl.includes('5174')) {
      mainWindow.loadURL('http://localhost:5173');
    }
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const startBackendServer = () => {
  const backendPath = path.join(__dirname, '../backend/server.js');
  
  backendProcess = spawn('node', [backendPath], {
    cwd: path.join(__dirname, '../backend'),
    stdio: 'inherit',
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend server:', err);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend server exited with code ${code}`);
  });
};

app.on('ready', () => {
  startBackendServer();
  
  // Wait for backend and dev server to start
  setTimeout(() => {
    createWindow();
  }, 3000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

// Create application menu
const createMenu = () => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

app.on('ready', createMenu);

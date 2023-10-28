const fs = require('fs');
const {app,BrowserWindow, ipcMain} = require('electron');
const path = require('path');
require("electron-reloader")(module);

const createWindow = () => {
    const win= new BrowserWindow({
        width:800,
        height:600,
        titleBarStyle: "hiddenInset",
        webPreferences: {
            preload: path.join(app.getAppPath(), "renderer.js"),
            webSecurity: false,
            nodeIntegration: true,
        }
    })

    win.loadFile('index.html')
    //win.setMenu(null)
    win.setTitle("Empire At War Auto Hardpoint Maker")

    return win
}

app.whenReady().then(() => {
    let win = createWindow()

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0){
            let win = createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})


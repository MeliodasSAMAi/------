const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    // mainWindow.webContents.openDevTools();
    mainWindow.loadFile('views/index.html');
    // 跳转首页
    ipcMain.on('pageHome', () => {
        emptyDir('./output');
        mainWindow.loadFile('./views/index.html');
    })
    // 跳转结果页
    ipcMain.on('pageResult', () => {
        mainWindow.loadFile('./views/result.html');
    })
}
const template = [];
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
    createWindow()
})


//清空文件夹
ipcMain.on('emptyDir', (event, path) => {
    emptyDir(path);
});

//上传
ipcMain.on('upload', (event, file) => {
    let fileObj = JSON.parse(file);
    fs.writeFileSync(`./uploads/${fileObj.name}`, fs.readFileSync(fileObj.path));
});

// 压缩
ipcMain.on('compress_start', () => {
    console.log('调用压缩');
    shell.openPath(path.join(__dirname, '../../squoosh_img/run.exe'));
})

// 打开结果文件夹
ipcMain.on('openOutputPath', () => {
    // shell.openExternal(path.join(__dirname,'../../output'));
    fs.writeFileSync(path.join(__dirname, '../../output.ahk'), `Run "${path.join(__dirname, '../../output')}"`);
    spawnSync('./AutoHotkey64.exe', ['./output.ahk']);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})


function emptyDir(path) {
    const files = fs.readdirSync(path);
    files.forEach(file => {
        const filePath = `${path}/${file}`;
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            emptyDir(filePath);
        } else {
            fs.unlinkSync(filePath);
            console.log(`删除${file}文件成功`);
        }
    })
}
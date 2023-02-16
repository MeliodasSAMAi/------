const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    emptyDir: (path) => ipcRenderer.send('emptyDir', path),
    upload: (file) => ipcRenderer.send('upload', file),
    pageResult:()=>ipcRenderer.send('pageResult'),
    pageHome:()=>ipcRenderer.send('pageHome'),
    compress_start:()=>ipcRenderer.send('compress_start'),
    openOutputPath:()=>ipcRenderer.send('openOutputPath'),
})
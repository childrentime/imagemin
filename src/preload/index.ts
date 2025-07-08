import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  selectImages: () => ipcRenderer.invoke('select-images'),
  compressImage: (imagePath: string, options: any, outputDir?: string) =>
    ipcRenderer.invoke('compress-image', imagePath, options, outputDir),
  selectOutputDir: (defaultPath?: string) => ipcRenderer.invoke('select-output-dir', defaultPath),
  getUserOutputDir: () => ipcRenderer.invoke('get-user-output-dir')
}

contextBridge.exposeInMainWorld('api', api)

import { BrowserWindow, dialog, ipcMain, shell } from 'electron'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { CompressionOptions } from '../types'
import { compressImage } from './imagemin'

import Store from 'electron-store'

const store = new Store()

const loadImageApi = (mainWindow: BrowserWindow): void => {
  ipcMain.handle('select-images', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp'] }],
      properties: ['openFile', 'multiSelections']
    })
    return result.filePaths
  })

  ipcMain.handle('select-output-dir', async (_event, defaultPath?: string) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory', 'createDirectory'],
      defaultPath
    })
    const dir = result.filePaths[0] || null
    if (dir) store.set('outputDir', dir)
    return dir
  })

  ipcMain.handle('set-user-output-dir', async (_event, dir: string) => {
    store.set('outputDir', dir)
    return true
  })

  ipcMain.handle('get-user-output-dir', async () => {
    let dir = store.get('outputDir')
    if (!dir) {
      const home = os.homedir()
      let picturesDir = path.join(home, 'Pictures')
      if (!fs.existsSync(picturesDir)) {
        picturesDir = home
      }
      dir = path.join(picturesDir, 'Compressed')
    }
    return dir
  })

  ipcMain.handle('show-in-folder', async (_event, folderPath: string) => {
    if (folderPath) {
      shell.showItemInFolder(folderPath)
    }
  })

  ipcMain.handle(
    'compress-image',
    async (_event, imagePath: string, options: CompressionOptions, outputDir?: string) => {
      try {
        const result = await compressImage(imagePath, options, outputDir)
        return result
      } catch (error) {
        throw new Error(`压缩失败: ${(error as any).message}`)
      }
    }
  )
}

export { loadImageApi }

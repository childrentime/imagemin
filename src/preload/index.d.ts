import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      selectImages: () => Promise<string[]>
      compressImage: (
        imagePath: string,
        options: any,
        outputDir?: string
      ) => Promise<CompressionResult>
      selectOutputDir: (defaultPath?: string) => Promise<string | null>
      showInFolder: (folderPath: string) => Promise<void>
      getDefaultOutputDir: () => Promise<string>
    }
  }
}

export interface CompressionOptions {
  format: 'webp' | 'avif' | 'jpeg' | 'png'
  quality: number
  outputPath?: string
}

export interface CompressionResult {
  originalPath: string
  compressedPath: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
  format: string
}

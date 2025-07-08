import fs from 'fs'
import os from 'os'
import path from 'path'
import sharp from 'sharp'
import { CompressionOptions, CompressionResult } from '../types'

export async function compressImage(
  inputPath: string,
  options: CompressionOptions,
  outputDir?: string
): Promise<CompressionResult> {
  const originalStats = fs.statSync(inputPath)
  const originalSize = originalStats.size

  let finalOutputDir = outputDir
  if (!finalOutputDir) {
    const home = os.homedir()
    let picturesDir = path.join(home, 'Pictures')
    // 若 Pictures 不存在则 fallback 到 home
    if (!fs.existsSync(picturesDir)) {
      picturesDir = home
    }
    finalOutputDir = path.join(picturesDir, 'Compressed')
  }
  if (!fs.existsSync(finalOutputDir)) {
    fs.mkdirSync(finalOutputDir, { recursive: true })
  }

  const fileName = path.parse(inputPath).name
  const outputPath = path.join(finalOutputDir, `${fileName}_compressed.${options.format}`)

  let sharpInstance = sharp(inputPath)

  // 智能压缩策略
  switch (options.format) {
    case 'webp':
      sharpInstance = sharpInstance.webp({
        quality: options.quality,
        effort: 6, // 更好的压缩
        lossless: options.quality === 100
      })
      break

    case 'avif':
      sharpInstance = sharpInstance.avif({
        quality: options.quality,
        effort: 9, // 最佳压缩
        lossless: options.quality === 100
      })
      break

    case 'jpeg':
      sharpInstance = sharpInstance.jpeg({
        quality: options.quality,
        progressive: true,
        mozjpeg: true // 使用mozjpeg编码器
      })
      break

    case 'png':
      sharpInstance = sharpInstance.png({
        quality: options.quality,
        compressionLevel: 9,
        adaptiveFiltering: true
      })
      break
  }

  await sharpInstance.toFile(outputPath)

  const compressedStats = fs.statSync(outputPath)
  const compressedSize = compressedStats.size
  const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100

  return {
    originalPath: inputPath,
    compressedPath: outputPath,
    originalSize,
    compressedSize,
    compressionRatio,
    format: options.format
  }
}

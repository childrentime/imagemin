import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { CompressionResult } from 'src/types'

interface CompressionOptions {
  format: 'original' | 'webp' | 'avif' | 'jpeg' | 'png'
  quality: number
}

interface Props {
  onCompressionComplete: (result: CompressionResult) => void
  clearAllButton?: React.ReactNode
}

export const ImageCompressor = forwardRef<{ clearAll: () => void }, Props>(
  ({ onCompressionComplete, clearAllButton }, ref) => {
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [options, setOptions] = useState<CompressionOptions>({
      format: 'original',
      quality: 80
    })
    const [isCompressing, setIsCompressing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [outputDir, setOutputDir] = useState<string | null>(null)
    const [defaultOutputDir, setDefaultOutputDir] = useState<string>('')

    useEffect(() => {
      window.api.getUserOutputDir().then(setDefaultOutputDir)
    }, [])

    const handleSelectFiles = useCallback(async () => {
      const files = await window.api.selectImages()
      setSelectedFiles(files)
    }, [])

    const handleSelectOutputDir = useCallback(async () => {
      const dir = await window.api.selectOutputDir(defaultOutputDir)
      if (dir) setOutputDir(dir)
    }, [defaultOutputDir])

    const handleCompress = useCallback(async () => {
      if (selectedFiles.length === 0) return
      setIsCompressing(true)
      setProgress(0)
      try {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i]
          let realOptions = options
          if (options.format === 'original') {
            // 自动检测原图片格式
            const ext = file.split('.').pop()?.toLowerCase()
            let detected: CompressionOptions['format'] = 'jpeg'
            if (
              ext === 'webp' ||
              ext === 'avif' ||
              ext === 'jpeg' ||
              ext === 'jpg' ||
              ext === 'png'
            ) {
              detected = ext === 'jpg' ? 'jpeg' : (ext as CompressionOptions['format'])
            }
            realOptions = { ...options, format: detected }
          }
          const result = await window.api.compressImage(file, realOptions, outputDir || undefined)
          onCompressionComplete(result)
          setProgress(((i + 1) / selectedFiles.length) * 100)
        }
      } catch (error) {
        console.error('压缩失败:', error)
        // TODO: 显示错误提示
      } finally {
        setIsCompressing(false)
        setProgress(0)
      }
    }, [selectedFiles, options, onCompressionComplete, outputDir])

    // 暴露清空方法
    useImperativeHandle(
      ref,
      () => ({
        clearAll: () => {
          setSelectedFiles([])
          setOptions({ format: 'original', quality: 80 })
          setIsCompressing(false)
          setProgress(0)
        }
      }),
      []
    )

    return (
      <Box sx={{ background: '#f8f9fa', p: 3, borderRadius: 2, mb: 3 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="contained" startIcon={<FolderOpenIcon />} onClick={handleSelectFiles}>
              选择图片
            </Button>
            <Typography variant="body2">已选择 {selectedFiles.length} 个文件</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<FolderSpecialIcon />}
              onClick={handleSelectOutputDir}
            >
              选择输出文件夹
            </Button>
            <TextField
              size="small"
              value={outputDir || defaultOutputDir}
              InputProps={{ readOnly: true }}
              sx={{ minWidth: 600 }}
            />
          </Box>

          <Box display="flex" alignItems="center" gap={4}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography>输出格式:</Typography>
              <Select
                size="small"
                value={options.format}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    format: e.target.value as CompressionOptions['format']
                  }))
                }
              >
                <MenuItem value="original">保持原格式</MenuItem>
                <MenuItem value="webp">WebP (推荐)</MenuItem>
                <MenuItem value="avif">AVIF (最佳压缩)</MenuItem>
                <MenuItem value="jpeg">JPEG</MenuItem>
                <MenuItem value="png">PNG</MenuItem>
              </Select>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography>质量: {options.quality}%</Typography>
              <Slider
                min={10}
                max={100}
                value={options.quality}
                onChange={(_, v) => setOptions((prev) => ({ ...prev, quality: v as number }))}
                sx={{ width: 200 }}
              />
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2} mt={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCompress}
              disabled={selectedFiles.length === 0 || isCompressing}
              sx={{ width: 180 }}
            >
              {isCompressing ? '压缩中...' : '开始压缩'}
            </Button>
            {clearAllButton}
          </Box>
        </Box>

        {isCompressing && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" sx={{ ml: 1 }}>
              {progress.toFixed(0)}%
            </Typography>
          </Box>
        )}
      </Box>
    )
  }
)

ImageCompressor.displayName = 'ImageCompressor'

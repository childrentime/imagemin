import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { formatFileSize } from '@renderer/utils'
import React, { useCallback, useRef, useState } from 'react'
import { CompressionResult } from 'src/types'

interface Props {
  result: CompressionResult
}

export const ImageComparison: React.FC<Props> = ({ result }) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!isDragging && e.type === 'mousemove') return
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setSliderPosition(percentage)
    },
    [isDragging]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      handleMouseMove(e)
    },
    [handleMouseMove]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // 初始几秒后隐藏引导
  React.useEffect(() => {
    if (showGuide) {
      const timer = setTimeout(() => setShowGuide(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [showGuide])

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          图片对比
        </Typography>
        <Box display="flex" gap={4}>
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              原始大小
            </Typography>
            <Typography variant="subtitle2">{formatFileSize(result.originalSize)}</Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              压缩后
            </Typography>
            <Typography variant="subtitle2">{formatFileSize(result.compressedSize)}</Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              节省
            </Typography>
            <Typography variant="subtitle2" color="secondary">
              {result.compressionRatio.toFixed(1)}%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: 400,
          overflow: 'hidden',
          borderRadius: 2,
          cursor: 'col-resize',
          background: '#f5f5f5',
          mb: 2
        }}
        onMouseDown={handleMouseDown}
      >
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={`imagemin://${result.originalPath}`}
            alt="原图"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              zIndex: 1
            }}
          />
          {/* 压缩后图片，裁剪显示 */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              zIndex: 3
            }}
          >
            <img
              src={`imagemin://${result.compressedPath}`}
              alt="压缩后"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'contrast(1.05) saturate(1.1)'
              }}
            />
          </Box>
        </Box>
        {/* 分界线和拖动杆 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: 0,
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          {/* 分界线阴影 */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: -12,
              width: 24,
              pointerEvents: 'none',
              background:
                'linear-gradient(90deg, rgba(25,118,210,0.10) 0%, rgba(255,255,255,0.7) 50%, rgba(211,47,47,0.10) 100%)',
              filter: 'blur(2px)'
            }}
          />
        </Box>
        {/* 拖动杆本体 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: 0,
            zIndex: 20,
            cursor: 'col-resize',
            pointerEvents: 'auto',
            transform: 'translateX(-3px)'
          }}
        >
          {/* 粗线 */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: 6,
              background: isDragging ? '#1976d2' : '#fff',
              border: isDragging ? '2px solid #1976d2' : '2px solid #90caf9',
              borderRadius: 3,
              boxShadow: isDragging ? '0 0 12px #1976d2' : '0 2px 8px #90caf9',
              transform: 'translateX(-50%)',
              transition: 'background 0.2s, border 0.2s, box-shadow 0.2s'
            }}
          />
          {/* 圆点+icon */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 40,
              height: 40,
              background: isDragging ? '#1976d2' : '#fff',
              border: isDragging ? '3px solid #1976d2' : '3px solid #90caf9',
              borderRadius: '50%',
              boxShadow: isDragging ? '0 0 16px #1976d2' : '0 2px 8px #90caf9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
              zIndex: 30
            }}
          >
            <SwapHorizIcon sx={{ color: isDragging ? '#fff' : '#1976d2', fontSize: 28 }} />
          </Box>
        </Box>
        {/* 初始引导浮层 */}
        {showGuide && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: `${sliderPosition}%`,
              transform: 'translate(-50%, -120%)',
              zIndex: 100,
              background: 'rgba(25,118,210,0.95)',
              color: '#fff',
              px: 2.5,
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 18,
              boxShadow: 4,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              userSelect: 'none'
            }}
          >
            拖动对比
          </Box>
        )}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            right: 10,
            display: 'flex',
            justifyContent: 'space-between',
            pointerEvents: 'none'
          }}
        >
          <Typography
            variant="caption"
            sx={{ background: 'rgba(0,0,0,0.7)', color: '#fff', px: 1.5, borderRadius: 1 }}
          >
            原图
          </Typography>
          <Typography
            variant="caption"
            sx={{ background: 'rgba(0,0,0,0.7)', color: '#fff', px: 1.5, borderRadius: 1 }}
          >
            压缩后
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

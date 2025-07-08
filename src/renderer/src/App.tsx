import ClearIcon from '@mui/icons-material/Clear'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  createTheme,
  CssBaseline,
  LinearProgress,
  ThemeProvider,
  Typography
} from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CompressionResult } from 'src/types'
import { ImageComparison } from './components/ImageComparison'
import { ImageCompressor } from './components/ImageCompressor'
import { formatFileSize } from './utils'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#2ecc71' }
  }
})

const App: React.FC = () => {
  const [results, setResults] = useState<CompressionResult[]>([])
  const [selectedResult, setSelectedResult] = useState<CompressionResult | null>(null)
  const imageCompressorRef = useRef<{ clearAll: () => void }>(null)

  const handleCompressionComplete = useCallback((result: CompressionResult) => {
    setResults((prev) => [...prev, result])
  }, [])

  // 清除所有状态
  const handleClearAll = useCallback(() => {
    setResults([])
    setSelectedResult(null)
    if (imageCompressorRef.current && imageCompressorRef.current.clearAll) {
      imageCompressorRef.current.clearAll()
    }
  }, [])

  useEffect(() => {
    if (
      results.length > 0 &&
      (!selectedResult || !results.some((r) => r.compressedPath === selectedResult.compressedPath))
    ) {
      setSelectedResult(results[0])
    }
  }, [results, selectedResult])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
            Smart Image Compressor
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            AVIF, WebP, PNG and JPEG Compression for Faster Websites
          </Typography>
        </Box>
        <ImageCompressor
          ref={imageCompressorRef}
          onCompressionComplete={handleCompressionComplete}
          clearAllButton={
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ClearIcon />}
              onClick={handleClearAll}
              sx={{ ml: 2 }}
            >
              清除所有
            </Button>
          }
        />
        <Box mt={4}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            压缩结果
          </Typography>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            {results.map((result, index) => (
              <Card
                key={index}
                sx={{
                  cursor: 'pointer',
                  border: selectedResult === result ? '2px solid #1976d2' : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5
                }}
                onClick={() => setSelectedResult(result)}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f5f5f5',
                    borderRadius: 1
                  }}
                >
                  <img
                    src={`imagemin://${result.compressedPath}`}
                    alt="缩略图"
                    style={{ maxWidth: 56, maxHeight: 56, borderRadius: 4 }}
                  />
                </Box>
                <CardContent sx={{ flex: 1, p: 0 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Chip label={result.format.toUpperCase()} color="primary" size="small" />
                    <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ flex: 1 }}>
                      {result.originalPath.split(/[\\/]/).pop()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" color="text.secondary">
                      原: {formatFileSize(result.originalSize)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      新: {formatFileSize(result.compressedSize)}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.max(0, Math.min(100, result.compressionRatio))}
                      sx={{ flex: 1, height: 8, borderRadius: 5, bgcolor: '#e0e0e0' }}
                      color="secondary"
                    />
                    <Typography variant="caption" color="secondary" fontWeight={700}>
                      {result.compressionRatio.toFixed(1)}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
        {selectedResult && (
          <Box mt={4}>
            <ImageComparison result={selectedResult} />
          </Box>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default App

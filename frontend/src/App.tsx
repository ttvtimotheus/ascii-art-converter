import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [asciiArt, setAsciiArt] = useState<string>('')
  const [width, setWidth] = useState<number>(100)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  // Process the selected file
  const processFile = (selectedFile: File) => {
    setError(null)
    
    // Check if file is an image
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }
    
    setFile(selectedFile)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  // Convert image to ASCII art
  const convertToAscii = async () => {
    if (!file) {
      setError('Please select an image first')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('width', width.toString())
      
      const response = await axios.post('http://localhost:3000/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data.success) {
        // Replace escaped newlines with actual newlines
        const formattedAscii = response.data.ascii.replace(/\\n/g, '\n')
        setAsciiArt(formattedAscii)
      } else {
        setError('Failed to convert image')
      }
    } catch (err) {
      console.error('Error converting image:', err)
      setError('Error converting image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Copy ASCII art to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(asciiArt)
      .then(() => {
        alert('ASCII art copied to clipboard!')
      })
      .catch(err => {
        console.error('Failed to copy:', err)
        alert('Failed to copy to clipboard')
      })
  }

  // Download ASCII art as .txt file
  const downloadAsTxt = () => {
    const element = document.createElement('a')
    const file = new Blob([asciiArt], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = 'ascii-art.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ASCII Art Converter</h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Upload & Controls */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`drag-drop-area ${isDragging ? 'active' : ''} ${preview ? 'border-green-500' : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center h-full cursor-pointer">
                {preview ? (
                  <div className="w-full">
                    <img src={preview} alt="Preview" className="max-h-40 mx-auto object-contain mb-2" />
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">{file?.name}</p>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-gray-400">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p className="text-center">Drag & drop an image here, or click to select</p>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">Supports JPG, PNG, GIF (max 5MB)</p>
                  </>
                )}
              </label>
            </div>

            {/* Width Control */}
            <div className="space-y-2">
              <label htmlFor="width-slider" className="block text-sm font-medium">
                ASCII Width: {width} characters
              </label>
              <input
                type="range"
                id="width-slider"
                min="20"
                max="200"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Convert Button */}
            <button
              onClick={convertToAscii}
              disabled={!file || isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting...
                </span>
              ) : (
                'Convert to ASCII'
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Right Column - ASCII Output */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">ASCII Result</h2>
              {asciiArt && (
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="py-1 px-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={downloadAsTxt}
                    className="py-1 px-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors"
                  >
                    Download .txt
                  </button>
                </div>
              )}
            </div>
            <div className="ascii-output h-[400px]">
              {asciiArt ? asciiArt : (
                <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <p>ASCII art will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2025 ASCII Art Converter | Created with React, Node.js & Sharp</p>
      </footer>
    </div>
  )
}

export default App

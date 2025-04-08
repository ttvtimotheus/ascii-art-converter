const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ASCII character set from darkest to lightest
const ASCII_CHARS = '@%#*+=-:. ';

/**
 * Convert image to ASCII art
 * @param {Buffer} imageBuffer - The image buffer
 * @param {number} width - The desired width of the ASCII art
 * @returns {Promise<string>} - The ASCII art string
 */
async function imageToAscii(imageBuffer, width = 100) {
  try {
    // Process the image with sharp
    const { data, info } = await sharp(imageBuffer)
      .grayscale() // Convert to grayscale
      .resize({
        width,
        fit: 'contain',
        withoutEnlargement: true
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = new Uint8Array(data);
    const imageWidth = info.width;
    const imageHeight = info.height;
    
    let asciiArt = '';
    
    // Map pixel brightness to ASCII characters
    for (let y = 0; y < imageHeight; y++) {
      for (let x = 0; x < imageWidth; x++) {
        const idx = (y * imageWidth + x);
        const pixelValue = pixels[idx];
        
        // Map the pixel value (0-255) to the ASCII character set
        const charIndex = Math.floor(pixelValue / 256 * ASCII_CHARS.length);
        asciiArt += ASCII_CHARS[charIndex];
      }
      asciiArt += '\\n'; // Add newline for each row
    }
    
    return asciiArt;
  } catch (error) {
    console.error('Error converting image to ASCII:', error);
    throw error;
  }
}

// Routes
app.get('/', (req, res) => {
  res.send('ASCII Art Converter API is running');
});

// Upload and convert image to ASCII
app.post('/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const width = parseInt(req.body.width) || 100;
    
    // Read the uploaded file
    const imageBuffer = fs.readFileSync(req.file.path);
    
    // Convert the image to ASCII
    const asciiArt = await imageToAscii(imageBuffer, width);
    
    // Delete the uploaded file after processing
    fs.unlinkSync(req.file.path);
    
    // Return the ASCII art
    res.json({ 
      success: true, 
      ascii: asciiArt,
      width,
      originalFilename: req.file.originalname
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image', message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

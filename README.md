# ASCII Art Converter 🎨

A modern web application that converts images to ASCII art. Upload any image and instantly transform it into a text-based ASCII representation that you can copy, share, or download.

![ASCII Art Converter Screenshot](https://via.placeholder.com/800x400?text=ASCII+Art+Converter)

## 🌟 Features

- **Simple Image Upload**: Drag & drop or select any image file
- **Real-time Conversion**: Transform images to ASCII art instantly
- **Customizable Width**: Adjust the character width of your ASCII output
- **Copy to Clipboard**: One-click copying of your ASCII creation
- **Download as Text**: Save your ASCII art as a .txt file
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices
- **No Server Storage**: Your images are processed locally and never stored

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite for fast development
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Axios** for API requests

### Backend
- **Node.js** with Express for the server
- **Sharp** for efficient image processing
- **Multer** for handling file uploads

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Setup

The easiest way to get started is using the provided setup script:

```bash
# Clone the repository
git clone https://github.com/yourusername/ascii-art-converter.git
cd ascii-art-converter

# Make the setup script executable and run it
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/ascii-art-converter.git
cd ascii-art-converter
```

2. Install backend dependencies and start the server
```bash
cd backend
npm install
npm start
```

3. In a new terminal, install frontend dependencies and start the development server
```bash
cd frontend
npm install
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📝 Usage

1. **Upload an Image**: Drag & drop an image onto the upload area or click to select a file
2. **Adjust Settings**: Use the slider to set the width of your ASCII art (more characters = higher resolution)
3. **Convert**: Click the "Convert to ASCII" button
4. **View Results**: See your image transformed into ASCII characters
5. **Save Your Work**: Copy to clipboard or download as a .txt file

## 💡 How It Works

The application works by:
1. Converting your image to grayscale
2. Mapping each pixel's brightness to a corresponding ASCII character
3. Assembling these characters into a text representation of your image

Darker pixels are represented by denser characters like `@` and `#`, while lighter pixels use characters like `.` and spaces.

## 🔮 Future Improvements

- Color ASCII art support using ANSI color codes
- Multiple character sets for different artistic styles
- Adjustable brightness and contrast controls
- Social sharing capabilities
- Custom character mapping
- Image preprocessing options (invert, edge detection, etc.)

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

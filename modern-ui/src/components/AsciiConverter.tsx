'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function AsciiConverter() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState<string>('');
  const [width, setWidth] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      handleFile(acceptedFiles[0]);
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error('Datei ist zu groß. Maximale Größe: 5MB');
      } else if (error?.code === 'file-invalid-type') {
        toast.error('Bitte wähle eine Bilddatei aus');
      } else {
        toast.error('Fehler beim Hochladen der Datei');
      }
    }
  });

  // Handle file selection
  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Convert image to ASCII
  const convertToAscii = async () => {
    if (!file) {
      toast.error('Bitte wähle zuerst ein Bild aus');
      return;
    }

    setIsLoading(true);
    setProgress(10);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('width', width.toString());
      
      setProgress(30);
      
      const response = await axios.post('http://localhost:3000/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setProgress(90);
      
      if (response.data.success) {
        // Replace escaped newlines with actual newlines
        const formattedAscii = response.data.ascii.replace(/\\n/g, '\n');
        setAsciiArt(formattedAscii);
        toast.success('Bild erfolgreich in ASCII-Art umgewandelt');
      } else {
        toast.error('Fehler bei der Umwandlung: ' + (response.data.error || 'Unbekannter Fehler'));
      }
    } catch (err) {
      console.error('Error converting image:', err);
      toast.error('Fehler bei der Umwandlung. Bitte stelle sicher, dass der Server läuft.');
    } finally {
      setIsLoading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  };

  // Copy ASCII art to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(asciiArt)
      .then(() => {
        toast.success('ASCII-Art wurde in die Zwischenablage kopiert');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error('Fehler beim Kopieren in die Zwischenablage');
      });
  };

  // Download ASCII art as .txt file
  const downloadAsTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([asciiArt], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'ascii-art.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('ASCII-Art als .txt-Datei heruntergeladen');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto p-4">
      {/* Left Column - Upload & Controls */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bild hochladen</CardTitle>
            <CardDescription>
              Lade ein Bild hoch, um es in ASCII-Art umzuwandeln
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              {...getRootProps()} 
              className={cn(
                "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[200px]",
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20",
                file ? "border-green-500/50" : ""
              )}
            >
              <input {...getInputProps()} />
              
              {preview ? (
                <div className="w-full flex flex-col items-center">
                  <img 
                    src={preview} 
                    alt="Vorschau" 
                    className="max-h-40 object-contain mb-2" 
                  />
                  <p className="text-sm text-muted-foreground">{file?.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mb-4 text-muted-foreground/60"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p>Drag & Drop ein Bild hier oder klicke zum Auswählen</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Unterstützt JPG, PNG, GIF (max. 5MB)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Einstellungen</CardTitle>
            <CardDescription>
              Passe die Breite der ASCII-Art an
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">ASCII-Breite:</span>
                <span className="text-sm font-medium">{width} Zeichen</span>
              </div>
              <Slider
                value={[width]}
                min={20}
                max={200}
                step={1}
                onValueChange={(value) => setWidth(value[0])}
              />
            </div>
            
            {progress > 0 && (
              <Progress value={progress} className="h-2 w-full" />
            )}
            
            <Button 
              onClick={convertToAscii} 
              disabled={!file || isLoading} 
              className="w-full"
            >
              {isLoading ? 'Umwandlung läuft...' : 'In ASCII umwandeln'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - ASCII Output */}
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>ASCII-Ergebnis</CardTitle>
            <CardDescription>
              Das umgewandelte ASCII-Art-Bild
            </CardDescription>
          </div>
          {asciiArt && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
              >
                Kopieren
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadAsTxt}
              >
                Als .txt herunterladen
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="font-mono whitespace-pre overflow-auto bg-muted/50 p-4 rounded-md border border-border h-[400px] text-xs leading-none">
            {asciiArt ? asciiArt : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>ASCII-Art wird hier angezeigt</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Tipp: Du kannst die Breite anpassen, um das beste Ergebnis zu erzielen
        </CardFooter>
      </Card>
    </div>
  );
}

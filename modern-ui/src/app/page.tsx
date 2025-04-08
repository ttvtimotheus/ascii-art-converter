import dynamic from 'next/dynamic';
import { Toaster } from '@/components/ui/sonner';

// Dynamically import the AsciiConverter component to avoid SSR issues with browser-only APIs
const AsciiConverter = dynamic(() => import('@/components/AsciiConverter').then(mod => ({ default: mod.AsciiConverter })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <p>Lade ASCII Art Converter...</p>
    </div>
  )
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b py-4">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold">ASCII Art Converter</h1>
          <a 
            href="https://github.com/username/ascii-art-converter" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="container">
          <AsciiConverter />
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ASCII Art Converter | Erstellt mit Next.js, Tailwind CSS und shadcn/ui</p>
        </div>
      </footer>
      
      <Toaster position="top-right" />
    </div>
  );
}

import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled for the MemeEditor component
// This is because it uses browser-only features like contentEditable
const MemeEditor = dynamic(() => import('@/components/meme/MemeEditor'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text">
            Nadine&apos;s Mean Meme Maker
          </h1>
          <p className="text-[var(--foreground)] opacity-70">
            Create, customize, and share your dankest memes
          </p>
        </header>
        
        <MemeEditor />
        
        <footer className="mt-12 text-center text-sm opacity-50">
          <p>Powered by Next.js, Pexels, and Groq AI</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Nadine&apos;s Mean Meme Maker</p>
        </footer>
      </div>
    </main>
  );
}

# Nadine's Mean Meme Maker

A dark mode, mobile-first, touch-sensitive interactive meme maker built with Next.js 15 and TypeScript. Create, customize, and share your dankest memes with ease!

## Features

- Dark mode UI with modern design
- Mobile-first, touch-sensitive interface
- Multiple meme templates to choose from
- Search for images using the Pexels API
- AI-powered text generation with Groq and Meta-Llama/Llama-4-Scout-17b-16e-instruct model
- Customize font size, color, and stroke width
- Download your memes as images
- Share to social media platforms
- Server-side API routes for security

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS for styling
- Pexels API for image search
- Groq API with Meta-Llama/Llama-4-Scout-17b-16e-instruct model for text generation
- Environment variables for API key security

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- API keys for Pexels and Groq

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:

```
PEXELS_API_KEY=your_pexels_api_key_here
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Choose a meme template or search for an image using the Pexels API
2. Add your own text or generate text using the AI-powered text generator
3. Customize the font size, color, and stroke width
4. Download your meme or share it to social media

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── pexels/
│   │   │   │   └── route.ts     # Server-side API route for Pexels
│   │   │   └── groq/
│   │   │       └── route.ts     # Server-side API route for Groq
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout with theme provider
│   │   └── page.tsx             # Main page component
│   ├── components/
│   │   ├── meme/
│   │   │   └── MemeEditor.tsx   # Main meme editor component
│   │   └── ui/
│   │       └── theme-provider.tsx # Dark mode theme provider
│   ├── lib/
│   │   ├── data/
│   │   │   └── templates.ts     # Meme templates data
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript interfaces
│   │   └── utils/
│   │       └── index.ts         # Utility functions
│   └── assets/
│       └── templates/           # Template images
├── .env.local                   # Environment variables (not in git)
├── .env.example                 # Example environment variables
└── README.md                    # Project documentation
```

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework
- [Pexels](https://www.pexels.com/) - Free stock photos
- [Groq](https://groq.com/) - AI API for text generation
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

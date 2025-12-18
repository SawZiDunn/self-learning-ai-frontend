# Issa Compass AI Assistant - Frontend

A modern Next.js chat interface for the Self-Learning AI Assistant.

## Features

-   💬 Real-time chat interface
-   🎨 Beautiful UI with Tailwind CSS
-   🌓 Dark mode support
-   📱 Fully responsive
-   🚀 Ready for Vercel deployment

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=https://web-production-ca44a.up.railway.app
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Deploy via GitHub

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable:
    - `NEXT_PUBLIC_API_URL` = `https://web-production-ca44a.up.railway.app`
6. Click "Deploy"

Done! Your app will be live at: `https://your-app.vercel.app`

## Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   └── ChatInterface.tsx # Main chat component
├── lib/
│   └── api.ts           # API integration
└── public/              # Static assets
```

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **HTTP Client**: Axios

## API Integration

The app connects to your Railway backend:

-   Endpoint: `POST /generate-reply`
-   Payload: `{ clientSequence: string, chatHistory: array }`
-   Response: `{ aiReply: string, provider: string }`

## Development

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Environment Variables

-   `NEXT_PUBLIC_API_URL` - Your Railway API URL

## License

MIT

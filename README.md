# Brainrot Generator

AI-powered image transformation tool using Gemini AI. Transform your images with creative "brainrot" edits!

## Features

- 🎨 AI-powered image transformation
- 🌍 Multi-language support (English/Nederlands)
- 📱 Progressive Web App (PWA) - installable on any device
- ⚡ Fast and responsive UI
- 🎯 Simple and intuitive interface

## Live Demo

Visit the live app: [https://snuushco.github.io/brainrot-me/](https://snuushco.github.io/brainrot-me/)

## Run Locally

**Prerequisites:** Node.js

1. Clone the repository:
   ```bash
   git clone https://github.com/Snuushco/brainrot-me.git
   cd brainrot-me
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. Upload an image
2. (Optional) Enter a custom object to merge with
3. Click "Generate" to transform your image
4. View and download the result!

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Gemini AI** - Image generation
- **TailwindCSS** - Styling
- **PWA** - Progressive Web App capabilities
- **TypeScript** - Type safety

## Deployment

### Option 1: Vercel (Recommended for API functionality)

1. Sign up/login at [vercel.com](https://vercel.com)
2. Click "Add New Project" and import your GitHub repository
3. Add environment variable: `GEMINI_API_KEY` with your Gemini API key
4. Deploy!

The app will be live at: `https://your-project.vercel.app`

### Option 2: GitHub Pages

This app is automatically deployed to GitHub Pages using GitHub Actions. Note: API functionality requires Vercel deployment.

## License

MIT

## Credits

Powered by Google Gemini AI
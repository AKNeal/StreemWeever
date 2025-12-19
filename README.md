# StreemWeever - Live Streaming App

A professional broadcast control application for streaming to social media with screen capture and logo overlay capabilities.

## Features

✅ **Screen Capture** - Capture your entire screen or specific windows
✅ **Logo Overlay** - Upload and position your logo anywhere on the stream
✅ **Drag & Drop Positioning** - Click and drag your logo to any position
✅ **Real-time Preview** - See exactly what your stream will look like
✅ **X.com Integration** - Ready to connect with X.com Media Studio
✅ **Professional UI** - Broadcast control room aesthetic

## Deployment to streemweever.com

### Option 1: Vercel (Recommended)

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/streemweever.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect React and deploy

3. **Add Custom Domain**
   - In Vercel dashboard, go to your project
   - Click "Settings" → "Domains"
   - Add `streemweever.com`
   - Update your DNS records as shown by Vercel

### Option 2: GitHub Pages + Custom Domain

1. **Create package.json**
   ```json
   {
     "name": "streemweever",
     "version": "1.0.0",
     "homepage": "https://streemweever.com",
     "dependencies": {
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "lucide-react": "^0.263.1"
     },
     "scripts": {
       "start": "react-scripts start",
       "build": "react-scripts build",
       "deploy": "gh-pages -d build"
     },
     "devDependencies": {
       "gh-pages": "^5.0.0",
       "react-scripts": "^5.0.1"
     }
   }
   ```

2. **Deploy**
   ```bash
   npm install
   npm run build
   npm run deploy
   ```

3. **Configure Custom Domain**
   - In GitHub repo, go to Settings → Pages
   - Set custom domain to `streemweever.com`
   - Add CNAME record in your DNS pointing to `yourusername.github.io`

## DNS Configuration

For `streemweever.com`, add these records with your DNS provider:

```
Type: A
Name: @
Value: [Your hosting provider's IP]

Type: CNAME
Name: www
Value: streemweever.com
```

## How to Use StreamWeever

### 1. Get Your X.com Stream Key

1. Go to [X Media Studio](https://studio.twitter.com/)
2. Click "Create" → "Go Live"
3. Under "Producer" section, find your Stream Key
4. Copy this key

### 2. Start Streaming

1. Open StreamWeever at `streemweever.com`
2. Click **"START CAPTURE"** to begin screen sharing
3. Select which screen/window to share
4. Upload your logo using the "Logo Overlay" panel
5. Drag the logo on the preview to position it
6. Adjust logo size with the slider
7. Paste your X.com Stream Key in the settings
8. Click **"GO LIVE"** to start streaming

### 3. Important Notes

**Browser Requirements:**
- Chrome, Edge, or Opera (recommended)
- Firefox works but may have limitations
- Must use HTTPS (required for screen capture)

**X.com Streaming:**
- Requires X Premium subscription
- Stream key is sensitive - never share it
- X.com has specific streaming guidelines - review them before going live

**Logo Tips:**
- Use PNG files with transparency for best results
- Recommended size: 500x500px or larger
- Position logo before going live

## Technical Setup for Local Development

1. **Create project structure**
   ```bash
   npx create-react-app streemweever
   cd streemweever
   ```

2. **Replace src/App.js with the streemweever.jsx content**

3. **Install dependencies**
   ```bash
   npm install lucide-react
   ```

4. **Run locally**
   ```bash
   npm start
   ```
   Visit `https://localhost:3000` (HTTPS required for screen capture)

## Alternative Streaming Method

If you prefer more control, you can use OBS Studio:

1. Use StreamWeever to composite your screen + logo
2. Use OBS to capture the StreamWeever preview window
3. Stream from OBS directly to X.com using your stream key

This gives you additional control over audio, scenes, and transitions.

## Troubleshooting

**"Failed to capture screen"**
- Grant screen capture permissions in your browser
- Ensure you're using HTTPS
- Try a different browser

**Logo not appearing**
- Make sure you've uploaded an image file
- Check that the file is a valid image format
- Try a smaller file size if it's very large

**Can't connect to X.com**
- Verify your stream key is correct
- Ensure you have X Premium
- Check X Media Studio for any account restrictions

## Security Notes

- Never share your X.com stream key
- The stream key is stored locally in your browser only
- StreamWeever runs entirely in your browser - no data is sent to external servers

## Support

For issues or questions about StreamWeever, consider:
- Checking browser console for error messages
- Verifying your X Premium subscription status
- Reviewing X.com's streaming documentation

---

Built for professional live streaming to X.com
Deploy to: www.streemweever.com

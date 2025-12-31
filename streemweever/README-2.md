# Streem Weever - Podcasting Studio

A multi-source podcasting application that allows you to display videos, websites, logos, and scrolling text overlays.

## Setup Instructions - Same Repo Deployment

Since Screen Mapper is already deployed at `akneal.github.io/mapper/`, we'll add Screen Weever to the same repository.

### Step 1: Clone Your Existing Repository

```bash
git clone https://github.com/akneal/akneal.github.io.git
cd akneal.github.io
```

### Step 2: Create Screen Weever Folder

Your repository structure should look like:
```
akneal.github.io/
├── mapper/              (existing Screen Mapper)
├── screen-weever/       (new - we'll create this)
└── index.html          (optional landing page)
```

Create the screen-weever folder:
```bash
mkdir screen-weever
cd screen-weever
```

### Step 3: Initialize Vite Project

```bash
# Create new Vite React project
npm create vite@latest . -- --template react

# Install dependencies
npm install

# Install additional packages
npm install lucide-react tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### Step 4: Copy Project Files

Copy all the files from this package:
- `vite.config.js` → `/screen-weever/vite.config.js`
- `package.json` → `/screen-weever/package.json`
- `tailwind.config.js` → `/screen-weever/tailwind.config.js`
- `postcss.config.js` → `/screen-weever/postcss.config.js`
- `index.html` → `/screen-weever/index.html`
- `src/App.jsx` → `/screen-weever/src/App.jsx`
- `src/main.jsx` → `/screen-weever/src/main.jsx`
- `src/index.css` → `/screen-weever/src/index.css`

### Step 5: Build the Project

```bash
# While in the screen-weever folder
npm install
npm run build
```

This creates a `dist` folder with your production build.

### Step 6: Deploy to GitHub

From the root of your repository (`akneal.github.io`):

```bash
# Add the built files
git add screen-weever/

# Commit
git commit -m "Add Screen Weever podcasting app"

# Push to GitHub
git push origin main
```

### Step 7: Access Your Apps

After GitHub Pages rebuilds (usually 1-2 minutes):

- **Screen Weever**: https://akneal.github.io/screen-weever/
- **Screen Mapper**: https://akneal.github.io/mapper/

## Alternative: Using GitHub Actions for Auto-Build

If you want GitHub to automatically build your Vite project, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Screen Weever

on:
  push:
    branches: [ main ]
    paths:
      - 'screen-weever/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install and Build
        run: |
          cd screen-weever
          npm install
          npm run build
          
      - name: Deploy
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add screen-weever/dist
          git commit -m "Deploy Screen Weever" || exit 0
          git push
```

## Development

To run locally for development:

```bash
cd screen-weever
npm run dev
```

Visit http://localhost:5173/screen-weever/

## Features

- **Multiple Videos**: Upload and position multiple video sources
- **Website Embedding**: Display live websites via iframe
- **Logo Overlay**: Add and position your logo
- **Text Overlays**: Customizable text with:
  - Horizontal scrolling (marquee style)
  - Vertical scrolling (ticker style)
  - Static text
  - Adjustable speed, size, and colors
- **Drag & Drop**: All elements are draggable
- **Links to Screen Mapper**: Easy navigation between apps

## Notes

- The link to Screen Mapper uses `/mapper/` (relative path) since both apps are in the same repository
- Make sure `vite.config.js` has `base: '/screen-weever/'` for proper routing
- The NealMedia logo is hosted on Imgur and links to www.nealmedia.app

## Troubleshooting

**If Screen Weever doesn't load:**
1. Check that the `dist` folder was properly built
2. Verify `vite.config.js` has the correct base path
3. Make sure GitHub Pages is enabled in repository settings
4. Wait 1-2 minutes for GitHub Pages to rebuild

**If Screen Mapper link doesn't work:**
- Ensure the path is `/mapper/` (with leading slash)
- Check that Screen Mapper is in the `mapper/` folder at the repository root

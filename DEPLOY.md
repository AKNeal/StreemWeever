# 🚀 Quick Deploy to streemweever.com

## Fastest Deployment (5 minutes)

### Step 1: Upload to GitHub
```bash
# In your project folder
git init
git add .
git commit -m "StreamWeever initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/streemweever.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your streemweever repo
4. Click "Deploy" (Vercel auto-detects React)
5. Wait ~2 minutes for deployment

### Step 3: Add Your Domain
1. In Vercel dashboard → Your Project → Settings → Domains
2. Add domain: `streemweever.com` and `www.streemweever.com`
3. Vercel will show you DNS records to add

### Step 4: Update DNS (at your domain registrar)
Add these records:
```
Type: A
Name: @
Value: 76.76.19.19 (Vercel's IP)

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**Done!** Visit www.streemweever.com in 5-10 minutes 🎉

---

## Alternative: Quick Test Locally

```bash
# Install dependencies
npm install

# Run locally (will open browser)
npm start
```

**Note:** Screen capture requires HTTPS. For local testing, accept the security warning or use `https://localhost:3000`

---

## What You Get

✅ Professional broadcast control interface
✅ Screen capture with logo overlay
✅ Drag-and-drop logo positioning  
✅ Real-time preview
✅ X.com streaming integration
✅ Mobile-responsive design

## Need Help?

Check the full README.md for:
- Detailed deployment options
- X.com stream key setup
- Troubleshooting guide
- Browser requirements

# 🚀 Fluence Spelling Master - GitHub Deployment Guide

## Quick Deployment Steps

### 1. Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `fluence-spelling-game`
3. Description: `React Fluence Spelling Master - Improve English spelling with AI-powered words`
4. Make it **Public** (required for free GitHub Pages)
5. **Don't initialize** with README (we already have files)
6. Click **"Create repository"**

### 2. Connect and Push to GitHub
```bash
# Connect to your GitHub repository
git remote add origin https://github.com/amanry/fluence-spelling-game.git

# Push your code to GitHub
git push -u origin main
```

### 3. Deploy to GitHub Pages
```bash
# Deploy to GitHub Pages (builds and deploys automatically)
npm run deploy
```

### 4. Enable GitHub Pages (if needed)
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Source should be set to **"Deploy from a branch"**
5. Branch should be **"gh-pages"**
6. Click **Save**

## 🌐 Your Live URL
After deployment, your game will be available at:
**https://amanry.github.io/fluence-spelling-game**

## 🔄 Automatic Updates
To update your deployed game after making changes:

```bash
# Add your changes
git add .
git commit -m "Your update message"
git push origin main

# Deploy the updates
npm run deploy
```

## 📦 Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm run deploy` - Build and deploy to GitHub Pages
- `npm test` - Run tests

## 🛠️ Troubleshooting

### If deployment fails:
1. Make sure you've created the GitHub repository
2. Check that you've pushed to GitHub first: `git push origin main`
3. Verify your repository name matches: `fluence-spelling-game`
4. Make sure repository is public

### If GitHub Pages doesn't work:
1. Check repository Settings → Pages
2. Make sure source is set to `gh-pages` branch
3. Wait a few minutes for GitHub to process the deployment

### If audio doesn't work on live site:
- Make sure you're accessing via HTTPS (GitHub Pages uses HTTPS)
- Check browser permissions for audio
- Try the "Test" button in the game settings

## 🎮 Game Features
- ✅ Multiple difficulty levels (Easy, Medium, Hard, Expert)
- ✅ Various categories (General, Science, Literature, etc.)
- ✅ Audio pronunciation of words and syllables
- ✅ Statistics tracking (score, streak, accuracy)
- ✅ Word history and hints
- ✅ Responsive design for all devices

## 📝 Notes
- The game works offline after first load
- All word data is built into the app (no external APIs)
- Optimized for fast loading and smooth gameplay 
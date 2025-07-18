# Deployment Guide - Fluence Spelling Game

This guide will help you deploy the Fluence Spelling Game to GitHub Pages under your new account `Amanrajyadav`.

## Prerequisites

1. **GitHub Account**: Make sure you have access to your GitHub account `Amanrajyadav`
2. **Git**: Ensure Git is installed on your system
3. **Node.js**: Version 14 or higher (already verified)

## Step-by-Step Deployment

### 1. Create New GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in to your `Amanrajyadav` account
2. Click the "+" icon in the top right corner and select "New repository"
3. Set repository name: `fluence-spelling-game`
4. Make it **Public** (required for GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 2. Initialize Git and Push to GitHub

Run these commands in your project directory:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Fluence Spelling Game"

# Add remote repository (replace with your actual repository URL)
git remote add origin https://github.com/Amanrajyadav/fluence-spelling-game.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/Amanrajyadav/fluence-spelling-game`
2. Click on "Settings" tab
3. Scroll down to "Pages" section in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "gh-pages" branch and "/(root)" folder
6. Click "Save"

### 4. Deploy to GitHub Pages

Run this command to deploy:

```bash
npm run deploy
```

This will:
- Build the production version
- Create a `gh-pages` branch
- Push the build files to GitHub
- Make your app available at `https://amanrajyadav.github.io/fluence-spelling-game`

### 5. Verify Deployment

1. Wait a few minutes for GitHub Pages to build and deploy
2. Visit: `https://amanrajyadav.github.io/fluence-spelling-game`
3. Your spelling game should be live!

## Troubleshooting

### If deployment fails:
1. Check that the repository is public
2. Verify the homepage URL in `package.json` matches your GitHub username
3. Ensure all dependencies are installed: `npm install`
4. Try building locally first: `npm run build`

### If the site doesn't load:
1. Check the GitHub Pages settings in your repository
2. Look for any build errors in the Actions tab
3. Verify the `gh-pages` branch was created

## Repository Structure

After deployment, your repository will have:
- `main` branch: Source code
- `gh-pages` branch: Built files for deployment

## Updating the Site

To update your deployed site:

```bash
# Make your changes
# Then commit and push to main branch
git add .
git commit -m "Update description"
git push

# Deploy the changes
npm run deploy
```

## Features of Your Deployed App

Your spelling game includes:
- ✅ Multiple difficulty levels (Easy, Medium, Hard, Expert)
- ✅ Various categories (General, Science, Literature, History, Nature, Academic)
- ✅ Audio pronunciation support
- ✅ Statistics tracking
- ✅ Responsive design for mobile and desktop
- ✅ Modern UI with Tailwind CSS

## Support

If you encounter any issues:
1. Check the GitHub Pages documentation
2. Verify all build steps completed successfully
3. Check browser console for any JavaScript errors

Your app will be accessible at: **https://amanrajyadav.github.io/fluence-spelling-game** 
 # Complete Guide: How to Run and View Your GraphQL Profile App

## 🌐 OPTION 1: View on Netlify (Already Deployed - Easiest!)

Your app is already live and deployed on Netlify. Simply open this link in Google Chrome or any browser:

**🔗 https://amanisgraphql.netlify.app/login**

No terminal commands needed - just click the link!

---

## 💻 OPTION 2: Run Locally on Your Computer

### Step-by-Step Terminal Commands:

#### **First Time Setup (Only needed once):**

1. Open your terminal (PowerShell/Command Prompt)

2. Navigate to the frontend folder:
   ```
   cd c:/Users/amani/graphql/frontend
   ```

3. Install dependencies (only needed once):
   ```
   yarn install
   ```

#### **Every Time You Want to Run the App:**

1. Open your terminal

2. Navigate to the frontend folder:
   ```
   cd c:/Users/amani/graphql/frontend
   ```

3. Start the development server:
   ```
   yarn start
   ```

4. Wait for the message: "Compiled successfully!"

5. The app will automatically open in your browser at:
   **http://localhost:3000**

6. If it doesn't open automatically, manually open Google Chrome and go to:
   **http://localhost:3000**

#### **To Stop the Server:**
- Press `Ctrl + C` in the terminal

---

## 📝 Quick Reference Commands

**Start the app:**
```powershell
cd c:/Users/amani/graphql/frontend
yarn start
```

**Stop the app:**
```
Ctrl + C
```

**Build for production:**
```powershell
cd c:/Users/amani/graphql/frontend
yarn build
```

---

## 🔗 Your App URLs

- **Netlify (Live):** https://amanisgraphql.netlify.app/login
- **Local Development:** http://localhost:3000
- **Local Network:** http://172.20.224.1:3000

---

## ✅ What's Working Now

✓ Token validation on startup
✓ Automatic logout for expired/invalid sessions
✓ Proper error messages
✓ Login page accessible
✓ Profile page with GraphQL data
✓ Interactive SVG charts
✓ Responsive design

---

## 🎯 How to Use

1. **Open the app** (Netlify link or localhost:3000)
2. **Login** with your school credentials (username/email and password)
3. **View your profile** with XP, projects, and statistics
4. **Explore the charts** in different tabs
5. **Logout** when done using the logout button

---

## 🐛 Troubleshooting

### Issue: "Failed to load profile data"
**Solution:** This happens if you have an old/invalid token. The app now automatically clears invalid tokens and redirects you to login.

### Issue: App doesn't open automatically
**Solution:** Manually open your browser and go to http://localhost:3000

### Issue: Port 3000 already in use
**Solution:** 
1. Stop any other apps running on port 3000
2. Or change the port by setting: `PORT=3001 yarn start`

### Issue: "yarn: command not found"
**Solution:** Install Yarn first:
```
npm install -g yarn
```

---

## 📦 Project Structure

```
graphql/
├── frontend/           # React application
│   ├── src/
│   │   ├── App.js     # Main app with routing & token validation
│   │   ├── components/
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Profile.jsx    # Profile dashboard
│   │   │   └── charts/        # SVG charts
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/           # FastAPI server (optional)
└── readme.md
```

---

## 🚀 Deployment

Your app is already deployed on Netlify. To update the deployment:

1. Make your changes locally
2. Commit and push to your Git repository
3. Netlify will automatically rebuild and deploy

Or manually deploy:
```powershell
cd c:/Users/amani/graphql/frontend
yarn build
# Then upload the 'build' folder to Netlify
```

---

## 📞 Need Help?

- Check the browser console (F12) for error messages
- Verify your school credentials are correct
- Ensure you have internet connection (app needs to connect to learn.01founders.co)
- Make sure Node.js and Yarn are installed

---

**That's it! Your app is ready to use both locally and on Netlify. Enjoy exploring your GraphQL profile! 🎉**

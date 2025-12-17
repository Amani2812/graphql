# GraphQL Profile - Frequently Asked Questions (FAQ)

## General Questions

### What is this project?
This is a GraphQL Profile application that displays your school data from 01 Founders. It shows your XP, projects, grades, and statistics with interactive SVG charts.

### What technologies are used?
- **Frontend**: React, TailwindCSS, Shadcn UI components
- **Authentication**: JWT tokens with Basic Auth
- **Data**: GraphQL API from 01 Founders
- **Backend** (optional): FastAPI with MongoDB
- **Deployment**: Netlify

---

## Running the Application

### How do I run this locally?
```bash
cd frontend
yarn install
yarn start
```
The app will open at http://localhost:3000

### How do I view it online?
Visit: https://amanisgraphql.netlify.app/login

### Why does it redirect me to /profile automatically?
You have an old token saved. The app now validates tokens and clears invalid ones automatically.

### How do I clear my session?
Click the "Logout" button in the profile page, or open browser console and run:
```javascript
localStorage.clear()
```

---

## Authentication

### What credentials do I use?
Use your 01 Founders school credentials (username/email and password).

### Where is authentication handled?
The app uses Basic Authentication to get a JWT token from `https://learn.01founders.co/api/auth/signin`

### How long does my session last?
Sessions last until the JWT token expires. The app validates tokens on startup and logs you out if expired.

### Why do I get "Session expired"?
Your JWT token has expired. Simply log in again with your credentials.

---

## Data & Features

### What data is displayed?
- User information (login, email, name)
- Total XP earned
- Projects completed
- Success rate / Audit ratio
- Recent projects with pass/fail status
- Interactive charts (XP over time, audit ratio, project stats)

### Where does the data come from?
All data comes from the 01 Founders GraphQL API at `https://learn.01founders.co/api/graphql-engine/v1/graphql`

### What GraphQL queries are used?
The app queries these tables:
- `user` - User information
- `transaction` - XP data
- `progress` - Project progress
- `result` - Project results

### Can I see my piscine stats?
Yes! The data includes all your projects including piscine exercises.

---

## Technical Questions

### Do I need the backend?
No! The backend (FastAPI server) is optional. The main app connects directly to the 01 Founders GraphQL API.

### What is the backend for?
It's a separate FastAPI server with MongoDB for additional features (not required for the GraphQL profile).

### How does token validation work?
On app startup:
1. Checks if a token exists in localStorage
2. Decodes the JWT to check expiration
3. Validates with the GraphQL API
4. Logs out if invalid/expired

### Why use GraphQL?
GraphQL allows us to:
- Request exactly the data we need
- Make multiple queries in one request
- Get strongly-typed responses
- Explore the API with GraphiQL

### How are the charts created?
Charts are built with SVG (Scalable Vector Graphics) for:
- Smooth animations
- Responsive design
- Interactive elements
- No external chart libraries needed

---

## Troubleshooting

### "Failed to load profile data"
**Solutions:**
1. Check your internet connection
2. Verify you're logged in with valid credentials
3. Click the "Retry" button
4. Clear your browser cache and try again

### Port 3000 already in use
**Solution:**
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
PORT=3001 yarn start
```

### "yarn: command not found"
**Solution:**
```bash
npm install -g yarn
```

### App doesn't open automatically
**Solution:**
Manually open your browser and go to http://localhost:3000

### CORS errors
**Solution:**
The app is configured to work with the 01 Founders API. If you're running a custom backend, update CORS_ORIGINS in your .env file.

---

## Development

### How do I modify the UI?
- Components are in `frontend/src/components/`
- UI components use Shadcn (in `frontend/src/components/ui/`)
- Styling uses TailwindCSS classes

### How do I add new GraphQL queries?
1. Open `frontend/src/components/Profile.jsx`
2. Add your query in `fetchProfileData()`
3. Use `executeGraphQLQuery()` to run it
4. Update the state with the results

### How do I add new charts?
1. Create a new component in `frontend/src/components/charts/`
2. Use SVG to build your chart
3. Import and use it in Profile.jsx tabs

### How do I deploy to Netlify?
1. Push your code to GitHub
2. Connect your repo to Netlify
3. Set build command: `cd frontend && yarn build`
4. Set publish directory: `frontend/build`
5. Netlify will auto-deploy on every push

---

## Project Structure

### What's in each folder?
```
graphql/
├── frontend/          # React application
│   ├── src/
│   │   ├── App.js            # Main app, routing, auth
│   │   ├── components/       # React components
│   │   │   ├── Login.jsx     # Login page
│   │   │   ├── Profile.jsx   # Profile dashboard
│   │   │   └── charts/       # SVG chart components
│   │   └── components/ui/    # Reusable UI components
│   └── public/               # Static files
├── backend/           # FastAPI server (optional)
│   └── server.py             # API endpoints
├── HOW_TO_RUN.md     # Running instructions
├── FAQ.md            # This file
└── readme.md         # Project documentation
```

---

## Best Practices

### Should I commit my .env file?
**NO!** Never commit .env files. They contain sensitive information like database URLs and API keys.

### How do I keep my token secure?
- Tokens are stored in localStorage (browser-only)
- Never share your token
- Log out when done
- The app validates tokens on startup

### How often should I update dependencies?
Check for updates monthly:
```bash
cd frontend
yarn upgrade-interactive
```

---

## Contact & Resources

### Where can I learn more about GraphQL?
- Official docs: https://graphql.org/
- 01 Founders GraphiQL: https://learn.01founders.co/graphiql/

### Where can I get help?
- Check this FAQ
- Review HOW_TO_RUN.md
- Check the code comments
- Ask your peers or mentors

### Can I customize this project?
Yes! This is your project. Feel free to:
- Add new features
- Modify the UI
- Add more charts
- Integrate additional APIs

---

**Last Updated:** December 2024

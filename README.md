# AI Web App

A modern web application built with React, Flask, and OpenAI.

## Quick Start

1. Open in VS Code:
   ```bash
   code ai-web-app.code-workspace
   ```

2. Run the setup script:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. Start Development Servers:

   Frontend (Terminal 1):
   ```bash
   cd frontend
   npm run dev
   ```

   Backend (Terminal 2):
   ```bash
   cd backend
   source venv/bin/activate
   python app.py
   ```

4. View the app at: http://localhost:5173

## Project Structure

```
ai-web-app/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Navigation.tsx    # Main navigation
│   │   │   ├── Home.tsx         # Home page
│   │   │   └── AnimatedBackground.tsx
│   │   └── assets/
│   │       └── images/    # Images and logos
│   └── package.json
└── backend/               # Flask backend
    ├── app.py            # Main server file
    └── requirements.txt  # Python dependencies
```

## Development Notes

### Current Features
- Modern navigation with centered logo
- Responsive design with mobile menu
- Montserrat font for modern typography
- Smooth hover animations
- Dark theme with gold accents

### Next Steps
- Complete home page content
- Implement chat functionality
- Add authentication
- Integrate OpenAI API

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Vite

- Backend:
  - Flask
  - Python
  - OpenAI API

## Git Commands

```bash
# Check status
git status

# Create new feature branch
git checkout -b feature-name

# Save changes
git add .
git commit -m "Description of changes"

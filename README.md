# Detection Equipment Questionnaire System

A comprehensive dark-themed web application for collecting and managing detection equipment installation information at intersections.

![Dark Theme](https://img.shields.io/badge/theme-dark-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-ISC-blue)

## Features

- **Multi-Step Questionnaire**: User-friendly wizard interface that guides users through equipment selection
- **Equipment Selection**: 
  - Cabinet Type
  - Detection I/O
  - TLS Connection
  - Intersection Phasing
  - Signal Timing
  - Equipment (Multi-select: Nexus Unit, Sensor Power Unit, Type 1 Sensor, Type 2 Sensor)
  - Auxiliary Equipment (Multi-select: Wifi Repeater, 19" Rack Mount Kit, Shelf Mount Kit, C1 Harness)
- **Authorization Form**: Checkout-style form for distributor and end-user information
- **Admin Portal**: View all submissions in a detailed table with expandable rows
- **Modern UI**: Beautiful, responsive design with smooth animations

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Node.js with Express
- **Database**: JSON file-based storage
- **Routing**: React Router v6
- **Styling**: Custom CSS with modern design patterns

## Installation

1. Install all dependencies:
```bash
npm run install-all
```

This will install dependencies for the root project, client, and server.

## Running the Application

### Development Mode (Recommended)

Run both frontend and backend simultaneously:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## Usage

### User Questionnaire

1. Navigate to http://localhost:3000
2. Complete the 9-step questionnaire:
   - Steps 1-5: Technical specifications
   - Step 6: Equipment selection (multi-select)
   - Step 7: Auxiliary equipment selection (multi-select)
   - Step 8: Review selections
   - Step 9: Authorization form (checkout)
3. Submit the form

### Admin Portal

1. Click "Admin Portal" in the navigation
2. View all submissions in the table
3. Click "Details" to expand and see full information
4. Use "Delete" to remove submissions
5. Click "Refresh Data" to update the table

## Database

The application uses a JSON file-based database (`server/submissions.json`) for simplicity and portability. The database file is created automatically on first run.

### Data Structure

```json
{
  "submissions": [
    {
      "id": 1,
      "cabinet_type": "...",
      "detection_io": "...",
      "tls_connection": "...",
      "intersection_phasing": "...",
      "signal_timing": "...",
      "equipment": [],
      "auxiliary_equipment": [],
      "distributor": "...",
      "end_user": "...",
      "address": "...",
      "city": "...",
      "state": "...",
      "zip": "...",
      "created_at": "2025-10-07T12:00:00.000Z"
    }
  ],
  "nextId": 2
}
```

## API Endpoints

- `POST /api/submissions` - Create a new submission
- `GET /api/submissions` - Get all submissions
- `DELETE /api/submissions/:id` - Delete a submission

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Questionnaire.jsx
│   │   │   ├── AdminPortal.jsx
│   │   │   └── *.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── server/                 # Express backend
│   ├── server.js
│   ├── submissions.json    # JSON database (auto-generated)
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Notes

- The application uses a JSON file for data storage
- All data is stored locally in `server/submissions.json`
- The admin portal requires no authentication (add authentication for production use)
- Equipment selections are stored as JSON objects with quantities
- Dark theme optimized for extended use
- File uploads supported for intersection phasing and signal timing documents

## Deployment to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub account

### Steps
1. Push your code to GitHub (see below)
2. Go to Railway.app and create a new project
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the configuration
6. Add environment variables:
   - `PORT=3001` (Railway will override this)
   - `FRONTEND_URL=https://your-frontend-url.railway.app`
7. Deploy!

### Environment Variables
Create a `.env` file in the root (for local development):
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

For production (Railway), set:
- `NODE_ENV=production`
- `FRONTEND_URL=<your-railway-frontend-url>`

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Detection Equipment Questionnaire System"
git branch -M main
git remote add origin https://github.com/hopkicod785/<your-repo-name>.git
git push -u origin main
```

## Future Enhancements

Consider adding:
- User authentication for admin portal
- Export submissions to CSV/Excel
- Search and filter functionality
- Email notifications on submission
- Form validation improvements
- Multi-language support
- Database migration to PostgreSQL for production


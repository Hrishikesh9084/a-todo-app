# Project Management Tool

A Trello-like application built with Astro frontend and Express backend.

## Features
- Create, view, and delete boards
- Add lists to boards
- Add, edit, and delete cards within lists
- Drag and drop cards between lists
- Responsive design with Tailwind CSS

## Tech Stack
- **Frontend**: Astro + React + Tailwind CSS + React DnD
- **Backend**: Express.js + Node.js
- **Database**: In-memory (for demo purposes)

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

## Setup Instructions

### 1. Clone the repository
```bash
# Clone this repository if you haven't already
git clone <repository-url>
cd <project-directory>
```

### 2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Start the development servers

**Backend (server):**
```bash
cd server
npm run dev
```

The backend will start on `http://localhost:3000`

**Frontend (client):**
```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:3001`

### 4. Access the application
Open your browser and navigate to:
```
http://localhost:3001
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Boards
```
GET /api/boards      - Get all boards
POST /api/boards     - Create a new board
PUT /api/boards/:id  - Update a board
DELETE /api/boards/:id - Delete a board
```

## Project Structure
```
client/            # Astro frontend
  ├── src/
  │   ├── components/  # React components
  │   ├── layouts/     # Astro layouts
  │   ├── pages/       # Astro pages
  │   └── styles/      # CSS files
  ├── astro.config.mjs
  ├── package.json
  └── ...

server/            # Express backend
  ├── index.js      # Main server file
  ├── package.json
  └── ...
```

## Deployment

For production deployment:
1. Build the Astro frontend:
```bash
cd client
npm run build
```

2. Start the backend:
```bash
cd server
npm start
```

## Notes
- This project uses in-memory storage for simplicity. For a production app, you should connect to a real database.
- The frontend proxies API requests to the backend via Vite's proxy configuration.
- Drag and drop functionality is implemented using React DnD.

## License
This project is open source and available under the MIT License.

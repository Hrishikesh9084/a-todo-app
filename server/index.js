const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory storage for boards
let boards = [
  {
    id: '1',
    title: 'Sample Board',
    lists: [
      {
        id: 'list-1',
        title: 'To Do',
        cards: [
          { id: 'card-1', title: 'Implement authentication', description: 'Add JWT authentication' },
          { id: 'card-2', title: 'Design database schema', description: 'Create tables for users and boards' }
        ]
      },
      {
        id: 'list-2',
        title: 'In Progress',
        cards: [
          { id: 'card-3', title: 'Build API endpoints', description: 'Create RESTful endpoints' }
        ]
      },
      {
        id: 'list-3',
        title: 'Done',
        cards: [
          { id: 'card-4', title: 'Setup project structure', description: 'Initialize frontend and backend' }
        ]
      }
    ]
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all boards
app.get('/api/boards', (req, res) => {
  res.json(boards);
});

// Create a new board
app.post('/api/boards', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newBoard = {
    id: uuidv4(),
    title,
    lists: []
  };

  boards.push(newBoard);
  res.status(201).json(newBoard);
});

// Update board (move card between lists)
app.put('/api/boards/:boardId', (req, res) => {
  const { boardId } = req.params;
  const { lists } = req.body;

  const boardIndex = boards.findIndex(b => b.id === boardId);
  if (boardIndex === -1) {
    return res.status(404).json({ error: 'Board not found' });
  }

  boards[boardIndex].lists = lists;
  res.json(boards[boardIndex]);
});

// Delete a board
app.delete('/api/boards/:boardId', (req, res) => {
  const { boardId } = req.params;
  boards = boards.filter(b => b.id !== boardId);
  res.status(204).end();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

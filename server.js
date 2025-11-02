const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Load the compiled C++ addon
// The path './build/Release/game_addon.node' is the default output of node-gyp
const gameAddon = require('./build/Release/game_addon');

// Middleware to serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse JSON bodies (for API requests)
app.use(express.json());


// --- API Endpoints ---
// These endpoints are called by the client-side JavaScript.
// They execute the C++ functions and return the result.

// 1. Dice Roll API
app.get('/api/dice', (req, res) => {
  const result = gameAddon.rollDice();
  res.json({ roll: result });
});

// 2. Guess the Number API (Generates the secret number)
app.get('/api/guess', (req, res) => {
  const number = gameAddon.guessNumber();
  res.json({ number: number });
});

// 3. Rock Paper Scissors API (Gets computer's move)
app.get('/api/rps', (req, res) => {
  const move = gameAddon.getRPSMove();
  res.json({ move: move });
});

// 4. Tic-Tac-Toe API (Checks for a winner)
app.post('/api/tic-tac-check', (req, res) => {
  const board = req.body.board; // Expects { "board": ["x", "", "o", ...] }
  if (!board || !Array.isArray(board) || board.length !== 9) {
    return res.status(400).json({ error: 'Invalid board data' });
  }
  const winner = gameAddon.checkTicTacWinner(board);
  res.json({ winner: winner });
});


// --- Server Start ---
app.listen(port, () => {
  console.log(`Mini-Game Hub server listening at http://localhost:${port}`);
  console.log('C++ Addon loaded:');
  console.log('- rollDice():', gameAddon.rollDice());
  console.log('- getRPSMove():', gameAddon.getRPSMove());
});

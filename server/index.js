const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // Loads variables from .env if available

const app = express();
const PORT = process.env.PORT || 3000;

// Use your OMDb API key here.
// Either store it in a .env file as OMDB_API_KEY=your_key or hardcode it below.
const OMDB_API_KEY = process.env.OMDB_API_KEY || 'db89e5d';

app.use(cors());
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Route for searching movies using OMDb
app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  // Construct the URL per OMDb docs:
  // http://www.omdbapi.com/?apikey=[yourkey]&s=[search term]
  const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`;
  console.log('Fetching OMDb URL:', url);

  try {
    const response = await axios.get(url);
    // OMDb returns { Response: "False", Error: "Movie not found!" } when no results exist.
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Optional: Endpoints for adding and getting movies (stored in memory)
let movieList = [];

app.post('/add-to-list', (req, res) => {
  const { imdbID, title } = req.body;
  if (!imdbID || !title) {
    return res.status(400).json({ error: 'imdbID and title are required' });
  }
  // Check for duplicates before adding
  if (!movieList.some(movie => movie.imdbID === imdbID)) {
    movieList.push({ imdbID, title });
  }
  res.json({ message: 'Movie added successfully', movieList });
});

app.get('/get-list', (req, res) => {
  res.json({ movieList });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

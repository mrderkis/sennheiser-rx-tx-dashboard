const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3003;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Endpoint to get a random photo for a given person
app.get('/random-photo/:name', (req, res) => {
  const name = req.params.name.replace(/ /g, "_"); // Replace spaces with underscores
  const folderPath = path.join(__dirname, 'images', name);

  fs.readdir(folderPath, (err, files) => {
    if (err || !files || files.length === 0) {
      return res.status(404).json({ error: 'No images found' });
    }

    // Pick a random file from the folder
    const randomPhoto = files[Math.floor(Math.random() * files.length)];
    res.json({ photoPath: `/images/${name}/${randomPhoto}` });
  });
});

// Monitor routes
app.get('/monitor1', (req, res) => {
  res.sendFile(path.join(__dirname, 'monitor1.html'));
});

// Route for Monitor 2
app.get('/monitor2', (req, res) => {
  res.sendFile(path.join(__dirname, 'monitor2.html'));
});

// Default route
app.get('*', (req, res) => {
  res.redirect('/monitor1');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Access Monitor 1: http://localhost:${PORT}/monitor1`);
  console.log(`Access Monitor 2: http://localhost:${PORT}/monitor2`);
});

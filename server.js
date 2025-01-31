const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3003;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Endpoint to get a random photo for a given person
app.get('/random-photo/:name', (req, res) => {
  const folderName = req.params.name.replace(/ /g, "_"); // Normalize folder names
  const folderPath = path.join(__dirname, 'images', folderName);

  fs.readdir(folderPath, (err, files) => {
    if (err || !files || files.length === 0) {
      // console.error(`Error: No images found in folder ${folderPath}`);
      return res.status(404).json({ error: 'No images found', photos: [] });
    }

    // Filter out non-image files
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const photoPaths = files
      .filter((file) => validExtensions.includes(path.extname(file).toLowerCase()))
      .map((file) => `/images/${folderName}/${file}`);

    if (photoPaths.length === 0) {
      console.error(`Error: No valid image files in folder ${folderPath}`);
      return res.status(404).json({ error: 'No valid image files', photos: [] });
    }

    res.json({ photos: photoPaths });
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

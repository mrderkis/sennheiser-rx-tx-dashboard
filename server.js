const express = require('express');
const path = require('path');

const app = express();
const PORT = 3003;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Route for Monitor 1
app.get('/monitor1', (req, res) => {
  res.sendFile(path.join(__dirname, 'monitor1.html'));
});

// Route for Monitor 2
app.get('/monitor2', (req, res) => {
  res.sendFile(path.join(__dirname, 'monitor2.html'));
});

// Fallback route (optional, default page)
app.get('*', (req, res) => {
  res.redirect('/monitor1'); // Default to Monitor 1
});

app.listen(PORT, () => {
  console.log(`Server running at http://<YOUR_IP_ADDRESS>:${PORT}`);
  console.log(`Access Monitor 1: http://<YOUR_IP_ADDRESS>:${PORT}/monitor1`);
  console.log(`Access Monitor 2: http://<YOUR_IP_ADDRESS>:${PORT}/monitor2`);
});

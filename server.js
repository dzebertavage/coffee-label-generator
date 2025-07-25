const express = require('express');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static(__dirname));
app.use(express.json()); // Allow JSON in POST requests

// POST route to handle Print button
app.post('/print-label', (req, res) => {
  const { grind, coffeeName, sellBy, size } = req.body;

  console.log('Print request received:', req.body);

  // TODO:
  // 1. Load label template with Puppeteer
  // 2. Screenshot → PNG → BMP → SBPL
  // 3. Send to printer

  res.json({ message: 'Label print initiated (placeholder).' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Label generator server running at http://localhost:${PORT}`);
});

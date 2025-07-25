const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

app.post('/print-label', async (req, res) => {
  const { grind, coffeeName, sellBy, size } = req.body;

  try {
    // Launch headless Chrome
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Construct query string URL
    const url = `http://localhost:3000/label-template-${grind}.html` +
                `?coffeeName=${encodeURIComponent(coffeeName)}` +
                `&sellBy=${encodeURIComponent(sellBy)}` +
                `&size=${encodeURIComponent(size)}`;

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Optional: set viewport to match label dimensions
    await page.setViewport({ width: 812, height: 1218 });

    // Screenshot label
    await page.screenshot({ path: 'label-output.png' });

    await browser.close();

    console.log('Label screenshot saved as label-output.png');
    res.json({ message: 'Label rendered and saved as PNG.' });
  } catch (err) {
    console.error('Puppeteer error:', err.stack || err.message || err);
    res.status(500).json({ message: 'Label generation failed.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Label generator server running at http://localhost:${PORT}`);
});

const puppeteer = require('puppeteer-core');
const express = require('express');
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

app.post('/print-label', async (req, res) => {
  const { grindType, grindNum, coffeeName, sellBy, weight } = req.body;

  try {
    // Launch headless Chrome
    const chromePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
    console.log('Using system Chrome from:', chromePath);
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Construct query string URL
    const url = `http://localhost:3000/label-template-${grindType}.html` +
                `?coffeeName=${encodeURIComponent(coffeeName)}` +
                `&sellBy=${encodeURIComponent(sellBy)}` +
                `&weight=${encodeURIComponent(weight)}`;

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForSelector('img[alt="Quartermaine Coffee Roasters logo"]', { visible: true });
  await page.waitForFunction(() => {
    const el = document.querySelector('.coffee-name');
    return el && el.innerText.length > 0 && parseInt(window.getComputedStyle(el).fontSize) > 10;
  });


    // Optional: set viewport to match label dimensions
    await page.setViewport({ width: 812, height: 1218 });

    // Format and screenshot label
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}-${milliseconds}`;
    const filename = `img/label-archive/label-output-${timestamp}.png`;

    await page.screenshot({ path: filename });
    console.log(`Label screenshot saved as ${filename}`);

  // Format log entry as CSV
  const sellByDate = sellBy.slice(9, 17);
  let weightNum = 5;
  
  if (weight === "one") {
    weightNum = 1;
  }

  const logLine = `"${timestamp}","${coffeeName}","${grindType}", "${grindNum}", "${sellByDate}","${weightNum}"\n`;
  const logPath = path.join(__dirname, 'print-log.csv');

  // Write header if the file doesn’t exist
  try {
    await fsp.access(logPath);
  } catch {
    // File does not exist, write header
    const header = `"Timestamp","Coffee","Grind Type", "#", "Sell By","Weight"\n`;
    await fsp.writeFile(logPath, header);
  }

  // Append new line to CSV
  try {
    await fsp.appendFile(logPath, logLine);
    console.log('Label print logged:', logLine.trim());
  } catch (err) {
    console.error('Failed to write CSV log:', err);
  }


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

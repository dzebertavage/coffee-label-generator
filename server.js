const puppeteer = require('puppeteer-core');
const express = require('express');
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

const sharp = require('sharp');
const net = require('net');

// --- PNG to monochrome bitmap
async function convertToMonochromeBitmap(inputPath) {
  const image = sharp(inputPath).threshold(128).toColourspace('b-w');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

// --- Pack bitmap data
function packBitmapData(raw, width, height) {
  const packed = Buffer.alloc(Math.ceil(width / 8) * height);
  let byteIndex = 0;

  for (let y = 0; y < height; y++) {
    for (let xByte = 0; xByte < Math.ceil(width / 8); xByte++) {
      let byte = 0;
      for (let bit = 0; bit < 8; bit++) {
        const x = xByte * 8 + bit;
        if (x >= width) continue;

        const pixelIndex = y * width + x;
        const pixelValue = raw[pixelIndex];
        if (pixelValue < 128) byte |= (1 << (7 - bit));
      }
      packed[byteIndex++] = byte;
    }
  }

  return packed;
}

// --- Build SBPL image command
function buildSBPLImageCommand(packedBuffer, widthBytes, heightDots) {
  const ESC = '\x1B';
  const header = Buffer.from(
    `${ESC}A${ESC}i0${String(widthBytes).padStart(3, '0')}${String(heightDots).padStart(4, '0')}`
  );
  const footer = Buffer.from(`${ESC}Z`);
  return Buffer.concat([header, packedBuffer, footer]);
}

// --- Send to printer over network
function sendToPrinterTCP(sbplBuffer, printerIP, port = 9100) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ host: printerIP, port }, () => {
      client.write(sbplBuffer);
      client.end();
    });

    client.on('error', err => {
      console.error('Printer connection error:', err);
      reject(err);
    });

    client.on('end', () => {
      console.log('✅ Label sent to printer');
      resolve();
    });
  });
}

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

    const { data, width, height } = await convertToMonochromeBitmap(filename);
    const packed = packBitmapData(data, width, height);
    const sbplBuffer = buildSBPLImageCommand(packed, Math.ceil(width / 8), height);

    const printerIP = '192.168.1.100'; // CHANGE TO IP OF THE SATO CL4NX PRINTER
    try {
    await sendToPrinterTCP(sbplBuffer, printerIP);
    await fsp.unlink(filename);
    console.log(`🗑️ Deleted label PNG after print: ${filename}`);

    const sellByDate = sellBy.slice(9, 17);
    let weightNum = weight === "one" ? 1 : 5;

    const logLine = `"${timestamp}","${coffeeName}","${grindType}", "${grindNum}", "${sellByDate}","${weightNum}"\n`;
    const logPath = path.join(__dirname, 'print-log.csv');

    try {
      await fsp.access(logPath);
    } catch {
      const header = `"Timestamp","Coffee","Grind Type", "#", "Sell By","Weight"\n`;
      await fsp.writeFile(logPath, header);
    }

    try {
      await fsp.appendFile(logPath, logLine);
      console.log('Label print logged:', logLine.trim());
    } catch (err) {
      console.error('Failed to write CSV log:', err);
    }

    res.json({ message: 'Label printed successfully.' });
  } catch (printErr) {
    console.error('❌ Print failed:', printErr);
    res.status(500).json({ message: 'Label print failed.' });
  }


  await browser.close();


  } catch (err) {
    console.error('Puppeteer error:', err.stack || err.message || err);
    res.status(500).json({ message: 'Label generation failed.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Label generator server running at http://localhost:${PORT}`);
});

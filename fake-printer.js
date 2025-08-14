const net = require('net');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'fake-printer-logs');
fs.mkdirSync(outputDir, { recursive: true });

const server = net.createServer(socket => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(outputDir, `received-label-${timestamp}.bin`);
  const chunks = [];

  console.log('📡 Incoming SBPL print job...');

  socket.on('data', chunk => {
    chunks.push(chunk);
  });

  socket.on('end', () => {
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ SBPL data saved to: ${filePath}`);
    console.log(`📏 Total bytes: ${buffer.length}`);
  });
});

server.listen(9100, () => {
  console.log('🖨️ Fake printer listening on port 9100');
});
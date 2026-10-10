import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(size) {
  // Simple uncompressed or deflate PNG generator
  const width = size;
  const height = size;

  // RGBA buffer
  const rowSize = width * 4;
  const buffer = Buffer.alloc((rowSize + 1) * height);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.45;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    buffer[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= r) {
        // Gradient from violet (#8B5CF6) to cyan (#06B6D4)
        const t = (x + y) / (width + height);
        const red = Math.round(139 * (1 - t) + 6 * t);
        const green = Math.round(92 * (1 - t) + 182 * t);
        const blue = Math.round(246 * (1 - t) + 212 * t);

        // Center sparkle / brain icon
        const innerDist = Math.abs(dx) + Math.abs(dy);
        if (innerDist < size * 0.22) {
          buffer[pxOffset] = 255;
          buffer[pxOffset + 1] = 255;
          buffer[pxOffset + 2] = 255;
          buffer[pxOffset + 3] = 255;
        } else {
          buffer[pxOffset] = red;
          buffer[pxOffset + 1] = green;
          buffer[pxOffset + 2] = blue;
          buffer[pxOffset + 3] = 255;
        }
      } else {
        // Transparent
        buffer[pxOffset] = 0;
        buffer[pxOffset + 1] = 0;
        buffer[pxOffset + 2] = 0;
        buffer[pxOffset + 3] = 0;
      }
    }
  }

  const deflated = zlib.deflateSync(buffer);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Standard CRC32
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

const iconsDir = path.resolve('apps/extension/public/icons');
fs.mkdirSync(iconsDir, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  const png = createPNG(size);
  const filePath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`Generated ${filePath} (${size}x${size})`);
}


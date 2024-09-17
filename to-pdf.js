const fs = require('fs').promises;
const path = require('path');

async function convert(fileName) {
  try {
    let data = await fs.readFile(fileName);
    await fs.appendFile('./tmp.txt', data);
  } catch (err) {
    console.log(err);
    return { success: false };
  }
}

async function run(dirPath) {
  const files = await fs.readdir(dirPath);
  for (const file of files) {
    if (file === '.DS_Store') continue;
    if (file === 'sample-mp4-file-small.mp4') continue;

    const filePath = path.join(dirPath, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      await run(filePath);
    } else {
      await convert(filePath);
      console.log(filePath);
    }
  }
}

async function toPdf() {
  await run(__dirname + '/src');
}

toPdf();

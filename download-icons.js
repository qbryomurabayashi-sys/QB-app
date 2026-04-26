import fs from 'fs';
import https from 'https';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, function(response) {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', function() {
        file.close(resolve);  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest, () => {}); // Delete the file async. (But we don't check the result)
      reject(err.message);
    });
  });
}

async function run() {
  await downloadFile('https://placehold.co/192x192/1e3a8a/ffffff/png?text=QB', 'public/icon-192.png');
  await downloadFile('https://placehold.co/512x512/1e3a8a/ffffff/png?text=QB', 'public/icon-512.png');
  console.log('done');
}
run();

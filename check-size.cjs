const fs = require('fs');
console.log('192:', fs.existsSync('public/icon-192.png') ? fs.statSync('public/icon-192.png').size : 'missing');
console.log('512:', fs.existsSync('public/icon-512.png') ? fs.statSync('public/icon-512.png').size : 'missing');

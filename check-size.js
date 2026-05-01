const fs = require('fs');
console.log('icon-192.png size:', fs.statSync('public/icon-192.png').size);
console.log('icon-512.png size:', fs.statSync('public/icon-512.png').size);

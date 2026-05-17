const fs = require('fs');
const data = JSON.parse(fs.readFileSync('QOMA.postman_collection.json', 'utf8'));

const ownerFolder = data.item.find(i => i.name === 'Owner');
if (ownerFolder) {
  console.log('--- OWNER ENDPOINTS ---');
  ownerFolder.item.forEach(reqItem => {
    // If it's a folder inside Owner (like Outlet, Bahan Baku)
    if (reqItem.item) {
      console.log('\nFolder: ' + reqItem.name);
      reqItem.item.forEach(subItem => {
        const method = subItem.request.method;
        const urlObj = subItem.request.url;
        const urlStr = urlObj && urlObj.raw ? urlObj.raw : JSON.stringify(urlObj);
        console.log(`  [${method}] ${subItem.name}: ${urlStr}`);
      });
    } else {
      const method = reqItem.request.method;
      const urlObj = reqItem.request.url;
      const urlStr = urlObj && urlObj.raw ? urlObj.raw : JSON.stringify(urlObj);
      console.log(`[${method}] ${reqItem.name}: ${urlStr}`);
    }
  });
} else {
  console.log('Owner folder not found');
}

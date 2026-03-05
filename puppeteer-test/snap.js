const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/Users/vinayakkad/Tech-Doc/debug_index.png' });

  await page.goto('http://localhost:8080/02-data-collection.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/Users/vinayakkad/Tech-Doc/debug_collection.png' });

  await page.goto('http://localhost:8080/03-identity-resolution.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/Users/vinayakkad/Tech-Doc/debug_identity.png' });

  await browser.close();
})();

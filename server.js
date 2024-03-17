const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const port = 3000;

const corsOpts = {
  origin: ['http://localhost:3000', 'chrome-extension://dildmhbaabhohhpihahebpdnhpcaonkh'],

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
  credentials: true
};

app.use(cors(corsOpts));

app.get('/generate-pdf', async (req, res) => {
  const { url, mode } = req.query;

  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(60000);

    const viewportOptions = mode === 'mobile'
      ? { width: 375, height: 926, isMobile: true, hasTouch: true }
      : { width: 1360, height: 926, isLandscape: true, hasTouch: true };
    
    await page.setViewport(viewportOptions);
  
    await page.goto(url, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      preferCSSPageSize: true,
    });
    
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="webpage.pdf"');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

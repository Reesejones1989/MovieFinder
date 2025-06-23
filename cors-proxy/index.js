const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001 ;

app.use(cors());

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  console.log('Proxy request for:', targetUrl);
  if (!targetUrl) {
    return res.status(400).send('Missing ?url parameter');
  }

  try {
    console.log('Fetching URL:', targetUrl);  // DEBUG LOG

    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType);
    const data = await response.text();
    res.send(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).send('Proxy error: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`CORS proxy running on http://localhost:${PORT}`);
});

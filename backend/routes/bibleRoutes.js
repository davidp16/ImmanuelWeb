const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Get the list of books (Fetch and save to file if not exists)
router.get('/list', async (req, res) => {
  const version = req.query.version || 'tb';
  const filePath = path.join(dataDir, `list_${version}.json`);
  
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return res.json({ data: JSON.parse(rawData) });
  }

  try {
    const fetchUrl = version === 'tb' 
      ? 'https://beeble.vercel.app/api/v1/passage/list'
      : `https://beeble.vercel.app/api/v1/passage/list?version=${version}`;
      
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error('Failed to fetch from beeble');
    
    const json = await response.json();
    fs.writeFileSync(filePath, JSON.stringify(json.data));
    res.json({ data: json.data });
  } catch (err) {
    console.error(`Error fetching list for ${version}:`, err);
    res.status(500).json({ error: 'Failed to fetch bible list' });
  }
});

// Get a specific chapter (Fetch and save to file if not exists)
router.get('/passage/:book/:chapter', async (req, res) => {
  const version = req.query.version || 'tb';
  const { book, chapter } = req.params;
  const filePath = path.join(dataDir, `passage_${version}_${book}_${chapter}.json`);

  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return res.json({ data: JSON.parse(rawData) });
  }

  try {
    const fetchUrl = version === 'tb'
      ? `https://beeble.vercel.app/api/v1/passage/${encodeURIComponent(book)}/${chapter}`
      : `https://beeble.vercel.app/api/v1/passage/${encodeURIComponent(book)}/${chapter}?version=${version}`;

    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error('Failed to fetch from beeble');
    
    const json = await response.json();
    fs.writeFileSync(filePath, JSON.stringify(json.data));
    res.json({ data: json.data });
  } catch (err) {
    console.error(`Error fetching passage ${book} ${chapter} for ${version}:`, err);
    res.status(500).json({ error: 'Failed to fetch bible passage' });
  }
});

module.exports = router;

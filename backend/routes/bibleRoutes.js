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

const cheerio = require('cheerio');

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
    // We use alkitab.sabda.org API instead of alkitab.mobi to avoid AWS blocking
    const fetchUrl = `https://alkitab.sabda.org/api/passage.php?passage=${encodeURIComponent(book + ' ' + chapter)}&version=${version}`;
    
    const response = await fetch(fetchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    
    if (!response.ok) throw new Error('Failed to fetch from sabda API');
    
    const xml = await response.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    
    let verses = [];
    
    $('verse').each((i, el) => {
      let verseNumText = $(el).find('number').text();
      let verseNum = verseNumText ? parseInt(verseNumText, 10) : 0;
      let title = $(el).find('title').text();
      let text = $(el).find('text').text();
      
      if (title) {
        verses.push({ verse: 0, type: 'title', content: title });
      }
      if (text) {
        verses.push({ verse: verseNum, type: 'content', content: text });
      }
    });

    if (verses.length === 0) {
       throw new Error('No verses found');
    }

    const parsedData = { book: { name: book, chapter }, verses };
    
    fs.writeFileSync(filePath, JSON.stringify(parsedData));
    res.json({ data: parsedData });
  } catch (err) {
    console.error(`Error fetching passage ${book} ${chapter} for ${version}:`, err);
    res.status(500).json({ error: 'Failed to fetch bible passage' });
  }
});

module.exports = router;

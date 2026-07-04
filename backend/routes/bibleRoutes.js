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
    const fetchUrl = `https://alkitab.mobi/${version}/${encodeURIComponent(book)}/${chapter}`;
    
    // Some hosting blocks bots, so use a real user agent
    const response = await fetch(fetchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    
    if (!response.ok) throw new Error('Failed to fetch from alkitab.mobi');
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    let verses = [];
    let lastVerse = 0;
    
    $('p').each((i, el) => {
      let data = $(el);
      let content = data.find('[data-begin]').first().text().trim();
      let title = data.find('.paragraphtitle').first().text().trim();
      let verseText = data.find('.reftext').children().first().text().trim();
      
      let verse = verseText ? parseInt(verseText, 10) : 0;
      
      if (!title && !content) {
        data.find('.reftext').remove();
        content = data.text().trim();
      }
      
      // Ignore footer copyright texts
      if (content.includes('Yayasan Lembaga SABDA') || content.includes('Copyright')) return;
      
      if (data.attr('hidden') === 'hidden' || data.hasClass('loading') || data.hasClass('error')) {
        return;
      }
      
      if (title) {
        verses.push({ verse: 0, type: 'title', content: title });
      } else if (content) {
        content = content.replace(/^\[\d+\]\s*/, '');
        content = content.replace(/^\d+\s*/, '');
        
        verses.push({ verse: verse, type: 'content', content: content });
        lastVerse = verse;
      }
    });

    const parsedData = { book: { name: book, chapter }, verses };
    
    fs.writeFileSync(filePath, JSON.stringify(parsedData));
    res.json({ data: parsedData });
  } catch (err) {
    console.error(`Error fetching passage ${book} ${chapter} for ${version}:`, err);
    res.status(500).json({ error: 'Failed to fetch bible passage' });
  }
});

module.exports = router;

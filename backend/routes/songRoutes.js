const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');

// Route to get Kidung Jemaat by song number
router.get('/kj/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const url = `https://alkitab.mobi/kidung/kj/${id}`;
    
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const paragraphs = [];
    $('p').each((i, el) => {
      paragraphs.push($(el).text().trim());
    });
    
    // Parse the output
    // Usually the first paragraph is the title: "KJ 1 - Haleluya, Pujilah"
    // Subsequent paragraphs are the lyrics
    // The last two paragraphs are "Play" and "Copyright..."
    
    if (paragraphs.length < 3) {
      return res.status(404).json({ error: 'Kidung Jemaat tidak ditemukan.' });
    }
    
    const title = paragraphs[0];
    
    // Filter out Copyright and Play
    const lyricsRaw = paragraphs.slice(1).filter(p => p && !p.startsWith('Copyright') && p !== 'Play');
    
    // Process lyrics to handle tabs/newlines correctly
    const lyrics = lyricsRaw.map(stanza => {
      return stanza
        .replace(/\t+/g, ' ')
        .replace(/\n\s+/g, '\n')
        .trim();
    });
    
    res.json({
      title,
      lyrics
    });
  } catch (error) {
    console.error('Error fetching Kidung Jemaat:', error);
    res.status(500).json({ error: 'Gagal mengambil data Kidung Jemaat.' });
  }
});

// Route to get Buku Ende by song number
router.get('/ende/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const url = `https://www.ende.sibirong.com/index?nomor=${id}`;
    
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) {
      return res.status(404).json({ error: `Gagal mengakses data Buku Ende No. ${id}` });
    }
    const html = await response.text();
    
    const metaTitleMatch = html.match(/<meta name="title" content="([^"]*)">/);
    const metaDescriptionMatch = html.match(/<meta name="description" content="([^"]*)">/);
    
    let fullTitle = metaTitleMatch ? metaTitleMatch[1] : null;
    let songLyrics = metaDescriptionMatch ? metaDescriptionMatch[1] : null;
    
    if (!fullTitle || !songLyrics || fullTitle.trim() === '' || songLyrics.trim() === '') {
      return res.status(404).json({ error: `Buku Ende No. ${id} tidak ditemukan.` });
    }
    
    let title = fullTitle.split('-').pop().trim();
    title = title.replace(/\\n|\\r|\\t/g, '').trim();
    
    songLyrics = songLyrics.replace(/\\n|\\r|\\t/g, '').trim();
    const verses = songLyrics.split(/\d+\.\s/).filter(verse => verse.trim() !== '');
    const lyrics = verses.map((verse, index) => `${index + 1}. ${verse.trim()}`);
    
    res.json({
      title: `Buku Ende No. ${id} - ${title}`,
      lyrics
    });
  } catch (error) {
    console.error('Error fetching Buku Ende:', error);
    res.status(500).json({ error: 'Gagal mengambil data Buku Ende.' });
  }
});

module.exports = router;

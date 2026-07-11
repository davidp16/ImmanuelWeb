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
router.get('/ende/:id', (req, res) => {
  try {
    const { id } = req.params;
    const fs = require('fs');
    const path = require('path');
    
    // Read the static JSON file
    const dataPath = path.join(__dirname, '../data/bukuEnde.json');
    if (!fs.existsSync(dataPath)) {
      return res.status(500).json({ error: 'Database Buku Ende belum tersedia.' });
    }
    
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const bukuEndeDb = JSON.parse(rawData);
    
    // Find the song
    const song = bukuEndeDb.find(s => s.id === id);
    
    if (!song) {
      return res.status(404).json({ error: `Buku Ende No. ${id} tidak ditemukan.` });
    }
    
    res.json({
      title: song.title,
      lyrics: song.lyrics
    });
  } catch (error) {
    console.error('Error fetching Buku Ende:', error);
    res.status(500).json({ error: 'Gagal mengambil data Buku Ende.' });
  }
});

module.exports = router;

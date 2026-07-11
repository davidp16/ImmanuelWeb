const cheerio = require('cheerio');
async function test() {
  const tb = await fetch('https://alkitab.sabda.org/api/passage.php?passage=Kej+1&version=toba', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const xml = await tb.text();
  const $ = cheerio.load(xml, { xmlMode: true });
  
  let verses = [];
  $('verse').each((i, el) => {
    let verseNum = parseInt($(el).find('number').text(), 10);
    let title = $(el).find('title').text();
    let text = $(el).find('text').text();
    
    if (title) verses.push({ verse: 0, type: 'title', content: title });
    if (text) verses.push({ verse: verseNum, type: 'content', content: text });
  });
  
  console.log(verses.slice(0, 3));
}
test();

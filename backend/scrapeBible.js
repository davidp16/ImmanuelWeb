const fs = require('fs');
const path = require('path');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return await res.json();
    } catch (e) {
      console.log(`Failed ${url}, retrying... (${i+1}/${retries})`);
      await delay(1000);
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

async function scrapeBible(version) {
  console.log(`\n--- Starting scrape for version: ${version} ---`);
  const listUrl = version === 'tb' 
    ? 'https://beeble.vercel.app/api/v1/passage/list'
    : `https://beeble.vercel.app/api/v1/passage/list?version=${version}`;
    
  let listData;
  try {
    const listRes = await fetchWithRetry(listUrl);
    listData = listRes.data;
  } catch (e) {
    console.error('Failed to get passage list', e);
    return;
  }

  const bibleData = {
    books: listData,
    chapters: {} // key: `${abbr}_${chapter}`, value: { verses: [...] }
  };

  let totalChapters = 0;
  for (const book of listData) {
    totalChapters += book.chapter;
  }

  let count = 0;
  // Limit concurrency
  const concurrency = 10;
  const queue = [];

  for (const book of listData) {
    for (let ch = 1; ch <= book.chapter; ch++) {
      queue.push({ abbr: book.abbr, ch });
    }
  }

  console.log(`Total chapters to fetch: ${totalChapters}`);

  for (let i = 0; i < queue.length; i += concurrency) {
    const batch = queue.slice(i, i + concurrency);
    const promises = batch.map(async ({ abbr, ch }) => {
      const url = version === 'tb'
        ? `https://beeble.vercel.app/api/v1/passage/${encodeURIComponent(abbr)}/${ch}`
        : `https://beeble.vercel.app/api/v1/passage/${encodeURIComponent(abbr)}/${ch}?version=${version}`;
      
      const data = await fetchWithRetry(url);
      bibleData.chapters[`${abbr}_${ch}`] = data.data;
      count++;
      if (count % 100 === 0) {
        console.log(`Progress: ${count} / ${totalChapters}`);
      }
    });
    
    await Promise.all(promises);
    await delay(100); // polite delay
  }

  const outPath = path.join(__dirname, 'data', `${version}.json`);
  if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
  }
  
  fs.writeFileSync(outPath, JSON.stringify(bibleData));
  console.log(`Successfully saved ${version}.json (${count} chapters)`);
}

async function main() {
  await scrapeBible('tb');
  await scrapeBible('toba');
  console.log('All scraping done!');
}

main();

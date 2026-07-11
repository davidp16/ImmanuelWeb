const url = 'https://alkitab.mobi/toba/1%20Musa/1';
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

async function test() {
  try {
    const res = await fetch(proxyUrl);
    const json = await res.json();
    if (json.contents.includes('1 Musa 1')) {
      console.log('SUCCESS_PROXY');
    } else {
      console.log('FAIL_PROXY', json.contents.substring(0, 100));
    }
  } catch (err) {
    console.error(err);
  }
}
test();

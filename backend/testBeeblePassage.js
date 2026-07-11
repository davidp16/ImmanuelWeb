async function test() {
  const url = 'https://corsproxy.io/?https://alkitab.mobi/toba/1%20Musa/1';
  try {
    const res = await fetch(url);
    const text = await res.text();
    if (text.includes('1 Musa 1')) {
      console.log('CORSPROXY SUCCESS');
    } else {
      console.log('CORSPROXY FAILED', text.substring(0, 100));
    }
  } catch (err) {
    console.error(err);
  }
}
test();

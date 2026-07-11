async function test() {
  const tb = await fetch('https://beeble.vercel.app/api/v1/passage/list');
  const tbData = await tb.json();
  console.log('TB length:', tbData.data?.length);

  const toba = await fetch('https://beeble.vercel.app/api/v1/passage/list?version=toba');
  const tobaData = await toba.json();
  console.log('Toba length:', tobaData.data?.length);
}
test();

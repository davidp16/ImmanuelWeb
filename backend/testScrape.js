async function search() {
  // Let's use github graphql or just REST
  const r = await fetch('https://api.github.com/search/code?q=ende+extension:json+repo:gracely011/bukuendehkbp');
  console.log(await r.json());
}
search();

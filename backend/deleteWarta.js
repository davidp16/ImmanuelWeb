const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Menghapus semua Warta Jemaat...');
  
  await prisma.news.deleteMany();
  console.log('✔ Semua Warta Jemaat berhasil dihapus!');
  
  console.log('Menghapus semua Tata Ibadah...');
  await prisma.liturgy.deleteMany();
  console.log('✔ Semua Tata Ibadah berhasil dihapus!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

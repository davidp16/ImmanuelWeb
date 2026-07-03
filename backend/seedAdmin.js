const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'admin123';

  // Check if admin already exists using raw SQL
  const existingAdmins = await prisma.$queryRaw`SELECT * FROM "AdminUser" WHERE username = ${username}`;

  if (existingAdmins.length > 0) {
    console.log('Admin user already exists!');
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create admin using raw SQL
  await prisma.$executeRaw`
    INSERT INTO "AdminUser" (id, username, password, "createdAt") 
    VALUES (gen_random_uuid(), ${username}, ${hashedPassword}, NOW())
  `;

  console.log(`Admin user created: ${username}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

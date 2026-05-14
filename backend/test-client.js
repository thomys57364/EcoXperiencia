const { PrismaClient } = require('./prisma/generated');

console.log('Attempting to create Prisma client...');
try {
  const prisma = new PrismaClient();
  console.log('✅ Client created successfully');
  prisma.$disconnect();
} catch (err) {
  console.error('❌ Error creating client:', err.message);
  console.error('Stack:', err.stack);
}

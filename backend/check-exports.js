const generated = require('./prisma/generated/index.js');
console.log('Exports from generated:', Object.keys(generated));
console.log('PrismaClient:', typeof generated.PrismaClient);
console.log('Prisma:', typeof generated.Prisma);

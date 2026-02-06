import { PrismaClient } from '../src/generated/prisma-client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DTB Kenya database...');

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@dtbkenya.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'dtbkenya@123';
  const adminHashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminHashedPassword,
      name: 'DTB Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
    create: {
      email: adminEmail,
      password: adminHashedPassword,
      name: 'DTB Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  console.log('✅ DTB Kenya seeding complete!');
  console.log(`Created:
    - Admin user: ${adminUser.email} (password: dtbkenya@123)
  `);

  // ============================================
  // COMMENTED OUT - Will create from frontend
  // ============================================

  // // Create organization
  // const dtbKenya = await prisma.organization.upsert({
  //   where: { slug: 'dtb-kenya' },
  //   update: {},
  //   create: {
  //     name: 'DTB Kenya',
  //     slug: 'dtb-kenya',
  //     description: 'Diamond Trust Bank Kenya - Tree Planting Initiative',
  //   },
  // });

  // // Create region (County)
  // const bungoma = await prisma.region.upsert({
  //   where: { organizationId_slug: { organizationId: dtbKenya.id, slug: 'bungoma' } },
  //   update: {},
  //   create: {
  //     name: 'Bungoma',
  //     slug: 'bungoma',
  //     organizationId: dtbKenya.id,
  //   },
  // });

  // // Create category
  // const treePlanting = await prisma.category.upsert({
  //   where: { regionId_slug: { regionId: bungoma.id, slug: 'tree-planting' } },
  //   update: {},
  //   create: {
  //     name: 'Tree Planting',
  //     slug: 'tree-planting',
  //     type: 'PLANTATION',
  //     regionId: bungoma.id,
  //   },
  // });

  // console.log(`
  //   - Organization: ${dtbKenya.name}
  //   - Region (County): ${bungoma.name}
  //   - Category: ${treePlanting.name}
  // `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

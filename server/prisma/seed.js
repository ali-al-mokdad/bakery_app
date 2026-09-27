const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

const PLACEHOLDER = (seed, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

async function main() {
  console.log('Seeding database...');

  // --- Admin user ---
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bakery.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: { email: adminEmail, passwordHash },
    });
    console.log(`Created administrator: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log('Administrator already exists, skipping.');
  }

  // --- Settings ---
  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        businessName: 'Sweet Crumb Bakery',
        logo: null,
        coverImage: PLACEHOLDER('bakery-cover', 1600, 900),
        description:
          'Sweet Crumb Bakery has been baking fresh bread, pastries, and cakes with love since 2010. Every item is handcrafted daily using traditional recipes and the finest local ingredients.',
        address: '123 Main Street, Springfield',
        phone: '+1 555 123 4567',
        whatsapp: '15551234567',
        email: 'hello@sweetcrumbbakery.com',
        facebook: 'https://facebook.com/sweetcrumbbakery',
        instagram: 'https://instagram.com/sweetcrumbbakery',
        tiktok: '',
        mapsEmbedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.9!2d-122.4!3d37.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
        openingHours:
          'Monday - Friday: 7:00 AM - 9:00 PM\nSaturday: 7:00 AM - 10:00 PM\nSunday: 8:00 AM - 8:00 PM',
        currency: 'USD',
      },
    });
    console.log('Created default settings.');
  }

  // --- Categories ---
  const categoryDefs = [
    { name: 'Croissants', description: 'Buttery, flaky French classics.', seed: 'croissants' },
    { name: 'Cakes', description: 'Rich, indulgent cakes for every occasion.', seed: 'cakes' },
    { name: 'Bread', description: 'Freshly baked artisan breads.', seed: 'bread' },
    { name: 'Donuts', description: 'Soft, glazed, and delightfully sweet.', seed: 'donuts' },
    { name: 'Cookies', description: 'Crunchy and chewy homemade cookies.', seed: 'cookies' },
    { name: 'Pies', description: 'Classic fruit and cream pies.', seed: 'pies' },
  ];

  const categories = {};
  for (let i = 0; i < categoryDefs.length; i++) {
    const c = categoryDefs[i];
    const existing = await prisma.category.findFirst({ where: { name: c.name } });
    if (existing) {
      categories[c.name] = existing;
      continue;
    }
    const created = await prisma.category.create({
      data: {
        name: c.name,
        description: c.description,
        image: PLACEHOLDER(c.seed, 800, 600),
        displayOrder: i,
        isVisible: true,
      },
    });
    categories[c.name] = created;
  }
  console.log('Categories ready.');

  // --- Menu items ---
  const productDefs = [
    {
      name: 'Butter Croissant',
      description: 'Classic French croissant, flaky and buttery, baked fresh every morning.',
      price: 2.5,
      category: 'Croissants',
      featured: true,
      seed: 'butter-croissant',
    },
    {
      name: 'Chocolate Croissant',
      description: 'Freshly baked buttery croissant filled with rich chocolate.',
      price: 3.5,
      category: 'Croissants',
      featured: true,
      seed: 'choc-croissant',
    },
    {
      name: 'Chocolate Cake',
      description: 'Decadent layered chocolate cake with silky ganache frosting.',
      price: 28,
      category: 'Cakes',
      featured: true,
      seed: 'chocolate-cake',
    },
    {
      name: 'Strawberry Cake',
      description: 'Light vanilla sponge with fresh strawberries and whipped cream.',
      price: 26,
      category: 'Cakes',
      featured: true,
      seed: 'strawberry-cake',
    },
    {
      name: 'Custom Wedding Cake',
      description: 'A bespoke multi-tier wedding cake designed to your taste and theme.',
      price: null,
      category: 'Cakes',
      featured: false,
      seed: 'wedding-cake',
    },
    {
      name: 'Glazed Donut',
      description: 'Soft, pillowy donut coated in a classic sweet glaze.',
      price: 2,
      category: 'Donuts',
      featured: true,
      seed: 'glazed-donut',
    },
    {
      name: 'Chocolate Chip Cookie',
      description: 'Chewy homemade cookie loaded with premium chocolate chips.',
      price: 1.75,
      category: 'Cookies',
      featured: false,
      seed: 'choc-cookie',
    },
    {
      name: 'French Baguette',
      description: 'Traditional crusty baguette, baked fresh throughout the day.',
      price: 3,
      category: 'Bread',
      featured: false,
      seed: 'baguette',
    },
    {
      name: 'Apple Pie',
      description: 'Warm cinnamon-spiced apples in a golden, flaky crust.',
      price: 15,
      category: 'Pies',
      featured: true,
      seed: 'apple-pie',
    },
    {
      name: 'Sourdough Loaf',
      description: 'Naturally leavened sourdough with a crisp crust and tangy crumb.',
      price: 6.5,
      category: 'Bread',
      featured: false,
      seed: 'sourdough',
    },
  ];

  for (let i = 0; i < productDefs.length; i++) {
    const p = productDefs[i];
    const existing = await prisma.menuItem.findFirst({ where: { name: p.name } });
    if (existing) continue;
    await prisma.menuItem.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        image: PLACEHOLDER(p.seed, 800, 600),
        categoryId: categories[p.category]?.id || null,
        isAvailable: true,
        isFeatured: p.featured,
        isVisible: true,
        displayOrder: i,
      },
    });
  }
  console.log('Menu items ready.');

  // --- Gallery ---
  const galleryDefs = [
    { caption: 'Fresh bread every morning', seed: 'gallery-bread' },
    { caption: 'Our cozy bakery interior', seed: 'gallery-interior' },
    { caption: 'Handcrafted cake decoration', seed: 'gallery-cake-deco' },
    { caption: 'Pastry display counter', seed: 'gallery-pastries' },
    { caption: 'Weekend baking special', seed: 'gallery-weekend' },
    { caption: 'Behind the scenes in our kitchen', seed: 'gallery-kitchen' },
  ];
  const existingGalleryCount = await prisma.gallery.count();
  if (existingGalleryCount === 0) {
    for (let i = 0; i < galleryDefs.length; i++) {
      const g = galleryDefs[i];
      await prisma.gallery.create({
        data: {
          image: PLACEHOLDER(g.seed, 900, 700),
          caption: g.caption,
          displayOrder: i,
          isVisible: true,
        },
      });
    }
    console.log('Gallery ready.');
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

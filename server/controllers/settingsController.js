const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { deleteUploadedFile } = require('../utils/fileUtils');

// GET /api/settings - public
const getSettings = asyncHandler(async (req, res) => {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }
  res.json(settings);
});

// PUT /api/settings (protected)
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }

  const {
    businessName,
    logo,
    coverImage,
    description,
    address,
    phone,
    whatsapp,
    email,
    facebook,
    instagram,
    tiktok,
    mapsEmbedUrl,
    openingHours,
    currency,
  } = req.body;

  // Delete old logo/cover if replaced
  if (logo !== undefined && logo !== settings.logo && settings.logo) {
    deleteUploadedFile(settings.logo);
  }
  if (coverImage !== undefined && coverImage !== settings.coverImage && settings.coverImage) {
    deleteUploadedFile(settings.coverImage);
  }

  const updated = await prisma.settings.update({
    where: { id: settings.id },
    data: {
      businessName: businessName !== undefined ? businessName : undefined,
      logo: logo !== undefined ? logo : undefined,
      coverImage: coverImage !== undefined ? coverImage : undefined,
      description: description !== undefined ? description : undefined,
      address: address !== undefined ? address : undefined,
      phone: phone !== undefined ? phone : undefined,
      whatsapp: whatsapp !== undefined ? whatsapp : undefined,
      email: email !== undefined ? email : undefined,
      facebook: facebook !== undefined ? facebook : undefined,
      instagram: instagram !== undefined ? instagram : undefined,
      tiktok: tiktok !== undefined ? tiktok : undefined,
      mapsEmbedUrl: mapsEmbedUrl !== undefined ? mapsEmbedUrl : undefined,
      openingHours: openingHours !== undefined ? openingHours : undefined,
      currency: currency !== undefined ? currency : undefined,
    },
  });

  res.json(updated);
});

module.exports = { getSettings, updateSettings };

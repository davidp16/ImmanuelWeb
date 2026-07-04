const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const prisma = new PrismaClient();

// Helper for sending standard responses
const handleSuccess = (res, data) => res.status(201).json(data);
const handleError = (res, error, message) => {
  console.error(error);
  res.status(500).json({ error: message });
};

// Helper to construct full URL for the uploaded file
const getFileUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// Jemaat Baru
router.post('/new-member', upload.single('file'), async (req, res) => {
  try {
    const data = req.body;
    const fileUrl = req.file ? getFileUrl(req, req.file.filename) : null;
    
    const result = await prisma.newMember.create({ 
      data: {
        ...data,
        transferLetterUrl: fileUrl
      } 
    });
    handleSuccess(res, result);
  } catch (error) {
    handleError(res, error, 'Gagal mendaftar jemaat baru');
  }
});

// Baptis Kudus
router.post('/baptism', upload.single('file'), async (req, res) => {
  try {
    const { birthDate, ...rest } = req.body;
    const fileUrl = req.file ? getFileUrl(req, req.file.filename) : null;

    const data = { 
      ...rest, 
      birthDate: new Date(birthDate),
      birthCertificateUrl: fileUrl
    };
    
    const result = await prisma.baptism.create({ data });
    handleSuccess(res, result);
  } catch (error) {
    handleError(res, error, 'Gagal mendaftar baptis kudus');
  }
});

// Katekisasi Sidi
router.post('/catechism', upload.single('file'), async (req, res) => {
  try {
    const { birthDate, ...rest } = req.body;
    const fileUrl = req.file ? getFileUrl(req, req.file.filename) : null;

    const data = { 
      ...rest, 
      birthDate: new Date(birthDate),
      baptismCertificateUrl: fileUrl
    };
    const result = await prisma.catechism.create({ data });
    handleSuccess(res, result);
  } catch (error) {
    handleError(res, error, 'Gagal mendaftar katekisasi sidi');
  }
});

// Pindah Keluar
router.post('/move-out', upload.none(), async (req, res) => {
  try {
    const data = req.body;
    const result = await prisma.moveOut.create({ data });
    handleSuccess(res, result);
  } catch (error) {
    handleError(res, error, 'Gagal mengajukan pindah keluar');
  }
});

// Berita Duka
router.post('/obituary', upload.none(), async (req, res) => {
  try {
    const { dateOfDeath, ...rest } = req.body;
    const data = { ...rest, dateOfDeath: new Date(dateOfDeath) };
    const result = await prisma.obituary.create({ data });
    handleSuccess(res, result);
  } catch (error) {
    handleError(res, error, 'Gagal mengirim berita duka');
  }
});

// Kotak Saran
router.post('/suggestion', upload.none(), async (req, res) => {
  try {
    const data = req.body;
    const result = await prisma.suggestion.create({ data });
    handleSuccess(res, result);
  } catch (error) {
    handleError(res, error, 'Gagal mengirim saran');
  }
});

// --- PUBLIC GET endpoints for frontend ---

// Tata Ibadah
router.get('/liturgy', async (req, res) => {
  try {
    const liturgies = await prisma.liturgy.findMany({ orderBy: { date: 'desc' } });
    res.json(liturgies);
  } catch (error) {
    handleError(res, error, 'Gagal mengambil data tata ibadah');
  }
});

// Warta Jemaat
router.get('/news', async (req, res) => {
  try {
    const newsList = await prisma.news.findMany({ orderBy: { date: 'desc' } });
    res.json(newsList);
  } catch (error) {
    handleError(res, error, 'Gagal mengambil data warta jemaat');
  }
});

// Galeri Foto
router.get('/gallery', async (req, res) => {
  try {
    const galleryItems = await prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(galleryItems);
  } catch (error) {
    handleError(res, error, 'Gagal mengambil data galeri');
  }
});

// Info & Kegiatan
router.get('/activities', async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(activities);
  } catch (error) {
    handleError(res, error, 'Gagal mengambil data informasi dan kegiatan');
  }
});

router.get('/activities/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const activity = await prisma.activity.findUnique({
      where: { id }
    });
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (error) {
    handleError(res, error, 'Gagal mengambil data informasi dan kegiatan');
  }
});

// Jadwal Mingguan
router.get('/schedules', async (req, res) => {
  try {
    // Return all schedules, optionally order by day, but day is string. We'll let frontend handle it or order by created time.
    const schedules = await prisma.schedule.findMany({ orderBy: { id: 'asc' } });
    res.json(schedules);
  } catch (error) {
    handleError(res, error, 'Gagal mengambil data jadwal mingguan');
  }
});

// --- GET endpoints for Admin Dashboard to view submissions ---

router.get('/submissions', verifyToken, async (req, res) => {
  try {
    const [
      newMembers,
      baptisms,
      catechisms,
      moveOuts,
      obituaries,
      suggestions
    ] = await Promise.all([
      prisma.newMember.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.baptism.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.catechism.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.moveOut.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.obituary.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.suggestion.findMany({ orderBy: { createdAt: 'desc' } })
    ]);

    res.json({
      newMembers,
      baptisms,
      catechisms,
      moveOuts,
      obituaries,
      suggestions
    });
  } catch (error) {
    handleError(res, error, 'Gagal mengambil data form layanan');
  }
});

module.exports = router;

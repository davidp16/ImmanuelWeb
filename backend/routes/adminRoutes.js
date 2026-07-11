const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/authMiddleware');
const prisma = new PrismaClient();

// Apply auth middleware to all admin routes
router.use(verifyToken);

// Helper to construct full URL for the uploaded file
const getFileUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// ----------------------------------------
// TATA IBADAH (LITURGY)
// ----------------------------------------
router.get('/liturgy', async (req, res) => {
  try {
    const liturgies = await prisma.liturgy.findMany({ orderBy: { date: 'desc' } });
    res.json(liturgies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch liturgies' });
  }
});

router.post('/liturgy', upload.single('file'), async (req, res) => {
  try {
    const { title, date } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const fileUrl = getFileUrl(req, req.file.filename);
    
    const liturgy = await prisma.liturgy.create({
      data: {
        title,
        date: new Date(date),
        fileUrl,
      }
    });
    
    res.status(201).json(liturgy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create liturgy' });
  }
});

// ----------------------------------------
// WARTA JEMAAT (NEWS)
// ----------------------------------------
router.get('/news', async (req, res) => {
  try {
    const newsList = await prisma.news.findMany({ orderBy: { date: 'desc' } });
    res.json(newsList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

router.post('/news', upload.single('file'), async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const fileUrl = req.file ? getFileUrl(req, req.file.filename) : null;
    
    const news = await prisma.news.create({
      data: {
        title,
        date: new Date(date),
        description,
        fileUrl,
      }
    });
    
    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create news' });
  }
});

router.delete('/news/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.news.delete({
      where: { id }
    });
    res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

router.put('/news/:id', upload.single('file'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, date, description } = req.body;
    
    const data = {
      title,
      date: new Date(date),
      description
    };

    if (req.file) {
      data.fileUrl = getFileUrl(req, req.file.filename);
    }
    
    const news = await prisma.news.update({
      where: { id },
      data
    });
    
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

// ----------------------------------------
// GALERI (GALLERY)
// ----------------------------------------
router.get('/gallery', async (req, res) => {
  try {
    const galleryItems = await prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

router.post('/gallery', upload.single('image'), async (req, res) => {
  try {
    const { title, category } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const imageUrl = getFileUrl(req, req.file.filename);
    
    const galleryItem = await prisma.gallery.create({
      data: {
        title,
        category: category || 'Umum',
        imageUrl,
      }
    });
    
    res.status(201).json(galleryItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload gallery image' });
  }
});

router.post('/activities', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const imageUrl = getFileUrl(req, req.file.filename);
    
    const activityItem = await prisma.activity.create({
      data: {
        title,
        description,
        imageUrl,
      }
    });
    
    res.status(201).json(activityItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload activity info' });
  }
});

router.delete('/activities/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.activity.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

router.put('/activities/:id', upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description } = req.body;
    
    const data = { title, description };

    if (req.file) {
      data.imageUrl = getFileUrl(req, req.file.filename);
    }
    
    const activityItem = await prisma.activity.update({
      where: { id },
      data
    });
    
    res.status(200).json(activityItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update activity info' });
  }
});

router.post('/schedules', async (req, res) => {
  try {
    const { day, title, location, time, category, icon, iconBg, iconColor } = req.body;
    
    const scheduleItem = await prisma.schedule.create({
      data: {
        day,
        title,
        location,
        time,
        category,
        icon,
        iconBg,
        iconColor,
      }
    });
    
    res.status(201).json(scheduleItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

router.delete('/schedules/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.schedule.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

router.put('/schedules/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { day, title, location, time, category, icon, iconBg, iconColor } = req.body;
    
    const scheduleItem = await prisma.schedule.update({
      where: { id },
      data: {
        day,
        title,
        location,
        time,
        category,
        icon,
        iconBg,
        iconColor,
      }
    });
    
    res.status(200).json(scheduleItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_jwt_auth';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // We have to use raw query because prisma client might not have adminUser generated yet (user didn't restart server)
    const admins = await prisma.$queryRaw`SELECT * FROM "AdminUser" WHERE username = ${username}`;
    
    if (admins.length === 0) {
      return res.status(401).json({ message: 'Username tidak ditemukan' });
    }

    const admin = admins[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, message: 'Login berhasil' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;

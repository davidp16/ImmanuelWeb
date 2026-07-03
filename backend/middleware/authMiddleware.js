const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_jwt_auth';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(403).json({ message: 'Tidak ada token yang diberikan' });
  }

  const token = authHeader.split(' ')[1]; // Format "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'Format token salah' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token tidak valid atau sudah kadaluarsa' });
    }
    req.adminId = decoded.id;
    req.adminUsername = decoded.username;
    next();
  });
}

module.exports = verifyToken;

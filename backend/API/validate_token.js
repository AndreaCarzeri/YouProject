const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.header('token');

  if (!token) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  jwt.verify(token, 'ABFC', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token non valido' });
    }

    // Aggiungi le informazioni dell'utente decodificate alla richiesta
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;

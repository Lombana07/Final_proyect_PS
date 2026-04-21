const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'Token required' });
  }

  const token = authHeader.split(' ')[1]; // quita Bearer

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

 } catch (error) {
    console.log("Error de JWT:", error.message); // 👈 Añade esto para ver por qué falla
    return res.status(401).json({ message: 'Invalid token' });
}
};

exports.checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) { // 👈 FIX AQUÍ
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
};
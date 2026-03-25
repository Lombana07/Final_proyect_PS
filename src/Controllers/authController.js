const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 🔐 LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validar datos
    if (!username || !password) {
      return res.status(400).json({ message: 'Username y password requeridos' });
    }

    // 2. Buscar usuario
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 3. Comparar contraseña
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // 4. Generar token (IMPORTANTE: usar role)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role   // 👈 aquí respetamos tu modelo
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // 5. Respuesta
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en login', error });
  }
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🔍 buscar usuario
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 🔐 comparar contraseña
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // 🎟️ generar token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login exitoso',
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
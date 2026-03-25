const bcrypt = require('bcrypt');
const User = require('../Models/User');

// 🔥 CREATE USER
exports.create = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: 'Usuario creado',
      user
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔥 UPDATE USER
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (username) user.username = username;
    if (role) user.role = role;

    await user.save();

    res.json({
      message: 'Usuario actualizado',
      user
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔥 DELETE USER
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();

    res.json({ message: 'Usuario eliminado' });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
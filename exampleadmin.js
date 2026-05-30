require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./src/Models'); // ajusta la ruta si es necesario

async function createAdmin() {
  try {
    await sequelize.authenticate();

    const hashedPassword = await bcrypt.hash('0509', 10);

    const user = await User.create({
      username: 'WendyInfante',
      password: hashedPassword,
      role: 'ADMIN'
    });

    console.log('✅ ADMIN creado:', user.username);

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
// username: BILLER1
// password: 1234
// username: VIEWER1
// password: 4321
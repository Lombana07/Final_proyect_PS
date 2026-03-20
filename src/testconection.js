const sequelize = require('./Config/database');

async function testDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL exitosa');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

testDB();
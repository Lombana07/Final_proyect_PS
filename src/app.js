require('dotenv').config();
const express = require('express');
const { sequelize } = require('./Models');

const customerRoutes = require('./Routes/CustomerRoutes');
const userRoutes = require('./Routes/UserRoutes');

const app = express();

// 🔥 PRIMERO LOS MIDDLEWARES
app.use(express.json());

// 🔥 LUEGO LAS RUTAS
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);

// 🚀 INICIO DEL SERVIDOR
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB conectada');

    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas');

    app.listen(process.env.PORT || 3000, () => {
      console.log('🚀 Servidor corriendo en puerto 3000');
    });

  } catch (error) {
    console.error('❌ Error al iniciar:', error);
  }
}

startServer();
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./Models'); // ⚠️ revisa minúscula
const customerRoutes = require('./Routes/CustomerRoutes');
const authRoutes = require('./Routes/authRoutes');

const app = express(); // ✅ PRIMERO crear app

// Middlewares
app.use(express.json());

app.use('/api/auth', authRoutes);

// Rutas
app.use('/api/customers', customerRoutes);

// Inicio del servidor
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
require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize, Customer, Product } = require('./Models');

const customerRoutes = require('./Routes/CustomerRoutes');
const authRoutes = require('./Routes/authRoutes');
const productRoutes = require('./Routes/ProductRoutes');
const userRoutes = require('./Routes/UserRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

app.use(express.static(path.join(__dirname, 'Public')));

app.get('/', (req, res) => {
    res.render('login'); 
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
// Ruta para Clientes
app.get('/customers', async (req, res) => {
    const customers = await Customer.findAll({ where: { isActive: true } });
    res.render('customers', { customers });
});

// Ruta para Productos
app.get('/products', async (req, res) => {
    const products = await Product.findAll({ where: { isActive: true } });
    res.render('products', { products });
});
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

async function startServer() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        console.log('✅ DB conectada');

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`🚀 Servidor en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

startServer();
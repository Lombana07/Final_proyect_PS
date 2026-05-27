require('dotenv').config(); 
const express = require('express'); 
const path = require('path'); 
const { sequelize, Customer, Product, Invoice } = require('./Models'); [1-3]

// Importación de rutas de la API
const customerRoutes = require('./Routes/CustomerRoutes'); 
const authRoutes = require('./Routes/authRoutes'); 
const productRoutes = require('./Routes/ProductRoutes'); 
const userRoutes = require('./Routes/UserRoutes'); 
const invoiceRoutes = require('./Routes/InvoiceRoutes');
const reportRoutes = require('./Routes/ReportRoutes');

const app = express();

// Middlewares básicos
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); [1]

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'Views')); [4]
app.use(express.static(path.join(__dirname, 'Public'))); [4]

// --- RUTAS PARA LAS VISTAS (FRONTEND) ---

// Punto de entrada: Login
app.get('/', (req, res) => { 
    res.render('login'); 
}); [5]

// Dashboard: Estadísticas en tiempo real
app.get('/dashboard', async (req, res) => { 
    try { 
        // Consultas paralelas para optimizar la carga [4]
        const [totalInvoices, totalSales, totalTax, totalCustomers, latestInvoices] = await Promise.all([ 
            Invoice.count({ where: { status: 'ISSUED' } }), 
            // Se asegura el valor 0 si la suma devuelve null por falta de registros [4]
            Invoice.sum('total', { where: { status: 'ISSUED' } }) || 0, 
            Invoice.sum('tax', { where: { status: 'ISSUED' } }) || 0, 
            Customer.count({ where: { isActive: true } }), 
            Invoice.findAll({ 
                limit: 5, 
                order: [['id', 'DESC']], 
                include: [{ model: Customer, attributes: ['name'] }] 
            }) 
        ]);

        res.render('dashboard', { 
            totalInvoices, 
            totalSales, 
            totalTax, 
            totalCustomers, 
            latestInvoices 
        }); 
    } catch (error) { 
        console.error("Error en Dashboard:", error);
        res.status(500).send("Error al cargar el dashboard"); 
    } 
});

// Gestión de Facturas: Tablas de Emitidas y Anuladas
app.get('/invoices', async (req, res) => { 
    try { 
        const allInvoices = await Invoice.findAll({ 
            include: [{ model: Customer, attributes: ['name'] }],
            order: [['id', 'DESC']]
        });

        // Separación lógica para mostrar dos tablas en la vista
        const activeInvoices = allInvoices.filter(inv => inv.status === 'ISSUED');
        const annulledInvoices = allInvoices.filter(inv => inv.status === 'CANCELLED');

        // Datos necesarios para el modal de "Nueva Factura"
        const customers = await Customer.findAll({ where: { isActive: true } });
        const products = await Product.findAll({ where: { isActive: true } });

        res.render('invoices', { 
            activeInvoices, 
            annulledInvoices, 
            customers, 
            products 
        }); 
    } catch (error) { 
        res.status(500).send("Error al cargar la gestión de facturas"); 
    } 
});

// Gestión de Clientes: Tablas de Activos e Inactivos
app.get('/customers', async (req, res) => { 
    try {
        const activeCustomers = await Customer.findAll({ where: { isActive: true } }); 
        const inactiveCustomers = await Customer.findAll({ where: { isActive: false } }); 
        
        res.render('customers', { 
            activeCustomers, 
            inactiveCustomers 
        }); 
    } catch (error) {
        res.status(500).send("Error al cargar clientes");
    }
});

// Gestión de Productos: Tablas de Activos e Inactivos
app.get('/products', async (req, res) => { 
    try {
        const activeProducts = await Product.findAll({ where: { isActive: true } }); 
        const inactiveProducts = await Product.findAll({ where: { isActive: false } }); 
        
        res.render('products', { 
            activeProducts, 
            inactiveProducts 
        }); 
    } catch (error) {
        res.status(500).send("Error al cargar productos");
    }
});
// Ruta para renderizar la vista de Reportes
app.get('/reports', (req, res) => {
    res.render('reports'); 
});

// --- RUTAS DE LA API (BACKEND) ---
app.use('/api/invoices', invoiceRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/customers', customerRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes); [6]
app.use('/api/reports',reportRoutes); [7]

// --- INICIO DEL SERVIDOR ---
async function startServer() { 
    try { 
        // Verificación de conexión y sincronización con MySQL [6, 7]
        await sequelize.authenticate(); 
        await sequelize.sync({ alter: true }); 
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor FacturaX corriendo en http://localhost:${PORT}`);
        });
    } catch (error) { 
        console.error('Error al iniciar el servidor:', error);
    } 
}

startServer();
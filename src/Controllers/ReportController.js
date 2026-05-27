const service = require('../Services/ReportService');
const nodemailer = require('nodemailer');

exports.getTaxReport = async (req, res) => {
    try {
        // Extraemos los datos de la URL (?startDate=...&endDate=...)
        const { startDate, endDate } = req.query; 

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Se requieren fechas' });
        }

        // Delegamos la búsqueda al servicio para evitar errores de "Invoice is not defined" aquí
        const reportData = await service.getTaxReportData(startDate, endDate);

        res.json({
            success: true,
            data: reportData
        });
    } catch (error) {
        console.error("Error en controlador:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.sendReportByEmail = async (req, res) => {
    try {
        const { startDate, endDate, email } = req.body;
        
        // Obtenemos los datos procesados (IVA por producto y trazabilidad histórica)
        const reportData = await service.getTaxReportData(startDate, endDate);

        // 1. AQUÍ DEFINIMOS LA VARIABLE QUE TE DABA ERROR
        let csvContent = "";

            // ===============================
            // TABLA 1 - RESUMEN DIAN
            // ===============================
                
            csvContent += "REPORTE FISCAL DIAN\n";
            csvContent += `Periodo:;${startDate};a;${endDate}\n\n`;
                
            csvContent += "RESUMEN DE IMPUESTOS GENERADOS\n";
            csvContent += "Producto;Ventas Brutas;IVA (%);Total IVA;Estado Actual\n";
                
            // Recorremos taxSummary
            Object.entries(reportData.taxSummary).forEach(([name, info]) => {
            
                csvContent += `${name};${info.totalSales};${info.taxRate};${info.totalTax};${info.currentStatus}\n`;
            
            });
            
            
            // Espacios entre tablas
            csvContent += "\n\n";
            
            
            // ===============================
            // TABLA 2 - DETALLE FACTURAS
            // ===============================
            
            csvContent += "DETALLE DE FACTURAS DEL PERIODO\n";
            csvContent += "ID Factura;Fecha;Cliente;Total;Estado\n";
            
            // Recorremos invoices
            reportData.invoices.forEach(inv => {
            
                csvContent += `INV-${inv.id};` +
                    `${new Date(inv.date).toLocaleDateString()};` +
                    `${inv.Customer ? inv.Customer.name : 'Cliente Eliminado'};` +
                    `${inv.total};` +
                    `${inv.status}\n`;
            
            });

        // Llenamos el contenido del CSV recorriendo el taxSummary
        Object.entries(reportData.taxSummary).forEach(([name, info]) => {
            // Usamos punto y coma para que Excel lo abra correctamente
            csvContent += `${name};${info.totalSales};${info.taxRate};${info.totalTax};${info.currentStatus}\n`;
        });

        // 2. Configuración del transporte de correo (Información externa)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
        });

        const mailOptions = {
            from: 'davidlombanayepes@gmail.com',
            to: email,
            subject: `Reporte Fiscal DIAN (${startDate} a ${endDate})`,
            text: `Hola, se adjunta el reporte de impuestos generado para el periodo solicitado.`,
            attachments: [
                {
                    filename: `Reporte_DIAN_${startDate}_${endDate}.csv`,
                    content: csvContent 
                }
            ]
        };

        // 3. Enviamos el correo
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: `Reporte con CSV enviado con éxito a ${email}` });

    } catch (error) {
        // Este catch es el que te está devolviendo el mensaje de error que ves
        console.error("Error en envío de reporte:", error);
        res.status(500).json({ message: "No se pudo enviar el archivo: " + error.message });
    }
};
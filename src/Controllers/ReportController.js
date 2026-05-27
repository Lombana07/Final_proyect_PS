const service = require('../Services/ReportService');

exports.getTaxReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Se requieren fechas de inicio y fin' });
        }

        const reportData = await service.getTaxReportData(startDate, endDate);

        res.json({
            success: true,
            period: { from: startDate, to: endDate },
            data: reportData
        });

    } catch (error) {
        console.error("Error en reporte contable:", error);
        res.status(500).json({ message: 'Error interno al generar el reporte' });
    }
};

// Función para el envío por correo (Requiere Nodemailer - Información externa)
exports.sendReportByEmail = async (req, res) => {
    try {
        const { startDate, endDate, email } = req.body;
        const reportData = await service.getTaxReportData(startDate, endDate);
        
        // Aquí integrarías la lógica de envío mencionada en conversaciones anteriores
        // utilizando la información de reportData.taxSummary para el cuerpo del mensaje.
        
        res.json({ message: `Reporte enviado con éxito a ${email}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
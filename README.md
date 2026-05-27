# Sistema de Facturación Electrónica Simplificado - FacturaX

**Proyecto Final: Pruebas de Software**  
**Integrantes:** Wendy Infante, David Lombada

## 📌 Finalidad del Proyecto
Este sistema fue diseñado para una empresa comercial que requiere sistematizar su proceso de facturación, garantizando el **control de ventas**, el **cálculo correcto de impuestos (IVA)** y la **trazabilidad histórica** de todas las transacciones .

## 🚀 Requerimientos Funcionales
- **Gestión de Maestros:** Administración de clientes y productos con desactivación lógica para mantener historial .
- **Facturación:** Creación de facturas con consecutivo automático, cálculo de subtotal e IVA, y estados (Emitida/Anulada).
- **Reportes:** Consulta por rango de fechas, resumen de impuestos para la DIAN y exportación a CSV.
- **Seguridad:** Autenticación mediante JWT y control de acceso basado en roles (ADMIN, BILLER, VIEWER).

## 🏗️ Arquitectura del Software
El proyecto sigue una arquitectura de capas para asegurar la escalabilidad y facilidad de pruebas:
1. **Routes:** Definición de endpoints y protección con middlewares.
2. **Controllers:** Manejo de la lógica de petición/respuesta.
3. **Services:** Lógica de negocio y procesamiento de datos.
4. **Models:** Definición de esquemas y relaciones con Sequelize.
5. **Views:** Interfaz de usuario dinámica utilizando EJS.

## 🛠️ Tecnologías Utilizadas
- **Backend:** Node.js, Express.
- **Base de Datos:** Sequelize (ORM) con MySQL/PostgreSQL.
- **Vistas:** EJS.
- **Autenticación:** JSON Web Token (JWT).
- **Reportes:** Nodemailer para envío de consolidados fiscales.

## ⚙️ Instalación y Configuración
1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Configurar el archivo `.env` con las credenciales de la base de datos, el `JWT_SECRET` y el gmail con la de contraseña de aplicacion del nodemailer.
4. Iniciar el servidor con `npm start` o `npm run dev`.
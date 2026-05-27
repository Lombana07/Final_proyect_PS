const { test, expect } = require('@playwright/test');

test.describe('CRUD Admin - Productos y Clientes', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');

    await page.fill('#username', 'DavidLombana');
    await page.fill('#password', '070406');
    await page.locator('.btn-login').click();

    // esperar navegación real
    await page.waitForURL('**/dashboard');
  });

  // ==========================
  // PRODUCTOS
  // ==========================

  test('Admin debe crear producto', async ({ page }) => {
    const nombre = 'Laptop QA';

    await page.locator('a:has-text("Productos")').click();

    await page.locator('text=+ Nuevo Producto').click();
    await page.fill('#createName', nombre);
    await page.fill('#createPrice', '2500');
    await page.fill('#createTax', '19');

    await page.locator('text=Guardar Producto').click();

    await expect(page.locator('table')).toContainText(nombre);
  });

  test('Admin debe actualizar producto', async ({ page }) => {
    await page.locator('a:has-text("Productos")').click();

    await page.locator('button:has-text("Editar")').first().click();

    await page.fill('#editName', 'Laptop Editada');
    await page.fill('#editPrice', '3000');

    await page.locator('button:has-text("Actualizar Producto")').click();

    await expect(page.locator('table')).toContainText('Laptop Editada');
  });

  test('Admin debe desactivar producto', async ({ page }) => {
    await page.locator('a:has-text("Productos")').click();

    await page.locator('button:has-text("Desactivar")').first().click();

    // esperar que la tabla cambie
    await page.waitForTimeout(1000);
  });

  // ==========================
  // CLIENTES
  // ==========================

  test('Admin debe crear cliente', async ({ page }) => {
    const cliente = 'Cliente QA';

    await page.locator('a:has-text("Clientes")').click();

    await page.locator('text=+ Nuevo Cliente').click();

    await page.fill('#createName', cliente);
    await page.fill('#createDocumentType', 'CC'); // ES INPUT
    await page.fill('#createDocumentNumber', '123456789');

    await page.locator('text=Guardar Cliente').click();

    await expect(page.locator('table')).toContainText(cliente);
  });

  test('Admin debe actualizar cliente', async ({ page }) => {
    await page.locator('a:has-text("Clientes")').click();

    await page.locator('button:has-text("Editar")').first().click();

    await page.fill('#editName', 'Cliente Editado');

    await page.locator('button:has-text("Actualizar Cliente")').click();

    await expect(page.locator('table')).toContainText('Cliente Editado');
  });

  test('Admin debe desactivar cliente', async ({ page }) => {
    await page.locator('a:has-text("Clientes")').click();

    await page.locator('button:has-text("Desactivar")').first().click();

    await page.waitForTimeout(1000);
  });

});
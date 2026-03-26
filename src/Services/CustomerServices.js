const Customer = require('../Models/Customer');

exports.createCustomer = async (data) => {
  const { name, documentType, documentNumber } = data;

  if (!name || !documentType || !documentNumber) {
    throw new Error('Missing required fields');
  }

  return await Customer.create({
    name,
    documentType,
    documentNumber
  });
};

exports.getCustomers = async () => {
  return await Customer.findAll({
    where: { isActive: true } // ✅
  });
};

exports.getCustomerById = async (id) => {
  const customer = await Customer.findByPk(id);

  if (!customer || !customer.isActive) {
    throw new Error('Customer not found');
  }

  return customer;
};

exports.updateCustomer = async (id, data) => {
  const customer = await Customer.findByPk(id);

  if (!customer) throw new Error('Customer not found');

  return await customer.update(data);
};

exports.disableCustomer = async (id) => {
  const customer = await Customer.findByPk(id);

  if (!customer) throw new Error('Customer not found');

  return await customer.update({ isActive: false }); // ✅
};
const Customer = require('../Models/Customer');

exports.createCustomer = async (data) => {
  const { name, document_type, document_number } = data;

  if (!name || !document_type || !document_number) {
    throw new Error('Missing required fields');
  }

  return await Customer.create({
    name,
    document_type,
    document_number
  });
};

exports.getCustomers = async () => {
  return await Customer.findAll({
    where: { status: true }
  });
};

exports.getCustomerById = async (id) => {
  const customer = await Customer.findByPk(id);

  if (!customer) throw new Error('Customer not found');

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

  return await customer.update({ status: false });
};
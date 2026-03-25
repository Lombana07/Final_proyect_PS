const service = require('../Services/CustomerServices');

exports.create = async (req, res) => {
  try {
    const customer = await service.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const customers = await service.getCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const customer = await service.getCustomerById(req.params.id);
    res.json(customer);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const customer = await service.updateCustomer(req.params.id, req.body);
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.disable = async (req, res) => {
  try {
    const customer = await service.disableCustomer(req.params.id);
    res.json({ message: 'Customer disabled', customer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
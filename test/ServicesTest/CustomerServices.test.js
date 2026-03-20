const service = require('../../src/services/customerservice');
const Customer = require('../../src/Models/customer.model');

jest.mock('../../src/models/customer.model');

describe('Customer Service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a customer', async () => {
    const mockData = {
      name: 'David',
      document_type: 'CC',
      document_number: '123'
    };

    Customer.create.mockResolvedValue(mockData);

    const result = await service.createCustomer(mockData);

    expect(Customer.create).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockData);
  });

  test('should throw error if missing fields', async () => {
    await expect(service.createCustomer({}))
      .rejects
      .toThrow('Missing required fields');
  });

  test('should return customers', async () => {
    const mockCustomers = [{ id: 1, name: 'David' }];

    Customer.findAll.mockResolvedValue(mockCustomers);

    const result = await service.getCustomers();

    expect(Customer.findAll).toHaveBeenCalledWith({
      where: { status: true }
    });

    expect(result).toEqual(mockCustomers);
  });

  test('should throw error if customer not found', async () => {
    Customer.findByPk.mockResolvedValue(null);

    await expect(service.getCustomerById(1))
      .rejects
      .toThrow('Customer not found');
  });

});
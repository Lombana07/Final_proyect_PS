const service = require('../../src/Services/CustomerServices');
const Customer = require('../../src/Models/Customer');

jest.mock('../../src/Models/Customer');

describe('Customer Service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a customer', async () => {
    const mockData = {
      name: 'David',
      documentType: 'CC',
      documentNumber: '123'
    };

    const createdCustomer = {
      id: 1,
      ...mockData,
      isActive: true
    };

    Customer.create.mockResolvedValue(createdCustomer);

    const result = await service.createCustomer(mockData);

    expect(Customer.create).toHaveBeenCalledWith({
      name: 'David',
      documentType: 'CC',
      documentNumber: '123',
    });

    expect(result).toEqual(createdCustomer);
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
      where: { isActive: true }
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
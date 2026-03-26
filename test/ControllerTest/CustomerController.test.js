const controller = require('../../src/Controllers/CustomerController');
const service = require('../../src/Services/CustomerServices');

jest.mock('../../src/Services/CustomerServices');

describe('Customer Controller', () => {

  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('should create customer', async () => {
    const mockCustomer = { id: 1, name: 'David' };

    req.body = mockCustomer;
    service.createCustomer.mockResolvedValue(mockCustomer);

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCustomer);
  });

  test('should return error on create', async () => {
    service.createCustomer.mockRejectedValue(new Error('Error'));

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});
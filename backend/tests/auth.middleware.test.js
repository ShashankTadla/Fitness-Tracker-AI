const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {

  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  test('Should reject request without token', () => {

    const verifyToken = require('../middleware/auth');

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No token provided'
    });

  });

  test('Should accept valid token', () => {

    req.headers.authorization =
      'Bearer valid-token';

    jwt.verify.mockReturnValue({
      id: 1,
      email: 'test@test.com'
    });

    const verifyToken = require('../middleware/auth');

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('Should reject invalid token', () => {

    req.headers.authorization =
      'Bearer invalid-token';

    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid');
    });

    const verifyToken = require('../middleware/auth');

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid token'
    });

  });

});
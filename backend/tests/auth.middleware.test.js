const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken'); //"Don't use the real JWT library. I'll fake its behavior myself."

describe('Auth Middleware', () => {

//normally express gives req,res,next to middleware.
  let req;
  let res;
  let next;

  beforeEach(() => {    //Runs before EVERY test.
    req = {
      headers: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),  //fake version of: res.status(401).json(...)
      json: jest.fn()    //fake version of: res.json(...)
    };

    next = jest.fn();  //to record all the details like called?how many tkmes? what arguments?

    jest.clearAllMocks();  ///clear all counts before each test
  });

  test('Should reject request without token', () => {

    const verifyToken = require('../middleware/auth');

    verifyToken(req, res, next);  //res.status(401).json({
                                  //  message: 'No token provided'
                                  //}); -> expected result

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No token provided'
    });

  });

  test('Should accept valid token', () => {

    req.headers.authorization =
      'Bearer valid-token';

    jwt.verify.mockReturnValue({     //jwt.verify(token, secret) 
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

// note:
// Use toBe():
// When checking a value

// Use toHaveBeenCalledWith()
// When checking how a mock function was called

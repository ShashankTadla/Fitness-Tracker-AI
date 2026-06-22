const bcrypt = require('bcryptjs');  //hashes passwords
const jwt = require('jsonwebtoken');

const authController = require('../controllers/authController');
const db = require('../models');

jest.mock('../models', () => ({   //mock db
  user: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  }
}));

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {

  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('Register new user successfully', async () => {

    req.body = {
      username: 'shashank',
      email: 'test@test.com',
      password: 'password123',
      age: 20,
      height: 170,
      weight: 70
    };

    db.user.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');

    db.user.create.mockResolvedValue({
      id: 1
    });

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('Register fails when username exists', async () => {

  req.body = {
    username: 'shashank',
    email: 'test@test.com'
  };

  db.user.findOne.mockResolvedValueOnce({
    id: 1
  });

  await authController.register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);

});

test('Register fails when email exists', async () => {

  req.body = {
    username: 'newuser',
    email: 'test@test.com'
  };

  db.user.findOne
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce({ id: 1 });

  await authController.register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});

test('Login success', async () => {

  req.body = {
    email: 'test@test.com',
    password: 'password123'
  };

  db.user.findOne.mockResolvedValue({
    id: 1,
    email: 'test@test.com',
    username: 'shashank',
    password: 'hashedPassword'
  });

  bcrypt.compare.mockResolvedValue(true);

  jwt.sign.mockReturnValue('token123');

  await authController.login(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
});

test('Login user not found', async () => {

  db.user.findOne.mockResolvedValue(null);

  await authController.login(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
});

test('Login invalid password', async () => {

  db.user.findOne.mockResolvedValue({
    password: 'hashedPassword'
  });

  bcrypt.compare.mockResolvedValue(false);

  await authController.login(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
});

test('Get profile success', async () => {

  req.user = { id: 1 };

  db.user.findByPk.mockResolvedValue({
    id: 1,
    username: 'shashank'
  });

  await authController.getProfile(req, res);

  expect(res.json).toHaveBeenCalled();
});

test('Profile not found', async () => {

  req.user = { id: 1 };

  db.user.findByPk.mockResolvedValue(null);

  await authController.getProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
});

});


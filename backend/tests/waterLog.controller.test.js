const db = require('../models');
const waterController = require('../controllers/waterLog.controller');

jest.mock('../models', () => ({
  water_log: {
    findOrCreate: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  Sequelize: {
    Op: {
      between: Symbol('between')
    }
  }
}));

describe('Water Log Controller', () => {

  let req;
  let res;

  beforeEach(() => {
    req = {
      user: { id: 1 },
      body: {},
      query: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('Create new water log', async () => {

    req.body = {
      date: '2026-06-19',
      waterIntake: 3000
    };

    db.water_log.findOrCreate.mockResolvedValue([
      {},
      true
    ]);

    await waterController.createOrUpdateLog(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Log created'
    });

  });

  test('Get daily water log', async () => {

    const mockLog = {
      waterIntake: 2500
    };

    req.query.date = '2026-06-19';

    db.water_log.findOne.mockResolvedValue(mockLog);

    await waterController.getDailyLog(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLog);

  });

  test('Get weekly water stats', async () => {

    const mockLogs = [
      { waterIntake: 2000 },
      { waterIntake: 2500 }
    ];

    req.query.endDate = '2026-06-19';

    db.water_log.findAll.mockResolvedValue(mockLogs);

    await waterController.getWeeklyStats(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLogs);

  });

});
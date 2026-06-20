const db = require('../models');
const sleepController = require('../controllers/sleepLog.controller');

jest.mock('../models', () => ({
  sleep_log: {
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

describe('Sleep Log Controller', () => {
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

  test('Create sleep log', async () => {
    req.body = {
      date: '2026-06-19',
      sleepHours: 8
    };

    db.sleep_log.findOrCreate.mockResolvedValue([{}, true]);

    await sleepController.createOrUpdateLog(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Sleep log created'
    });
  });

  test('Get daily sleep log', async () => {
    const log = { sleepHours: 8 };

    req.query.date = '2026-06-19';

    db.sleep_log.findOne.mockResolvedValue(log);

    await sleepController.getDailyLog(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(log);
  });

  test('Get weekly sleep stats', async () => {
    const logs = [
      { sleepHours: 7 },
      { sleepHours: 8 }
    ];

    req.query.endDate = '2026-06-19';

    db.sleep_log.findAll.mockResolvedValue(logs);

    await sleepController.getWeeklyStats(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(logs);
  });

  test('Handle database error', async () => {
    db.sleep_log.findOne.mockRejectedValue(
      new Error('Database failed')
    );

    await sleepController.getDailyLog(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
const db = require('../models');
const calorieController = require('../controllers/calorieLog.controller');

jest.mock('../models', () => ({
  calorie_log: {
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

describe('Calorie Log Controller', () => {
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

  test('Create calorie log', async () => {
    req.body = {
      date: '2026-06-19',
      calorieIntake: 2500
    };

    db.calorie_log.findOrCreate.mockResolvedValue([{}, true]);

    await calorieController.createOrUpdateLog(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Log created'
    });
  });

  test('Get daily calorie log', async () => {
    const log = { calorieIntake: 2500 };

    req.query.date = '2026-06-19';

    db.calorie_log.findOne.mockResolvedValue(log);

    await calorieController.getDailyLog(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(log);
  });

  test('Get weekly calorie stats', async () => {
    const logs = [
      { calorieIntake: 2300 },
      { calorieIntake: 2500 }
    ];

    req.query.endDate = '2026-06-19';

    db.calorie_log.findAll.mockResolvedValue(logs);

    await calorieController.getWeeklyStats(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(logs);
  });

  test('Handle database error', async () => {
    db.calorie_log.findOne.mockRejectedValue(
      new Error('Database failed')
    );

    await calorieController.getDailyLog(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
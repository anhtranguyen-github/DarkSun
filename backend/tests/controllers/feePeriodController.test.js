const httpMocks = require('node-mocks-http');

// Mock models BEFORE requiring controller
jest.mock('../../models', () => ({
    FeePeriod: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
}));

// Mock asyncHandler to just pass through
jest.mock('../../middleware/errorMiddleware', () => ({
    asyncHandler: (fn) => fn,
}));

const { getAllFeePeriods, createFeePeriod, getFeePeriodById } = require('../../controllers/feePeriodController');
const { FeePeriod } = require('../../models');

describe('Fee Period Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getAllFeePeriods', () => {
        test('should return list of fee periods', async () => {
            FeePeriod.findAll.mockResolvedValue([
                { id: 1, name: 'Tháng 1/2024' },
                { id: 2, name: 'Tháng 2/2024' }
            ]);

            await getAllFeePeriods(req, res, next);

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res._getData()).data).toHaveLength(2);
        });
    });

    describe('createFeePeriod', () => {
        test('should create fee period with valid data', async () => {
            req.body = {
                name: 'Tháng 3/2024',
                startDate: '2024-03-01',
                endDate: '2024-03-31'
            };
            FeePeriod.create.mockResolvedValue({ id: 3, ...req.body });

            await createFeePeriod(req, res, next);

            expect(FeePeriod.create).toHaveBeenCalled();
            expect(res.statusCode).toBe(201);
        });

        test('should return 400 if missing required fields', async () => {
            req.body = { name: 'Test' }; // Missing dates

            await createFeePeriod(req, res, next);

            expect(res.statusCode).toBe(400);
        });

        test('should return 400 if start date is after end date', async () => {
            req.body = {
                name: 'Invalid Period',
                startDate: '2024-03-31',
                endDate: '2024-03-01' // End before start
            };

            await createFeePeriod(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(JSON.parse(res._getData()).message).toMatch(/trước/);
        });
    });

    describe('getFeePeriodById', () => {
        test('should return fee period if found', async () => {
            req.params = { id: 1 };
            FeePeriod.findByPk.mockResolvedValue({ id: 1, name: 'Tháng 1' });

            await getFeePeriodById(req, res, next);

            expect(res.statusCode).toBe(200);
        });

        test('should return 404 if period not found', async () => {
            req.params = { id: 999 };
            FeePeriod.findByPk.mockResolvedValue(null);

            await getFeePeriodById(req, res, next);

            expect(res.statusCode).toBe(404);
        });
    });
});

const httpMocks = require('node-mocks-http');

// Mock models BEFORE requiring controller
jest.mock('../../models', () => ({
    FeeType: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
    PeriodFee: {
        count: jest.fn(),
    },
    InvoiceDetail: {
        count: jest.fn(),
    },
}));

// Mock asyncHandler to just pass through
jest.mock('../../middleware/errorMiddleware', () => ({
    asyncHandler: (fn) => fn,
}));

const { getAllFeeTypes, createFeeType, deleteFeeType } = require('../../controllers/financeController');
const { FeeType, PeriodFee, InvoiceDetail } = require('../../models');

describe('Finance Controller (FeeType)', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('getAllFeeTypes', () => {
        test('should return list of fee types', async () => {
            FeeType.findAll.mockResolvedValue([
                { id: 1, name: 'Phí vệ sinh', price: 6000 },
                { id: 2, name: 'Phí gửi xe máy', price: 70000 }
            ]);

            await getAllFeeTypes(req, res, next);

            expect(res.statusCode).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data.data).toHaveLength(2);
        });
    });

    describe('createFeeType', () => {
        test('should create fee type with valid data', async () => {
            req.body = { name: 'Phí mới', unit: 'VND/tháng', price: 50000 };
            FeeType.create.mockResolvedValue({ id: 10, ...req.body });

            await createFeeType(req, res, next);

            expect(FeeType.create).toHaveBeenCalled();
            expect(res.statusCode).toBe(201);
        });

        test('should return 400 if missing required fields', async () => {
            req.body = { name: 'Test' }; // Missing unit and price

            await createFeeType(req, res, next);

            expect(res.statusCode).toBe(400);
        });
    });

    describe('deleteFeeType', () => {
        test('should prevent delete if fee type is in use by PeriodFee', async () => {
            req.params = { id: 1 };
            FeeType.findByPk.mockResolvedValue({ id: 1 });
            PeriodFee.count.mockResolvedValue(5); // In use by 5 periods

            await deleteFeeType(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(JSON.parse(res._getData()).message).toMatch(/Không thể xóa/);
        });

        test('should prevent delete if fee type is in use by InvoiceDetail', async () => {
            req.params = { id: 1 };
            FeeType.findByPk.mockResolvedValue({ id: 1 });
            PeriodFee.count.mockResolvedValue(0);
            InvoiceDetail.count.mockResolvedValue(10); // In use by invoices

            await deleteFeeType(req, res, next);

            expect(res.statusCode).toBe(400);
        });

        test('should delete if not in use', async () => {
            req.params = { id: 1 };
            const mockFeeType = { id: 1, destroy: jest.fn() };
            FeeType.findByPk.mockResolvedValue(mockFeeType);
            PeriodFee.count.mockResolvedValue(0);
            InvoiceDetail.count.mockResolvedValue(0);

            await deleteFeeType(req, res, next);

            expect(mockFeeType.destroy).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
        });

        test('should return 404 if fee type not found', async () => {
            req.params = { id: 999 };
            FeeType.findByPk.mockResolvedValue(null);

            await deleteFeeType(req, res, next);

            expect(res.statusCode).toBe(404);
        });
    });
});

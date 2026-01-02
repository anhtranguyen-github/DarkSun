const { recordPayment, generateInvoicesForPeriod } = require('../../controllers/invoiceController');
const { Invoice, FeePeriod, Household, Resident, Vehicle, InvoiceDetail, sequelize } = require('../../models');
const httpMocks = require('node-mocks-http');

jest.mock('../../models', () => ({
    Invoice: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
    },
    InvoiceDetail: {
        create: jest.fn(),
    },
    FeePeriod: {
        findByPk: jest.fn(),
    },
    Household: {
        findAll: jest.fn(),
    },
    Resident: {},
    Vehicle: {},
    User: {},
    FeeType: {},
    sequelize: {
        transaction: jest.fn().mockImplementation(() => ({
            commit: jest.fn(),
            rollback: jest.fn(),
        })),
    },
}));

describe('Invoice Controller', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    describe('recordPayment', () => {
        test('should record payment and update invoice status', async () => {
            req.params = { invoiceId: 1 };
            req.body = { paymentMethod: 'ChuyenKhoan' };
            req.user = { id: 10 };

            const mockInvoice = {
                id: 1,
                status: 'unpaid',
                update: jest.fn()
            };
            Invoice.findByPk.mockResolvedValue(mockInvoice);

            await recordPayment(req, res);

            expect(mockInvoice.update).toHaveBeenCalledWith(expect.objectContaining({
                status: 'paid',
                cashierId: 10
            }));
            expect(res.statusCode).toBe(200);
        });

        test('should return 404 if invoice not found', async () => {
            req.params = { invoiceId: 999 };
            req.user = { id: 1 };
            Invoice.findByPk.mockResolvedValue(null);

            await recordPayment(req, res);
            expect(res.statusCode).toBe(404);
        });

        test('should return 400 if already paid', async () => {
            req.params = { invoiceId: 1 };
            req.user = { id: 1 };
            Invoice.findByPk.mockResolvedValue({ id: 1, status: 'paid' });

            await recordPayment(req, res);
            expect(res.statusCode).toBe(400);
        });
    });

    describe('generateInvoicesForPeriod', () => {
        test('should create invoices for households with residents', async () => {
            req.params = { feePeriodId: 1 };

            FeePeriod.findByPk.mockResolvedValue({ id: 1 });
            Household.findAll.mockResolvedValue([
                {
                    id: 10,
                    Residents: [{ id: 1 }, { id: 2 }], // 2 residents = 12000 VND
                    Vehicles: [{ type: 'XeMay' }]      // 1 moto = 70000 VND
                }
            ]);
            Invoice.findOne.mockResolvedValue(null); // No existing invoice
            Invoice.create.mockResolvedValue({ id: 100 });

            await generateInvoicesForPeriod(req, res);

            expect(Invoice.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    householdId: 10,
                    totalAmount: 6000 * 2 + 70000 // 82000
                }),
                expect.anything()
            );
            expect(res.statusCode).toBe(201);
        });

        test('should skip if invoice already exists', async () => {
            req.params = { feePeriodId: 1 };
            FeePeriod.findByPk.mockResolvedValue({ id: 1 });
            Household.findAll.mockResolvedValue([{ id: 10, Residents: [], Vehicles: [] }]);
            Invoice.findOne.mockResolvedValue({ id: 50 }); // Existing

            await generateInvoicesForPeriod(req, res);

            expect(Invoice.create).not.toHaveBeenCalled();
        });
    });
});

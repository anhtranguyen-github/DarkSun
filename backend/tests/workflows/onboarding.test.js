/**
 * Integration/Coordination Tests
 * 
 * These tests verify that multiple features work together correctly.
 * They simulate real-world workflows where actions in one module affect another.
 */

const {
    Household,
    Resident,
    TemporaryResidence,
    Vehicle,
    Invoice,
    InvoiceDetail,
    FeePeriod,
    FeeType
} = require('../../models');
const httpMocks = require('node-mocks-http');

// Import Controllers
const householdController = require('../../controllers/householdController');
const residentController = require('../../controllers/residentController');
const vehicleController = require('../../controllers/vehicleController');
const invoiceController = require('../../controllers/invoiceController');
const tempResidenceController = require('../../controllers/tempResidenceController');

// Mock all models
jest.mock('../../models', () => ({
    Household: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
    },
    Resident: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
    },
    Vehicle: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
    },
    TemporaryResidence: {
        create: jest.fn(),
        findAll: jest.fn(),
    },
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
    FeeType: {},
    User: {},
    sequelize: {
        transaction: jest.fn().mockImplementation(() => ({
            commit: jest.fn(),
            rollback: jest.fn(),
        })),
    },
}));

describe('Workflow: Household Creation -> Resident -> Vehicle -> Invoice', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Complete household onboarding workflow', async () => {
        // STEP 1: Create Household with Owner
        const createHouseholdReq = httpMocks.createRequest({
            body: {
                householdCode: 'HK-TEST-001',
                addressStreet: '123 Test Street',
                addressWard: 'Test Ward',
                addressDistrict: 'Test District',
                owner: { fullName: 'Owner Name', idCardNumber: '001122334455' }
            }
        });
        const createHouseholdRes = httpMocks.createResponse();

        const mockHousehold = { id: 100, update: jest.fn() };
        const mockOwner = { id: 200 };
        Household.create.mockResolvedValue(mockHousehold);
        Resident.create.mockResolvedValue(mockOwner);

        await householdController.createHousehold(createHouseholdReq, createHouseholdRes);
        expect(createHouseholdRes.statusCode).toBe(201);

        // STEP 2: Add another Resident to the Household
        const addResidentReq = httpMocks.createRequest({
            body: {
                householdId: 100,
                fullName: 'Family Member',
                dateOfBirth: '2000-01-01',
                gender: 'Nam',
                relationship: 'Con'
            }
        });
        const addResidentRes = httpMocks.createResponse();

        Household.findByPk.mockResolvedValue({ id: 100 });
        Resident.create.mockResolvedValue({ id: 201 });

        await residentController.createResident(addResidentReq, addResidentRes);
        expect(addResidentRes.statusCode).toBe(201);

        // STEP 3: Register Vehicle for the Household
        const registerVehicleReq = httpMocks.createRequest({
            body: {
                householdId: 100,
                licensePlate: '30A-99999',
                type: 'XeMay',
                name: 'Honda Wave'
            }
        });
        const registerVehicleRes = httpMocks.createResponse();

        Household.findByPk.mockResolvedValue({ id: 100 });
        Vehicle.create.mockResolvedValue({ id: 300 });

        await vehicleController.registerVehicle(registerVehicleReq, registerVehicleRes);
        expect(registerVehicleRes.statusCode).toBe(201);

        // STEP 4: Generate Invoice (Should calculate 2 Residents + 1 Moto)
        const generateInvoiceReq = httpMocks.createRequest({
            params: { feePeriodId: 1 }
        });
        const generateInvoiceRes = httpMocks.createResponse();

        FeePeriod.findByPk.mockResolvedValue({ id: 1 });
        Household.findAll.mockResolvedValue([{
            id: 100,
            Residents: [{ id: 200 }, { id: 201 }],
            Vehicles: [{ type: 'XeMay' }]
        }]);
        Invoice.findOne.mockResolvedValue(null);
        Invoice.create.mockResolvedValue({ id: 400 });

        await invoiceController.generateInvoicesForPeriod(generateInvoiceReq, generateInvoiceRes);

        expect(Invoice.create).toHaveBeenCalledWith(
            expect.objectContaining({
                householdId: 100,
                totalAmount: 6000 * 2 + 70000 // 82000 VND
            }),
            expect.anything()
        );
        expect(generateInvoiceRes.statusCode).toBe(201);
    });
});

describe('Workflow: Resident Temporary Absence', () => {
    test('Register temporary absence for resident', async () => {
        const req = httpMocks.createRequest({
            body: {
                residentId: 1,
                type: 'TamVang',
                startDate: '2024-06-01',
                endDate: '2024-12-01',
                reason: 'Đi công tác dài hạn'
            }
        });
        const res = httpMocks.createResponse();

        Resident.findByPk.mockResolvedValue({ id: 1 });
        TemporaryResidence.create.mockResolvedValue({ id: 10 });

        await tempResidenceController.registerTemporaryResidence(req, res);

        expect(TemporaryResidence.create).toHaveBeenCalledWith(expect.objectContaining({
            type: 'TamVang',
            reason: 'Đi công tác dài hạn'
        }));
        expect(res.statusCode).toBe(201);
    });
});

describe('Workflow: Payment Recording', () => {
    test('Accountant records payment for unpaid invoice', async () => {
        const req = httpMocks.createRequest({
            params: { invoiceId: 1 },
            body: { paymentMethod: 'TienMat', notes: 'Thu tại nhà' },
            user: { id: 5 } // Cashier ID
        });
        const res = httpMocks.createResponse();

        const mockInvoice = { id: 1, status: 'unpaid', update: jest.fn() };
        Invoice.findByPk.mockResolvedValue(mockInvoice);

        await invoiceController.recordPayment(req, res);

        expect(mockInvoice.update).toHaveBeenCalledWith(expect.objectContaining({
            status: 'paid',
            paymentMethod: 'TienMat',
            cashierId: 5
        }));
        expect(res.statusCode).toBe(200);
    });
});

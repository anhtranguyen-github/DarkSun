const { createHousehold, getAllHouseholds } = require('../../controllers/householdController');
const { Household, Resident, sequelize } = require('../../models');
const httpMocks = require('node-mocks-http');

// Mock Models
jest.mock('../../models', () => ({
    Household: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
    Resident: {
        create: jest.fn(),
        findByPk: jest.fn(),
    },
    Vehicle: {},
    User: {},
    sequelize: {
        transaction: jest.fn().mockImplementation(() => ({
            commit: jest.fn(),
            rollback: jest.fn(),
        })),
    },
}));

describe('Household Controller', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    describe('createHousehold', () => {
        test('should create household and owner transactionally', async () => {
            req.body = {
                householdCode: 'HK001',
                addressStreet: '123 Main',
                addressWard: 'W1',
                addressDistrict: 'D1',
                owner: {
                    fullName: 'Nguyen Van A',
                    idCardNumber: '0123456789'
                }
            };

            const mockHousehold = { id: 10, update: jest.fn() };
            const mockOwner = { id: 99 };

            Household.create.mockResolvedValue(mockHousehold);
            Resident.create.mockResolvedValue(mockOwner);

            await createHousehold(req, res);

            // Expect Transaction Steps
            expect(sequelize.transaction).toHaveBeenCalled();
            expect(Household.create).toHaveBeenCalledWith(expect.objectContaining({ householdCode: 'HK001' }), expect.anything());
            expect(Resident.create).toHaveBeenCalledWith(expect.objectContaining({ householdId: 10 }), expect.anything());
            expect(mockHousehold.update).toHaveBeenCalledWith({ ownerId: 99 }, expect.anything());

            expect(res.statusCode).toBe(201);
        });

        test('should return 400 if missing owner info', async () => {
            req.body = { householdCode: 'HK002' }; // No owner
            await createHousehold(req, res);
            expect(res.statusCode).toBe(400);
        });
    });

    describe('getAllHouseholds', () => {
        test('should return list of households', async () => {
            Household.findAll.mockResolvedValue([{ id: 1, householdCode: 'HK1' }]);

            await getAllHouseholds(req, res);

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res._getData()).data).toHaveLength(1);
        });
    });

    // NEW TEST FOR DETAILS
    const { getHouseholdDetails } = require('../../controllers/householdController');
    describe('getHouseholdDetails', () => {
        test('should return 404 if household not found', async () => {
            req.params = { id: 999 };
            Household.findByPk.mockResolvedValue(null);

            await getHouseholdDetails(req, res);
            expect(res.statusCode).toBe(404);
        });

        test('should return details with relations', async () => {
            req.params = { id: 1 };
            const mockData = {
                id: 1,
                householdCode: 'HK001',
                Owner: { fullName: 'Owner' },
                Residents: [{ id: 1, fullName: 'Owner' }],
                Vehicles: []
            };
            Household.findByPk.mockResolvedValue(mockData);

            await getHouseholdDetails(req, res);

            expect(res.statusCode).toBe(200);
            const data = JSON.parse(res._getData()).data;
            expect(data.householdCode).toBe('HK001');
            expect(data.Residents).toBeDefined();
        });
    });
});

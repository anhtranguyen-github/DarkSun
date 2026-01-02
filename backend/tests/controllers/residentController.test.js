const { createResident, getAllResidents } = require('../../controllers/residentController');
const { Resident, Household } = require('../../models');
const httpMocks = require('node-mocks-http');

jest.mock('../../models', () => ({
    Resident: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
    Household: {
        findByPk: jest.fn(),
    }
}));

describe('Resident Controller', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    describe('createResident', () => {
        test('should create resident with v2.0 fields', async () => {
            req.body = {
                householdId: 1,
                fullName: 'Nguyen B',
                dateOfBirth: '1990-01-01',
                gender: 'Nam',
                nativePlace: 'Hanoi',
                ethnicity: 'Kinh'
            };

            Household.findByPk.mockResolvedValue({ id: 1 });
            Resident.create.mockResolvedValue({ id: 100, ...req.body });

            await createResident(req, res);

            expect(Resident.create).toHaveBeenCalledWith(expect.objectContaining({
                nativePlace: 'Hanoi',
                ethnicity: 'Kinh'
            }));
            expect(res.statusCode).toBe(201);
        });

        test('should fail if household not found', async () => {
            req.body = { householdId: 999, fullName: 'A', dateOfBirth: '2000', gender: 'F' };
            Household.findByPk.mockResolvedValue(null);

            await createResident(req, res);
            expect(res.statusCode).toBe(404);
        });
    });

    describe('getAllResidents', () => {
        test('should invoke findAll', async () => {
            Resident.findAll.mockResolvedValue([]);
            await getAllResidents(req, res);
            expect(Resident.findAll).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
        });
    });
});

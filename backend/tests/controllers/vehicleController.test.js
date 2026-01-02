const { registerVehicle, getAllVehicles, deleteVehicle } = require('../../controllers/vehicleController');
const { Vehicle, Household } = require('../../models');
const httpMocks = require('node-mocks-http');

jest.mock('../../models', () => ({
    Vehicle: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
    Household: {
        findByPk: jest.fn(),
    }
}));

describe('Vehicle Controller', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    describe('registerVehicle', () => {
        test('should register vehicle with valid data', async () => {
            req.body = {
                householdId: 1,
                licensePlate: '30A-12345',
                type: 'XeMay',
                name: 'Honda Vision'
            };

            Household.findByPk.mockResolvedValue({ id: 1 });
            Vehicle.create.mockResolvedValue({ id: 10, ...req.body });

            await registerVehicle(req, res);

            expect(Vehicle.create).toHaveBeenCalledWith(expect.objectContaining({
                licensePlate: '30A-12345',
                type: 'XeMay'
            }));
            expect(res.statusCode).toBe(201);
        });

        test('should return 400 if missing required fields', async () => {
            req.body = { householdId: 1 }; // Missing licensePlate and type
            await registerVehicle(req, res);
            expect(res.statusCode).toBe(400);
        });

        test('should return 404 if household not found', async () => {
            req.body = { householdId: 999, licensePlate: 'ABC', type: 'Oto' };
            Household.findByPk.mockResolvedValue(null);

            await registerVehicle(req, res);
            expect(res.statusCode).toBe(404);
        });
    });

    describe('deleteVehicle', () => {
        test('should delete vehicle if exists', async () => {
            req.params = { id: 10 };
            const mockVehicle = { id: 10, destroy: jest.fn() };
            Vehicle.findByPk.mockResolvedValue(mockVehicle);

            await deleteVehicle(req, res);

            expect(mockVehicle.destroy).toHaveBeenCalled();
            expect(res.statusCode).toBe(200);
        });

        test('should return 404 if vehicle not found', async () => {
            req.params = { id: 999 };
            Vehicle.findByPk.mockResolvedValue(null);

            await deleteVehicle(req, res);
            expect(res.statusCode).toBe(404);
        });
    });

    describe('getAllVehicles', () => {
        test('should return list of vehicles', async () => {
            Vehicle.findAll.mockResolvedValue([{ id: 1, licensePlate: 'ABC' }]);

            await getAllVehicles(req, res);

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res._getData()).data).toHaveLength(1);
        });
    });
});

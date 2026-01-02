const { registerTemporaryResidence } = require('../../controllers/tempResidenceController');
const { TemporaryResidence, Resident } = require('../../models');
const httpMocks = require('node-mocks-http');

jest.mock('../../models', () => ({
    TemporaryResidence: {
        create: jest.fn(),
        findAll: jest.fn(),
    },
    Resident: {
        findByPk: jest.fn(),
    }
}));

describe('Temp Residence Controller', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    test('should register valid temporary stay', async () => {
        req.body = {
            residentId: 1,
            type: 'TamTru',
            startDate: '2024-01-01',
            permitCode: 'TR001'
        };

        Resident.findByPk.mockResolvedValue({ id: 1 });
        TemporaryResidence.create.mockResolvedValue(req.body);

        await registerTemporaryResidence(req, res);

        expect(TemporaryResidence.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'TamTru' }));
        expect(res.statusCode).toBe(201);
    });

    test('should return 404 if resident does not exist', async () => {
        req.body = { residentId: 99, type: 'TamVang', startDate: '2024-01-01' };
        Resident.findByPk.mockResolvedValue(null);

        await registerTemporaryResidence(req, res);
        expect(res.statusCode).toBe(404);
    });
});

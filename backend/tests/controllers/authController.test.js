const { login, register } = require('../../controllers/authController');
const { User, Role, sequelize } = require('../../models');
const httpMocks = require('node-mocks-http');

jest.mock('../../models', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
    Role: {
        findByPk: jest.fn(),
        findOrCreate: jest.fn(),
    },
    sequelize: {
        transaction: jest.fn().mockImplementation(() => ({
            commit: jest.fn(),
            rollback: jest.fn(),
        })),
    },
}));

jest.mock('../../utils/passwordUtils', () => ({
    comparePassword: jest.fn(),
}));

jest.mock('../../utils/jwtUtils', () => ({
    generateToken: jest.fn().mockReturnValue('mock-jwt-token'),
}));

const { comparePassword } = require('../../utils/passwordUtils');

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    describe('login', () => {
        test('should return token on valid credentials', async () => {
            req.body = { username: 'demo_admin', password: 'password123' };

            User.findOne.mockResolvedValue({
                id: 1,
                username: 'demo_admin',
                password: 'hashed',
                fullName: 'Admin',
                status: 'active',
                Roles: [{ id: 1, name: 'admin' }]
            });
            comparePassword.mockResolvedValue(true);

            await login(req, res);

            expect(res.statusCode).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data.data.token).toBe('mock-jwt-token');
            expect(data.data.user.roles).toContain('admin');
        });

        test('should return 401 on invalid password', async () => {
            req.body = { username: 'demo_admin', password: 'wrong' };

            User.findOne.mockResolvedValue({
                id: 1,
                password: 'hashed',
                status: 'active',
                Roles: []
            });
            comparePassword.mockResolvedValue(false);

            await login(req, res);
            expect(res.statusCode).toBe(401);
        });

        test('should return 403 on locked account', async () => {
            req.body = { username: 'locked_user', password: 'pass' };

            User.findOne.mockResolvedValue({
                id: 2,
                status: 'locked',
                Roles: []
            });

            await login(req, res);
            expect(res.statusCode).toBe(403);
        });
    });

    describe('register', () => {
        test('should return 400 if missing required fields', async () => {
            req.body = { username: 'test' }; // Missing password, fullName, roleId
            await register(req, res);
            expect(res.statusCode).toBe(400);
        });
    });
});

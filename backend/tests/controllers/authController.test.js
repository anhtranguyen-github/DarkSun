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
    hashPassword: jest.fn().mockResolvedValue('mock_hashed_password'),
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

    // NEW TESTS FOR FORGOT PASSWORD
    const { requestPasswordReset, resetPassword } = require('../../controllers/authController');
    const jwt = require('jsonwebtoken');
    jest.mock('jsonwebtoken', () => ({
        verify: jest.fn(),
        sign: jest.fn().mockReturnValue('mock-jwt-token')
    }));

    describe('requestPasswordReset', () => {
        test('should return 404 if user not found', async () => {
            req.body = { email: 'unknown' };
            User.findOne.mockResolvedValue(null);

            await requestPasswordReset(req, res);
            expect(res.statusCode).toBe(404);
        });

        test('should return 200 and log token if email exists', async () => {
            req.body = { email: 'admin@example.com' };
            User.findOne.mockResolvedValue({ id: 1, username: 'admin', email: 'admin@example.com' });

            await requestPasswordReset(req, res);
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res._getData()).message).toContain('Link đặt lại mật khẩu');
        });

        test('should return allowManualReset if user has no email', async () => {
            req.body = { email: 'no_email_user' };
            User.findOne.mockResolvedValue({ id: 2, username: 'no_email_user', email: null }); // No Email

            await requestPasswordReset(req, res);
            expect(res.statusCode).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data.allowManualReset).toBe(true);
            expect(data.requireAdminVerify).toBe(true);
        });
    });

    // NEW TEST FOR MANUAL RESET request
    const { requestManualReset } = require('../../controllers/authController');
    describe('requestManualReset', () => {
        test('should update user with pending password', async () => {
            req.body = { username: 'user1', newPassword: 'newPassword123' };
            const mockUser = {
                save: jest.fn(),
                username: 'user1'
            };
            User.findOne.mockResolvedValue(mockUser);

            await requestManualReset(req, res);

            expect(res.statusCode).toBe(200);
            expect(mockUser.pending_password).toBeDefined();
            expect(mockUser.is_reset_pending).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
        });
    });

    describe('resetPassword', () => {
        test('should return 400 if token missing', async () => {
            req.body = { newPassword: 'newpass' };
            await resetPassword(req, res);
            expect(res.statusCode).toBe(400);
        });

        test('should return 401 if token invalid', async () => {
            req.body = { token: 'invalid', newPassword: 'newpassword123' };
            jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

            await resetPassword(req, res);
            expect(res.statusCode).toBe(401);
        });

        test('should reset password successfully', async () => {
            req.body = { token: 'valid-token', newPassword: 'newpassword123' };
            jwt.verify.mockReturnValue({ id: 1, type: 'reset' });

            const mockUser = {
                id: 1,
                update: jest.fn().mockResolvedValue(true)
            };
            User.findByPk = jest.fn().mockResolvedValue(mockUser);

            await resetPassword(req, res);

            expect(res.statusCode).toBe(200);
            expect(mockUser.update).toHaveBeenCalledWith(
                { password: 'newpassword123' },
                expect.objectContaining({ transaction: expect.anything() })
            );
        });
    });
});

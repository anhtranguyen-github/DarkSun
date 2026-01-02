const { protect, authorize } = require('../../middleware/authMiddleware');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

jest.mock('../../utils/jwtUtils', () => ({
    verifyToken: jest.fn(),
}));

const { verifyToken } = require('../../utils/jwtUtils');

describe('Auth Middleware', () => {
    describe('protect', () => {
        let req, res, next;

        beforeEach(() => {
            req = httpMocks.createRequest();
            res = httpMocks.createResponse();
            next = jest.fn();
        });

        test('should return 401 if no authorization header', async () => {
            await protect(req, res, next);
            expect(res.statusCode).toBe(401);
            expect(JSON.parse(res._getData()).message).toMatch(/Không có quyền truy cập/);
        });

        test('should return 401 if token invalid', async () => {
            req.headers.authorization = 'Bearer invalidtoken';
            verifyToken.mockReturnValue(null);

            await protect(req, res, next);
            expect(res.statusCode).toBe(401);
        });

        test('should call next if token valid', async () => {
            req.headers.authorization = 'Bearer validtoken';
            verifyToken.mockReturnValue({ id: 1, roles: ['admin'] });

            await protect(req, res, next);

            expect(req.user).toBeDefined();
            expect(req.user.id).toBe(1);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('authorize', () => {
        let req, res, next;

        beforeEach(() => {
            req = httpMocks.createRequest();
            res = httpMocks.createResponse();
            next = jest.fn();
        });

        test('should return 403 if user has no matching role', () => {
            req.user = { roles: ['manager'] };
            authorize('admin')(req, res, next);
            expect(res.statusCode).toBe(403);
        });

        test('should call next if user has matching role', () => {
            req.user = { roles: ['admin'] };
            authorize('admin')(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
});

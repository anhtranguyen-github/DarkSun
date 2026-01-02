const { ApiError, errorHandler, notFoundHandler } = require('../../middleware/errorMiddleware');
const httpMocks = require('node-mocks-http');

describe('Error Middleware', () => {
    describe('ApiError', () => {
        test('should create error with statusCode and message', () => {
            const error = new ApiError(404, 'Not Found');
            expect(error.statusCode).toBe(404);
            expect(error.message).toBe('Not Found');
            expect(error.isOperational).toBe(true);
        });
    });

    describe('notFoundHandler', () => {
        test('should call next with 404 ApiError', () => {
            const req = httpMocks.createRequest({ originalUrl: '/api/nonexistent' });
            const res = httpMocks.createResponse();
            const next = jest.fn();

            notFoundHandler(req, res, next);

            expect(next).toHaveBeenCalled();
            const error = next.mock.calls[0][0];
            expect(error.statusCode).toBe(404);
        });
    });

    describe('errorHandler', () => {
        test('should return JSON error response', () => {
            const err = new ApiError(400, 'Bad Request');
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const next = jest.fn();

            errorHandler(err, req, res, next);

            expect(res.statusCode).toBe(400);
            const data = JSON.parse(res._getData());
            expect(data.success).toBe(false);
            expect(data.message).toBe('Bad Request');
        });

        test('should handle SequelizeUniqueConstraintError', () => {
            const err = {
                name: 'SequelizeUniqueConstraintError',
                fields: { username: 'test' }
            };
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const next = jest.fn();

            errorHandler(err, req, res, next);

            expect(res.statusCode).toBe(409);
        });

        test('should default to 500 for unknown errors', () => {
            const err = new Error('Something went wrong');
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const next = jest.fn();

            errorHandler(err, req, res, next);

            expect(res.statusCode).toBe(500);
        });
    });
});

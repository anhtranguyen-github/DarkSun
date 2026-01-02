const { Invoice } = require('../../models');

describe('Invoice (NopTien) Model', () => {
    test('should have payment tracking fields', () => {
        const attributes = Invoice.rawAttributes;

        expect(attributes.paymentMethod).toBeDefined();
        expect(attributes.cashierId).toBeDefined(); // User ID
        expect(attributes.paidDate).toBeDefined();
        expect(attributes.status).toBeDefined();
    });
});

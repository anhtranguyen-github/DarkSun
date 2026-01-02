const { FeePeriod } = require('../../models');

describe('FeePeriod Model', () => {
    test('should have period definition fields', () => {
        const attributes = FeePeriod.rawAttributes;
        expect(attributes.name).toBeDefined();
        expect(attributes.startDate).toBeDefined();
        expect(attributes.endDate).toBeDefined();
        expect(attributes.status).toBeDefined();
    });
});

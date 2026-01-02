const { FeeType } = require('../../models');

describe('FeeType Model', () => {
    test('should have basic fee definition fields', () => {
        const attributes = FeeType.rawAttributes;
        expect(attributes.name).toBeDefined();
        expect(attributes.price).toBeDefined();
        expect(attributes.unit).toBeDefined();
    });
});

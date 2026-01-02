const { Role } = require('../../models');

describe('Role Model', () => {
    test('should have name and displayName fields', () => {
        const attributes = Role.rawAttributes;
        expect(attributes.name).toBeDefined();
        expect(attributes.displayName).toBeDefined(); // V2.0 requirement
    });
});

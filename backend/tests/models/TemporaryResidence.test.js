const { TemporaryResidence } = require('../../models');

describe('TemporaryResidence Model', () => {
    test('should support both Stay and Absence types', () => {
        const attributes = TemporaryResidence.rawAttributes;

        expect(attributes.type).toBeDefined();
        expect(attributes.type.values).toContain('TamTru');
        expect(attributes.type.values).toContain('TamVang');

        expect(attributes.permitCode).toBeDefined();
        expect(attributes.residentId).toBeDefined();
    });
});

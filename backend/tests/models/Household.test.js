const { Household } = require('../../models');

describe('Household (HoKhau) Model', () => {
    test('should have ownerId and strict address fields', () => {
        const attributes = Household.rawAttributes;

        expect(attributes.ownerId).toBeDefined(); // Link to NhanKhau
        expect(attributes.householdCode).toBeDefined(); // So so ho khau

        // Detailed Address V2.0
        expect(attributes.addressStreet).toBeDefined();
        expect(attributes.addressWard).toBeDefined();
        expect(attributes.addressDistrict).toBeDefined();
    });
});

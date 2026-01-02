const { Vehicle } = require('../../models');

describe('Vehicle (PhuongTien) Model', () => {
    test('should have required fields for Parking Fees', () => {
        const attributes = Vehicle.rawAttributes;

        expect(attributes.licensePlate).toBeDefined();
        expect(attributes.type).toBeDefined(); // Enum: Oto/XeMay
        expect(attributes.householdId).toBeDefined();
    });
});

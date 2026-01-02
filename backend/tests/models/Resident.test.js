const { Resident } = require('../../models');

describe('Resident (NhanKhau) Model', () => {
    test('should have all v2.0 required demographic fields', () => {
        const attributes = Resident.rawAttributes;

        // V1.0 Core
        expect(attributes.fullName).toBeDefined();
        expect(attributes.dateOfBirth).toBeDefined();

        // V2.0 Extended
        expect(attributes.alias).toBeDefined(); // Bi danh
        expect(attributes.birthPlace).toBeDefined(); // Noi sinh
        expect(attributes.nativePlace).toBeDefined(); // Nguyen quan
        expect(attributes.ethnicity).toBeDefined(); // Dan toc
        expect(attributes.religion).toBeDefined(); // Ton giao
        expect(attributes.workplace).toBeDefined(); // Noi lam viec
        expect(attributes.moveInDate).toBeDefined(); // Ngay chuyen den
    });
});

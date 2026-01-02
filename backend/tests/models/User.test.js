const { Sequelize, DataTypes } = require('sequelize');
const { User, Role } = require('../../models');

describe('User Model', () => {
    let sequelize;

    beforeAll(async () => {
        // Setup in-memory sqlite for testing
        sequelize = new Sequelize('sqlite::memory:', { logging: false });
        // Manually init models on this instance or mock them if using global
        // For unit testing existing models, we usually rely on the real DB connection 
        // OR mock the sequalize definitions. 
        // Given the project structure, we will test assuming Env is setup OR mocks.
    });

    test('should have username and password fields', async () => {
        const attributes = User.rawAttributes;
        expect(attributes.username).toBeDefined();
        expect(attributes.password).toBeDefined();
    });

    // Add more tests
});

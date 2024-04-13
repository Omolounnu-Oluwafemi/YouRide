"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDriver = exports.Driver = void 0;
const sequelize_1 = require("sequelize");
class Driver extends sequelize_1.Model {
}
exports.Driver = Driver;
const initDriver = (sequelize) => {
    Driver.init({
        driverId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        phoneNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        country: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: sequelize_1.DataTypes.ENUM,
            values: ['Male', 'Female', 'Other'],
            allowNull: false,
        },
        category: {
            type: sequelize_1.DataTypes.ENUM,
            values: ['Private Driver', 'Taxi Driver', 'Delivery Driver'],
            allowNull: false,
        },
        referralCode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        vehicleYear: {
            type: sequelize_1.DataTypes.ENUM,
            values: ['2024', '2023', '2022', '2021', '2020', '2019', '2018'],
            allowNull: false,
        },
        vehicleManufacturer: {
            type: sequelize_1.DataTypes.ENUM,
            values: ['ACE', 'Acura', 'AIWAYS', 'AKT', 'BMW', 'BYD', 'Chevrolet'],
            allowNull: false,
        },
        vehicleColor: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        licensePlate: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        vehicleNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        driverLicense: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        vehicleLogBook: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        privateHireLicenseBadge: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        insuranceCertificate: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        motTestCertificate: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'Drivers',
    });
};
exports.initDriver = initDriver;

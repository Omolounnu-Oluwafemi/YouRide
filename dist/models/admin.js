"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAdmin = exports.Admin = void 0;
const sequelize_1 = require("sequelize");
class Admin extends sequelize_1.Model {
}
exports.Admin = Admin;
const initAdmin = (sequelize) => {
    Admin.init({
        adminId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        role: {
            type: sequelize_1.DataTypes.ENUM,
            values: ['Admin', 'Super Admin'],
            allowNull: false,
        },
        image: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    }, {
        sequelize,
        tableName: 'Admin',
    });
};
exports.initAdmin = initAdmin;

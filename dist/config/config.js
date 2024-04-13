"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const usersModel_1 = require("../models/usersModel");
const drivers_1 = require("../models/drivers");
const admin_1 = require("../models/admin");
const database = process.env.DB_NAME || 'postgres';
const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || '@August1908dev';
const host = process.env.DB_HOST || 'localhost';
const dialect = 'postgres';
exports.sequelize = new sequelize_1.Sequelize(database, username, password, {
    host,
    dialect,
});
(0, usersModel_1.initUser)(exports.sequelize);
(0, drivers_1.initDriver)(exports.sequelize);
(0, admin_1.initAdmin)(exports.sequelize);

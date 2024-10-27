"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize) => {
    const attendance = sequelize.define("attendance", {
        attendanceType: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    });
    return attendance;
};

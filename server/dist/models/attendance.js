"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize) => {
    const attendance = sequelize.define("attendance", {
        attendance_type: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    });
    attendance.associate = (db) => {
        db.attendance.belongsTo(db.user, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            foreignKey: { allowNull: false },
        });
        db.attendance.belongsTo(db.event, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            foreignKey: { allowNull: false },
        });
    };
    return attendance;
};

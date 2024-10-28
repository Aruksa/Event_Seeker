"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize) => {
    const category = sequelize.define("category", {
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    });
    category.associate = (db) => {
        db.category.hasMany(db.event_categories);
    };
    return category;
};

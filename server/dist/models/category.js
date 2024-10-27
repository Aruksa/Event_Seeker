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
        db.category.belongsToMany(db.event, {
            through: "event_categories",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    };
    return category;
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize) => {
    const event = sequelize.define("event", {
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100],
            },
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255],
            },
        },
        mode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        venue: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 200],
            },
        },
        city: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100],
            },
        },
        country: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 60],
            },
        },
        thumbnail: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    });
    event.associate = (db) => {
        db.event.belongsTo(db.user, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: { allowNull: false },
        });
        db.event.belongsToMany(db.user, {
            through: db.attendance,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        db.event.belongsToMany(db.category, {
            through: db.event_categories,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    };
    return event;
};

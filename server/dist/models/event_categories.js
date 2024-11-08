"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize) => {
    const event_categories = sequelize.define("event_categories", {});
    event_categories.associate = (db) => {
        db.event_categories.belongsTo(db.category, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: { allowNull: false },
        });
        db.event_categories.belongsTo(db.event, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: { allowNull: false },
        });
    };
    return event_categories;
};

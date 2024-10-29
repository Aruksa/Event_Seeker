import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB, ModelWithAssociations } from "./index";

export interface EventCategoriesInstance extends ModelWithAssociations {
  id: number;
  categoryId: number;
}

module.exports = (sequelize: Sequelize) => {
  const event_categories = sequelize.define<EventCategoriesInstance>(
    "event_categories",
    {}
  ) as ModelStatic<EventCategoriesInstance> & {
    associate: (db: DB) => void;
  };

  event_categories.associate = (db) => {
    (db.event_categories as ModelStatic<EventCategoriesInstance>).belongsTo(
      db.category as ModelStatic<Model>,
      {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );

    (db.event_categories as ModelStatic<EventCategoriesInstance>).belongsTo(
      db.event as ModelStatic<Model>,
      {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );
  };

  return event_categories;
};

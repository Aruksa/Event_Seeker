import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB } from "./index";

interface EventCategoriesInstance extends Model {}

module.exports = (sequelize: Sequelize) => {
  const event_categories = sequelize.define<EventCategoriesInstance>(
    "event_categories",
    {}
  ) as ModelStatic<EventCategoriesInstance> & {
    associate: (db: DB) => void;
  };

  return event_categories;
};

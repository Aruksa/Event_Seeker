import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB } from "./index";

interface CategoryInstance extends Model {
  name: string;
}

module.exports = (sequelize: Sequelize) => {
  const category = sequelize.define<CategoryInstance>("category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }) as ModelStatic<CategoryInstance> & {
    associate: (db: DB) => void;
  };

  category.associate = (db) => {
    (db.category as ModelStatic<CategoryInstance>).belongsToMany(
      db.event as ModelStatic<Model>,
      {
        through: "event_categories",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }
    );
  };

  return category;
};

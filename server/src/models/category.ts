import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB } from "./index";

export interface CategoryInstance extends Model {
  id: number;
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
        through: db.event_categories as ModelStatic<Model>,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }
    );
  };

  return category;
};

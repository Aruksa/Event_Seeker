import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB } from "./index";

interface UserInstance extends Model {
  id: number;
  name: string;
  email: string;
  password: string;
}

module.exports = (sequelize: Sequelize) => {
  const user = sequelize.define<UserInstance>("user", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
      },
    },
  }) as ModelStatic<UserInstance> & {
    associate: (db: DB) => void;
  };

  user.associate = (db: DB) => {
    (db.user as ModelStatic<UserInstance>).hasMany(
      db.event as ModelStatic<Model>
    );

    (db.user as ModelStatic<UserInstance>).hasMany(
      db.attendance as ModelStatic<Model>
    );
  };

  return user;
};

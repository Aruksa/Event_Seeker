import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB } from "./index";

export interface EventInstance extends Model {
  id: number;
  title: string;
  description: string;
  mode: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  city: string;
  country: string;
  thumbnail: string;
}

module.exports = (sequelize: Sequelize) => {
  const event = sequelize.define<EventInstance>("event", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 200],
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 60],
      },
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }) as ModelStatic<EventInstance> & {
    associate: (db: DB) => void;
  };

  event.associate = (db) => {
    (db.event as ModelStatic<EventInstance>).belongsTo(
      db.user as ModelStatic<Model>,
      {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );

    (db.event as ModelStatic<EventInstance>).belongsToMany(
      db.user as ModelStatic<Model>,
      {
        through: db.attendance as ModelStatic<Model>,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }
    );

    (db.event as ModelStatic<EventInstance>).belongsToMany(
      db.category as ModelStatic<Model>,
      {
        through: db.event_categories as ModelStatic<Model>,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }
    );
  };

  return event;
};

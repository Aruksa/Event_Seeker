import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB } from "./index";

interface AttendanceInstance extends Model {
  id: number;
  attendance_type: number;
}

module.exports = (sequelize: Sequelize) => {
  const attendance = sequelize.define<AttendanceInstance>("attendance", {
    attendance_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }) as ModelStatic<AttendanceInstance> & {
    associate: (db: DB) => void;
  };

  attendance.associate = (db) => {
    (db.attendance as ModelStatic<AttendanceInstance>).belongsTo(
      db.user as ModelStatic<Model>,
      {
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );

    (db.attendance as ModelStatic<AttendanceInstance>).belongsTo(
      db.event as ModelStatic<Model>,
      {
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );
  };

  return attendance;
};

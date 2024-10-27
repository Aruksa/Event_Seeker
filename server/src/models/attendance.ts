import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB } from "./index";

interface AttendanceInstance extends Model {
  attendanceType: number;
}

module.exports = (sequelize: Sequelize) => {
  const attendance = sequelize.define<AttendanceInstance>("attendance", {
    attendanceType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }) as ModelStatic<AttendanceInstance> & {
    associate: (db: DB) => void;
  };

  return attendance;
};

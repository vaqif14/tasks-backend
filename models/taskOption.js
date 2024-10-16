const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const TaskOption = sequelize.define(
    "TaskOption",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      optionText: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      tableName: "TaskOptions",
      indexes: [
        {
          fields: ["taskId"],
        },
      ],
    }
  );

  TaskOption.associate = (models) => {
    TaskOption.belongsTo(models.Task, {
      foreignKey: {
        name: "taskId",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return TaskOption;
};

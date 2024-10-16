const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      instruction: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: true,
      tableName: "Tasks",
      indexes: [
        {
          fields: ["id"],
        },
      ],
    }
  );

  Task.associate = (models) => {
    Task.hasMany(models.TaskOption, {
      foreignKey: {
        name: "taskId",
        allowNull: false,
      },
      as: "options",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Task;
};

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SessionToken = sequelize.define(
    "SessionToken",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10, 512],
        },
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "SessionTokens",
      indexes: [
        {
          fields: ["token"],
        },
      ],
    }
  );

  SessionToken.associate = (models) => {};

  return SessionToken;
};

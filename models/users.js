const { sq } = require("../database/connection");
const { DataTypes } = require("sequelize");
const User = sq.define("user", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  books: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {"past": [], "present": []}
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

User.sync({ force: true }).then(() => {
  console.log("User Model synced");
});

module.exports = { User };
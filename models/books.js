const { sq } = require("../database/connection");
const { DataTypes } = require("sequelize");
const Book = sq.define("book",{
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    score: {
      type: DataTypes.INTEGER,
      required: true,
      defaultValue: -1
    },
    user_scores: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: []
    },
    score_count: {
      type: DataTypes.INTEGER,
      required: false,
    },
    borrower_user_id: {
      type: DataTypes.INTEGER,
      required: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER,
      required: false,
      default: 1,
    }
});

Book.sync({ force: true }).then(() => {
  console.log("Book Model synced");
});

module.exports = { Book };
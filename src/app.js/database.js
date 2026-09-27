const path = require("node:path");
const { Sequelize } = require("sequelize");

function createDatabase(storage = process.env.DB_STORAGE || path.resolve(__dirname, "../../database.sqlite")) {
    return new Sequelize({ dialect: "sqlite", storage, logging: false });
}

const database = createDatabase();

module.exports = { createDatabase, database };
const path = require("node:path");
const { Sequelize } = require("sequelize");

const database = new Sequelize({
	dialect: "sqlite",
	storage: path.resolve(__dirname, "../database.sqlite"),
	logging: false
});

module.exports = database;
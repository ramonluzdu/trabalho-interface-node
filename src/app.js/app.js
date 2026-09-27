const path = require("node:path");
const express = require("express");
const { database: defaultDatabase } = require("./database");
const defineProduto = require("./models/produto.model");
const createProdutoRoutes = require("./routes/produto.routes");

function createApp({ sequelize = defaultDatabase, staticDirectory = path.resolve(__dirname, "../../public") } = {}) {
    const app = express();
    const Produto = defineProduto(sequelize);

    app.use(express.json());
    app.use("/produtos", createProdutoRoutes(Produto));
    app.use(express.static(staticDirectory));
    app.locals.sequelize = sequelize;

    return app;
}

module.exports = { createApp };
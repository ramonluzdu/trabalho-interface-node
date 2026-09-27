const express = require("express");
const { database: defaultDatabase } = require("./database");
const defineProduto = require("./models/produto.model");
const createProdutoRoutes = require("./routes/produto.routes");

function createApp({ sequelize = defaultDatabase } = {}) {
    const app = express();
    const Produto = defineProduto(sequelize);

    app.use(express.json());
    app.use("/produtos", createProdutoRoutes(Produto));
    app.use((req, res) => {
        res.status(404).json({ mensagem: "Rota não encontrada" });
    });
    app.use((erro, req, res, next) => {
        const status = erro.status === 400 ? 400 : 500;
        const mensagem = status === 400 ? "JSON inválido" : "Erro interno do servidor";
        res.status(status).json({ mensagem });
    });
    app.locals.sequelize = sequelize;

    return app;
}

module.exports = { createApp };
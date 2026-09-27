const express = require("express");
const defineProduto = require("./models/produto");

function validarProduto(dados) {
    if (!dados || typeof dados.nome !== "string" || !dados.nome.trim()) {
        throw new Error("nome é obrigatório");
    }

    if (typeof dados.preco !== "number" || !Number.isFinite(dados.preco) || dados.preco < 0) {
        throw new Error("preço deve ser um número maior ou igual a zero");
    }

    return { nome: dados.nome.trim(), preco: dados.preco };
}

function createApp(database) {
    const app = express();
    const Produto = defineProduto(database);

    app.use(express.json());

    app.get("/produtos", async (req, res) => {
        const produtos = await Produto.findAll({ order: [["id", "ASC"]] });
        res.status(200).json(produtos);
    });

    app.get("/produtos/:id", async (req, res) => {
        const id = Number(req.params.id);
        const produto = Number.isInteger(id) && id > 0 ? await Produto.findByPk(id) : null;

        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }
        res.status(200).json(produto);
    });

    app.post("/produtos", async (req, res) => {
        let dados;
        try {
            dados = validarProduto(req.body);
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }

        const produto = await Produto.create(dados);
        res.status(201).json(produto);
    });

    app.put("/produtos/:id", async (req, res) => {
        const id = Number(req.params.id);
        const produto = Number.isInteger(id) && id > 0 ? await Produto.findByPk(id) : null;

        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }

        let dados;
        try {
            dados = validarProduto(req.body);
        } catch (erro) {
            return res.status(400).json({ mensagem: erro.message });
        }

        await produto.update(dados);
        res.status(200).json(produto);
    });

    app.delete("/produtos/:id", async (req, res) => {
        const id = Number(req.params.id);
        const produto = Number.isInteger(id) && id > 0 ? await Produto.findByPk(id) : null;

        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado" });
        }

        await produto.destroy();
        res.status(204).end();
    });

    app.use((req, res) => {
        res.status(404).json({ mensagem: "Rota não encontrada" });
    });

    app.use((erro, req, res, next) => {
        const status = erro.status === 400 ? 400 : 500;
        const mensagem = status === 400 ? "JSON inválido" : "Erro interno do servidor";
        res.status(status).json({ mensagem });
    });

    return app;
}

module.exports = createApp;
const express = require("express");
const createProdutoController = require("../controllers/produto.controller");
const createProdutoService = require("../services/produto.service");

function createProdutoRoutes(Produto) {
	const router = express.Router();
	const controller = createProdutoController(createProdutoService(Produto));

	router.get("/", controller.listar);
	router.post("/", controller.criar);
	router.get("/:id", controller.buscarPorId);
	router.put("/:id", controller.atualizar);
	router.delete("/:id", controller.remover);

	return router;
}

module.exports = createProdutoRoutes;
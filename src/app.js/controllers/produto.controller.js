function createProdutoController(service) {
    return {
        async listar(req, res) {
            res.status(200).json(await service.listar());
        },

        async buscarPorId(req, res) {
            const produto = await service.buscarPorId(req.params.id);
            if (!produto) {
                return res.status(404).json({ mensagem: "Produto não encontrado" });
            }
            res.status(200).json(produto);
        },

        async criar(req, res) {
            try {
                const produto = await service.criar(req.body);
                res.status(201).json(produto);
            } catch (erro) {
                res.status(400).json({ mensagem: erro.message });
            }
        },

        async atualizar(req, res) {
            try {
                const produto = await service.atualizar(req.params.id, req.body);
                if (!produto) {
                    return res.status(404).json({ mensagem: "Produto não encontrado" });
                }
                res.status(200).json(produto);
            } catch (erro) {
                res.status(400).json({ mensagem: erro.message });
            }
        },

        async remover(req, res) {
            const removido = await service.remover(req.params.id);
            if (!removido) {
                return res.status(404).json({ mensagem: "Produto não encontrado" });
            }
            res.status(204).end();
        }
    };
}

module.exports = createProdutoController;

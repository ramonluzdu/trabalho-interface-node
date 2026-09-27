function createProdutoService(Produto) {
    function validarDados(dados) {
        if (!dados || typeof dados.nome !== "string" || !dados.nome.trim()) {
            throw new Error("nome é obrigatório");
        }

        if (typeof dados.preco !== "number" || !Number.isFinite(dados.preco) || dados.preco < 0) {
            throw new Error("preço deve ser um número maior ou igual a zero");
        }

        return { nome: dados.nome.trim(), preco: dados.preco };
    }

    return {
        listar() {
            return Produto.findAll({ order: [["id", "ASC"]] });
        },

        async buscarPorId(id) {
            const numeroId = Number(id);
            if (!Number.isInteger(numeroId) || numeroId < 1) return null;
            return Produto.findByPk(numeroId);
        },

        criar(dados) {
            return Produto.create(validarDados(dados));
        },

        async atualizar(id, dados) {
            const produto = await this.buscarPorId(id);
            if (!produto) return null;

            await produto.update(validarDados(dados));
            return produto;
        },

        async remover(id) {
            const produto = await this.buscarPorId(id);
            if (!produto) return false;

            await produto.destroy();
            return true;
        }
    };
}

module.exports = createProdutoService;

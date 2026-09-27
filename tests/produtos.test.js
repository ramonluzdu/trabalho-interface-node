const { Sequelize } = require("sequelize");
const request = require("supertest");
const { createApp } = require("../src/app.js/app");

describe("CRUD de produtos", () => {
    let sequelize;
    let app;

    beforeEach(async () => {
        sequelize = new Sequelize({ dialect: "sqlite", storage: ":memory:", logging: false });
        app = createApp({ sequelize });
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    test("cria, lista, consulta, atualiza e remove um produto", async () => {
        const home = await request(app).get("/");
        expect(home.status).toBe(200);
        expect(home.text).toContain("Seu catálogo");

        expect((await request(app).get("/produtos")).status).toBe(200);
        expect((await request(app).get("/produtos")).body).toEqual([]);

        const criado = await request(app)
            .post("/produtos")
            .send({ nome: "Teclado", preco: 249.9 });

        expect(criado.status).toBe(201);
        expect(criado.body).toMatchObject({ nome: "Teclado", preco: 249.9 });

        const lista = await request(app).get("/produtos");
        expect(lista.body).toHaveLength(1);
        expect(lista.body[0].id).toBe(criado.body.id);

        const consulta = await request(app).get(`/produtos/${criado.body.id}`);
        expect(consulta.status).toBe(200);
        expect(consulta.body.nome).toBe("Teclado");

        const atualizado = await request(app)
            .put(`/produtos/${criado.body.id}`)
            .send({ nome: "Teclado mecânico", preco: 399 });

        expect(atualizado.status).toBe(200);
        expect(atualizado.body).toMatchObject({ nome: "Teclado mecânico", preco: 399 });

        expect((await request(app).delete(`/produtos/${criado.body.id}`)).status).toBe(204);
        expect((await request(app).get("/produtos")).body).toEqual([]);
    });

    test("rejeita dados inválidos ao criar e atualizar", async () => {
        expect((await request(app).post("/produtos").send({ preco: 10 })).status).toBe(400);
        expect((await request(app).post("/produtos").send({ nome: "  ", preco: 10 })).status).toBe(400);
        expect((await request(app).post("/produtos").send({ nome: "Cabo", preco: -1 })).status).toBe(400);
        expect((await request(app).post("/produtos").send({ nome: "Cabo", preco: "10" })).status).toBe(400);

        const criado = await request(app).post("/produtos").send({ nome: "Cabo", preco: 10 });
        const resposta = await request(app)
            .put(`/produtos/${criado.body.id}`)
            .send({ nome: "", preco: 15 });

        expect(resposta.status).toBe(400);
        expect(resposta.body.mensagem).toBe("nome é obrigatório");
    });

    test("retorna 404 para identificadores inválidos ou inexistentes", async () => {
        expect((await request(app).get("/produtos/abc")).status).toBe(404);
        expect((await request(app).get("/produtos/0")).status).toBe(404);
        expect((await request(app).get("/produtos/99")).status).toBe(404);
        expect((await request(app).put("/produtos/99").send({ nome: "Item", preco: 1 })).status).toBe(404);
        expect((await request(app).delete("/produtos/99")).status).toBe(404);
    });
});
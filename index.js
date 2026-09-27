const database = require("./src/database");
const createApp = require("./src/api");

const app = createApp(database);

async function start() {
    await database.sync();
    const port = Number(process.env.PORT) || 3000;

    return app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}

if (require.main === module) {
    start().catch((error) => {
        console.error("Não foi possível iniciar o servidor:", error);
        process.exitCode = 1;
    });
}

module.exports = { app, start };

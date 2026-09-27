const { app, start } = require("../../../index");

if (require.main === module) {
	start().catch((error) => {
		console.error("Não foi possível iniciar o servidor:", error);
		process.exitCode = 1;
	});
}

module.exports = app;
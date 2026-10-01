const { vaultExists } = require("./vault");
const { perguntar } = require("./input");
const { limparTela } = require("./utils");
const { criarNovoCofre, desbloquearCofre } = require("./auth");
const { menu } = require("./menus");

// Estado da aplicação
const app = { vault: null, masterPassword: null };

// Iniciar aplicação
async function iniciarAplicacao() {
    while (true) {
        limparTela();
        console.log("=================================");
        console.log("======== COFRE DE SENHAS ========");
        console.log("=================================");
        console.log();

        // Primeiro acesso
        if (!vaultExists()) {
            console.log("Nenhum cofre encontrado.");
            console.log();
            const resposta = await perguntar("Deseja criar um novo cofre? (s/n): ");

            if (resposta.toLowerCase() !== "s") {
                console.log();
                console.log("Encerrando...");
                return;
            }

            const criado = await criarNovoCofre(app);
            if (!criado) return;
		
		// Cofre existente
        } else {
            const desbloqueado = await desbloquearCofre(app);
            if (!desbloqueado) return;
        }

		// Menu principal
        await menu(app);

        if (app.vault === null && app.masterPassword === null) {
            continue;
        }
    }
}


module.exports = {
    iniciarAplicacao
};

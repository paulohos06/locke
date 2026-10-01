const { perguntar, pausar } = require("./input");
const { limparTela } = require("./utils");
const { listarCredenciais, buscarCredencial, adicionarCredencial, alterarCredencial, removerCredencial } = require("./credentials");

// Bloquear cofre
function bloquearCofre(app) {
    app.vault = null;
    app.masterPassword = null;

    console.log();
    console.log("Cofre bloqueado.");
}

// Sair
function sair(app) {
    app.vault = null;
    app.masterPassword = null;

    console.log();
    console.log("Até mais!");
    process.exit(0);
}

// Menu principal
async function menu(app) {
    while (app.vault !== null) {
        limparTela();
        console.log("================================");
        console.log("======== MENU PRINCIPAL ========");
        console.log("================================");
        console.log();

        console.log("1. Listar credenciais");
        console.log("2. Adicionar credencial");
        console.log("3. Buscar credencial");
        console.log("4. Alterar credencial");
        console.log("5. Remover credencial");
        console.log("6. Bloquear cofre");
        console.log("0. Sair");
        console.log();

        const opcao = await perguntar("Escolha: ");

        switch (opcao) {
            case "1":
                await listarCredenciais(app);
                break;
            case "2":
                await adicionarCredencial(app);
                break;
            case "3":
                await buscarCredencial(app);
                break;
            case "4":
                await alterarCredencial(app);
                break;
            case "5":
                await removerCredencial(app);
                break;
            case "6":
                bloquearCofre(app);
                break;
            case "0":
                sair(app);
                return;
            default:
                console.log();
                console.log("Opção inválida.");
                await pausar();
        }
    }
}


module.exports = {
    menu
};

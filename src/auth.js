const { perguntar, pausar } = require("./input");
const { perguntarSenha } = require("./password");
const { createEmptyVault, saveVault, loadVault } = require("./vault");


// Criar novo cofre
async function criarNovoCofre(app) {
    console.log();
    console.log("=== Criar novo cofre ===");
    console.log();

    const senha = await perguntarSenha("Nova senha-mestra: ");

    if (!senha) {
        console.log("A senha não pode ser vazia.");
        await pausar();
        return false;
    }

    if (senha.length < 8) {
        console.log("A senha-mestra deve ter pelo menos 8 caracteres.");
        await pausar();
        return false;
    }

    const confirmacao = await perguntarSenha("Confirme a senha-mestra: ");
    if (senha !== confirmacao) {
        console.log();
        console.log("As senhas não são iguais.");
        await pausar();
        return false;
    }

    app.vault = createEmptyVault();
    app.masterPassword = senha;

    saveVault(app.vault, app.masterPassword);

    console.log();
    console.log("Cofre criado com sucesso!");

    await pausar();
    return true;
}

// Desbloquear cofre
async function desbloquearCofre(app) {
    console.log();
    const senha = await perguntarSenha("Senha-mestra: ");
    if (!senha) {
        console.log("A senha não pode ser vazia.");
        await pausar();
        return false;
    }

    try {
        const vault = loadVault(senha);
        app.vault = vault;
        app.masterPassword = senha;
		
        console.log();
        console.log("Cofre desbloqueado!");
        return true;
    } catch {
        console.log();
        console.log("Não foi possível desbloquear o cofre.");
        console.log("Verifique a senha-mestra.");
        await pausar();
        return false;
    }
}


module.exports = {
    criarNovoCofre,
    desbloquearCofre
};
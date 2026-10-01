const readline = require("readline");

// Perguntar ao usuário
function perguntar(pergunta) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(pergunta, (resposta) => {
                rl.close();
                resolve(resposta.trim());
            }
        );
    });
}

// Pausar aplicação
async function pausar() {
    await perguntar("Pressione ENTER para continuar...");
}

module.exports = {
    perguntar,
    pausar
};

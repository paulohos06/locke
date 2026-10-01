const { perguntar, pausar } = require("./input");
const { perguntarSenha, gerarSenha } = require("./password");
const { gerarId } = require("./utils");
const { copiarParaClipboard } = require("./clipboard");
const { saveVault } = require("./vault");

// Mostrar credenciais
function mostrarCredenciais(app) {
    const credenciais = app.vault.credentials;
    console.log();
    console.log("================================");
    console.log("       SUAS CREDENCIAIS");
    console.log("================================");

    if (credenciais.length === 0) {
        console.log();
        console.log("Nenhuma credencial cadastrada.");
        return;
    }

    console.log();

    credenciais.forEach(
        (credencial, indice) => {
            console.log(`${indice + 1}. ${credencial.service}`);
            console.log(`   Usuário: ${credencial.username}`);
            console.log();
        }
    );
}

// Listar credenciais
async function listarCredenciais(app) {
    const credenciais = app.vault.credentials;
    mostrarCredenciais(app);

    if (credenciais.length === 0) {
        await pausar();
        return;
    }

    console.log("Digite o número da credencial para acessar (Pressione ENTER para voltar).");
    console.log();

    const entrada = await perguntar("Número: ");
    if (!entrada) return;

    const indice = Number(entrada) - 1;

    if ( !Number.isInteger(indice) || indice < 0 || indice >= credenciais.length) {
        console.log();
        console.log("Credencial inválida.");

        await pausar();
        return;
    }

    await menuCredencial(credenciais[indice]);
}

// Buscar credencial
async function buscarCredencial(app) {
    console.log();

    const termo = await perguntar("Buscar por serviço ou usuário: ");

    if (!termo) {
        console.log();
        console.log("O termo de busca não pode ser vazio.");
        await pausar();
        return;
    }

    const termoNormalizado = termo.toLowerCase();

    const resultados =
        app.vault.credentials.filter(
            (credencial) => {
                const service = String(credencial.service || "").toLowerCase();
                const username = String(credencial.username || "").toLowerCase();

                return (
                    service.includes(termoNormalizado) ||
                    username.includes(termoNormalizado)
                );
            }
        );

    console.log();

    if (resultados.length === 0) {
        console.log("Nenhuma credencial encontrada.");
        await pausar();
        return;
    }

    console.log(`Encontradas: ${resultados.length}`);
    console.log();

    resultados.forEach(
        (credencial, indice) => {
            console.log(`${indice + 1}. ${credencial.service}`);
            console.log(`   Usuário: ${credencial.username}`);
            console.log();
        }
    );

    const entrada = await perguntar("Número da credencial (Pressione ENTER para voltar): ");
    if (!entrada) return;

    const indice = Number(entrada) - 1;

    if (
        !Number.isInteger(indice) ||
        indice < 0 ||
        indice >= resultados.length
    ) {

        console.log();
        console.log(
            "Credencial inválida."
        );

        await pausar();

        return;
    }

    await menuCredencial(
        resultados[indice]
    );
}


// Menu da credencial
async function menuCredencial(credencial) {
	console.log();
	console.log("================================");
	console.log("       CREDENCIAL");
	console.log("================================");
	console.log();
	console.log(`Serviço: ${credencial.service}`);
	console.log(`Usuário: ${credencial.username}`);
	console.log();
	console.log("1. Copiar usuário");
	console.log("2. Copiar senha");
	console.log();
		
    while (true) {
		console.log();
		const opcao = await perguntar("Escolha (Pressione ENTER para voltar): ");
		
        // Copiar usuário
        if (opcao === "1") {
            try {
                await copiarParaClipboard(credencial.username);
                console.log();
                console.log("Usuário copiado para o clipboard.");
            } catch {
                console.log();
                console.log("Não foi possível acessar o clipboard.");
            }

            await pausar();
            continue;
        }

        // Copiar senha
        if (opcao === "2") {
            try {
                await copiarParaClipboard(credencial.password);
                console.log();
                console.log("Senha copiada para o clipboard.");
            } catch {
                console.log();
                console.log("Não foi possível acessar o clipboard.");
            }

            await pausar();
            continue;
        }

        // Voltar
        if (opcao == "") {
			console.log();
            return;
        }
		
        // Opção inválida
        // console.log();
        // console.log("Opção inválida.");
        await pausar();
    }
}

// Adicionar credencial
async function adicionarCredencial(app) {
    console.log();
    console.log("=== Nova credencial ===");
    console.log();

    const service = await perguntar("Serviço: ");
    if (!service) {
        console.log("O serviço é obrigatório.");
        await pausar();
        return;
    }

    const username = await perguntar("Usuário: ");
    if (!username) {
        console.log("O usuário é obrigatório.");
        await pausar();
        return;
    }

    console.log();
    console.log("1. Digitar senha");
    console.log("2. Gerar senha");
    console.log();

    const opcao = await perguntar("Escolha: ");
    let password;
	let password1;
	let password2;

    if (opcao === "1") {
		// Digitar senha
		password1 = await perguntarSenha("Digite a senha: ");
		password2 = await perguntarSenha("Confirme a senha: ");
		
		if (password1 == ""|| password2 == "") {
			console.log();
			console.log("A senha não pode ser em branco.");
			await pausar();
			return;
		}
		
		if (password1 !== password2) {
			console.log();
			console.log("As senhas não conferem.");
			await pausar();
			return;
		}
		
		if (password1 == password2) {
			password = password1;
		}	

	} else if (opcao === "2") {
		// Gerar senha
        password = gerarSenha(24);
        console.log();
        console.log("Senha gerada:");
        console.log(password);
        console.log();
        await pausar();
    } else {
		// Opção inválida
        console.log();
        console.log("Opção inválida.");
        await pausar();
        return;
    }

    if (!password) {
        console.log("A senha não pode ser vazia.");
        await pausar();
        return;
    }

    const credencial = {
        id: gerarId(),
        service,
        username,
        password
    };

    app.vault.credentials.push(credencial);
    saveVault(app.vault, app.masterPassword);

    console.log();
    console.log("Credencial adicionada com sucesso.");

    await pausar();
}

// Selecionar credencial
async function selecionarCredencial(app) {
    const credenciais = app.vault.credentials;

    if (credenciais.length === 0) {
        console.log();
        console.log("Nenhuma credencial cadastrada.");
        await pausar();
        return null;
    }

    mostrarCredenciais(app);
    console.log();

    const entrada = await perguntar("Número da credencial: ");
    const indice = Number(entrada) - 1;

    if (!Number.isInteger(indice) || indice < 0 || indice >= credenciais.length) {
        console.log();
        console.log("Credencial inválida.");
        return null;
    }

    return credenciais[indice];
}

// Alterar credencial
async function alterarCredencial(app) {
    const credencial = await selecionarCredencial(app);
    if (!credencial) {
        await pausar();
        return;
    }

    console.log();
    console.log(`Editando: ${credencial.service}`);
    console.log();
    console.log("Deixe vazio para manter o valor atual.");

    const service = await perguntar(`Serviço [${credencial.service}]: `);
    const username = await perguntar(`Usuário [${credencial.username}]: `);

    if (service) credencial.service = service;
    if (username) credencial.username = username;
    
    console.log();
    console.log("1. Manter senha atual");
    console.log("2. Digitar nova senha");
    console.log("3. Gerar nova senha");
    console.log();

    const opcao = await perguntar("Escolha: ");

    // Digitar nova senha
    if (opcao === "2") {
        const novaSenha1 = await perguntarSenha("Nova senha: ");
		const novaSenha2 = await perguntarSenha("Confirme a nova senha: ");
					
		if (novaSenha1 == ""|| novaSenha2 == "") {
			console.log();
			console.log("A senha não pode ser em branco.");
			await pausar();
			return;
		}
		
		if (novaSenha1 !== novaSenha2) {
			console.log();
			console.log("As senhas não conferem.");
			await pausar();
			return;
		}
		
		if (novaSenha1 == novaSenha2) {
			credencial.password = novaSenha1;
		}
		
		
    } else if (opcao === "3") {
		// Gerar nova senha
        const novaSenha = gerarSenha(24);
        credencial.password = novaSenha;
		
        console.log();
        console.log("Nova senha:");
        console.log(novaSenha);
        console.log();
        await pausar();
		
    } else if (opcao !== "1") {
		// Manter senha
        console.log();
        console.log("Opção inválida.");
        await pausar();
        return;
    }


    saveVault(app.vault, app.masterPassword);

    console.log();
    console.log("Credencial atualizada.");
    await pausar();
}

// Remover credencial
async function removerCredencial(app) {
    const credencial = await selecionarCredencial(app);
    if (!credencial) {
        await pausar();
        return;
    }

    console.log();
    console.log(`Você selecionou: ${credencial.service}`);
    console.log();

    const confirmacao = await perguntar("Digite REMOVER para confirmar: ");
    if (confirmacao !== "REMOVER") {
        console.log();
        console.log("Operação cancelada.");
        await pausar();
        return;
    }

    const indice = app.vault.credentials.findIndex((item) => item.id === credencial.id);

    if (indice === -1) {
        console.log();
        console.log("Credencial não encontrada.");
        await pausar();
        return;
    }

    app.vault.credentials.splice(indice, 1);
    saveVault(app.vault,app.masterPassword);

    console.log();
    console.log("Credencial removida.");
    await pausar();
}


module.exports = {
    listarCredenciais,
    buscarCredencial,
    adicionarCredencial,
    alterarCredencial,
    removerCredencial
};

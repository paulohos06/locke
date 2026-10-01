const crypto = require("crypto");

// Gerar senha aleatória
function gerarSenha(tamanho = 24) {
    const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789" +
        "!@#$%^&*()-_=+";

    let senha = "";
    for (let i = 0; i < tamanho; i++) {
        const indice = crypto.randomInt(0, caracteres.length);
        senha += caracteres[indice];
    }
    return senha;
}

// Entrada de senha mascarada
function perguntarSenha(pergunta) {

    return new Promise((resolve) => {

        process.stdout.write(pergunta);

        const stdin = process.stdin;

        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding("utf8");

        let senha = "";

        function finalizar() {

            stdin.setRawMode(false);
            stdin.pause();

            stdin.removeListener(
                "data",
                receberEntrada
            );
        }

        function receberEntrada(caractere) {

            // ------------------------------------------
            // Ctrl+C
            // ------------------------------------------

            if (caractere === "\u0003") {

                process.stdout.write("\n");

                finalizar();

                process.exit(0);
            }


            // ------------------------------------------
            // Enter
            // ------------------------------------------

            if (
                caractere === "\r" ||
                caractere === "\n"
            ) {

                process.stdout.write("\n");

                finalizar();

                resolve(senha);

                return;
            }


            // ------------------------------------------
            // Backspace
            // ------------------------------------------

            if (caractere === "\u007f") {

                if (senha.length > 0) {

                    senha =
                        senha.slice(0, -1);

                    process.stdout.write(
                        "\b \b"
                    );
                }

                return;
            }


            // ------------------------------------------
            // Caracteres normais
            // ------------------------------------------

            if (caractere >= " ") {

                senha += caractere;

                process.stdout.write("*");
            }
        }

        stdin.on(
            "data",
            receberEntrada
        );
    });
}


module.exports = {
    gerarSenha,
    perguntarSenha
};

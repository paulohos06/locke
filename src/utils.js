const { pausar } = require("./input");
const crypto = require("crypto");

function limparTela() {
    console.clear();
}

function gerarId() {
    return crypto.randomUUID();
}

module.exports = {
    limparTela,
    gerarId
};

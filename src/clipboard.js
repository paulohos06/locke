const { execFile } = require("child_process");

function copiarParaClipboard(texto) {
    return new Promise((resolve, reject) => {
        if (process.platform === "win32") {
            const processo = execFile(
                "powershell.exe",
                [
                    "-NoProfile",
                    "-NonInteractive",
                    "-Command",
                    "[Console]::In.ReadToEnd() | Set-Clipboard"
                ],
                {
                    windowsHide: true
                },
                (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                }
            );

            processo.stdin.write(texto, "utf8");
            processo.stdin.end();

            return;
        }

        if (process.platform === "darwin") {
            const processo = execFile(
                "pbcopy",
                [],
                (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                }
            );

            processo.stdin.write(texto, "utf8");
            processo.stdin.end();

            return;
        }

        if (process.platform === "linux") {
            const processo = execFile(
                "wl-copy",
                [],
                (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                }
            );

            processo.stdin.write(texto, "utf8");
            processo.stdin.end();

            return;
        }

        reject(
            new Error(
                "Sistema operacional não suportado."
            )
        );
    });
}

module.exports = {
    copiarParaClipboard
};

// src/public/app.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("alunoForm");
    const messageDiv = document.getElementById("message");

    function showMessage(text, isError = false) {
        messageDiv.textContent = text;
        messageDiv.className = isError ? "error" : "success";
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        messageDiv.textContent = "";

        const nome_completo = document.getElementById("nome_completo").value.trim();
        const usuario_acesso = document.getElementById("usuario_acesso").value.trim();
        const senha = document.getElementById("senha").value;
        const email_aluno = document.getElementById("email_aluno").value.trim();
        const observacao = document.getElementById("observacao").value.trim();

        // Validações básicas no client
        if (!nome_completo) return showMessage("Nome completo é obrigatório.", true);
        if (!usuario_acesso || usuario_acesso.length < 4) return showMessage("Usuário deve ter ao menos 4 caracteres.", true);
        if (!senha || senha.length < 6) return showMessage("Senha deve ter ao menos 6 caracteres.", true);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_aluno)) return showMessage("Email em formato inválido.", true);

        // Envia para o backend (a senha será hashada no servidor)
        try {
            const resp = await fetch("/api/alunos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome_completo, usuario_acesso, senha, email_aluno, observacao })
            });

            const data = await resp.json();

            if (!resp.ok) {
                // Mostra mensagens vindas do servidor
                if (data && data.errors && Array.isArray(data.errors)) {
                    // mensagens do express-validator
                    return showMessage(data.errors.map(e => e.msg).join(" | "), true);
                }
                return showMessage(data.message || "Ocorreu um erro.", true);
            }

            showMessage("Aluno cadastrado com sucesso!");
            form.reset();
        } catch (err) {
            console.error("Erro ao enviar formulário:", err);
            showMessage("Erro de conexão com o servidor.", true);
        }
    });
});

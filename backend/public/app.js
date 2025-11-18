// src/public/app.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("alunoForm");
    const messageDiv = document.getElementById("message");
    const fields = {
        nome_completo: document.getElementById('nome_completo'),
        usuario_acesso: document.getElementById('usuario_acesso'),
        senha: document.getElementById('senha'),
        email_aluno: document.getElementById('email_aluno'),
        observacao: document.getElementById('observacao')
    };

    function setFieldError(fieldEl, msg) {
        const id = fieldEl.id;
        const errEl = document.getElementById('error_' + id);
        if (msg) {
            errEl.textContent = msg;
            fieldEl.classList.add('invalid');
            errEl.classList.remove('field-valid');
            errEl.classList.add('field-error');
        } else {
            errEl.textContent = '';
            fieldEl.classList.remove('invalid');
            errEl.classList.remove('field-error');
        }
    }

    function showMessage(text, isError = false) {
        messageDiv.textContent = text;
        messageDiv.classList.remove('error', 'success');
        if (!text) return;
        messageDiv.classList.add(isError ? 'error' : 'success');
        messageDiv.classList.add('message');
    }

    function validateAll() {
        let ok = true;
        // nome
        const nome = fields.nome_completo.value.trim();
        if (!nome) { setFieldError(fields.nome_completo, 'Nome completo é obrigatório.'); ok = false } else setFieldError(fields.nome_completo, '');

        // usuario
        const usuario = fields.usuario_acesso.value.trim();
        if (!usuario || usuario.length < 4) { setFieldError(fields.usuario_acesso, 'Usuário deve ter ao menos 4 caracteres.'); ok = false } else setFieldError(fields.usuario_acesso, '');

        // senha
        const senha = fields.senha.value;
        if (!senha || senha.length < 6) { setFieldError(fields.senha, 'Senha deve ter ao menos 6 caracteres.'); ok = false } else setFieldError(fields.senha, '');

        // email
        const email = fields.email_aluno.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { setFieldError(fields.email_aluno, 'Email em formato inválido.'); ok = false } else setFieldError(fields.email_aluno, '');

        // observacao - opcional, mas limitar tamanho
        const obs = fields.observacao.value.trim();
        if (obs.length > 500) { setFieldError(fields.observacao, 'Observação deve ter no máximo 500 caracteres.'); ok = false } else setFieldError(fields.observacao, '');

        return ok;
    }

    // validate fields on blur
    Object.values(fields).forEach(el => {
        el.addEventListener('blur', () => validateAll());
        el.addEventListener('input', () => {
            // clear message while typing
            const err = document.getElementById('error_' + el.id);
            if (err) err.textContent = '';
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage('');

        if (!validateAll()) {
            showMessage('Existem erros no formulário. Corrija e tente novamente.', true);
            return;
        }

        const payload = {
            nome_completo: fields.nome_completo.value.trim(),
            usuario_acesso: fields.usuario_acesso.value.trim(),
            senha: fields.senha.value,
            email_aluno: fields.email_aluno.value.trim(),
            observacao: fields.observacao.value.trim()
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';

        try {
            const resp = await fetch('/api/alunos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await resp.json().catch(() => ({}));

            if (!resp.ok) {
                if (data && data.errors && Array.isArray(data.errors)) {
                    // map server field errors if they include param
                    data.errors.forEach(err => {
                        if (err.param && fields[err.param]) setFieldError(fields[err.param], err.msg);
                    });
                    showMessage(data.errors.map(e => e.msg).join(' | '), true);
                } else {
                    showMessage(data.message || 'Ocorreu um erro no servidor.', true);
                }
                return;
            }

            showMessage('Aluno cadastrado com sucesso!');
            form.reset();
        } catch (err) {
            console.error('Erro ao enviar formulário:', err);
            showMessage('Erro de conexão com o servidor.', true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});

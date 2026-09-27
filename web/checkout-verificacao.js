// =====================================================
// PROTEGE A ETAPA: precisa ter passado pelo cadastro
// =====================================================

const cart = JSON.parse(localStorage.getItem('importTechCart') || '[]');
const companyData = JSON.parse(localStorage.getItem('it_checkoutCompany') || 'null');

if (!cart.length || !companyData) {
    window.location.href = 'dashboard.html';
}


// =====================================================
// ELEMENTOS
// =====================================================

const targetEmail = document.getElementById('targetEmail');
const form = document.getElementById('verificacaoForm');
const inputs = Array.from(document.querySelectorAll('#codeInputs input'));
const verifyBtn = document.getElementById('verifyBtn');
const resendBtn = document.getElementById('resendBtn');


// =====================================================
// MOSTRA O E-MAIL DE DESTINO (MASCARADO)
// =====================================================

function maskEmail(email) {
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const visible = user.slice(0, 2);
    const hidden = '•'.repeat(Math.max(user.length - 2, 2));
    return `${visible}${hidden}@${domain}`;
}

if (companyData && companyData.emailEmpresa) {
    targetEmail.textContent = maskEmail(companyData.emailEmpresa);
}


// =====================================================
// NAVEGAÇÃO ENTRE OS CAMPOS DO CÓDIGO
// =====================================================

inputs.forEach(function (input, index) {

    input.addEventListener('input', function () {
        input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);

        if (input.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' && !input.value && index > 0) {
            inputs[index - 1].focus();
        }
    });

    input.addEventListener('paste', function (event) {
        event.preventDefault();
        const pasted = (event.clipboardData || window.clipboardData)
            .getData('text')
            .replace(/[^0-9]/g, '')
            .slice(0, inputs.length);

        pasted.split('').forEach(function (digit, i) {
            if (inputs[i]) inputs[i].value = digit;
        });

        const next = Math.min(pasted.length, inputs.length - 1);
        inputs[next].focus();
    });

});

inputs[0].focus();


// =====================================================
// ENVIO: QUALQUER CÓDIGO DE 6 DÍGITOS É ACEITO
// (verificação fictícia, apenas para demonstração)
// =====================================================

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const code = inputs.map(function (input) { return input.value; }).join('');

    if (code.length < 6) {
        inputs.forEach(function (input) {
            if (!input.value) input.focus();
        });
        return;
    }

    verifyBtn.disabled = true;
    verifyBtn.textContent = 'VERIFICANDO...';

    setTimeout(function () {
        localStorage.setItem('it_verified', 'true');
        window.location.href = 'payment.html';
    }, 900);
});


// =====================================================
// REENVIAR CÓDIGO (FICTÍCIO)
// =====================================================

let resendCooldown = 0;

resendBtn.addEventListener('click', function () {
    if (resendCooldown > 0) return;

    const fakeCode = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem('it_verificationCode', fakeCode);

    resendCooldown = 30;
    resendBtn.disabled = true;

    const timer = setInterval(function () {
        resendCooldown--;
        resendBtn.textContent = `Reenviar código (${resendCooldown}s)`;

        if (resendCooldown <= 0) {
            clearInterval(timer);
            resendBtn.disabled = false;
            resendBtn.textContent = 'Reenviar código';
        }
    }, 1000);
});

// =====================================================
// PROTEGE A ETAPA: precisa haver carrinho
// =====================================================

const cart = JSON.parse(localStorage.getItem('importTechCart') || '[]');

if (!cart.length) {
    window.location.href = 'dashboard.html';
}


// =====================================================
// ELEMENTOS
// =====================================================

const form = document.getElementById('cadastroForm');

const nomeEmpresaInput = document.getElementById('nomeEmpresa');
const nomeFuncionarioInput = document.getElementById('nomeFuncionario');
const emailEmpresaInput = document.getElementById('emailEmpresa');

const fieldEmpresa = document.getElementById('fieldEmpresa');
const fieldFuncionario = document.getElementById('fieldFuncionario');
const fieldEmail = document.getElementById('fieldEmail');


// =====================================================
// PREENCHE COM DADOS JÁ SALVOS (se o usuário voltar)
// =====================================================

const savedData = JSON.parse(localStorage.getItem('it_checkoutCompany') || 'null');

if (savedData) {
    nomeEmpresaInput.value = savedData.nomeEmpresa || '';
    nomeFuncionarioInput.value = savedData.nomeFuncionario || '';
    emailEmpresaInput.value = savedData.emailEmpresa || '';
}


// =====================================================
// VALIDAÇÃO
// =====================================================

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function setInvalid(fieldEl, invalid) {
    fieldEl.classList.toggle('invalid', invalid);
}

function validate() {
    let valid = true;

    const nomeEmpresa = nomeEmpresaInput.value.trim();
    const nomeFuncionario = nomeFuncionarioInput.value.trim();
    const emailEmpresa = emailEmpresaInput.value.trim();

    const empresaOk = nomeEmpresa.length >= 2;
    setInvalid(fieldEmpresa, !empresaOk);
    if (!empresaOk) valid = false;

    const funcionarioOk = nomeFuncionario.length >= 2;
    setInvalid(fieldFuncionario, !funcionarioOk);
    if (!funcionarioOk) valid = false;

    const emailOk = isValidEmail(emailEmpresa);
    setInvalid(fieldEmail, !emailOk);
    if (!emailOk) valid = false;

    return valid;
}


// =====================================================
// ENVIO DO FORMULÁRIO
// =====================================================

form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validate()) {
        return;
    }

    const companyData = {
        nomeEmpresa: nomeEmpresaInput.value.trim(),
        nomeFuncionario: nomeFuncionarioInput.value.trim(),
        emailEmpresa: emailEmpresaInput.value.trim()
    };

    localStorage.setItem('it_checkoutCompany', JSON.stringify(companyData));

    // Gera um código fictício de 6 dígitos (apenas para exibição na tela de verificação)
    const fakeCode = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem('it_verificationCode', fakeCode);
    localStorage.removeItem('it_verified');

    window.location.href = 'checkout-verificacao.html';
});


// =====================================================
// LIMPA ERRO AO DIGITAR
// =====================================================

[nomeEmpresaInput, nomeFuncionarioInput, emailEmpresaInput].forEach(function (input) {
    input.addEventListener('input', function () {
        input.closest('.field').classList.remove('invalid');
    });
});

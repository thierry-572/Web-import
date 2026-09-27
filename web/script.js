const loginForm = document.getElementById('loginForm');
const codigoFuncionario = document.getElementById('codigoFuncionario');
const senhaEmpresa = document.getElementById('senhaEmpresa');
const togglePassword = document.getElementById('togglePassword');
const message = document.getElementById('message');

// Credenciais do sistema
// 6767 / 1234 = Proprietário
// 1234 / 4321 = Loja normal
// 4242 / 0202 = Loja normal
const usuarios = {
  '6767:1234': { role: 'owner', name: 'Proprietário', destino: 'owner.html' },
  '1234:4321': { role: 'employee', name: 'Funcionário', destino: 'dashboard.html' },
  '4242:0202': { role: 'employee', name: 'Funcionário', destino: 'dashboard.html' }
};

if (togglePassword) {
  togglePassword.addEventListener('click', () => {
    senhaEmpresa.type = senhaEmpresa.type === 'password' ? 'text' : 'password';
  });
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const codigo = codigoFuncionario.value.trim();
  const senha = senhaEmpresa.value.trim();
  const usuario = usuarios[`${codigo}:${senha}`];

  message.textContent = '';

  if (!codigo || !senha) {
    message.textContent = 'Preencha todos os campos.';
    message.style.color = '#777';
    return;
  }



  // Remove qualquer sessão anterior antes de criar a nova.
  sessionStorage.clear();
  sessionStorage.setItem('it_role', usuario.role);
  sessionStorage.setItem('it_user_name', usuario.name);
  sessionStorage.setItem('it_login_code', codigo);

  message.textContent = usuario.role === 'owner'
    ? 'Acesso autorizado — Painel do Proprietário.'
    : 'Acesso autorizado — Loja.';
  message.style.color = '#13a9ee';

  // Redirecionamento direto para a tela correta.
  window.setTimeout(() => {
    window.location.replace(usuario.destino);
  }, 250);
});

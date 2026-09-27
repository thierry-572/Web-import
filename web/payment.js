const cart = JSON.parse(localStorage.getItem('importTechCart') || '[]');
const companyData = JSON.parse(localStorage.getItem('it_checkoutCompany') || 'null');
const isVerified = localStorage.getItem('it_verified') === 'true';
const money = v => Number(v || 0).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
const itemsEl = document.getElementById('items');
const totalEl = document.getElementById('total');
const confirmBtn = document.getElementById('confirm');
const success = document.getElementById('success');
const pixCodeEl = document.getElementById('pixCode');
const companyInfoEl = document.getElementById('companyInfo');

// Garante que a empresa passou pelo cadastro e pela verificação de e-mail
if (!cart.length) {
  window.location.href = 'dashboard.html';
} else if (!companyData) {
  window.location.href = 'checkout-cadastro.html';
} else if (!isVerified) {
  window.location.href = 'checkout-verificacao.html';
}

if (companyData) {
  companyInfoEl.innerHTML = `<b>${escapeHtml(companyData.nomeEmpresa)}</b>Responsável: ${escapeHtml(companyData.nomeFuncionario)}<br>${escapeHtml(companyData.emailEmpresa)}`;
}

if (!cart.length) {
  itemsEl.innerHTML = '<div class="empty">Seu carrinho está vazio.<br><br>Volte à loja e adicione produtos.</div>';
  totalEl.textContent = money(0);
  confirmBtn.disabled = true;
  confirmBtn.textContent = 'CARRINHO VAZIO';
} else {
  itemsEl.innerHTML = cart.map(item => {
    const q = Number(item.quantity || 1);
    const subtotal = Number(item.price || 0) * q;
    return `<div class="item"><div><b>${escapeHtml(item.name)}</b><small>${q} × ${money(item.price)}</small></div><strong>${money(subtotal)}</strong></div>`;
  }).join('');
}

const total = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
totalEl.textContent = money(total);
const orderId = '#IT-' + String(Date.now()).slice(-6);
const pix = `00020126580014BR.GOV.BCB.PIX0136IMPORTTECH-DEMO-${orderId.replace('#','')}520400005303986540${total.toFixed(2)}5802BR5912IMPORT TECH6009ALVORADA6304DEMO`;
pixCodeEl.value = pix;

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function makeFakeQR(text) {
  const qr = document.getElementById('qr');
  qr.innerHTML = '';
  const n = 29;
  const cells = Array.from({length:n*n}, () => false);
  let seed = 2166136261;
  for (const ch of text) seed = Math.imul(seed ^ ch.charCodeAt(0), 16777619) >>> 0;
  const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const set = (x,y,v=true) => { if(x>=0&&x<n&&y>=0&&y<n) cells[y*n+x]=v; };
  for(let y=0;y<n;y++) for(let x=0;x<n;x++) cells[y*n+x]=rand()>0.56;
  function finder(sx,sy){
    for(let y=-1;y<8;y++) for(let x=-1;x<8;x++) set(sx+x,sy+y,false);
    for(let y=0;y<7;y++) for(let x=0;x<7;x++) set(sx+x,sy+y,x===0||x===6||y===0||y===6||(x>=2&&x<=4&&y>=2&&y<=4));
  }
  finder(0,0); finder(n-7,0); finder(0,n-7);
  for(let i=8;i<n-8;i++){set(i,6,i%2===0);set(6,i,i%2===0);}
  qr.style.gridTemplateColumns=`repeat(${n},1fr)`;
  qr.style.gridTemplateRows=`repeat(${n},1fr)`;
  const frag=document.createDocumentFragment();
  cells.forEach(on=>{const b=document.createElement('b'); if(!on)b.className='off'; frag.appendChild(b);});
  qr.appendChild(frag);
}
makeFakeQR(pix);

document.querySelectorAll('.method').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.method').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const isPix = btn.dataset.method === 'pix';
  document.getElementById('pixArea').classList.toggle('hidden', !isPix);
  document.getElementById('cardArea').classList.toggle('hidden', isPix);
}));

document.getElementById('copyBtn').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(pix); }
  catch { pixCodeEl.select(); document.execCommand('copy'); }
  const btn=document.getElementById('copyBtn'); btn.textContent='COPIADO!';
  setTimeout(()=>btn.textContent='COPIAR',1400);
});

confirmBtn.addEventListener('click', () => {
  const method = document.querySelector('.method.active')?.dataset.method || 'pix';
  if (method === 'card') {
    const inputs = [...document.querySelectorAll('#cardArea input')];
    if (inputs.some(i => !i.value.trim())) { alert('Preencha os dados do cartão para continuar.'); return; }
  }

  const order = {
    id: orderId,
    client: companyData ? companyData.nomeEmpresa : 'Cliente da loja',
    responsavel: companyData ? companyData.nomeFuncionario : '',
    email: companyData ? companyData.emailEmpresa : '',
    date: new Date().toLocaleDateString('pt-BR'),
    time: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}),
    value: total,
    status: 'Pago',
    method: method.toUpperCase(),
    items: cart
  };

  const orders = JSON.parse(localStorage.getItem('it_orders') || '[]');
  orders.unshift(order);
  localStorage.setItem('it_orders', JSON.stringify(orders));
  localStorage.setItem('it_lastOrder', JSON.stringify(order));

  localStorage.removeItem('importTechCart');
  localStorage.removeItem('it_verified');
  localStorage.removeItem('it_verificationCode');
  localStorage.removeItem('it_checkoutCompany');

  confirmBtn.disabled = true;
  confirmBtn.textContent = 'PROCESSANDO...';

  setTimeout(() => {
    window.location.href = 'checkout-confirmacao.html';
  }, 900);
});

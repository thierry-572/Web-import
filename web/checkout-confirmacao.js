// =====================================================
// CARREGA O ÚLTIMO PEDIDO REGISTRADO
// =====================================================

const order = JSON.parse(localStorage.getItem('it_lastOrder') || 'null');

const confirmSub = document.getElementById('confirmSub');
const receiptEl = document.getElementById('receipt');


// =====================================================
// SEM PEDIDO ENCONTRADO -> VOLTA PARA A LOJA
// =====================================================

if (!order) {
    window.location.href = 'dashboard.html';
}


// =====================================================
// FORMATA DINHEIRO
// =====================================================

function money(value) {
    return Number(value || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (c) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];
    });
}


// =====================================================
// MONTA O RECIBO
// =====================================================

if (order) {

    confirmSub.innerHTML = `Pedido <b>${escapeHtml(order.id)}</b> registrado com sucesso.
        Uma confirmação fictícia foi enviada para <b>${escapeHtml(order.email || '')}</b>.`;

    const itemsHtml = (order.items || []).map(function (item) {
        const q = Number(item.quantity || 1);
        const subtotal = Number(item.price || 0) * q;

        return `
            <div class="item">
                <div>
                    <b>${escapeHtml(item.name)}</b>
                    <small>${q} × ${money(item.price)}</small>
                </div>
                <strong>${money(subtotal)}</strong>
            </div>
        `;
    }).join('');

    receiptEl.innerHTML = `

        <div class="receipt-row">
            <span>Número do pedido</span>
            <span>${escapeHtml(order.id)}</span>
        </div>

        <div class="receipt-row">
            <span>Status</span>
            <span><span class="badge-status">${escapeHtml(order.status || 'Pago')}</span></span>
        </div>

        <div class="receipt-row">
            <span>Empresa</span>
            <span>${escapeHtml(order.client || '—')}</span>
        </div>

        <div class="receipt-row">
            <span>Responsável</span>
            <span>${escapeHtml(order.responsavel || '—')}</span>
        </div>

        <div class="receipt-row">
            <span>E-mail</span>
            <span>${escapeHtml(order.email || '—')}</span>
        </div>

        <div class="receipt-row">
            <span>Forma de pagamento</span>
            <span>${escapeHtml(order.method || '—')}</span>
        </div>

        <div class="receipt-row">
            <span>Data</span>
            <span>${escapeHtml(order.date || '')} ${escapeHtml(order.time || '')}</span>
        </div>

        <div class="receipt-items">
            ${itemsHtml || '<div class="empty">Nenhum item encontrado.</div>'}
        </div>

        <div class="receipt-total">
            <span>Total pago</span>
            <strong>${money(order.value)}</strong>
        </div>
    `;
}

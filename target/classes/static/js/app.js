const API = 'http://localhost:8080/api';

// ============================================================
// NAVEGAÇÃO
// ============================================================

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    event.currentTarget.classList.add('active');
}

// ============================================================
// LOG
// ============================================================

function log(type, title, data) {
    const body = document.getElementById('logBody');
    const now = new Date().toLocaleTimeString('pt-BR');
    const typeClass = type === 'ok' ? 'log-ok' : type === 'err' ? 'log-err' : 'log-info';
    const typeLabel = type === 'ok' ? 'OK' : type === 'err' ? 'ERRO' : 'INFO';
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <div class="log-time">${now}</div>
        <span class="log-type ${typeClass}">${typeLabel}</span>
        <div class="log-msg">${title}</div>
        ${data ? `<div class="log-json">${JSON.stringify(data, null, 2)}</div>` : ''}
    `;
    if (body.querySelector('.empty-state')) body.innerHTML = '';
    body.prepend(entry);
}

function clearLog() {
    document.getElementById('logBody').innerHTML = '<div class="empty-state">Log limpo.</div>';
}

// ============================================================
// HELPERS
// ============================================================

async function call(method, path, body) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(API + path, opts);
    if (res.status === 204) return null;
    const data = await res.json();
    if (!res.ok) throw { status: res.status, ...data };
    return data;
}

function badgeStatus(status) {
    const map = {
        'Pronto': 'badge-pronto', 'Lançado': 'badge-lancado', 'Falha': 'badge-falha',
        'Em solo': 'badge-solo', 'No espaço': 'badge-espaco',
        'Em órbita': 'badge-orbita', 'Ativo': 'badge-ativo'
    };
    return `<span class="badge ${map[status] || ''}">${status}</span>`;
}

function fuelBar(val, max = 150) {
    const pct = Math.min(100, (val / max) * 100);
    return `<div class="fuel-bar"><div class="fuel-fill" style="width:${pct}%"></div></div>`;
}

// ============================================================
// MODAL DE CONFIRMAÇÃO
// ============================================================

function confirmarDelete(msg, callback) {
    document.getElementById('modalMsg').textContent = msg;
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('modalConfirm').onclick = () => {
        fecharModal();
        callback();
    };
}

function fecharModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}

// ============================================================
// FOGUETES
// ============================================================

async function loadFoguetes() {
    try {
        const data = await call('GET', '/foguetes');
        renderFoguetes(data, 'foguetes-content');
        log('ok', `${data.length} foguete(s) carregado(s)`);
    } catch(e) { log('err', 'Erro ao carregar foguetes', e); }
}

function renderFoguetes(list, containerId) {
    const el = document.getElementById(containerId);
    if (!list.length) { el.innerHTML = '<div class="empty-state">Nenhum foguete encontrado</div>'; return; }
    el.innerHTML = `<div class="cards">${list.map(f => `
        <div class="card">
            <div class="card-header">
                <span class="card-name">🚀 ${f.nome}</span>
                ${badgeStatus(f.status)}
            </div>
            ${fuelBar(f.combustivelRestante)}
            <div class="card-row"><span>Combustível</span><span>${f.combustivelRestante} ton</span></div>
            <div class="card-row"><span>Carga máxima</span><span>${f.cargaMaxima} kg</span></div>
            <div class="card-row"><span>Satélite</span><span>${f.sateliteCarregado || '—'}</span></div>
            <div class="card-actions">
                <button class="btn-delete" onclick="deletarFoguete('${f.nome}')">🗑 Deletar</button>
            </div>
        </div>`).join('')}</div>`;
}

async function criarFoguete() {
    const nome = document.getElementById('f-nome').value.trim();
    const cargaMaxima = parseFloat(document.getElementById('f-carga').value);
    const combustivelRestante = parseFloat(document.getElementById('f-comb').value);
    if (!nome) { log('err', 'Nome é obrigatório'); return; }
    try {
        const data = await call('POST', '/foguetes', { nome, cargaMaxima, combustivelRestante });
        log('ok', `Foguete "${data.nome}" criado com sucesso!`, data);
        document.getElementById('f-nome').value = '';
    } catch(e) { log('err', e.mensagem || 'Erro ao criar foguete', e); }
}

async function abastecerFoguete() {
    const nome = document.getElementById('ab-nome').value.trim();
    const quantidade = parseFloat(document.getElementById('ab-qtd').value);
    if (!nome) { log('err', 'Nome é obrigatório'); return; }
    try {
        const data = await call('PUT', `/foguetes/${nome}/abastecer`, { quantidade });
        log('ok', `${nome} abastecido! Combustível: ${data.combustivelRestante} ton`, data);
    } catch(e) { log('err', e.mensagem || 'Erro ao abastecer', e); }
}

async function deletarFoguete(nome) {
    confirmarDelete(`Tem certeza que deseja deletar o foguete "${nome}"?`, async () => {
        try {
            await call('DELETE', `/foguetes/${encodeURIComponent(nome)}`);
            log('ok', `Foguete "${nome}" deletado com sucesso!`);
            loadFoguetes();
        } catch(e) { log('err', e.mensagem || 'Erro ao deletar foguete', e); }
    });
}

// ============================================================
// SATÉLITES
// ============================================================

async function loadSatelites() {
    try {
        const data = await call('GET', '/satelites');
        renderSatelites(data, 'satelites-content');
        log('ok', `${data.length} satélite(s) carregado(s)`);
    } catch(e) { log('err', 'Erro ao carregar satélites', e); }
}

function renderSatelites(list, containerId) {
    const el = document.getElementById(containerId);
    if (!list.length) { el.innerHTML = '<div class="empty-state">Nenhum satélite encontrado</div>'; return; }
    el.innerHTML = `<div class="cards">${list.map(s => `
        <div class="card">
            <div class="card-header">
                <span class="card-name">🛰 ${s.nome}</span>
                ${badgeStatus(s.status)}
            </div>
            ${fuelBar(s.energia, 100)}
            <div class="card-row"><span>Energia</span><span>${s.energia}%</span></div>
            <div class="card-row"><span>Massa</span><span>${s.massaKg} kg</span></div>
            <div class="card-row"><span>Tipo</span><span>${s.tipoSatelite}</span></div>
            <div class="card-row"><span>Órbita</span><span>${s.orbitaAlvo || '—'}</span></div>
            <div class="card-row"><span>Painéis</span><span>${s.paineisAtivos ? '☀ Ativos' : '⬛ Fechados'}</span></div>
            <div class="card-actions">
                <button class="btn-delete" onclick="deletarSatelite('${s.nome}')">🗑 Deletar</button>
            </div>
        </div>`).join('')}</div>`;
}

async function criarSatelite() {
    const nome = document.getElementById('s-nome').value.trim();
    const massaKg = parseFloat(document.getElementById('s-massa').value);
    const energia = parseFloat(document.getElementById('s-energia').value);
    const orbitaAlvo = document.getElementById('s-orbita').value.trim();
    const tipoSatelite = document.getElementById('s-tipo').value;
    if (!nome) { log('err', 'Nome é obrigatório'); return; }
    try {
        const data = await call('POST', '/satelites', { nome, massaKg, energia, orbitaAlvo, tipoSatelite });
        log('ok', `Satélite "${data.nome}" criado!`, data);
        document.getElementById('s-nome').value = '';
    } catch(e) { log('err', e.mensagem || 'Erro ao criar satélite', e); }
}

async function ativarPaineis() {
    const nome = document.getElementById('op-paineis-nome').value.trim();
    if (!nome) { log('err', 'Nome é obrigatório'); return; }
    try {
        const data = await call('PUT', `/satelites/${nome}/paineis`);
        log('ok', `Painéis de ${nome} ativados! Energia: ${data.energia}`, data);
    } catch(e) { log('err', e.mensagem || 'Erro', e); }
}

async function definirOrbita() {
    const nome = document.getElementById('op-orbita-nome').value.trim();
    const escolha = document.getElementById('op-orbita-escolha').value;
    if (!nome) { log('err', 'Nome é obrigatório'); return; }
    try {
        const data = await call('PUT', `/satelites/${nome}/orbita`, { escolha });
        log('ok', `Órbita de ${nome} definida: ${data.orbitaAlvo}`, data);
    } catch(e) { log('err', e.mensagem || 'Erro', e); }
}

async function ativarSatelite() {
    const nome = document.getElementById('op-ativar-nome').value.trim();
    if (!nome) { log('err', 'Nome é obrigatório'); return; }
    try {
        const data = await call('PUT', `/satelites/${nome}/ativar`);
        log('ok', `Satélite ${nome} ATIVO!`, data);
    } catch(e) { log('err', e.mensagem || 'Erro', e); }
}

async function deletarSatelite(nome) {
    confirmarDelete(`Tem certeza que deseja deletar o satélite "${nome}"?`, async () => {
        try {
            await call('DELETE', `/satelites/${encodeURIComponent(nome)}`);
            log('ok', `Satélite "${nome}" deletado com sucesso!`);
            loadSatelites();
        } catch(e) { log('err', e.mensagem || 'Erro ao deletar satélite', e); }
    });
}

// ============================================================
// MISSÕES
// ============================================================

async function iniciarMissao() {
    const nomeFoguete = document.getElementById('m-foguete').value.trim();
    const nomeSatelite = document.getElementById('m-satelite').value.trim();
    if (!nomeFoguete || !nomeSatelite) { log('err', 'Preencha foguete e satélite'); return; }
    try {
        const data = await call('POST', '/missoes/iniciar', { nomeFoguete, nomeSatelite });
        log(data.sucesso ? 'ok' : 'err', data.mensagem, data);
    } catch(e) { log('err', e.mensagem || 'Erro ao iniciar missão', e); }
}

async function enviarDados() {
    const nome = document.getElementById('d-nome').value.trim();
    if (!nome) { log('err', 'Nome é obrigatório'); return; }
    try {
        const data = await call('PUT', `/missoes/${nome}/dados`);
        log('ok', `📡 ${data.satelite}: "${data.mensagem}" | Energia: ${data.energiaRestante}`, data);
    } catch(e) { log('err', e.mensagem || 'Erro ao enviar dados', e); }
}

// ============================================================
// STATUS GERAL
// ============================================================

async function loadStatus() {
    try {
        const data = await call('GET', '/missoes/status');
        const el = document.getElementById('status-content');
        el.innerHTML = `
            <h3 style="font-size:14px;color:#4a6080;margin-bottom:12px">🚀 Foguetes</h3>
            <div class="cards" style="margin-bottom:20px">
                ${data.foguetes.map(f => `
                <div class="card">
                    <div class="card-header"><span class="card-name">🚀 ${f.nome}</span>${badgeStatus(f.status)}</div>
                    ${fuelBar(f.combustivelRestante)}
                    <div class="card-row"><span>Combustível</span><span>${f.combustivelRestante} ton</span></div>
                    <div class="card-row"><span>Carga máxima</span><span>${f.cargaMaxima} kg</span></div>
                    <div class="card-row"><span>Satélite</span><span>${f.sateliteCarregado || '—'}</span></div>
                    <div class="card-actions">
                        <button class="btn-delete" onclick="deletarFoguete('${f.nome}')">🗑 Deletar</button>
                    </div>
                </div>`).join('')}
            </div>
            <h3 style="font-size:14px;color:#4a6080;margin-bottom:12px">🛰 Satélites</h3>
            <div class="cards">
                ${data.satelites.map(s => `
                <div class="card">
                    <div class="card-header"><span class="card-name">🛰 ${s.nome}</span>${badgeStatus(s.status)}</div>
                    ${fuelBar(s.energia, 100)}
                    <div class="card-row"><span>Energia</span><span>${s.energia}%</span></div>
                    <div class="card-row"><span>Massa</span><span>${s.massaKg} kg</span></div>
                    <div class="card-row"><span>Tipo</span><span>${s.tipoSatelite}</span></div>
                    <div class="card-row"><span>Órbita</span><span>${s.orbitaAlvo || '—'}</span></div>
                    <div class="card-row"><span>Painéis</span><span>${s.paineisAtivos ? '☀ Ativos' : '⬛ Fechados'}</span></div>
                    <div class="card-actions">
                        <button class="btn-delete" onclick="deletarSatelite('${s.nome}')">🗑 Deletar</button>
                    </div>
                </div>`).join('')}
            </div>
        `;
        log('ok', 'Status atualizado');
    } catch(e) {
        log('err', 'API offline — verifique se o Spring Boot está rodando', e);
        document.getElementById('statusDot').style.background = '#ef4444';
        document.getElementById('statusDot').style.boxShadow = '0 0 6px #ef4444';
    }
}

// Carrega status ao abrir
loadStatus();

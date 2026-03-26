const API = 'http://localhost:8080/api';

// ============================================================
// NAVEGAÇÃO
// ============================================================

function showPage(id, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    if (el) el.classList.add('active');
}

// ============================================================
// LOG
// ============================================================

function log(type, title, data) {
    const body = document.getElementById('logBody');
    const now = new Date().toLocaleTimeString('pt-BR');
    const typeClass = type === 'ok' ? 'log-ok' : type === 'err' ? 'log-err' : 'log-info';
    const typeLabel = type === 'ok' ? 'OK' : type === 'err' ? 'ERRO' : 'INFO';
    const entryClass = type === 'ok' ? 'ok-entry' : type === 'err' ? 'err-entry' : 'info-entry';
    const entry = document.createElement('div');
    entry.className = `log-entry ${entryClass}`;
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
    document.getElementById('logBody').innerHTML = '<div class="empty-state">[ TERMINAL LIMPO ]</div>';
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

function atualizarStats(foguetes, satelites) {
    document.getElementById('stat-foguetes').textContent = foguetes.length;
    document.getElementById('stat-satelites').textContent = satelites.length;
    const emOrbita = satelites.filter(s => s.status === 'Em órbita' || s.status === 'Ativo').length;
    document.getElementById('stat-orbita').textContent = emOrbita;
}

function setOnline(online) {
    const dot  = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    if (online) {
        dot.className = 'status-dot';
        text.textContent = 'ONLINE';
    } else {
        dot.className = 'status-dot offline';
        text.textContent = 'OFFLINE';
    }
}

// ============================================================
// MODAL
// ============================================================

function confirmarDelete(msg, callback) {
    document.getElementById('modalMsg').textContent = msg;
    document.getElementById('modalOverlay').classList.add('open');
    document.getElementById('modalConfirm').onclick = () => { fecharModal(); callback(); };
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
    } catch(e) { log('err', 'Falha ao carregar foguetes', e); }
}

function renderFoguetes(list, containerId) {
    const el = document.getElementById(containerId);
    if (!list.length) { el.innerHTML = '<div class="empty-state">[ NENHUM VETOR REGISTRADO ]</div>'; return; }
    el.innerHTML = `<div class="cards">${list.map(f => `
        <div class="card">
            <div class="card-header">
                <span class="card-name">🚀 ${f.nome}</span>
                ${badgeStatus(f.status)}
            </div>
            ${fuelBar(f.combustivelRestante)}
            <div class="card-row"><span>Propelente</span><span>${f.combustivelRestante} ton</span></div>
            <div class="card-row"><span>Carga máx.</span><span>${f.cargaMaxima} kg</span></div>
            <div class="card-row"><span>Carga útil</span><span>${f.sateliteCarregado || '—'}</span></div>
            <div class="card-actions">
                <button class="btn-delete" onclick="deletarFoguete('${f.nome}')">🗑 DELETAR</button>
            </div>
        </div>`).join('')}</div>`;
}

async function criarFoguete() {
    const nome = document.getElementById('f-nome').value.trim();
    const cargaMaxima = parseFloat(document.getElementById('f-carga').value);
    const combustivelRestante = parseFloat(document.getElementById('f-comb').value);
    if (!nome) { log('err', 'Designação é obrigatória'); return; }
    try {
        const data = await call('POST', '/foguetes', { nome, cargaMaxima, combustivelRestante });
        log('ok', `Vetor "${data.nome}" registrado com sucesso`, data);
        document.getElementById('f-nome').value = '';
    } catch(e) { log('err', e.mensagem || 'Falha ao registrar foguete', e); }
}

async function abastecerFoguete() {
    const nome = document.getElementById('ab-nome').value.trim();
    const quantidade = parseFloat(document.getElementById('ab-qtd').value);
    if (!nome) { log('err', 'Designação é obrigatória'); return; }
    try {
        const data = await call('PUT', `/foguetes/${nome}/abastecer`, { quantidade });
        log('ok', `${nome} abastecido // Propelente: ${data.combustivelRestante} ton`, data);
    } catch(e) { log('err', e.mensagem || 'Falha no abastecimento', e); }
}

async function deletarFoguete(nome) {
    confirmarDelete(`Confirmar exclusão do vetor "${nome}" do sistema?`, async () => {
        try {
            await call('DELETE', `/foguetes/${encodeURIComponent(nome)}`);
            log('ok', `Vetor "${nome}" removido do sistema`);
            loadFoguetes();
        } catch(e) { log('err', e.mensagem || 'Falha ao remover foguete', e); }
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
    } catch(e) { log('err', 'Falha ao carregar satélites', e); }
}

function renderSatelites(list, containerId) {
    const el = document.getElementById(containerId);
    if (!list.length) { el.innerHTML = '<div class="empty-state">[ NENHUMA CARGA ÚTIL REGISTRADA ]</div>'; return; }
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
            <div class="card-row"><span>Painéis</span><span>${s.paineisAtivos ? '☀ ATIVOS' : '■ FECHADOS'}</span></div>
            <div class="card-actions">
                <button class="btn-delete" onclick="deletarSatelite('${s.nome}')">🗑 DELETAR</button>
            </div>
        </div>`).join('')}</div>`;
}

async function criarSatelite() {
    const nome = document.getElementById('s-nome').value.trim();
    const massaKg = parseFloat(document.getElementById('s-massa').value);
    const energia = parseFloat(document.getElementById('s-energia').value);
    const orbitaAlvo = document.getElementById('s-orbita').value.trim();
    const tipoSatelite = document.getElementById('s-tipo').value;
    if (!nome) { log('err', 'Designação é obrigatória'); return; }
    try {
        const data = await call('POST', '/satelites', { nome, massaKg, energia, orbitaAlvo, tipoSatelite });
        log('ok', `Carga útil "${data.nome}" registrada com sucesso`, data);
        document.getElementById('s-nome').value = '';
    } catch(e) { log('err', e.mensagem || 'Falha ao registrar satélite', e); }
}

async function ativarPaineis() {
    const nome = document.getElementById('op-paineis-nome').value.trim();
    if (!nome) { log('err', 'Designação é obrigatória'); return; }
    try {
        const data = await call('PUT', `/satelites/${nome}/paineis`);
        log('ok', `Painéis de ${nome} ativados // Energia: ${data.energia}%`, data);
    } catch(e) { log('err', e.mensagem || 'Falha na ativação dos painéis', e); }
}

async function definirOrbita() {
    const nome = document.getElementById('op-orbita-nome').value.trim();
    const escolha = document.getElementById('op-orbita-escolha').value;
    if (!nome) { log('err', 'Designação é obrigatória'); return; }
    try {
        const data = await call('PUT', `/satelites/${nome}/orbita`, { escolha });
        log('ok', `Órbita de ${nome} definida: ${data.orbitaAlvo}`, data);
    } catch(e) { log('err', e.mensagem || 'Falha na definição de órbita', e); }
}

async function ativarSatelite() {
    const nome = document.getElementById('op-ativar-nome').value.trim();
    if (!nome) { log('err', 'Designação é obrigatória'); return; }
    try {
        const data = await call('PUT', `/satelites/${nome}/ativar`);
        log('ok', `Satélite ${nome} — STATUS: ATIVO`, data);
    } catch(e) { log('err', e.mensagem || 'Falha na ativação', e); }
}

async function deletarSatelite(nome) {
    confirmarDelete(`Confirmar exclusão da carga útil "${nome}" do sistema?`, async () => {
        try {
            await call('DELETE', `/satelites/${encodeURIComponent(nome)}`);
            log('ok', `Carga útil "${nome}" removida do sistema`);
            loadSatelites();
        } catch(e) { log('err', e.mensagem || 'Falha ao remover satélite', e); }
    });
}

// ============================================================
// MISSÕES
// ============================================================

async function iniciarMissao() {
    const nomeFoguete = document.getElementById('m-foguete').value.trim();
    const nomeSatelite = document.getElementById('m-satelite').value.trim();
    if (!nomeFoguete || !nomeSatelite) { log('err', 'Preencha vetor e carga útil'); return; }
    try {
        const data = await call('POST', '/missoes/iniciar', { nomeFoguete, nomeSatelite });
        log(data.sucesso ? 'ok' : 'err', data.mensagem, data);
        if (data.sucesso) loadStatus();
    } catch(e) { log('err', e.mensagem || 'Falha na sequência de lançamento', e); }
}

async function enviarDados() {
    const nome = document.getElementById('d-nome').value.trim();
    if (!nome) { log('err', 'Designação é obrigatória'); return; }
    try {
        const data = await call('PUT', `/missoes/${nome}/dados`);
        log('ok', `📡 TRANSMISSÃO // ${data.satelite}: "${data.mensagem}" // Energia: ${data.energiaRestante}%`, data);
    } catch(e) { log('err', e.mensagem || 'Falha na transmissão', e); }
}

// ============================================================
// STATUS GERAL
// ============================================================

async function loadStatus() {
    try {
        const data = await call('GET', '/missoes/status');
        atualizarStats(data.foguetes, data.satelites);
        setOnline(true);

        document.getElementById('status-content').innerHTML = `
            <h3 style="font-family:'Orbitron',monospace;font-size:11px;color:rgba(0,180,255,.5);letter-spacing:.1em;margin-bottom:12px">◈ VETORES DE LANÇAMENTO</h3>
            <div class="cards" style="margin-bottom:20px">
                ${data.foguetes.map(f => `
                <div class="card">
                    <div class="card-header"><span class="card-name">🚀 ${f.nome}</span>${badgeStatus(f.status)}</div>
                    ${fuelBar(f.combustivelRestante)}
                    <div class="card-row"><span>Propelente</span><span>${f.combustivelRestante} ton</span></div>
                    <div class="card-row"><span>Carga máx.</span><span>${f.cargaMaxima} kg</span></div>
                    <div class="card-row"><span>Carga útil</span><span>${f.sateliteCarregado || '—'}</span></div>
                    <div class="card-actions"><button class="btn-delete" onclick="deletarFoguete('${f.nome}')">🗑 DELETAR</button></div>
                </div>`).join('')}
            </div>
            <h3 style="font-family:'Orbitron',monospace;font-size:11px;color:rgba(0,180,255,.5);letter-spacing:.1em;margin-bottom:12px">◈ CARGAS ÚTEIS</h3>
            <div class="cards">
                ${data.satelites.map(s => `
                <div class="card">
                    <div class="card-header"><span class="card-name">🛰 ${s.nome}</span>${badgeStatus(s.status)}</div>
                    ${fuelBar(s.energia, 100)}
                    <div class="card-row"><span>Energia</span><span>${s.energia}%</span></div>
                    <div class="card-row"><span>Massa</span><span>${s.massaKg} kg</span></div>
                    <div class="card-row"><span>Tipo</span><span>${s.tipoSatelite}</span></div>
                    <div class="card-row"><span>Órbita</span><span>${s.orbitaAlvo || '—'}</span></div>
                    <div class="card-row"><span>Painéis</span><span>${s.paineisAtivos ? '☀ ATIVOS' : '■ FECHADOS'}</span></div>
                    <div class="card-actions"><button class="btn-delete" onclick="deletarSatelite('${s.nome}')">🗑 DELETAR</button></div>
                </div>`).join('')}
            </div>`;

        log('info', `Sistema online // ${data.foguetes.length} vetores // ${data.satelites.length} cargas úteis`);
    } catch(e) {
        setOnline(false);
        log('err', 'Falha de comunicação — API offline', e);
    }
}

// Inicializa
loadStatus();

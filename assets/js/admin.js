/* =============================================================
   PAINEL — preços, produtos e fotos
   -------------------------------------------------------------
   O site não tem servidor, então o painel grava direto no
   repositório do GitHub: reescreve assets/js/catalogo.js e envia
   as fotos para assets/img/produtos/<id>/. Tudo vai num commit só,
   e a hospedagem (Vercel, Netlify, GitHub Pages…) publica sozinha.

   A chave de acesso é um token do GitHub e fica só no navegador de
   quem entrou. Sem ela, o painel abre em modo de teste: edita tudo,
   mas em vez de publicar baixa o catalogo.js para subir à mão.
   ============================================================= */

(() => {
  'use strict';

  const ARQ_CATALOGO = 'assets/js/catalogo.js';
  const PASTA_FOTOS = 'assets/img/produtos';
  const CHAVE = 'alianca:admin';
  const REPO_PADRAO = 'Mywons/site-alian-a-eduardo';
  const RAMO_PADRAO = 'main';
  const LADO_MAX = 1600; // px — foto maior que isso é reduzida antes de subir

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const brl = (n) => Number(n || 0).toLocaleString('pt-BR',
    { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const slug = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const clone = (o) => JSON.parse(JSON.stringify(o));

  const CATS = (typeof CATEGORIAS !== 'undefined' ? CATEGORIAS : [])
    .filter((c) => c.id !== 'todos');
  const nomeCat = (id) => CATS.find((c) => c.id === id)?.nome || id;

  /* ---------- Estado ---------- */

  const estado = {
    modo: null,          // 'github' | 'teste'
    token: '', repo: REPO_PADRAO, ramo: RAMO_PADRAO,
    shaCatalogo: null,   // sha do catalogo.js quando foi lido — detecta edição simultânea
    original: [],        // como está publicado
    produtos: [],        // como está aqui
    fotos: new Map(),    // caminho -> { blob, url }  (fotos novas, ainda não publicadas)
    filtro: 'todos',
    termo: ''
  };

  const lerPrefs = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch { return {}; } };
  const gravarPrefs = (o) => { try { localStorage.setItem(CHAVE, JSON.stringify(o)); } catch { /* sem storage */ } };
  const apagarPrefs = () => { try { localStorage.removeItem(CHAVE); } catch { /* sem storage */ } };

  /* ---------- Aviso ---------- */

  let toastTimer;
  function toast(msg, tipo = '') {
    const t = $('#toast');
    t.textContent = msg;
    t.dataset.tipo = tipo;
    t.dataset.visivel = 'true';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.dataset.visivel = 'false'; }, tipo === 'erro' ? 7000 : 3800);
  }

  /* ---------- GitHub ---------- */

  async function gh(caminho, opcoes = {}) {
    const r = await fetch(`https://api.github.com${caminho}`, {
      ...opcoes,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${estado.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(opcoes.body ? { 'Content-Type': 'application/json' } : {})
      }
    });
    if (!r.ok) {
      let msg = `${r.status}`;
      try { msg = (await r.json()).message || msg; } catch { /* corpo vazio */ }
      const e = new Error(msg); e.status = r.status; throw e;
    }
    return r.status === 204 ? null : r.json();
  }

  const b64ParaTexto = (b64) => new TextDecoder().decode(
    Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0)));

  const textoParaB64 = (txt) => {
    const bytes = new TextEncoder().encode(txt);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };

  const blobParaB64 = (blob) => new Promise((ok, falha) => {
    const fr = new FileReader();
    fr.onload = () => ok(String(fr.result).split(',')[1]);
    fr.onerror = falha;
    fr.readAsDataURL(blob);
  });

  /* O catalogo.js é `const PRODUTOS = [ ...JSON... ];` com um comentário
     em cima. Lê só a parte JSON. */
  function lerCatalogo(texto) {
    const ini = texto.indexOf('[', texto.indexOf('const PRODUTOS'));
    const fim = texto.lastIndexOf(']');
    if (ini < 0 || fim < ini) throw new Error('catalogo.js num formato que o painel não reconhece');
    return JSON.parse(texto.slice(ini, fim + 1));
  }

  function escreverCatalogo(produtos) {
    return `/* =============================================================
   CATÁLOGO — gerado pelo painel (admin.html)
   -------------------------------------------------------------
   Este arquivo é reescrito inteiro sempre que alguém salva no
   painel de administração. Pode editar à mão, mas mantenha o
   formato JSON (aspas duplas, sem comentário dentro da lista),
   senão o painel não consegue ler de volta.
   ============================================================= */
const PRODUTOS = ${JSON.stringify(produtos, null, 2)};
`;
  }

  async function carregarDoGitHub() {
    const arq = await gh(`/repos/${estado.repo}/contents/${ARQ_CATALOGO}?ref=${encodeURIComponent(estado.ramo)}`);
    estado.shaCatalogo = arq.sha;
    return lerCatalogo(b64ParaTexto(arq.content));
  }

  /* Um commit só com o catálogo e todas as fotos novas, pela API de
     dados do Git: blobs -> árvore -> commit -> mover o ramo. */
  async function publicar(produtos, mensagem) {
    const base = `/repos/${estado.repo}`;
    const ref = await gh(`${base}/git/ref/heads/${encodeURIComponent(estado.ramo)}`);
    const pai = ref.object.sha;
    const commitPai = await gh(`${base}/git/commits/${pai}`);

    // Alguém salvou depois que esta página abriu?
    const atual = await gh(`${base}/contents/${ARQ_CATALOGO}?ref=${pai}`);
    if (estado.shaCatalogo && atual.sha !== estado.shaCatalogo) {
      const seguir = confirm('O catálogo foi alterado em outro lugar depois que você abriu o painel.\n\n'
        + 'Publicar mesmo assim substitui aquela versão pela sua. Continuar?');
      if (!seguir) throw new Error('cancelado');
    }

    const usadas = new Set(produtos.flatMap((p) => Object.values(p.imagens || {})));
    const arvore = [];

    for (const [caminho, foto] of estado.fotos) {
      if (!usadas.has(caminho) || foto.enviada) continue;
      const blob = await gh(`${base}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({ content: await blobParaB64(foto.blob), encoding: 'base64' })
      });
      arvore.push({ path: caminho, mode: '100644', type: 'blob', sha: blob.sha });
    }

    const cat = await gh(`${base}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: textoParaB64(escreverCatalogo(produtos)), encoding: 'base64' })
    });
    arvore.push({ path: ARQ_CATALOGO, mode: '100644', type: 'blob', sha: cat.sha });

    const tree = await gh(`${base}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({ base_tree: commitPai.tree.sha, tree: arvore })
    });
    const commit = await gh(`${base}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({ message: mensagem, tree: tree.sha, parents: [pai] })
    });
    await gh(`${base}/git/refs/heads/${encodeURIComponent(estado.ramo)}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha })
    });
    estado.shaCatalogo = cat.sha;
    return commit;
  }

  /* ---------- Entrada ---------- */

  function iniciarEntrada() {
    const p = lerPrefs();
    $('#in-repo').value = p.repo || REPO_PADRAO;
    $('#in-ramo').value = p.ramo || RAMO_PADRAO;

    $('#form-entrada').addEventListener('submit', async (e) => {
      e.preventDefault();
      const erro = $('#entrada-erro');
      const botao = e.submitter || $('#form-entrada button[type=submit]');
      erro.textContent = '';
      estado.token = $('#in-token').value.trim();
      estado.repo = $('#in-repo').value.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '') || REPO_PADRAO;
      estado.ramo = $('#in-ramo').value.trim() || RAMO_PADRAO;
      botao.disabled = true;
      botao.textContent = 'Entrando…';
      try {
        await entrarGitHub();
        if ($('#in-lembrar').checked) gravarPrefs({ token: estado.token, repo: estado.repo, ramo: estado.ramo });
        else gravarPrefs({ repo: estado.repo, ramo: estado.ramo });
      } catch (err) {
        erro.textContent = explicarErro(err);
      } finally {
        botao.disabled = false;
        botao.textContent = 'Entrar';
      }
    });

    $('#btn-teste').addEventListener('click', () => {
      estado.modo = 'teste';
      const base = typeof PRODUTOS !== 'undefined' ? PRODUTOS : [];
      abrirPainel(clone(base));
    });

    // Já entrou antes neste aparelho
    if (p.token) {
      estado.token = p.token; estado.repo = p.repo || REPO_PADRAO; estado.ramo = p.ramo || RAMO_PADRAO;
      entrarGitHub().catch((err) => {
        $('#entrada-erro').textContent = explicarErro(err);
      });
    }
  }

  async function entrarGitHub() {
    const lista = await carregarDoGitHub();
    estado.modo = 'github';
    abrirPainel(lista);
  }

  function explicarErro(err) {
    if (err.status === 401) return 'Chave recusada. Confira se copiou inteira e se não venceu.';
    if (err.status === 403) return 'A chave não tem permissão de escrita (Contents: Read and write) neste repositório.';
    if (err.status === 404) return 'Repositório, ramo ou catálogo não encontrado. Confira em “Repositório e ramo”.';
    if (err.status === 409 || err.status === 422) return 'O GitHub recusou a gravação. Recarregue a página e tente de novo.';
    if (err instanceof TypeError) return 'Sem conexão com o GitHub. Confira a internet.';
    return `Não deu certo: ${err.message}`;
  }

  function abrirPainel(lista) {
    estado.original = clone(lista);
    estado.produtos = clone(lista);
    $('#entrada').hidden = true;
    $('#painel').hidden = false;
    $('#topo-modo').textContent = estado.modo === 'github'
      ? `${estado.repo} · ${estado.ramo}`
      : 'Modo de teste — nada é publicado';
    $('#topo-modo').dataset.modo = estado.modo;
    $('#btn-salvar').textContent = estado.modo === 'github' ? 'Publicar no site' : 'Baixar catalogo.js';
    desenhar();
  }

  $('#btn-sair').addEventListener('click', () => {
    if (mudancas() && !confirm('Há alterações não publicadas. Sair mesmo assim?')) return;
    apagarPrefs();
    location.reload();
  });

  /* ---------- Diferenças ---------- */

  const chaveDe = (p) => JSON.stringify(p);

  function mudancas() {
    const a = estado.original, b = estado.produtos;
    const porId = new Map(a.map((p) => [p.id, chaveDe(p)]));
    let n = 0;
    b.forEach((p) => { if (porId.get(p.id) !== chaveDe(p)) n++; });
    a.forEach((p) => { if (!b.some((q) => q.id === p.id)) n++; });
    const ordem = a.map((p) => p.id).join() !== b.map((p) => p.id).join();
    return n || (ordem ? 1 : 0);
  }

  const alterado = (p) => {
    const o = estado.original.find((x) => x.id === p.id);
    return !o ? 'novo' : chaveDe(o) !== chaveDe(p) ? 'editado' : '';
  };

  function atualizarBarra() {
    const n = mudancas();
    $('#barra').dataset.visivel = n ? 'true' : 'false';
    $('#barra-txt').textContent = n === 1 ? '1 alteração não publicada' : `${n} alterações não publicadas`;
  }

  window.addEventListener('beforeunload', (e) => {
    if (mudancas()) { e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------- Foto de um produto ---------- */

  function urlFoto(p, cor) {
    const caminho = p.imagens?.[cor];
    if (caminho && estado.fotos.has(caminho)) return estado.fotos.get(caminho).url;
    if (caminho) return caminho;
    if (p.fotos === false) return '';
    return `${PASTA_FOTOS}/${p.id}/${slug(cor)}.webp`;
  }

  /* ---------- Painel ---------- */

  function desenhar() {
    desenharNumeros();
    desenharFiltros();
    desenharLinhas();
    atualizarBarra();
  }

  function desenharNumeros() {
    const ps = estado.produtos;
    const precos = ps.map((p) => +p.preco || 0);
    const dest = ps.filter((p) => p.destaque === 'principal').length;
    const media = precos.length ? precos.reduce((a, b) => a + b, 0) / precos.length : 0;
    $('#cabeca-sub').textContent = `${ps.length} produtos em ${new Set(ps.map((p) => p.categoria)).size} categorias`;
    $('#numeros').innerHTML = [
      ['Produtos', ps.length],
      ['Em destaque', `${dest}<small> / 5 na capa</small>`],
      ['Preço médio', brl(media)],
      ['Mais caro', brl(Math.max(0, ...precos))]
    ].map(([t, v]) => `<div class="numero"><span>${t}</span><b>${v}</b></div>`).join('');
  }

  function desenharFiltros() {
    const cont = (id) => id === 'todos' ? estado.produtos.length
      : estado.produtos.filter((p) => p.categoria === id).length;
    $('#filtro-cat').innerHTML = [{ id: 'todos', nome: 'Tudo' }, ...CATS].map((c) => `
      <button type="button" data-cat="${c.id}" aria-pressed="${estado.filtro === c.id}">
        ${esc(c.nome)} <span>${cont(c.id)}</span>
      </button>`).join('');
  }

  const visiveis = () => {
    const t = estado.termo.trim().toLowerCase();
    return estado.produtos.filter((p) =>
      (estado.filtro === 'todos' || p.categoria === estado.filtro)
      && (!t || `${p.nome} ${p.id} ${p.linha || ''}`.toLowerCase().includes(t)));
  };

  function desenharLinhas() {
    const lista = visiveis();
    $('#vazio').hidden = lista.length > 0;
    $('#linhas').innerHTML = lista.map((p) => {
      const idx = estado.produtos.indexOf(p);
      const foto = urlFoto(p, p.cores?.[0]);
      const marca = alterado(p);
      return `
      <tr data-id="${esc(p.id)}" data-alterado="${marca}">
        <td class="c-ordem">
          <button class="seta" type="button" data-mover="-1" aria-label="Subir ${esc(p.nome)}" ${idx === 0 ? 'disabled' : ''}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg></button>
          <button class="seta" type="button" data-mover="1" aria-label="Descer ${esc(p.nome)}" ${idx === estado.produtos.length - 1 ? 'disabled' : ''}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
        </td>
        <td>
          <button class="prod" type="button" data-editar>
            <span class="miniatura">${foto ? `<img src="${esc(foto)}" alt="" loading="lazy" onerror="this.remove()">` : ''}</span>
            <span class="prod-txt">
              <b>${esc(p.nome)}</b>
              <small>${esc(p.linha || p.id)}${marca ? ` · <em>${marca}</em>` : ''}</small>
            </span>
          </button>
        </td>
        <td class="c-cat"><span class="etiqueta">${esc(nomeCat(p.categoria))}</span></td>
        <td class="c-preco" data-rotulo="Preço">
          <input class="preco" type="number" min="0" step="1" inputmode="numeric" value="${+p.preco || 0}"
                 data-campo="preco" aria-label="Preço de ${esc(p.nome)}">
        </td>
        <td class="c-preco" data-rotulo="Oficial">
          <input class="preco preco--leve" type="number" min="0" step="1" inputmode="numeric" value="${p.precoOficial || ''}"
                 data-campo="precoOficial" placeholder="—" aria-label="Preço oficial de ${esc(p.nome)}">
        </td>
        <td class="c-dest">
          <label class="chave">
            <input type="checkbox" data-campo="destaque" ${p.destaque === 'principal' ? 'checked' : ''}
                   aria-label="${esc(p.nome)} em destaque">
            <span></span>
          </label>
        </td>
        <td class="c-acoes">
          <button class="btn btn--leve btn--peq" type="button" data-editar>Editar</button>
        </td>
      </tr>`;
    }).join('');
  }

  const produtoDaLinha = (el) => estado.produtos.find((p) => p.id === el.closest('tr')?.dataset.id);

  $('#linhas').addEventListener('change', (e) => {
    const campo = e.target.dataset.campo;
    const p = produtoDaLinha(e.target);
    if (!campo || !p) return;
    if (campo === 'destaque') {
      if (e.target.checked) p.destaque = 'principal'; else delete p.destaque;
    } else {
      const v = Math.round(Number(e.target.value));
      if (campo === 'precoOficial' && !v) delete p.precoOficial;
      else p[campo] = Math.max(0, v || 0);
    }
    const tr = e.target.closest('tr');
    tr.dataset.alterado = alterado(p);
    tr.querySelector('.prod-txt small').innerHTML =
      `${esc(p.linha || p.id)}${tr.dataset.alterado ? ` · <em>${tr.dataset.alterado}</em>` : ''}`;
    desenharNumeros();
    atualizarBarra();
  });

  $('#linhas').addEventListener('click', (e) => {
    const p = produtoDaLinha(e.target);
    if (!p) return;
    if (e.target.closest('[data-editar]')) return abrirEditor(p);
    const mover = e.target.closest('[data-mover]');
    if (mover) {
      const i = estado.produtos.indexOf(p);
      const j = i + Number(mover.dataset.mover);
      if (j < 0 || j >= estado.produtos.length) return;
      [estado.produtos[i], estado.produtos[j]] = [estado.produtos[j], estado.produtos[i]];
      desenharLinhas();
      atualizarBarra();
      $(`tr[data-id="${CSS.escape(p.id)}"] [data-mover="${mover.dataset.mover}"]`)?.focus();
    }
  });

  $('#filtro-cat').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    estado.filtro = b.dataset.cat;
    desenharFiltros();
    desenharLinhas();
  });

  $('#busca').addEventListener('input', (e) => { estado.termo = e.target.value; desenharLinhas(); });

  /* ---------- Reajuste em lote ---------- */

  $('#btn-reajuste').addEventListener('click', () => {
    const n = visiveis().length;
    $('#reajuste-alvo').textContent = estado.filtro === 'todos' && !estado.termo
      ? `Vale para os ${n} produtos da loja.`
      : `Vale para os ${n} produtos filtrados agora (${nomeCat(estado.filtro) === 'todos' ? 'Tudo' : nomeCat(estado.filtro)}).`;
    $('#reajuste').showModal();
  });

  $('#reajuste').addEventListener('close', () => {
    if ($('#reajuste').returnValue !== 'ok') return;
    const pct = Number($('#reajuste-pct').value) || 0;
    const arred = $('#reajuste-arred').checked;
    if (!pct) return;
    const lista = visiveis();
    lista.forEach((p) => {
      let v = Math.round((+p.preco || 0) * (1 + pct / 100));
      if (arred && v > 20) v = Math.max(9, Math.round((v + 1) / 10) * 10 - 1);
      p.preco = v;
    });
    desenhar();
    toast(`${lista.length} preços ${pct > 0 ? 'aumentados' : 'reduzidos'} em ${Math.abs(pct)}%. Revise e publique.`);
  });

  /* ---------- Editor ---------- */

  const ed = $('#editor');
  const fed = $('#form-editor');
  let editando = null;   // o objeto de produto (cópia de trabalho)
  let alvo = null;       // o original na lista, ou null se é novo
  let idManual = false;

  $('#ed-categoria').innerHTML = CATS.map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join('');

  $('#btn-novo').addEventListener('click', () => abrirEditor(null));

  function abrirEditor(p) {
    alvo = p;
    editando = p ? clone(p) : {
      id: '', nome: '', categoria: estado.filtro !== 'todos' ? estado.filtro : (CATS[0]?.id || 'iphone'),
      linha: '', preco: 0, chamada: '', resumo: '', cores: [], capacidades: [], specs: []
    };
    idManual = !!p;
    $('#editor-titulo').textContent = p ? p.nome : 'Novo produto';
    $('#ed-perigo').hidden = !p;

    fed.nome.value = editando.nome || '';
    fed.categoria.value = editando.categoria;
    fed.id.value = editando.id || '';
    fed.id.readOnly = !!p && !!estado.original.find((o) => o.id === p.id);
    fed.linha.value = editando.linha || '';
    fed.preco.value = editando.preco || '';
    fed.precoOficial.value = editando.precoOficial || '';
    fed.destaque.checked = editando.destaque === 'principal';
    fed.chamada.value = editando.chamada || '';
    fed.resumo.value = editando.resumo || '';
    $('[data-id-preview]').textContent = editando.id || '…';

    desenharCores();
    desenharCaps();
    desenharSpecs();
    ed.showModal();
    ed.querySelector('.editor-corpo').scrollTop = 0;
    if (!p) fed.nome.focus();
  }

  fed.nome.addEventListener('input', () => {
    if (!idManual && !fed.id.readOnly) {
      fed.id.value = slug(fed.nome.value);
      $('[data-id-preview]').textContent = fed.id.value || '…';
    }
  });
  fed.id.addEventListener('input', () => {
    idManual = true;
    fed.id.value = slug(fed.id.value) + (fed.id.value.endsWith('-') ? '-' : '');
    $('[data-id-preview]').textContent = fed.id.value || '…';
  });

  ed.querySelector('[data-fechar]').addEventListener('click', () => ed.close('cancelar'));
  ed.addEventListener('cancel', () => { ed.returnValue = 'cancelar'; });

  /* -- Cores -- */

  function desenharCores() {
    const cores = editando.cores || [];
    $('#ed-cores').innerHTML = cores.length ? cores.map((c, i) => {
      const url = urlFoto(editando, c);
      const hex = editando.coresHex?.[c] || '#d2cec7';
      return `
      <div class="cor" data-i="${i}">
        <label class="cor-foto" title="Trocar foto">
          ${url ? `<img src="${esc(url)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'cor-sem',textContent:'Sem foto'}))">`
                : '<span class="cor-sem">Sem foto</span>'}
          <input type="file" accept="image/png,image/jpeg,image/webp" data-foto hidden>
          <span class="cor-trocar">Enviar foto</span>
        </label>
        <div class="cor-campos">
          <input type="text" value="${esc(c)}" data-cor-nome aria-label="Nome da cor" placeholder="Nome da cor">
          <label class="cor-hex" title="Tom da bolinha">
            <input type="color" value="${esc(hex)}" data-cor-hex aria-label="Tom da cor ${esc(c)}">
          </label>
        </div>
        <button class="x" type="button" data-remover-cor aria-label="Remover a cor ${esc(c)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </div>`;
    }).join('') : '<p class="dica">Nenhuma cor ainda.</p>';
  }

  $('#ed-add-cor').addEventListener('click', () => {
    editando.cores = editando.cores || [];
    let nome = 'Nova cor', n = 2;
    while (editando.cores.includes(nome)) nome = `Nova cor ${n++}`;
    editando.cores.push(nome);
    desenharCores();
    $$('#ed-cores [data-cor-nome]').at(-1)?.select();
  });

  $('#ed-cores').addEventListener('click', (e) => {
    const linha = e.target.closest('.cor');
    if (!linha || !e.target.closest('[data-remover-cor]')) return;
    const cor = editando.cores[+linha.dataset.i];
    editando.cores.splice(+linha.dataset.i, 1);
    if (editando.imagens) delete editando.imagens[cor];
    if (editando.coresHex) delete editando.coresHex[cor];
    desenharCores();
  });

  $('#ed-cores').addEventListener('change', async (e) => {
    const linha = e.target.closest('.cor');
    if (!linha) return;
    const i = +linha.dataset.i;
    const cor = editando.cores[i];

    if (e.target.matches('[data-cor-nome]')) {
      const novo = e.target.value.trim();
      if (!novo || novo === cor) { e.target.value = cor; return; }
      if (editando.cores.includes(novo)) { toast('Já existe uma cor com esse nome.', 'erro'); e.target.value = cor; return; }
      editando.cores[i] = novo;
      for (const k of ['imagens', 'coresHex']) {
        if (editando[k]?.[cor] !== undefined) { editando[k][novo] = editando[k][cor]; delete editando[k][cor]; }
      }
      // Sem foto cadastrada, a regra do nome mudaria o arquivo procurado:
      // fixa o caminho antigo para a foto existente não se perder.
      if (!editando.imagens?.[novo] && alvo && editando.fotos !== false && estado.original.some((o) => o.id === editando.id)) {
        editando.imagens = { ...(editando.imagens || {}), [novo]: `${PASTA_FOTOS}/${editando.id}/${slug(cor)}.webp` };
      }
      desenharCores();
    }

    if (e.target.matches('[data-cor-hex]')) {
      editando.coresHex = { ...(editando.coresHex || {}), [cor]: e.target.value };
    }

    if (e.target.matches('[data-foto]') && e.target.files[0]) {
      const id = slug(fed.id.value) || slug(fed.nome.value);
      if (!id) { toast('Dê um nome ao produto antes de enviar foto.', 'erro'); return; }
      try {
        const blob = await prepararFoto(e.target.files[0]);
        const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg';
        const caminho = `${PASTA_FOTOS}/${id}/${slug(cor) || 'foto'}.${ext}`;
        const antigo = estado.fotos.get(caminho);
        if (antigo) URL.revokeObjectURL(antigo.url);
        estado.fotos.set(caminho, { blob, url: URL.createObjectURL(blob) });
        editando.imagens = { ...(editando.imagens || {}), [cor]: caminho };
        delete editando.fotos;
        desenharCores();
      } catch {
        toast('Não consegui ler essa imagem. Tente PNG, JPG ou WEBP.', 'erro');
      }
    }
  });

  /* Reduz para no máximo LADO_MAX px e converte para WEBP quando o
     navegador sabe (Chrome, Edge, Firefox). O Safari não gera WEBP:
     lá sai PNG, que preserva o fundo transparente. */
  async function prepararFoto(arquivo) {
    const bmp = await createImageBitmap(arquivo);
    const k = Math.min(1, LADO_MAX / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * k), h = Math.round(bmp.height * k);
    const tela = document.createElement('canvas');
    tela.width = w; tela.height = h;
    tela.getContext('2d').drawImage(bmp, 0, 0, w, h);
    const gerar = (tipo, q) => new Promise((ok) => tela.toBlob(ok, tipo, q));
    let blob = await gerar('image/webp', 0.86);
    if (!blob || blob.type !== 'image/webp') blob = await gerar('image/png');
    // Se o original já era menor, fica com ele.
    if (k === 1 && arquivo.size < blob.size && /image\/(webp|png|jpeg)/.test(arquivo.type)) return arquivo;
    return blob;
  }

  /* -- Capacidades -- */

  function desenharCaps() {
    const caps = editando.capacidades || [];
    $('#ed-caps').innerHTML = caps.map((c, i) => `
      <span class="ficha">${esc(c)}
        <button type="button" data-i="${i}" aria-label="Remover ${esc(c)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </span>`).join('') || '<p class="dica">Nenhuma ainda.</p>';
  }

  const addCap = () => {
    const inp = $('#ed-cap-nova');
    inp.value.split(',').map((s) => s.trim()).filter(Boolean).forEach((v) => {
      editando.capacidades = editando.capacidades || [];
      if (!editando.capacidades.includes(v)) editando.capacidades.push(v);
    });
    inp.value = '';
    desenharCaps();
  };
  $('#ed-add-cap').addEventListener('click', addCap);
  $('#ed-cap-nova').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addCap(); } });
  $('#ed-caps').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-i]');
    if (!b) return;
    editando.capacidades.splice(+b.dataset.i, 1);
    desenharCaps();
  });

  /* -- Especificações -- */

  function desenharSpecs() {
    const specs = editando.specs || [];
    $('#ed-specs').innerHTML = specs.map(([k, v], i) => `
      <div class="spec" data-i="${i}">
        <input type="text" value="${esc(k)}" data-k="0" placeholder="Tela" aria-label="Item">
        <input type="text" value="${esc(v)}" data-k="1" placeholder='6,3" Super Retina XDR' aria-label="Valor">
        <button class="x" type="button" data-remover-spec aria-label="Remover linha">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </div>`).join('') || '<p class="dica">Nenhuma ainda.</p>';
  }

  $('#ed-add-spec').addEventListener('click', () => {
    editando.specs = editando.specs || [];
    editando.specs.push(['', '']);
    desenharSpecs();
    $$('#ed-specs .spec').at(-1)?.querySelector('input')?.focus();
  });
  $('#ed-specs').addEventListener('input', (e) => {
    const linha = e.target.closest('.spec');
    if (linha && e.target.dataset.k) editando.specs[+linha.dataset.i][+e.target.dataset.k] = e.target.value;
  });
  $('#ed-specs').addEventListener('click', (e) => {
    const linha = e.target.closest('.spec');
    if (!linha || !e.target.closest('[data-remover-spec]')) return;
    editando.specs.splice(+linha.dataset.i, 1);
    desenharSpecs();
  });

  /* -- Apagar -- */

  $('#ed-apagar').addEventListener('click', () => {
    if (!alvo || !confirm(`Apagar “${alvo.nome}” do site? Isso só vale depois de publicar.`)) return;
    estado.produtos = estado.produtos.filter((p) => p !== alvo);
    ed.close('apagado');
    desenhar();
    toast('Produto apagado. Publique para valer no site.');
  });

  /* -- Concluir -- */

  fed.addEventListener('submit', (e) => {
    const sub = e.submitter?.value;
    if (sub !== 'ok') return;
    e.preventDefault();

    const nome = fed.nome.value.trim();
    const id = slug(fed.id.value);
    const preco = Math.round(Number(fed.preco.value));
    const erros = [];
    if (!nome) erros.push('o nome');
    if (!id) erros.push('o endereço da página');
    if (!preco) erros.push('o preço');
    if (erros.length) { toast(`Falta preencher ${erros.join(', ')}.`, 'erro'); return; }
    if (estado.produtos.some((p) => p.id === id && p !== alvo)) {
      toast('Já existe um produto com esse endereço. Mude o endereço da página.', 'erro');
      fed.id.focus();
      return;
    }

    const p = editando;
    p.id = id;
    p.nome = nome;
    p.categoria = fed.categoria.value;
    p.preco = preco;
    const oficial = Math.round(Number(fed.precoOficial.value));
    if (oficial) p.precoOficial = oficial; else delete p.precoOficial;
    if (fed.destaque.checked) p.destaque = 'principal'; else delete p.destaque;
    for (const k of ['linha', 'chamada', 'resumo']) {
      const v = fed[k].value.trim();
      if (v) p[k] = v; else delete p[k];
    }
    p.specs = (p.specs || []).filter(([k, v]) => String(k).trim() && String(v).trim());
    p.capacidades = p.capacidades?.length ? p.capacidades : ['Único'];
    p.cores = p.cores || [];

    // Fotos: produto novo sem foto enviada usa o desenho, em vez de
    // procurar um arquivo que não existe.
    if (p.imagens) {
      Object.keys(p.imagens).forEach((c) => { if (!p.cores.includes(c)) delete p.imagens[c]; });
      if (!Object.keys(p.imagens).length) delete p.imagens;
    }
    if (p.coresHex) {
      Object.keys(p.coresHex).forEach((c) => { if (!p.cores.includes(c)) delete p.coresHex[c]; });
      if (!Object.keys(p.coresHex).length) delete p.coresHex;
    }
    const publicado = estado.original.some((o) => o.id === p.id);
    if (!publicado && !p.imagens) p.fotos = false;

    // Ordem fixa das chaves, para o catálogo ficar legível e o diff limpo.
    const ordem = ['id', 'nome', 'categoria', 'linha', 'preco', 'precoOficial', 'destaque', 'chamada',
      'resumo', 'cores', 'coresHex', 'imagens', 'fotos', 'capacidades', 'specs', 'vistas'];
    const limpo = {};
    ordem.forEach((k) => { if (p[k] !== undefined) limpo[k] = p[k]; });
    Object.keys(p).forEach((k) => { if (!(k in limpo)) limpo[k] = p[k]; });

    if (alvo) estado.produtos[estado.produtos.indexOf(alvo)] = limpo;
    else estado.produtos.unshift(limpo);

    ed.close('ok');
    desenhar();
    requestAnimationFrame(() => {
      const tr = $(`tr[data-id="${CSS.escape(limpo.id)}"]`);
      tr?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
    toast(alvo ? 'Produto atualizado. Publique para valer no site.' : 'Produto criado. Publique para valer no site.');
  });

  /* ---------- Salvar / descartar ---------- */

  $('#btn-descartar').addEventListener('click', () => {
    if (!confirm('Descartar todas as alterações não publicadas?')) return;
    estado.produtos = clone(estado.original);
    desenhar();
  });

  $('#btn-salvar').addEventListener('click', async () => {
    const botao = $('#btn-salvar');

    if (estado.modo !== 'github') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([escreverCatalogo(estado.produtos)], { type: 'text/javascript' }));
      a.download = 'catalogo.js';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      if (estado.fotos.size) toast('catalogo.js baixado. As fotos novas só sobem no modo conectado ao GitHub.');
      else toast('catalogo.js baixado. Substitua o arquivo em assets/js/ na hospedagem.');
      return;
    }

    const n = mudancas();
    const nomes = estado.produtos.filter((p) => alterado(p)).map((p) => p.nome).slice(0, 4);
    const msg = `Painel: ${n} alteraç${n === 1 ? 'ão' : 'ões'} no catálogo${nomes.length ? ` (${nomes.join(', ')})` : ''}`;

    botao.disabled = true;
    botao.textContent = 'Publicando…';
    try {
      await publicar(estado.produtos, msg);
      estado.original = clone(estado.produtos);
      // A prévia continua valendo até a hospedagem publicar o arquivo.
      estado.fotos.forEach((f) => { f.enviada = true; });
      desenhar();
      toast('Publicado. O site atualiza em cerca de 1 minuto.', 'ok');
    } catch (err) {
      if (err.message !== 'cancelado') toast(explicarErro(err), 'erro');
    } finally {
      botao.disabled = false;
      botao.textContent = 'Publicar no site';
    }
  });

  iniciarEntrada();
})();

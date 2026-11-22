/* =============================================================
   PAINEL — produtos, preços, ofertas, eventos e preço automático
   -------------------------------------------------------------
   O site não tem servidor, então o painel grava direto no
   repositório do GitHub:
     • assets/js/catalogo.js  — os produtos
     • assets/js/loja.js      — eventos e regra de preço automático
     • assets/img/produtos/<id>/ — as fotos enviadas
   Tudo vai num commit só, e a hospedagem publica sozinha.

   As contas (preço por capacidade, oferta, dólar) moram em
   regras.js, o mesmo arquivo que o site e o robô diário usam.
   ============================================================= */

(() => {
  'use strict';

  const ARQ_CATALOGO = 'assets/js/catalogo.js';
  const ARQ_LOJA = 'assets/js/loja.js';
  const PASTA_FOTOS = 'assets/img/produtos';
  const CHAVE = 'alianca:admin';
  const REPO_PADRAO = 'Mywons/site-alian-a-eduardo';
  const RAMO_PADRAO = 'main';
  const LADO_MAX = 1600;
  const R = window.REGRAS;

  const LOJA_PADRAO = {
    precificacao: { automatico: false, dolar: 5.5, dolarAjuste: 0, dolarEm: '', custosExtras: 0,
      margem: { tipo: '%', valor: 15 }, arredondar: '99', limiteVariacao: 8, ultimaExecucao: '', alertas: [] },
    eventos: []
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const brl = (n) => Number(n || 0).toLocaleString('pt-BR',
    { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const num = (v) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));
  const dataBR = (d) => (d ? d.split('-').reverse().join('/') : '');
  const slug = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const semMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Fecha um diálogo com a animação de saída antes do close de
     verdade. Sem movimento, fecha na hora. */
  function fechar(dlg, valor) {
    if (!dlg.open) return;
    if (semMovimento()) { dlg.close(valor); return; }
    dlg.classList.add('fechando');
    setTimeout(() => { dlg.classList.remove('fechando'); dlg.close(valor); }, 180);
  }

  /* Números que contam até o valor novo, em vez de trocar de repente. */
  function contar(el, alvo) {
    const de = Number(el.dataset.valor || 0);
    el.dataset.valor = String(alvo);
    if (semMovimento() || de === alvo) { el.textContent = alvo; return; }
    const t0 = performance.now(), dur = 600;
    const passo = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(de + (alvo - de) * e);
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  const CATS = (typeof CATEGORIAS !== 'undefined' ? CATEGORIAS : []).filter((c) => c.id !== 'todos');
  const nomeCat = (id) => CATS.find((c) => c.id === id)?.nome || id;

  /* ---------- Estado ---------- */

  const estado = {
    modo: null, token: '', repo: REPO_PADRAO, ramo: RAMO_PADRAO,
    sha: { catalogo: null, loja: null },
    original: [], produtos: [],
    lojaOriginal: clone(LOJA_PADRAO), loja: clone(LOJA_PADRAO),
    fotos: new Map(),
    filtro: 'todos', termo: '', aba: 'produtos'
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

  /* Os dois arquivos são `const NOME = <JSON>;` com um comentário em
     cima. Lê só a parte JSON. */
  function lerJSON(texto, nome, abre, fecha) {
    const ini = texto.indexOf(abre, texto.indexOf(`const ${nome}`));
    const fim = texto.lastIndexOf(fecha);
    if (ini < 0 || fim < ini) throw new Error(`${nome} num formato que o painel não reconhece`);
    return JSON.parse(texto.slice(ini, fim + 1));
  }

  const escreverCatalogo = (produtos) => `/* =============================================================
   CATÁLOGO — gerado pelo painel (admin.html)
   -------------------------------------------------------------
   Este arquivo é reescrito inteiro sempre que alguém salva no
   painel de administração. Pode editar à mão, mas mantenha o
   formato JSON (aspas duplas, sem comentário dentro da lista),
   senão o painel não consegue ler de volta.
   ============================================================= */
const PRODUTOS = ${JSON.stringify(produtos, null, 2)};
`;

  const escreverLoja = (loja) => `/* =============================================================
   LOJA — eventos e preço automático (gerado pelo painel)
   -------------------------------------------------------------
   Reescrito pelo painel (admin.html) e pelo robô diário de preços.
   Mantenha o formato JSON se editar à mão.
   ============================================================= */
const LOJA = ${JSON.stringify(loja, null, 2)};
`;

  async function lerArquivo(caminho, ref) {
    try {
      return await gh(`/repos/${estado.repo}/contents/${caminho}?ref=${encodeURIComponent(ref)}`);
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }

  async function carregarDoGitHub() {
    const cat = await lerArquivo(ARQ_CATALOGO, estado.ramo);
    if (!cat) { const e = new Error('catálogo não encontrado'); e.status = 404; throw e; }
    estado.sha.catalogo = cat.sha;
    const produtos = lerJSON(b64ParaTexto(cat.content), 'PRODUTOS', '[', ']');
    const lj = await lerArquivo(ARQ_LOJA, estado.ramo);
    estado.sha.loja = lj ? lj.sha : null;
    const loja = lj ? lerJSON(b64ParaTexto(lj.content), 'LOJA', '{', '}') : clone(LOJA_PADRAO);
    return { produtos, loja };
  }

  /* Um commit só: blobs -> árvore -> commit -> mover o ramo. */
  async function publicar(mensagem) {
    const base = `/repos/${estado.repo}`;
    const ref = await gh(`${base}/git/ref/heads/${encodeURIComponent(estado.ramo)}`);
    const pai = ref.object.sha;
    const commitPai = await gh(`${base}/git/commits/${pai}`);

    // Alguém (ou o robô) salvou depois que esta página abriu?
    const [catAgora, lojaAgora] = await Promise.all([lerArquivo(ARQ_CATALOGO, pai), lerArquivo(ARQ_LOJA, pai)]);
    const mudouFora = (catAgora && catAgora.sha !== estado.sha.catalogo)
      || ((lojaAgora?.sha || null) !== estado.sha.loja);
    if (mudouFora && !confirm('O catálogo foi alterado em outro lugar (talvez pelo robô de preços) depois que você abriu o painel.\n\n'
      + 'Publicar mesmo assim substitui aquela versão pela sua. Para não perder nada, cancele e recarregue a página. Continuar?')) {
      throw new Error('cancelado');
    }

    const blob = async (conteudo) => (await gh(`${base}/git/blobs`, {
      method: 'POST', body: JSON.stringify({ content: conteudo, encoding: 'base64' })
    })).sha;

    const usadas = new Set(estado.produtos.flatMap((p) => Object.values(p.imagens || {})));
    const arvore = [];
    for (const [caminho, foto] of estado.fotos) {
      if (!usadas.has(caminho) || foto.enviada) continue;
      arvore.push({ path: caminho, mode: '100644', type: 'blob', sha: await blob(await blobParaB64(foto.blob)) });
    }
    const shaCat = await blob(textoParaB64(escreverCatalogo(estado.produtos)));
    const shaLoja = await blob(textoParaB64(escreverLoja(estado.loja)));
    arvore.push({ path: ARQ_CATALOGO, mode: '100644', type: 'blob', sha: shaCat });
    arvore.push({ path: ARQ_LOJA, mode: '100644', type: 'blob', sha: shaLoja });

    const tree = await gh(`${base}/git/trees`, {
      method: 'POST', body: JSON.stringify({ base_tree: commitPai.tree.sha, tree: arvore })
    });
    const commit = await gh(`${base}/git/commits`, {
      method: 'POST', body: JSON.stringify({ message: mensagem, tree: tree.sha, parents: [pai] })
    });
    await gh(`${base}/git/refs/heads/${encodeURIComponent(estado.ramo)}`, {
      method: 'PATCH', body: JSON.stringify({ sha: commit.sha })
    });
    estado.sha.catalogo = shaCat;
    estado.sha.loja = shaLoja;
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
        gravarPrefs($('#in-lembrar').checked
          ? { token: estado.token, repo: estado.repo, ramo: estado.ramo }
          : { repo: estado.repo, ramo: estado.ramo });
      } catch (err) {
        erro.textContent = explicarErro(err);
      } finally {
        botao.disabled = false;
        botao.textContent = 'Entrar';
      }
    });

    $('#btn-teste').addEventListener('click', () => {
      estado.modo = 'teste';
      abrirPainel(
        clone(typeof PRODUTOS !== 'undefined' ? PRODUTOS : []),
        clone(typeof LOJA !== 'undefined' ? LOJA : LOJA_PADRAO)
      );
    });

    if (p.token) {
      estado.token = p.token; estado.repo = p.repo || REPO_PADRAO; estado.ramo = p.ramo || RAMO_PADRAO;
      entrarGitHub().catch((err) => { $('#entrada-erro').textContent = explicarErro(err); });
    }
  }

  async function entrarGitHub() {
    const { produtos, loja } = await carregarDoGitHub();
    estado.modo = 'github';
    abrirPainel(produtos, loja);
  }

  function explicarErro(err) {
    if (err.status === 401) return 'Chave recusada. Confira se copiou inteira e se não venceu.';
    if (err.status === 403) return 'A chave não tem permissão de escrita (Contents: Read and write) neste repositório.';
    if (err.status === 404) return 'Repositório, ramo ou catálogo não encontrado. Confira em “Repositório e ramo”.';
    if (err.status === 409 || err.status === 422) return 'O GitHub recusou a gravação. Recarregue a página e tente de novo.';
    if (err instanceof TypeError) return 'Sem conexão com o GitHub. Confira a internet.';
    return `Não deu certo: ${err.message}`;
  }

  function abrirPainel(lista, loja) {
    const lj = { ...clone(LOJA_PADRAO), ...loja };
    lj.precificacao = { ...LOJA_PADRAO.precificacao, ...(loja.precificacao || {}) };
    estado.original = clone(lista);
    estado.produtos = clone(lista);
    estado.lojaOriginal = clone(lj);
    estado.loja = clone(lj);
    $('#entrada').hidden = true;
    $('#painel').hidden = false;
    $('#painel').classList.add('chegando');
    setTimeout(() => $('#painel').classList.remove('chegando'), 900);
    $('#topo-modo').textContent = estado.modo === 'github'
      ? `${estado.repo} · ${estado.ramo}` : 'Modo de teste — nada é publicado';
    $('#topo-modo').dataset.modo = estado.modo;
    $('#btn-salvar').textContent = estado.modo === 'github' ? 'Publicar no site' : 'Baixar arquivos';
    desenhar(true);
    preencherRegra();
    requestAnimationFrame(moverIndicador);
  }

  $('#btn-sair').addEventListener('click', () => {
    if (mudancas() && !confirm('Há alterações não publicadas. Sair mesmo assim?')) return;
    apagarPrefs();
    location.reload();
  });

  /* ---------- Abas ---------- */

  /* A pílula escura desliza até a aba escolhida. */
  function moverIndicador() {
    const ativa = $('[data-aba][aria-selected="true"]');
    const ind = $('.abas-indicador');
    if (!ativa || !ind) return;
    ind.style.width = `${ativa.offsetWidth}px`;
    ind.style.transform = `translateX(${ativa.offsetLeft - 3}px)`;
  }
  window.addEventListener('resize', moverIndicador);

  $$('[data-aba]').forEach((b) => b.addEventListener('click', () => {
    estado.aba = b.dataset.aba;
    $$('[data-aba]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    moverIndicador();
    $$('.aba').forEach((s) => { s.hidden = s.id !== `aba-${estado.aba}`; });
    if (estado.aba === 'produtos') desenharLinhas(true);
    if (estado.aba === 'ofertas') desenharOfertas();
    if (estado.aba === 'precos') desenharPrecos();
  }));

  /* ---------- Diferenças ---------- */

  const chaveDe = (p) => JSON.stringify(p);

  function mudancas() {
    const a = estado.original, b = estado.produtos;
    const porId = new Map(a.map((p) => [p.id, chaveDe(p)]));
    let n = 0;
    b.forEach((p) => { if (porId.get(p.id) !== chaveDe(p)) n++; });
    a.forEach((p) => { if (!b.some((q) => q.id === p.id)) n++; });
    if (!n && a.map((p) => p.id).join() !== b.map((p) => p.id).join()) n = 1;
    if (JSON.stringify(estado.loja) !== JSON.stringify(estado.lojaOriginal)) n++;
    return n;
  }

  const alterado = (p) => {
    const o = estado.original.find((x) => x.id === p.id);
    return !o ? 'novo' : chaveDe(o) !== chaveDe(p) ? 'editado' : '';
  };

  function atualizarBarra() {
    const n = mudancas();
    $('#barra').dataset.visivel = n ? 'true' : 'false';
    const txt = n === 1 ? '1 alteração não publicada' : `${n} alterações não publicadas`;
    if (n && $('#barra-txt').textContent !== txt && !semMovimento()) {
      $('#barra').classList.remove('pulou');
      void $('#barra').offsetWidth;
      $('#barra').classList.add('pulou');
    }
    $('#barra-txt').textContent = txt;
  }

  window.addEventListener('beforeunload', (e) => {
    if (mudancas()) { e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------- Foto ---------- */

  function urlFoto(p, cor) {
    const caminho = p.imagens?.[cor];
    if (caminho && estado.fotos.has(caminho)) return estado.fotos.get(caminho).url;
    if (caminho) return caminho;
    if (p.fotos === false) return '';
    return `${PASTA_FOTOS}/${p.id}/${slug(cor)}.webp`;
  }

  /* ---------- Produtos: resumo, filtros, tabela ---------- */

  function desenhar(animar = false) {
    desenharNumeros();
    desenharFiltros();
    desenharLinhas(animar);
    atualizarBarra();
  }

  function desenharNumeros() {
    const ps = estado.produtos;
    const noSite = ps.filter(R.visivel);
    const ofertas = noSite.filter((p) => R.ofertaAtiva(p)).length;
    const esgot = noSite.filter((p) => R.statusDe(p) === 'esgotado').length;
    const dest = noSite.filter((p) => p.destaque === 'principal').length;
    $('#cabeca-sub').textContent = `${noSite.length} no site · ${ps.length - noSite.length} escondidos`;
    const dados = [
      ['No site', noSite.length, ` de ${ps.length}`],
      ['Em oferta hoje', ofertas, ''],
      ['Esgotados', esgot, ''],
      ['Em destaque', dest, ' / 5 na capa']
    ];
    const caixa = $('#numeros');
    if (!caixa.children.length) {
      caixa.innerHTML = dados.map(([t]) => `<div class="numero"><span>${t}</span><b><i data-n>0</i><small></small></b></div>`).join('');
    }
    dados.forEach(([, n, extra], k) => {
      const card = caixa.children[k];
      contar(card.querySelector('[data-n]'), n);
      card.querySelector('small').textContent = extra;
    });
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

  /* Preço "simples": todas as capacidades custam igual — dá para
     editar direto na linha. Com preços diferentes, a linha mostra a
     faixa e o clique abre o editor. */
  const precoUnico = (p) => new Set(R.capacidadesDe(p).map((c) => R.precoTabela(p, c))).size <= 1;

  function selosLinha(p) {
    const s = [];
    if (p.oculto) s.push('<span class="sl sl--cinza">Escondido</span>');
    const st = R.statusDe(p);
    if (st === 'esgotado') s.push('<span class="sl sl--escuro">Esgotado</span>');
    if (st === 'encomenda') s.push('<span class="sl">Encomenda</span>');
    if ((p.esgotadas || []).length && st !== 'esgotado') s.push(`<span class="sl">${p.esgotadas.length} opç${p.esgotadas.length === 1 ? 'ão' : 'ões'} esgotada${p.esgotadas.length === 1 ? '' : 's'}</span>`);
    if (p.precoManual) s.push('<span class="sl sl--cinza">Preço manual</span>');
    return s.join('');
  }

  function celulaOferta(p) {
    if (!p.oferta || !(Number(p.oferta.valor) > 0)) return '<span class="traco">—</span>';
    const ativa = R.ofertaAtiva(p);
    const v = p.oferta.tipo === 'R$' ? `−${brl(p.oferta.valor)}` : `−${p.oferta.valor}%`;
    const quando = p.oferta.fim ? `até ${dataBR(p.oferta.fim)}` : 'sem prazo';
    const futura = !ativa && p.oferta.inicio && p.oferta.inicio > R.hoje();
    return `<button class="oferta-chip${ativa ? '' : ' oferta-chip--off'}" type="button" data-editar="oferta">
      <b>${v}</b><small>${ativa ? quando : futura ? `começa ${dataBR(p.oferta.inicio)}` : 'encerrada'}</small></button>`;
  }

  function desenharLinhas(animar = false) {
    const lista = visiveis();
    $('#vazio').hidden = lista.length > 0;
    const corpo = $('#linhas');
    corpo.classList.toggle('anima', animar && !semMovimento());
    corpo.innerHTML = lista.map((p, n) => {
      const idx = estado.produtos.indexOf(p);
      const foto = urlFoto(p, p.cores?.[0]);
      const marca = alterado(p);
      const caps = R.capacidadesDe(p);
      const valores = caps.map((c) => R.precoTabela(p, c));
      const preco = precoUnico(p)
        ? `<input class="preco" type="number" min="0" step="1" inputmode="numeric" value="${valores[0] || 0}"
                  data-campo="preco" aria-label="Preço de ${esc(p.nome)}">`
        : `<button class="preco-faixa" type="button" data-editar="preco">${brl(Math.min(...valores))}<small>até ${brl(Math.max(...valores))}</small></button>`;
      return `
      <tr data-id="${esc(p.id)}" data-alterado="${marca}" data-oculto="${!!p.oculto}" style="--i:${Math.min(n, 14)}">
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
              <span class="selos-linha">${selosLinha(p)}</span>
            </span>
          </button>
        </td>
        <td class="c-cat"><span class="etiqueta">${esc(nomeCat(p.categoria))}</span></td>
        <td class="c-preco" data-rotulo="Preço">${preco}</td>
        <td class="c-oferta" data-rotulo="Oferta">${celulaOferta(p)}</td>
        <td class="c-dest" data-rotulo="No site">
          <label class="chave"><input type="checkbox" data-campo="visivel" ${p.oculto ? '' : 'checked'}
                 aria-label="${esc(p.nome)} aparece no site"><span></span></label>
        </td>
        <td class="c-dest" data-rotulo="Destaque">
          <label class="chave"><input type="checkbox" data-campo="destaque" ${p.destaque === 'principal' ? 'checked' : ''}
                 aria-label="${esc(p.nome)} em destaque"><span></span></label>
        </td>
        <td class="c-acoes">
          <button class="btn btn--leve btn--peq" type="button" data-editar>Editar</button>
        </td>
      </tr>`;
    }).join('');
  }

  const produtoDaLinha = (el) => estado.produtos.find((p) => p.id === el.closest('tr')?.dataset.id);

  function pulsar(id) {
    if (semMovimento()) return;
    const tr = $(`tr[data-id="${CSS.escape(id)}"]`);
    if (tr) tr.classList.add('pulsa');
  }

  function mudouProduto(id) {
    desenharNumeros();
    desenharLinhas();
    atualizarBarra();
    if (id) pulsar(id);
  }

  $('#linhas').addEventListener('change', (e) => {
    const campo = e.target.dataset.campo;
    const p = produtoDaLinha(e.target);
    if (!campo || !p) return;
    if (campo === 'destaque') {
      if (e.target.checked) p.destaque = 'principal'; else delete p.destaque;
    } else if (campo === 'visivel') {
      if (e.target.checked) delete p.oculto; else p.oculto = true;
    } else if (campo === 'preco') {
      const v = Math.max(0, Math.round(Number(e.target.value)) || 0);
      p.preco = v;
      delete p.precos;
    }
    mudouProduto(p.id);
  });

  $('#linhas').addEventListener('click', (e) => {
    const p = produtoDaLinha(e.target);
    if (!p) return;
    const ed = e.target.closest('[data-editar]');
    if (ed) return abrirEditor(p, ed.dataset.editar);
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
    desenharLinhas(true);
  });

  $('#busca').addEventListener('input', (e) => { estado.termo = e.target.value; desenharLinhas(); });

  /* ---------- Reajuste em lote ---------- */

  $('#btn-reajuste').addEventListener('click', () => {
    const n = visiveis().length;
    $('#reajuste-alvo').textContent = estado.filtro === 'todos' && !estado.termo
      ? `Vale para os ${n} produtos da loja, em todas as capacidades.`
      : `Vale para os ${n} produtos filtrados agora, em todas as capacidades.`;
    $('#reajuste').showModal();
  });

  $('#reajuste').addEventListener('close', () => {
    if ($('#reajuste').returnValue !== 'ok') return;
    const pct = Number($('#reajuste-pct').value) || 0;
    const modo = $('#reajuste-arred').checked ? '9' : '0';
    if (!pct) return;
    const lista = visiveis();
    lista.forEach((p) => {
      const caps = R.capacidadesDe(p);
      const novos = {};
      caps.forEach((c) => { novos[c] = R.arredondar(R.precoTabela(p, c) * (1 + pct / 100), modo); });
      if (precoUnico(p)) { p.preco = novos[caps[0]]; delete p.precos; }
      else { p.precos = novos; R.sincronizarPreco(p); }
    });
    desenhar(true);
    toast(`${lista.length} produtos ${pct > 0 ? 'aumentados' : 'reduzidos'} em ${Math.abs(pct)}%. Revise e publique.`);
  });

  /* ---------- Biblioteca ---------- */

  const dlgBib = $('#biblioteca');

  function desenharBiblioteca() {
    const t = $('#bib-busca').value.trim().toLowerCase();
    const ids = new Set(estado.produtos.map((p) => p.id));
    const lista = (typeof BIBLIOTECA !== 'undefined' ? BIBLIOTECA : [])
      .filter((m) => !ids.has(m.id))
      .filter((m) => !t || `${m.nome} ${nomeCat(m.categoria)}`.toLowerCase().includes(t));
    $('#bib-lista').innerHTML = lista.length ? lista.map((m) => `
      <button class="bib-item" type="button" data-bib="${esc(m.id)}">
        <span class="etiqueta">${esc(nomeCat(m.categoria))}</span>
        <b>${esc(m.nome)}</b>
        <small>${esc(m.cores.length)} cor${m.cores.length === 1 ? '' : 'es'} · ${esc(m.capacidades.join(', '))}</small>
        <span class="bib-add">Adicionar</span>
      </button>`).join('')
      : '<p class="dica">Todos os modelos da biblioteca já estão no catálogo. Para outro, use “Novo produto”.</p>';
  }

  $('#btn-biblioteca').addEventListener('click', () => {
    $('#bib-busca').value = '';
    desenharBiblioteca();
    dlgBib.showModal();
  });
  $('#bib-busca').addEventListener('input', desenharBiblioteca);
  $('#bib-lista').addEventListener('click', (e) => {
    const b = e.target.closest('[data-bib]');
    if (!b) return;
    const modelo = BIBLIOTECA.find((m) => m.id === b.dataset.bib);
    fechar(dlgBib);
    abrirEditor(null, 'preco', { ...clone(modelo), preco: 0, fotos: false });
  });

  /* ---------- Editor ---------- */

  const ed = $('#editor');
  const fed = $('#form-editor');
  let editando = null;
  let alvo = null;
  let idManual = false;

  $('#ed-categoria').innerHTML = CATS.map((c) => `<option value="${c.id}">${esc(c.nome)}</option>`).join('');

  $('#btn-novo').addEventListener('click', () => abrirEditor(null));

  function abrirEditor(p, secao, modelo) {
    alvo = p;
    editando = p ? clone(p) : (modelo || {
      id: '', nome: '', categoria: estado.filtro !== 'todos' ? estado.filtro : (CATS[0]?.id || 'iphone'),
      linha: '', preco: 0, chamada: '', resumo: '', cores: [], capacidades: [], specs: []
    });
    idManual = !!p || !!modelo;
    $('#editor-titulo').textContent = p ? p.nome : modelo ? `Novo: ${modelo.nome}` : 'Novo produto';
    $('#ed-perigo').hidden = !p;

    const publicado = !!p && estado.original.some((o) => o.id === p.id);
    fed.nome.value = editando.nome || '';
    fed.categoria.value = editando.categoria;
    fed.id.value = editando.id || '';
    fed.id.readOnly = publicado;
    fed.linha.value = editando.linha || '';
    fed.moedaCusto.value = editando.moedaCusto || 'USD';
    fed.margemValor.value = editando.margem?.valor ?? '';
    fed.margemTipo.value = editando.margem?.tipo || '%';
    fed.precoManual.checked = !!editando.precoManual;
    fed.precoOficial.value = editando.precoOficial || '';
    fed.destaque.checked = editando.destaque === 'principal';
    const o = editando.oferta || {};
    fed.ofertaValor.value = o.valor || '';
    fed.ofertaTipo.value = o.tipo || '%';
    fed.ofertaRotulo.value = o.rotulo || '';
    fed.ofertaInicio.value = o.inicio || '';
    fed.ofertaFim.value = o.fim || '';
    fed.visivel.checked = !editando.oculto;
    fed.status.value = R.statusDe(editando);
    fed.prazo.value = editando.prazo || '';
    fed.chamada.value = editando.chamada || '';
    fed.resumo.value = editando.resumo || '';
    $('[data-id-preview]').textContent = editando.id || '…';

    desenharPrecosEditor();
    desenharCores();
    desenharCaps();
    desenharEsgotadas();
    desenharSpecs();
    previaOferta();
    $('#campo-prazo').hidden = fed.status.value !== 'encomenda';
    ed.showModal();
    const corpo = ed.querySelector('.editor-corpo');
    corpo.scrollTop = 0;
    if (secao === 'preco') $('#grupo-preco').scrollIntoView({ block: 'start' });
    if (secao === 'oferta') fed.ofertaValor.closest('.grupo').scrollIntoView({ block: 'start' });
    if (!p && !modelo) fed.nome.focus();
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
  fed.status.addEventListener('change', () => { $('#campo-prazo').hidden = fed.status.value !== 'encomenda'; });

  ed.querySelector('[data-fechar]').addEventListener('click', () => fechar(ed, 'cancelar'));
  ed.addEventListener('cancel', () => { ed.returnValue = 'cancelar'; });

  /* -- Preço por capacidade -- */

  const regraLoja = () => estado.loja.precificacao;
  const dolarEfetivo = () => (Number(regraLoja().dolar) || 0) + (Number(regraLoja().dolarAjuste) || 0);

  /* Um produto temporário com o que está nos campos agora, para a
     prévia de preço calculado e de oferta refletir o que se digita. */
  function rascunho() {
    const p = { ...editando, moedaCusto: fed.moedaCusto.value };
    const mv = num(fed.margemValor.value);
    p.margem = mv == null ? undefined : { tipo: fed.margemTipo.value, valor: mv };
    return p;
  }

  function desenharPrecosEditor() {
    const caps = R.capacidadesDe(editando);
    const moeda = fed.moedaCusto.value === 'USD' ? 'US$' : 'R$';
    const p = rascunho();
    $('#ed-precos').innerHTML = `
      <div class="precos-cab"><span>${caps.length > 1 ? 'Capacidade' : ''}</span><span>Custo (${moeda})</span><span>Preço de venda (R$)</span></div>
      ${caps.map((c) => {
        const calc = R.precoCalculado(p, c, regraLoja(), dolarEfetivo());
        const atual = editando.precos?.[c] ?? editando.preco ?? '';
        return `
        <div class="precos-linha" data-cap="${esc(c)}">
          <span class="precos-cap">${caps.length > 1 ? esc(c) : 'Preço'}</span>
          <input type="number" min="0" step="0.01" data-custo value="${editando.custos?.[c] ?? ''}" placeholder="—" aria-label="Custo ${esc(c)}">
          <span class="precos-venda">
            <input type="number" min="0" step="1" data-venda value="${atual || ''}" aria-label="Preço de venda ${esc(c)}">
            ${calc != null ? `<button class="usar" type="button" data-usar="${calc}" title="Usar o preço da regra">pela regra ${brl(calc)}</button>` : ''}
          </span>
        </div>`;
      }).join('')}`;
  }

  // Ler a tabela de volta para `editando`
  function lerPrecosEditor() {
    const custos = {}, precos = {};
    $$('#ed-precos .precos-linha').forEach((l) => {
      const c = l.dataset.cap;
      const custo = num(l.querySelector('[data-custo]').value);
      const venda = num(l.querySelector('[data-venda]').value);
      if (custo != null && custo > 0) custos[c] = custo;
      if (venda != null && venda > 0) precos[c] = Math.round(venda);
    });
    editando.custos = Object.keys(custos).length ? custos : undefined;
    const valores = Object.values(precos);
    if (valores.length && new Set(valores).size === 1 && valores.length === R.capacidadesDe(editando).length) {
      editando.preco = valores[0];
      delete editando.precos;
    } else if (valores.length) {
      editando.precos = precos;
      editando.preco = Math.min(...valores);
    } else {
      delete editando.precos;
      editando.preco = 0;
    }
  }

  $('#ed-precos').addEventListener('input', () => { lerPrecosEditor(); previaOferta(); });
  $('#ed-precos').addEventListener('change', (e) => {
    if (e.target.matches('[data-custo]')) { lerPrecosEditor(); desenharPrecosEditor(); }
  });
  $('#ed-precos').addEventListener('click', (e) => {
    const b = e.target.closest('[data-usar]');
    if (!b) return;
    b.closest('.precos-linha').querySelector('[data-venda]').value = b.dataset.usar;
    lerPrecosEditor();
    previaOferta();
  });
  [fed.moedaCusto, fed.margemValor, fed.margemTipo].forEach((el) => el.addEventListener('change', () => {
    lerPrecosEditor(); desenharPrecosEditor();
  }));

  /* -- Oferta -- */

  function lerOferta() {
    const v = num(fed.ofertaValor.value);
    if (!v || v <= 0) return undefined;
    const o = { tipo: fed.ofertaTipo.value, valor: v };
    if (fed.ofertaInicio.value) o.inicio = fed.ofertaInicio.value;
    if (fed.ofertaFim.value) o.fim = fed.ofertaFim.value;
    if (fed.ofertaRotulo.value.trim()) o.rotulo = fed.ofertaRotulo.value.trim();
    return o;
  }

  function previaOferta() {
    const o = lerOferta();
    const caixa = $('#ed-oferta-previa');
    if (!o) { caixa.textContent = 'Sem oferta.'; return; }
    const cap = R.capacidadesDe(editando)[0];
    const base = R.precoTabela(editando, cap);
    const por = R.aplicarOferta(base, o);
    const ev = R.eventoAtivo(estado.loja);
    const nome = o.rotulo || (ev ? R.temaDe(ev.tema).selo : 'Oferta');
    const quando = [o.inicio && `de ${dataBR(o.inicio)}`, o.fim && `até ${dataBR(o.fim)}`].filter(Boolean).join(' ') || 'sem prazo';
    caixa.innerHTML = `Selo “${esc(nome)}”: de <s>${brl(base)}</s> por <b>${brl(por)}</b> · ${quando}.`;
  }
  ['ofertaValor', 'ofertaTipo', 'ofertaInicio', 'ofertaFim', 'ofertaRotulo'].forEach((n) =>
    fed[n].addEventListener('input', previaOferta));

  /* -- Esgotadas -- */

  function desenharEsgotadas() {
    const opcoes = [...(editando.cores || []), ...R.capacidadesDe(editando).filter((c) => c !== 'Único')];
    const esg = new Set(editando.esgotadas || []);
    $('#ed-esgotadas').innerHTML = opcoes.length ? opcoes.map((o) => `
      <button type="button" class="ficha ficha--toque" data-opcao="${esc(o)}" aria-pressed="${esg.has(o)}">${esc(o)}</button>`).join('')
      : '<p class="dica">Sem cores ou capacidades.</p>';
  }
  $('#ed-esgotadas').addEventListener('click', (e) => {
    const b = e.target.closest('[data-opcao]');
    if (!b) return;
    const set = new Set(editando.esgotadas || []);
    if (set.has(b.dataset.opcao)) set.delete(b.dataset.opcao); else set.add(b.dataset.opcao);
    editando.esgotadas = [...set];
    b.setAttribute('aria-pressed', String(set.has(b.dataset.opcao)));
  });

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
    desenharEsgotadas();
    $$('#ed-cores [data-cor-nome]').at(-1)?.select();
  });

  $('#ed-cores').addEventListener('click', (e) => {
    const linha = e.target.closest('.cor');
    if (!linha || !e.target.closest('[data-remover-cor]')) return;
    const cor = editando.cores[+linha.dataset.i];
    editando.cores.splice(+linha.dataset.i, 1);
    if (editando.imagens) delete editando.imagens[cor];
    if (editando.coresHex) delete editando.coresHex[cor];
    editando.esgotadas = (editando.esgotadas || []).filter((x) => x !== cor);
    desenharCores();
    desenharEsgotadas();
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
      editando.esgotadas = (editando.esgotadas || []).map((x) => (x === cor ? novo : x));
      // A foto existente seguia a regra do nome: fixa o caminho antigo.
      if (!editando.imagens?.[novo] && alvo && editando.fotos !== false && estado.original.some((o) => o.id === editando.id)) {
        editando.imagens = { ...(editando.imagens || {}), [novo]: `${PASTA_FOTOS}/${editando.id}/${slug(cor)}.webp` };
      }
      desenharCores();
      desenharEsgotadas();
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
     navegador sabe. O Safari não gera WEBP: lá sai PNG. */
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
      </span>`).join('') || '<p class="dica">Nenhuma ainda. Sem capacidade, o produto tem um preço só.</p>';
  }

  const capsMudaram = () => {
    lerPrecosEditor();
    desenharCaps();
    desenharPrecosEditor();
    desenharEsgotadas();
  };

  const addCap = () => {
    const inp = $('#ed-cap-nova');
    lerPrecosEditor();
    inp.value.split(',').map((s) => s.trim()).filter(Boolean).forEach((v) => {
      editando.capacidades = (editando.capacidades || []).filter((c) => c !== 'Único');
      if (!editando.capacidades.includes(v)) editando.capacidades.push(v);
    });
    inp.value = '';
    capsMudaram();
  };
  $('#ed-add-cap').addEventListener('click', addCap);
  $('#ed-cap-nova').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addCap(); } });
  $('#ed-caps').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-i]');
    if (!b) return;
    lerPrecosEditor();
    const [cap] = editando.capacidades.splice(+b.dataset.i, 1);
    editando.esgotadas = (editando.esgotadas || []).filter((x) => x !== cap);
    if (editando.precos) delete editando.precos[cap];
    if (editando.custos) delete editando.custos[cap];
    capsMudaram();
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
    if (!alvo || !confirm(`Apagar “${alvo.nome}” do catálogo? Para só tirar do site por um tempo, desligue “Aparece no site”.\n\nIsso só vale depois de publicar.`)) return;
    estado.produtos = estado.produtos.filter((p) => p !== alvo);
    fechar(ed, 'apagado');
    desenhar();
    toast('Produto apagado. Publique para valer no site.');
  });

  /* -- Concluir -- */

  fed.addEventListener('submit', (e) => {
    if (e.submitter?.value !== 'ok') return;
    e.preventDefault();
    lerPrecosEditor();

    const nome = fed.nome.value.trim();
    const id = slug(fed.id.value);
    const erros = [];
    if (!nome) erros.push('o nome');
    if (!id) erros.push('o endereço da página');
    if (!(editando.preco > 0)) erros.push('o preço');
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
    p.moedaCusto = fed.moedaCusto.value;
    const mv = num(fed.margemValor.value);
    if (mv != null) p.margem = { tipo: fed.margemTipo.value, valor: mv }; else delete p.margem;
    if (fed.precoManual.checked) p.precoManual = true; else delete p.precoManual;
    const oficial = Math.round(Number(fed.precoOficial.value));
    if (oficial) p.precoOficial = oficial; else delete p.precoOficial;
    if (fed.destaque.checked) p.destaque = 'principal'; else delete p.destaque;
    const oferta = lerOferta();
    if (oferta) p.oferta = oferta; else delete p.oferta;
    if (fed.visivel.checked) delete p.oculto; else p.oculto = true;
    if (fed.status.value === 'disponivel') delete p.status; else p.status = fed.status.value;
    if (fed.status.value === 'encomenda' && fed.prazo.value.trim()) p.prazo = fed.prazo.value.trim(); else delete p.prazo;
    for (const k of ['linha', 'chamada', 'resumo']) {
      const v = fed[k].value.trim();
      if (v) p[k] = v; else delete p[k];
    }
    p.specs = (p.specs || []).filter(([k, v]) => String(k).trim() && String(v).trim());
    p.capacidades = p.capacidades?.length ? p.capacidades : ['Único'];
    p.cores = p.cores || [];
    p.esgotadas = (p.esgotadas || []).filter((x) => p.cores.includes(x) || p.capacidades.includes(x));
    if (!p.esgotadas.length) delete p.esgotadas;
    if (!p.custos) delete p.custos;
    if (p.moedaCusto === 'USD' && !p.custos) delete p.moedaCusto;

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
    if (p.imagens && p.fotos === false) delete p.fotos;
    R.sincronizarPreco(p);

    // Ordem fixa das chaves: catálogo legível e diff limpo.
    const ordem = ['id', 'nome', 'categoria', 'linha', 'preco', 'precos', 'precoOficial', 'moedaCusto', 'custos',
      'margem', 'precoManual', 'oferta', 'status', 'prazo', 'esgotadas', 'oculto', 'destaque', 'chamada',
      'resumo', 'cores', 'coresHex', 'imagens', 'fotos', 'capacidades', 'specs', 'vistas'];
    const limpo = {};
    ordem.forEach((k) => { if (p[k] !== undefined) limpo[k] = p[k]; });
    Object.keys(p).forEach((k) => { if (!(k in limpo) && p[k] !== undefined) limpo[k] = p[k]; });

    if (alvo) estado.produtos[estado.produtos.indexOf(alvo)] = limpo;
    else estado.produtos.unshift(limpo);

    fechar(ed, 'ok');
    desenhar();
    if (estado.aba === 'ofertas') desenharOfertas();
    requestAnimationFrame(() => {
      $(`tr[data-id="${CSS.escape(limpo.id)}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      pulsar(limpo.id);
    });
    toast(alvo ? 'Produto atualizado. Publique para valer no site.' : 'Produto criado. Publique para valer no site.');
  });

  /* ---------- Ofertas e eventos ---------- */

  const corTema = {
    'black-friday': ['#000', '#ffd60a'], 'cyber-monday': ['#0a0a23', '#00d9f5'], natal: ['#0d3b2a', '#c8102e'],
    'ano-novo': ['#000', '#d4af37'], 'volta-as-aulas': ['#eaf1ff', '#2563eb'], consumidor: ['#ecfdf3', '#15803d'],
    maes: ['#fde2ee', '#c0266d'], namorados: ['#3a0413', '#d61f45'], pais: ['#0b1226', '#8fb0ff'],
    lancamento: ['#000', '#2997ff'], criancas: ['#fff6dc', '#6d28d9'], aniversario: ['#FF6200', '#1d1d1f']
  };
  const amostra = (id) => {
    const [a, b] = corTema[id] || ['#1d1d1f', '#FF6200'];
    return `<span class="amostra" style="--a:${a};--b:${b}" aria-hidden="true"></span>`;
  };

  function desenharOfertas() {
    const ev = R.eventoAtivo(estado.loja);
    const t = ev && R.temaDe(ev.tema);
    $('#no-ar').innerHTML = ev
      ? `${amostra(ev.tema)}<div><span>No ar hoje</span><b>${esc(t.nome)}</b><small>${ev.fim ? `até ${dataBR(ev.fim)}` : 'sem data para acabar'}</small></div>
         <a class="btn btn--leve" href="index.html?evento=${esc(ev.tema)}" target="_blank" rel="noopener">Ver no site</a>`
      : `${amostra('')}<div><span>No ar hoje</span><b>Nenhum evento</b><small>O site está com o visual de sempre.</small></div>`;

    const eventos = estado.loja.eventos || [];
    $('#eventos').innerHTML = eventos.length ? eventos.map((e, i) => {
      const tema = R.temaDe(e.tema);
      const agora = ev === e;
      const passou = e.fim && e.fim < R.hoje();
      return `
      <article class="evento${agora ? ' evento--ar' : ''}" data-i="${i}">
        <header class="evento-topo">
          ${amostra(e.tema)}
          <select data-ev="tema" aria-label="Tema">
            ${R.TEMAS.map((x) => `<option value="${x.id}" ${x.id === e.tema ? 'selected' : ''}>${esc(x.nome)}</option>`).join('')}
          </select>
          <span class="evento-estado">${agora ? 'No ar' : passou ? 'Encerrado' : e.ativo === false ? 'Desligado' : 'Programado'}</span>
          <label class="chave" title="Ligado"><input type="checkbox" data-ev="ativo" ${e.ativo !== false ? 'checked' : ''} aria-label="Evento ligado"><span></span></label>
        </header>
        <div class="evento-corpo">
          <label class="campo"><span>Título do cartaz</span><input data-ev="titulo" value="${esc(e.titulo || '')}" placeholder="${esc(tema?.titulo || '')}"></label>
          <label class="campo"><span>Frase do cartaz</span><input data-ev="subtitulo" value="${esc(e.subtitulo || '')}" placeholder="${esc(tema?.subtitulo || '')}"></label>
          <label class="campo"><span>Frases da faixa do topo <small>(uma por linha)</small></span>
            <textarea data-ev="faixa" rows="3">${esc(String(e.faixa || '').split('|').join('\n'))}</textarea></label>
          <div class="grade-2">
            <label class="campo"><span>Começa</span><input type="date" data-ev="inicio" value="${esc(e.inicio || '')}"></label>
            <label class="campo"><span>Termina</span><input type="date" data-ev="fim" value="${esc(e.fim || '')}"></label>
          </div>
        </div>
        <footer class="evento-acoes">
          <a class="btn btn--leve btn--peq" href="index.html?evento=${esc(e.tema)}" target="_blank" rel="noopener">Pré-visualizar</a>
          <button class="btn btn--perigo btn--peq" type="button" data-ev-apagar>Apagar</button>
        </footer>
      </article>`;
    }).join('') : '<p class="dica">Nenhum evento ainda. Crie um em “Novo evento”.</p>';

    $('#lote-escopo').innerHTML = [
      ['todos', 'Todos os produtos do site'],
      ['destaques', 'Só os destaques da capa'],
      ...CATS.map((c) => [c.id, c.nome])
    ].map(([v, n]) => `<option value="${v}">${esc(n)}</option>`).join('');
    const evDatas = ev || eventos.find((x) => x.ativo !== false && (!x.fim || x.fim >= R.hoje()));
    if (evDatas) {
      $('#form-lote').inicio.value = evDatas.inicio || '';
      $('#form-lote').fim.value = evDatas.fim || '';
    }

    const com = estado.produtos.filter((p) => p.oferta && Number(p.oferta.valor) > 0);
    $('#lista-ofertas').innerHTML = com.length ? `<ul class="lista-ofertas">${com.map((p) => {
      const info = R.precoMinimo({ ...p, oferta: { ...p.oferta, inicio: undefined, fim: undefined } });
      return `<li>
        <button type="button" data-of="${esc(p.id)}"><b>${esc(p.nome)}</b>
          <span>de <s>${brl(info.base)}</s> por <b>${brl(info.final)}</b></span>
          <small>${R.ofertaAtiva(p) ? 'no ar' : p.oferta.inicio && p.oferta.inicio > R.hoje() ? `começa ${dataBR(p.oferta.inicio)}` : 'encerrada'}${p.oferta.fim ? ` · até ${dataBR(p.oferta.fim)}` : ''}</small></button>
      </li>`;
    }).join('')}</ul>` : '<p class="dica">Nenhum produto em oferta.</p>';
  }

  $('#eventos').addEventListener('input', (e) => {
    const card = e.target.closest('.evento');
    const campo = e.target.dataset.ev;
    if (!card || !campo) return;
    const ev = estado.loja.eventos[+card.dataset.i];
    if (campo === 'ativo') ev.ativo = e.target.checked;
    else if (campo === 'faixa') ev.faixa = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean).join('|');
    else ev[campo] = e.target.value;
    atualizarBarra();
  });
  $('#eventos').addEventListener('change', (e) => {
    const campo = e.target.dataset.ev;
    if (campo === 'tema' || campo === 'ativo' || campo === 'inicio' || campo === 'fim') desenharOfertas();
  });
  $('#eventos').addEventListener('click', (e) => {
    if (!e.target.closest('[data-ev-apagar]')) return;
    const i = +e.target.closest('.evento').dataset.i;
    if (!confirm('Apagar este evento?')) return;
    estado.loja.eventos.splice(i, 1);
    desenharOfertas();
    atualizarBarra();
  });

  $('#btn-novo-evento').addEventListener('click', () => {
    $('#temas-lista').innerHTML = R.TEMAS.map((t) => {
      const d = R.datasSugeridas(t);
      return `<button type="button" class="tema" data-tema="${t.id}">
        ${amostra(t.id)}<b>${esc(t.nome)}</b><small>${d.inicio ? `${dataBR(d.inicio)} a ${dataBR(d.fim)}` : 'você escolhe a data'}</small></button>`;
    }).join('');
    $('#temas').showModal();
  });
  $('#temas-lista').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tema]');
    if (!b) return;
    const t = R.temaDe(b.dataset.tema);
    const d = R.datasSugeridas(t);
    estado.loja.eventos = estado.loja.eventos || [];
    estado.loja.eventos.push({
      id: `${t.id}-${(d.inicio || R.hoje()).slice(0, 4)}-${Date.now().toString(36).slice(-4)}`,
      tema: t.id, titulo: t.titulo, subtitulo: t.subtitulo, faixa: t.faixa,
      inicio: d.inicio, fim: d.fim, ativo: true
    });
    fechar($('#temas'));
    desenharOfertas();
    atualizarBarra();
    const novo = $$('#eventos .evento').at(-1);
    if (novo && !semMovimento()) { novo.classList.add('novo'); novo.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    toast(`${t.nome} criado. Confira as datas e publique.`);
  });

  $('#form-lote').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const valor = num(f.valor.value);
    if (!valor || valor <= 0) { toast('Coloque o valor do desconto.', 'erro'); return; }
    const alvoLote = alvoDoLote(f.escopo.value);
    if (!confirm(`Colocar ${f.tipo.value === '%' ? `${valor}%` : brl(valor)} de desconto em ${alvoLote.length} produtos?`)) return;
    alvoLote.forEach((p) => {
      p.oferta = { tipo: f.tipo.value, valor };
      if (f.inicio.value) p.oferta.inicio = f.inicio.value;
      if (f.fim.value) p.oferta.fim = f.fim.value;
    });
    desenhar();
    desenharOfertas();
    toast(`Oferta aplicada em ${alvoLote.length} produtos. Publique para valer no site.`);
  });
  $('#btn-tirar-ofertas').addEventListener('click', () => {
    const alvoLote = alvoDoLote($('#lote-escopo').value).filter((p) => p.oferta);
    if (!alvoLote.length) { toast('Nenhuma oferta nesses produtos.'); return; }
    if (!confirm(`Tirar a oferta de ${alvoLote.length} produtos?`)) return;
    alvoLote.forEach((p) => delete p.oferta);
    desenhar();
    desenharOfertas();
  });
  function alvoDoLote(escopo) {
    const noSite = estado.produtos.filter(R.visivel);
    if (escopo === 'todos') return noSite;
    if (escopo === 'destaques') return noSite.filter((p) => p.destaque === 'principal');
    return noSite.filter((p) => p.categoria === escopo);
  }
  $('#lista-ofertas').addEventListener('click', (e) => {
    const b = e.target.closest('[data-of]');
    if (b) abrirEditor(estado.produtos.find((p) => p.id === b.dataset.of), 'oferta');
  });

  /* ---------- Preço automático ---------- */

  function preencherRegra() {
    const c = regraLoja();
    $('#pc-automatico').checked = !!c.automatico;
    $('#pc-dolar').value = c.dolar ?? '';
    $('#pc-ajuste').value = c.dolarAjuste ?? 0;
    $('#pc-extras').value = c.custosExtras ?? 0;
    $('#pc-margem').value = c.margem?.valor ?? 0;
    $('#pc-margem-tipo').value = c.margem?.tipo || '%';
    $('#pc-arred').value = c.arredondar || '99';
    $('#pc-limite').value = c.limiteVariacao ?? 8;
  }

  function lerRegra() {
    const c = regraLoja();
    c.automatico = $('#pc-automatico').checked;
    c.dolar = num($('#pc-dolar').value) ?? 0;
    c.dolarAjuste = num($('#pc-ajuste').value) ?? 0;
    c.custosExtras = num($('#pc-extras').value) ?? 0;
    c.margem = { tipo: $('#pc-margem-tipo').value, valor: num($('#pc-margem').value) ?? 0 };
    c.arredondar = $('#pc-arred').value;
    c.limiteVariacao = num($('#pc-limite').value) ?? 0;
  }

  function desenharPrecos() {
    const c = regraLoja();
    const dolar = dolarEfetivo();
    $('#robo-info').textContent = c.ultimaExecucao
      ? `Última vez: ${c.ultimaExecucao.replace('T', ' às ').slice(0, 19)}`
      : 'O robô ainda não rodou.';
    $('#pc-dolar-em').textContent = c.dolarEm ? `Cotação de ${dataBR(c.dolarEm)}` : '';
    const exemplo = R.precoCalculado({ custos: { x: 1000 }, moedaCusto: 'USD' }, 'x', c, dolar);
    const m = c.margem || {};
    $('#formula').innerHTML = `Preço = custo × dólar (R$ ${dolar.toFixed(2).replace('.', ',')})
      + ${c.custosExtras || 0}% de frete e impostos
      + margem de ${m.tipo === 'R$' ? brl(m.valor) : `${m.valor || 0}%`}, arredondado.
      <span>Ex.: custo de US$ 1.000 vira <b>${brl(exemplo)}</b>.</span>`;
    const semCusto = estado.produtos.filter((p) => R.visivel(p) && !p.precoManual
      && !R.capacidadesDe(p).some((cap) => R.custoEmReais(p, cap, 1) != null));
    $('#sem-custo').textContent = semCusto.length
      ? `${semCusto.length} produtos do site ainda não têm custo cadastrado e ficam com o preço atual: ${semCusto.slice(0, 6).map((p) => p.nome).join(', ')}${semCusto.length > 6 ? '…' : ''}. Cadastre o custo em “Editar → Preço e custo”.`
      : 'Todos os produtos do site têm custo cadastrado ou preço manual.';
    const al = c.alertas || [];
    $('#bloco-alertas').hidden = !al.length;
    $('#alertas-robo').innerHTML = al.length ? tabelaMudancas(al, true) : '';
  }

  const tabelaMudancas = (lista, alerta) => `
    <table class="tabela tabela--simples">
      <thead><tr><th>Produto</th><th>Capacidade</th><th>Hoje</th><th>Novo</th><th>Variação</th></tr></thead>
      <tbody>${lista.map((m) => `
        <tr${alerta ? ' class="alerta"' : ''}><td>${esc(m.nome)}</td><td>${esc(m.cap)}</td><td>${brl(m.antigo)}</td>
        <td><b>${brl(m.novo)}</b></td><td class="${m.variacao > 0 ? 'sobe' : 'desce'}">${m.variacao > 0 ? '+' : ''}${String(m.variacao).replace('.', ',')}%</td></tr>`).join('')}
      </tbody>
    </table>`;

  ['#pc-automatico', '#pc-dolar', '#pc-ajuste', '#pc-extras', '#pc-margem', '#pc-margem-tipo', '#pc-arred', '#pc-limite']
    .forEach((s) => $(s).addEventListener('change', () => { lerRegra(); desenharPrecos(); atualizarBarra(); }));

  $('#btn-cotacao').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    b.disabled = true;
    try {
      const r = await fetch('https://open.er-api.com/v6/latest/USD');
      const j = await r.json();
      const v = j?.rates?.BRL;
      if (!v) throw new Error('sem BRL');
      $('#pc-dolar').value = (Math.round(v * 100) / 100).toFixed(2);
      regraLoja().dolarEm = R.hoje();
      lerRegra();
      desenharPrecos();
      atualizarBarra();
      toast(`Dólar de hoje: R$ ${v.toFixed(2).replace('.', ',')}`);
    } catch {
      toast('Não consegui buscar a cotação agora. Digite o valor à mão.', 'erro');
    } finally {
      b.disabled = false;
    }
  });

  let simulado = null;
  $('#btn-simular').addEventListener('click', () => {
    lerRegra();
    simulado = R.recalcular(estado.produtos, regraLoja(), dolarEfetivo());
    const { mudancas: m, alertas: a } = simulado;
    $('#simulacao').innerHTML = !m.length && !a.length
      ? '<p class="dica">Nenhum preço muda com esta regra.</p>'
      : `${m.length ? `<h3 class="sub-h">${m.length} preço${m.length === 1 ? '' : 's'} mudariam</h3>${tabelaMudancas(m)}` : ''}
         ${a.length ? `<h3 class="sub-h">${a.length} passariam da trava de ${regraLoja().limiteVariacao}% e ficariam de fora</h3>${tabelaMudancas(a, true)}` : ''}
         <div class="mini-acoes">
           ${a.length ? '<button class="btn" type="button" id="btn-aplicar-tudo">Aplicar incluindo os travados</button>' : ''}
           ${m.length ? '<button class="btn btn--cheio" type="button" id="btn-aplicar">Aplicar estes preços</button>' : ''}
         </div>`;
  });
  $('#simulacao').addEventListener('click', (e) => {
    if (!simulado) return;
    if (e.target.closest('#btn-aplicar')) {
      estado.produtos = simulado.produtos;
    } else if (e.target.closest('#btn-aplicar-tudo')) {
      estado.produtos = R.recalcular(estado.produtos, { ...regraLoja(), limiteVariacao: 0 }, dolarEfetivo()).produtos;
    } else return;
    simulado = null;
    $('#simulacao').innerHTML = '<p class="dica">Preços aplicados. Publique para valer no site.</p>';
    desenhar();
  });

  /* ---------- Salvar / descartar ---------- */

  $('#btn-descartar').addEventListener('click', () => {
    if (!confirm('Descartar todas as alterações não publicadas?')) return;
    estado.produtos = clone(estado.original);
    estado.loja = clone(estado.lojaOriginal);
    preencherRegra();
    desenhar(true);
    if (estado.aba === 'ofertas') desenharOfertas();
    if (estado.aba === 'precos') desenharPrecos();
  });

  const baixar = (nome, texto) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([texto], { type: 'text/javascript' }));
    a.download = nome;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  $('#btn-salvar').addEventListener('click', async () => {
    const botao = $('#btn-salvar');

    if (estado.modo !== 'github') {
      baixar('catalogo.js', escreverCatalogo(estado.produtos));
      setTimeout(() => baixar('loja.js', escreverLoja(estado.loja)), 300);
      toast(estado.fotos.size
        ? 'Arquivos baixados. As fotos novas só sobem no modo conectado ao GitHub.'
        : 'catalogo.js e loja.js baixados. Substitua os dois em assets/js/ na hospedagem.');
      return;
    }

    const n = mudancas();
    const nomes = estado.produtos.filter((p) => alterado(p)).map((p) => p.nome).slice(0, 4);
    const msg = `Painel: ${n} alteraç${n === 1 ? 'ão' : 'ões'}${nomes.length ? ` (${nomes.join(', ')})` : ''}`;

    botao.disabled = true;
    botao.textContent = 'Publicando…';
    try {
      await publicar(msg);
      estado.original = clone(estado.produtos);
      estado.lojaOriginal = clone(estado.loja);
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

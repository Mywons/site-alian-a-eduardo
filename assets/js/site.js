/* =============================================================
   SITE — o conteúdo que o dono edita no painel
   -------------------------------------------------------------
   Lê LOJA.site (assets/js/loja.js) e escreve na página:
     • faixa do topo, banners da capa, títulos das seções,
       selos de garantia, perguntas e dados de contato.
   Roda assim que é carregado, no fim do <body>, ANTES do app.js e
   antes do evento do dia — por isso o cartaz de evento ainda entra
   na frente dos banners e o palco já nasce com tudo no lugar.

   Sem LOJA.site (ou com um campo vazio), vale o que está escrito no
   HTML. O site nunca fica sem texto.
   ============================================================= */

(function () {
  'use strict';
  if (typeof LOJA === 'undefined' || !LOJA.site) return;
  const S = LOJA.site;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tem = (v) => v != null && String(v).trim() !== '';
  const $ = (s) => document.querySelector(s);

  /* ---------- Contato (vale para todas as páginas) ---------- */
  if (S.contato && typeof CONFIG !== 'undefined') {
    const c = S.contato;
    if (tem(c.whatsapp)) CONFIG.whatsapp = String(c.whatsapp).replace(/\D/g, '');
    ['email', 'instagram', 'arroba', 'cnpj', 'horario'].forEach((k) => { if (c[k] != null) CONFIG[k] = c[k]; });
  }

  /* ---------- Perguntas ---------- */
  if (Array.isArray(S.perguntas) && S.perguntas.length && typeof PERGUNTAS !== 'undefined') {
    PERGUNTAS.splice(0, PERGUNTAS.length, ...S.perguntas.filter((q) => tem(q.p) && tem(q.r)));
  }

  /* ---------- Faixa do topo ---------- */
  if (Array.isArray(S.faixa) && S.faixa.filter(tem).length) {
    const frases = S.faixa.filter(tem);
    const cheia = [];
    while (cheia.length < 6) cheia.push(...frases);
    document.querySelectorAll('.faixa-lista').forEach((ul) => {
      ul.innerHTML = cheia.map((f) => `<li>${esc(f)}</li>`).join('');
    });
  }

  /* ---------- Títulos das seções ---------- */
  Object.entries(S.secoes || {}).forEach(([id, t]) => {
    const topo = document.querySelector(`[data-secao="${id}"]`);
    if (!topo || !t) return;
    const olho = topo.querySelector('.sec-olho');
    const h2 = topo.querySelector('h2');
    if (olho && t.olho != null) { olho.textContent = t.olho; olho.hidden = !tem(t.olho); }
    if (h2 && tem(t.titulo)) {
      h2.innerHTML = `${esc(t.titulo)}${tem(t.fecho) ? ` <em class="rampa">${esc(t.fecho)}</em>` : ''}`;
    }
  });

  /* ---------- Selos de garantia ---------- */
  if (Array.isArray(S.selos)) {
    document.querySelectorAll('.selos-grade > li').forEach((li, i) => {
      const s = S.selos[i];
      if (!s) return;
      if (tem(s.titulo)) li.querySelector('h3').textContent = s.titulo;
      if (s.texto != null) li.querySelector('p').textContent = s.texto;
    });
  }

  /* ---------- Banners da capa ---------- */
  const trilho = $('#palco-trilho');
  const ativos = (S.cartazes || []).filter((c) => c && c.ativo !== false && tem(c.titulo));
  if (!trilho || !ativos.length) return;

  const CLASSE = {
    estreia: 'cartaz--estreia', perola: 'cartaz--duo', claro: 'cartaz--claro',
    laranja: 'cartaz--laranja', escuro: 'cartaz--corp'
  };
  const BOTAO = { estreia: 'btn--claro', laranja: 'btn--tinta' };

  const acao = (b, classe) => {
    if (!b || !tem(b.texto)) return '';
    if (b.tipo === 'whatsapp') {
      return `<a class="${classe}" target="_blank" rel="noopener" data-wa="${esc(b.valor || 'true')}">${esc(b.texto)}</a>`;
    }
    const url = tem(b.valor) ? b.valor : 'index.html#catalogo';
    const troca = /corporate\.html/.test(url) ? ' data-troca="#000000"' : '';
    return `<a class="${classe}" href="${esc(url)}"${troca}>${esc(b.texto)}</a>`;
  };

  trilho.innerHTML = ativos.map((c, i) => {
    const primeiro = i === 0;
    const estilo = CLASSE[c.estilo] ? c.estilo : 'claro';
    const arte = estilo === 'estreia' || estilo === 'perola';
    const entra = primeiro ? ' data-entra' : '';
    const h = primeiro ? 'h1' : 'h2';
    const metal = estilo === 'estreia' ? 'titulo-metal' : estilo === 'perola' ? 'titulo-perola' : '';
    const titulo = metal
      ? `<span class="${metal}">${esc(c.titulo)}${tem(c.fecho) ? ` ${esc(c.fecho)}` : ''}</span>`
      : `${esc(c.titulo)}${tem(c.fecho) ? ` <em>${esc(c.fecho)}</em>` : ''}`;
    const fatos = String(c.fatos || '').split('|').map((s) => s.trim()).filter(Boolean);
    const img = tem(c.imagem) ? `
          <figure class="${arte ? 'cartaz-arte' : 'cartaz-foto cartaz-foto--alta'}">
            <img src="${esc(c.imagem)}" alt="${esc(c.alt || c.titulo)}" decoding="async"
                 ${primeiro ? 'fetchpriority="high"' : 'loading="lazy"'}>
          </figure>` : '';
    return `
        <article class="cartaz ${CLASSE[estilo]}" aria-roledescription="slide">
          <div class="cartaz-txt">
            ${tem(c.olho) ? `<p class="${arte ? 'cartaz-novo' : 'cartaz-olho'}"${entra}>${esc(c.olho)}</p>` : ''}
            <${h} class="cartaz-titulo"${entra}>${titulo}</${h}>
            ${tem(c.frase) ? `<p class="${arte ? 'cartaz-frase' : 'cartaz-sub'}"${entra}>${esc(c.frase)}</p>` : ''}
            ${fatos.length ? `<ul class="cartaz-fatos"${entra}>${fatos.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
            <div class="cartaz-acoes"${entra}>
              ${acao(c.botao, `btn btn--grande ${BOTAO[estilo] || ''}`)}
              ${acao(c.link, 'seta')}
            </div>
            ${primeiro ? `<p class="estado" id="estado-loja" data-entra data-aberta="false">
              <span class="estado-luz" aria-hidden="true"></span><span class="estado-txt"></span></p>` : ''}
          </div>${img}
        </article>`;
  }).join('');
})();

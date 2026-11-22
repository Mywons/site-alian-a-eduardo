/* =============================================================
   EVENTO — o visual de Black Friday, Natal, Dia das Mães…
   -------------------------------------------------------------
   Carregado no <head>, depois de loja.js e regras.js, para o tema
   entrar antes da primeira pintura (sem piscar a cor de sempre).

   Decide o evento do dia (LOJA.eventos + datas) e:
     • põe data-evento="<tema>" no <html> — o CSS faz o resto;
     • troca as frases da faixa do topo;
     • abre a capa com um cartaz do evento.

   Pré-visualizar: index.html?evento=natal (vale até fechar a aba).
   ?evento=nenhum desliga a pré-visualização.
   ============================================================= */

(function () {
  'use strict';
  if (typeof REGRAS === 'undefined') return;

  const CHAVE = 'alianca:previa-evento';
  let evento = null;

  try {
    const pedido = new URLSearchParams(location.search).get('evento');
    if (pedido === 'nenhum') sessionStorage.removeItem(CHAVE);
    else if (pedido && REGRAS.temaDe(pedido)) sessionStorage.setItem(CHAVE, pedido);
    const previa = sessionStorage.getItem(CHAVE);
    if (previa) {
      const t = REGRAS.temaDe(previa);
      const salvo = (typeof LOJA !== 'undefined' ? LOJA.eventos || [] : []).find((e) => e.tema === previa);
      evento = { ...t, tema: t.id, ...(salvo || {}), previa: true };
    }
  } catch (e) { /* sem sessionStorage: segue sem pré-visualização */ }

  if (!evento && typeof LOJA !== 'undefined') evento = REGRAS.eventoAtivo(LOJA);
  if (!evento) return;

  const tema = REGRAS.temaDe(evento.tema);
  document.documentElement.dataset.evento = tema.id;
  window.EVENTO_ATIVO = { ...evento, nome: tema.nome, selo: tema.selo };

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  document.addEventListener('DOMContentLoaded', () => {
    /* A faixa do topo passa a falar do evento. */
    const frases = String(evento.faixa || '').split('|').map((s) => s.trim()).filter(Boolean);
    if (frases.length) {
      // Repete as frases para a faixa nunca ficar com buraco no fim.
      const cheia = [];
      while (cheia.length < 6) cheia.push(...frases);
      document.querySelectorAll('.faixa-lista').forEach((ul) => {
        ul.innerHTML = cheia.map((f) => `<li>${esc(f)}</li>`).join('');
      });
    }

    /* O cartaz do evento entra primeiro na capa. */
    const trilho = document.querySelector('#palco-trilho');
    if (trilho) {
      const temOfertas = typeof PRODUTOS !== 'undefined'
        && PRODUTOS.some((p) => REGRAS.visivel(p) && REGRAS.ofertaAtiva(p));
      const acao = temOfertas
        ? `<a class="btn btn--grande" href="index.html?cat=ofertas#catalogo">Ver as ofertas</a>`
        : `<a class="btn btn--grande" target="_blank" rel="noopener"
             data-wa="Olá! Vim pelo site da Aliança One e quero saber das condições de ${esc(tema.nome)}.">Falar no WhatsApp</a>`;
      const fim = evento.fim ? evento.fim.split('-').reverse().slice(0, 2).join('/') : '';
      trilho.insertAdjacentHTML('afterbegin', `
        <article class="cartaz cartaz--evento" aria-roledescription="slide">
          <div class="cartaz-txt">
            <p class="cartaz-olho">${esc(tema.nome)}${fim ? ` · até ${fim}` : ''}</p>
            <h2 class="cartaz-titulo">${esc(evento.titulo || tema.titulo)}</h2>
            <p class="cartaz-sub">${esc(evento.subtitulo || tema.subtitulo)}</p>
            <div class="cartaz-acoes">
              ${acao}
              <a class="seta" href="index.html#catalogo">Toda a loja</a>
            </div>
          </div>
          <figure class="cartaz-foto cartaz-foto--alta">
            <picture>
              <source srcset="assets/img/iphone-17-pro.webp" type="image/webp">
              <img src="assets/img/iphone-17-pro.png" width="988" height="1122" decoding="async"
                   alt="Três iPhone 17 Pro vistos por trás.">
            </picture>
          </figure>
          <span class="cartaz-enfeite" aria-hidden="true"></span>
        </article>`);
    }

    if (evento.previa) {
      document.body.insertAdjacentHTML('beforeend', `
        <a class="previa-evento" href="?evento=nenhum">Pré-visualizando: ${esc(tema.nome)} · sair</a>`);
    }
  });
})();

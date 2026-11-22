/* =============================================================
   ALIANÇA — a sacola
   -------------------------------------------------------------
   Não é um checkout. É uma lista de compras que o cliente monta
   sozinho e que vira UMA mensagem de WhatsApp, com tudo escrito:
   modelo, cor, capacidade, quantidade e total.

   O estado mora no navegador da pessoa (localStorage), some se
   ela limpar o navegador e nunca sai do aparelho dela. Nada é
   enviado para lugar nenhum até ela tocar em "fechar pedido".
   ============================================================= */

const SACOLA_CHAVE = 'alianca:sacola';

/* Um item é a combinação produto + cor + capacidade. Dois iPhone 17
   de cores diferentes são duas linhas; dois iguais são quantidade 2. */
const chaveItem = (id, cor, capacidade) => [id, cor, capacidade].join('');

/* `guarda` vem do app.js e decide sozinha onde dá para guardar:
   localStorage quando existe, window.name quando o site foi aberto
   direto do arquivo. O carrinho não precisa saber qual dos dois é. */

function lerSacola() {
  try {
    const bruto = JSON.parse(guarda.ler(SACOLA_CHAVE));
    if (!Array.isArray(bruto)) return [];
    // Um produto pode ter saído do catálogo desde a última visita.
    return bruto.filter((i) => i && acharProduto(i.id));
  } catch (_) {
    return [];
  }
}

function gravarSacola(itens) {
  guarda.gravar(SACOLA_CHAVE, JSON.stringify(itens));
}

/* O upsell do checkout (LOJA.checkout.upsells) pode dar um preço especial
   para o item que entrou por ele. A regra é lida de novo a cada conta: se
   o dono desligou o upsell, o item volta ao preço normal. */
const regraUpsell = (id) => ((typeof LOJA !== 'undefined' && LOJA.checkout?.upsells) || [])
  .find((u) => u.id === id && u.ativo !== false);

function precoItem(i) {
  const p = acharProduto(i.id);
  if (!p) return 0;
  const base = REGRAS.precoDe(p, i.capacidade).final;
  const r = i.upsell && regraUpsell(i.upsell);
  return r && r.produto === i.id && Number(r.valor) > 0 ? REGRAS.aplicarOferta(base, r) : base;
}

const totalSacola = (itens) => itens.reduce((soma, i) => soma + precoItem(i) * i.qtd, 0);

const contarSacola = (itens) => itens.reduce((soma, i) => soma + i.qtd, 0);

/* ---------- A mensagem ----------
   O cliente não digita nada, nem quando são seis produtos. */

function msgSacola(itens) {
  const linhas = itens.map((i, n) => {
    const p = acharProduto(i.id);
    const util = (v) => v && v !== 'Único';
    const detalhe = [i.capacidade, i.cor].filter(util).join(', ');
    const qtd = i.qtd > 1 ? `${i.qtd}× ` : '';
    return `${n + 1}. ${qtd}${p.nome}${detalhe ? ` (${detalhe})` : ''} — ${brl(precoItem(i) * i.qtd)}`;
  });

  const total = totalSacola(itens);

  return `Olá! Quero fechar este pedido no site da ${CONFIG.nome}:\n\n`
       + `${linhas.join('\n')}\n\n`
       + `Total à vista: ${brl(total)}\n`
       + `Ou ${CONFIG.parcelas}x de ${brl(Math.ceil(total / CONFIG.parcelas))}\n\n`
       + `Está tudo disponível?`;
}

/* ---------- Desenho da gaveta ---------- */

function itemHTML(i) {
  const p = acharProduto(i.id);
  const util = (v) => v && v !== 'Único';
  const detalhe = [i.capacidade, i.cor].filter(util).join(' · ');
  const chave = chaveItem(i.id, i.cor, i.capacidade);

  return `
  <article class="sac-item" data-chave="${escapar(chave)}">
    <div class="sac-poco">${aparelhoHTML(p, i.cor, 'linha')}</div>

    <div class="sac-txt">
      <h3><a href="produto.html?id=${encodeURIComponent(p.id)}">${escapar(p.nome)}</a></h3>
      ${detalhe ? `<p class="sac-variante">${escapar(detalhe)}</p>` : ''}
      <p class="sac-preco">
        ${brl(precoItem(i) * i.qtd)}
        <small>${parcela(precoItem(i) * i.qtd)}</small>
      </p>
    </div>

    <div class="sac-qtd" role="group" aria-label="Quantidade de ${escapar(p.nome)}">
      <button type="button" data-menos aria-label="Tirar um">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>
      </button>
      <span aria-live="polite">${i.qtd}</span>
      <button type="button" data-mais aria-label="Somar um">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
  </article>`;
}

function vazioHTML() {
  return `
  <div class="sac-vazio">
    <p class="sac-vazio-t">Seu carrinho está vazio.</p>
    <p>Escolha o modelo, a cor e a capacidade na página do produto. Só então ele
       entra aqui, já do jeito certo.</p>
    <a class="btn btn--vazio" href="index.html#catalogo">Ver o catálogo</a>
  </div>`;
}

/* ---------- O que costuma ir junto ----------
   Sugestão no único momento em que ela não atrapalha: a pessoa já
   decidiu comprar. Não é "quem viu também viu" — é o acessório que
   a categoria do que está no carrinho realmente pede, e só aparece
   se ainda não estiver lá dentro. */

const ACESSORIO_POR_CATEGORIA = {
  iphone: ['magsafe-charger', 'airpods-pro-3'],
  ipad:   ['apple-pencil-pro', 'magic-keyboard-ipad'],
  mac:    ['airpods-pro-3'],
  watch:  ['magsafe-charger'],
  audio:  ['magsafe-charger']
};

function sugestoes(itens) {
  if (!itens.length) return [];

  const dentro = new Set(itens.map((i) => i.id));
  const vistos = new Set();
  const fora = [];

  itens.forEach((i) => {
    const p = acharProduto(i.id);
    (ACESSORIO_POR_CATEGORIA[p?.categoria] || []).forEach((id) => {
      if (dentro.has(id) || vistos.has(id)) return;
      const sugerido = acharProduto(id);
      if (!sugerido || sugerido.oculto || REGRAS.statusDe(sugerido) === 'esgotado') return;
      vistos.add(id);
      fora.push(sugerido);
    });
  });

  return fora.slice(0, 2);
}

function sugestaoHTML(p) {
  return `
  <article class="sug" data-sugestao="${escapar(p.id)}">
    <div class="sug-poco">${aparelhoHTML(p, p.cores?.[0], 'linha')}</div>
    <div class="sug-txt">
      <h4>${escapar(p.nome)}</h4>
      <p>${brl(REGRAS.precoMinimo(p).final)}</p>
    </div>
    <button class="sug-mais" type="button" aria-label="Adicionar ${escapar(p.nome)} ao carrinho">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
    </button>
  </article>`;
}

function pintarSacola() {
  const itens = lerSacola();

  const corpo = document.querySelector('#carrinho-itens');
  const fim = document.querySelector('#carrinho-fim');
  const total = document.querySelector('#carrinho-total');
  const parcelado = document.querySelector('#carrinho-parcelado');

  if (corpo) {
    const sugeridos = sugestoes(itens);
    corpo.innerHTML = itens.length
      ? itens.map(itemHTML).join('') + (sugeridos.length ? `
        <section class="sugestoes">
          <h3>Costuma ir junto</h3>
          ${sugeridos.map(sugestaoHTML).join('')}
        </section>` : '')
      : vazioHTML();
  }
  if (fim) fim.hidden = !itens.length;
  if (total) total.textContent = brl(totalSacola(itens));
  if (parcelado) parcelado.textContent = itens.length
    ? `${parcela(totalSacola(itens))} sem juros`
    : '';

  // O botão da gaveta leva ao checkout; a mensagem de WhatsApp sai de lá.

  // Contador na navegação. Zero não é um número que precise aparecer.
  const n = contarSacola(itens);
  document.querySelectorAll('.fab-sacola').forEach((b) => {
    b.dataset.itens = String(n);
    const bolinha = b.querySelector('.fab-sacola-n');
    if (bolinha) bolinha.textContent = String(n);
    b.setAttribute('aria-label', n
      ? `Abrir o carrinho, ${n} ${n === 1 ? 'item' : 'itens'}`
      : 'Abrir o carrinho, vazio');
  });

  return itens;
}

/* ---------- Movimento ----------
   Duas peças, e só. O selo pulsa para dizer "chegou", e a peça
   escolhida voa até ele para dizer "chegou dali". Nada disso é
   enfeite: são as duas perguntas que a pessoa faz ao tocar em
   adicionar — foi? e foi o quê? */

function pulsarSelo() {
  const selo = document.querySelector('.fab-sacola');
  if (!selo || semMovimento()) return;
  selo.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.24)' }, { transform: 'scale(1)' }],
    { duration: 460, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
  );
}

function voarParaSacola(origem) {
  const selo = document.querySelector('.fab-sacola');
  if (!selo || !origem || semMovimento() || !origem.animate) return;

  const de = origem.getBoundingClientRect();
  const para = selo.getBoundingClientRect();
  if (!de.width || !para.width) return;

  const clone = origem.cloneNode(true);
  clone.classList.add('voando');
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${de.left}px`,
    top: `${de.top}px`,
    width: `${de.width}px`,
    height: `${de.height}px`,
    margin: '0',
    zIndex: '400',
    pointerEvents: 'none'
  });
  document.body.appendChild(clone);

  const dx = (para.left + para.width / 2) - (de.left + de.width / 2);
  const dy = (para.top + para.height / 2) - (de.top + de.height / 2);

  // O arco: sobe um pouco antes de ir, como um objeto jogado. Uma reta
  // até o ícone leria como recorte de tela, não como gesto.
  const voo = clone.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.5}px, ${dy * 0.28 - 46}px) scale(0.52)`, opacity: 0.92, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.1)`, opacity: 0 }
  ], { duration: 640, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });

  voo.onfinish = () => clone.remove();
  voo.oncancel = () => clone.remove();
  setTimeout(() => pulsarSelo(), 430);
}

/* ---------- Abrir e fechar ---------- */

let focoAnterior = null;

function abrirSacola(v) {
  const raiz = document.querySelector('#carrinho');
  if (!raiz) return;

  const folha = raiz.querySelector('.carrinho-folha');
  raiz.dataset.aberto = String(v);
  folha.setAttribute('aria-hidden', String(!v));
  document.documentElement.classList.toggle('travado', v);
  document.querySelectorAll('.fab-sacola').forEach((b) =>
    b.setAttribute('aria-expanded', String(v)));

  if (v) {
    focoAnterior = document.activeElement;
    // O primeiro foco vai para o fechar: é a saída, e quem usa teclado
    // precisa saber onde ela está antes de qualquer outra coisa.
    raiz.querySelector('.carrinho-x')?.focus();
  } else {
    focoAnterior?.focus?.();
    focoAnterior = null;
  }
}

function montarSacola() {
  const raiz = document.querySelector('#carrinho');
  if (!raiz) return;

  pintarSacola();

  document.querySelectorAll('.fab-sacola').forEach((b) =>
    b.addEventListener('click', () => abrirSacola(raiz.dataset.aberto !== 'true')));

  raiz.querySelectorAll('[data-fechar-carrinho]').forEach((b) =>
    b.addEventListener('click', () => abrirSacola(false)));

  document.addEventListener('keydown', (e) => {
    if (raiz.dataset.aberto !== 'true') return;

    if (e.key === 'Escape') { abrirSacola(false); return; }

    // Enquanto a gaveta está aberta, o Tab não escapa para trás dela.
    if (e.key !== 'Tab') return;
    const focaveis = raiz.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focaveis.length) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  });

  // Um acessório sugerido entra com a configuração padrão dele: são
  // peças de uma variante só, então não há escolha a fazer.
  raiz.addEventListener('click', (e) => {
    const mais = e.target.closest('.sug-mais');
    if (!mais) return;
    const p = acharProduto(mais.closest('[data-sugestao]')?.dataset.sugestao);
    if (!p) return;
    adicionarNaSacola(p, p.cores?.[0] || '', p.capacidades?.[0] || '',
      mais.closest('.sug')?.querySelector('.poco'));
  });

  // Mais, menos e a linha que desaparece quando chega a zero.
  raiz.addEventListener('click', (e) => {
    const botao = e.target.closest('[data-mais], [data-menos]');
    if (!botao) return;

    const linha = botao.closest('.sac-item');
    const chave = linha?.dataset.chave;
    if (!chave) return;

    const itens = lerSacola();
    const item = itens.find((i) => chaveItem(i.id, i.cor, i.capacidade) === chave);
    if (!item) return;

    item.qtd += botao.hasAttribute('data-mais') ? 1 : -1;

    const sobraram = itens.filter((i) => i.qtd > 0);
    gravarSacola(sobraram);

    if (item.qtd <= 0 && !semMovimento() && linha.animate) {
      // A linha encolhe antes de sumir: sem isso a lista salta e a
      // pessoa perde de vista o que acabou de tirar.
      const alt = linha.getBoundingClientRect().height;
      linha.style.overflow = 'hidden';
      const saida = linha.animate([
        { height: `${alt}px`, opacity: 1 },
        { height: '0px', opacity: 0, paddingTop: '0px', paddingBottom: '0px' }
      ], { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
      saida.onfinish = () => pintarSacola();
      return;
    }

    pintarSacola();
  });
}

/* ---------- A porta de entrada ----------
   Chamada pela página do produto — o único lugar do site onde um
   aparelho entra na sacola, porque é o único onde cor e capacidade
   já foram escolhidas. `origem` é o elemento que voa. */

function adicionarNaSacola(produto, cor, capacidade, origem) {
  if (!produto) return;

  const itens = lerSacola();
  const chave = chaveItem(produto.id, cor, capacidade);
  const jaTem = itens.find((i) => chaveItem(i.id, i.cor, i.capacidade) === chave);

  if (jaTem) jaTem.qtd += 1;
  else itens.push({ id: produto.id, cor, capacidade, qtd: 1 });

  gravarSacola(itens);
  pintarSacola();
  voarParaSacola(origem);
  if (semMovimento() || !origem) pulsarSelo();
}

document.addEventListener('DOMContentLoaded', montarSacola);

/* ---------- Quando a página volta ----------
   `DOMContentLoaded` roda UMA vez por documento carregado, e há três
   situações em que a sacola muda sem que ele volte a rodar:

     1. O BOTÃO VOLTAR. O navegador guarda a página inteira viva no
        back/forward cache e a devolve congelada no estado em que ela
        saiu — com o selo marcando o que havia ANTES de a pessoa
        juntar o produto na página seguinte. `DOMContentLoaded` não
        dispara nessa volta; só `pageshow` com `persisted`.
     2. Outra aba do mesmo site alterou o localStorage.
     3. A aba voltou a ficar visível depois de a pessoa comprar em
        outra janela.

   Nos três, o remédio é o mesmo e é barato: reler o que está guardado
   e repintar. `pintarSacola` é idempotente — chamar à toa não custa
   nada e não pisca. */
window.addEventListener('pageshow', (e) => {
  // Numa carga normal o `montarSacola` do DOMContentLoaded já cuidou.
  if (e.persisted) pintarSacola();
});

window.addEventListener('storage', (e) => {
  if (!e.key || e.key === SACOLA_CHAVE) pintarSacola();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') pintarSacola();
});

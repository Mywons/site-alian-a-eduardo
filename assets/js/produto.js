/* =============================================================
   ALIANÇA — página do produto
   ============================================================= */

/* A tabela de cores e o desenho dos aparelhos vivem em
   assets/js/aparelho.js, porque a vitrine também usa os dois. */

const idAtual = new URLSearchParams(location.search).get('id');

// Definido antes do DOMContentLoaded para que a bolha de WhatsApp
// já nasça com a mensagem deste produto.
if (idAtual) document.body.dataset.produto = idAtual;

document.addEventListener('DOMContentLoaded', () => {
  const raiz = document.querySelector('#produto');
  if (!raiz) return;

  const p = acharProduto(idAtual);

  if (!p || p.oculto) {
    raiz.innerHTML = `
      <div class="shell">
        <div class="vazio" style="max-width:620px;margin-inline:auto;border:0">
          <h3>Esse produto saiu da vitrine</h3>
          <p>O link pode estar antigo, ou a peça já foi vendida.
             Se você sabe o que procura, pergunte direto: às vezes temos em estoque.</p>
          <div class="compra" style="max-width:320px;margin-inline:auto">
            <a class="btn btn--grande" target="_blank" rel="noopener"
               href="${waLink(`Olá! Cheguei em um link do site da ${CONFIG.nome} que não abriu. Vocês podem me ajudar?`)}">
              ${ICONE_WA} Perguntar no WhatsApp
            </a>
            <a class="btn btn--vazio" href="index.html#catalogo">Ver o catálogo</a>
          </div>
        </div>
      </div>`;
    return;
  }

  document.title = `${p.nome} — ${CONFIG.nome}`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content',
    `${p.nome} na ${CONFIG.nome}: ${p.chamada || ''} A partir de ${brl(REGRAS.precoMinimo(p).final)}, com nota fiscal e garantia.`);

  // Abre na primeira opção que ainda está à venda.
  const primeiraLivre = (lista) => (lista || []).find((v) => !REGRAS.esgotada(p, v)) || lista?.[0] || '';
  let cor = primeiraLivre(p.cores);
  let capacidade = primeiraLivre(p.capacidades);
  const status = REGRAS.statusDe(p);
  const evento = window.EVENTO_ATIVO;

  const temCores = p.cores?.length > 1;
  const temCaps  = p.capacidades?.length > 1;
  const rotuloCap = (p.categoria === 'watch' || p.categoria === 'acessorios')
    ? 'Versão' : 'Capacidade';

  raiz.innerHTML = `
    <div class="shell">
      <nav class="migalhas" aria-label="Trilha de navegação">
        <a href="index.html">Loja</a><span aria-hidden="true">/</span>
        <a href="index.html?cat=${p.categoria}#catalogo">${escapar(nomeCategoria(p.categoria))}</a><span aria-hidden="true">/</span>
        <span aria-current="page">${escapar(p.nome)}</span>
      </nav>

      <header class="produto-capa">
        ${p.linha ? `<p class="olho">${escapar(p.linha)}</p>` : ''}
        <h1 class="produto-nome">${escapar(p.nome)}</h1>
        <p class="produto-resumo">${escapar(p.resumo || p.chamada || '')}</p>
        <p class="produto-preco" id="produto-preco" aria-live="polite"></p>
        ${status === 'encomenda' ? `<p class="produto-status">Sob encomenda${p.prazo ? ` · chega em ${escapar(p.prazo)}` : ''}</p>` : ''}
        ${status === 'esgotado' ? '<p class="produto-status produto-status--esgotado">Esgotado no momento</p>' : ''}

        ${p.precoOficial && p.precoOficial > REGRAS.precoMinimo(p).final ? `
        <p class="ancora">
          <span class="ancora-de">${brl(p.precoOficial)} no varejo oficial</span>
          <span class="ancora-eco">Você economiza ${brl(p.precoOficial - REGRAS.precoMinimo(p).final)}</span>
        </p>` : ''}

        <!-- A galeria: a foto da cor escolhida e, quando houver, os
             ângulos extras declarados no data.js. Produto sem foto cai
             no desenho esquemático de sempre. -->
        ${galeriaHTML(p, cor) || `
        <div class="produto-mockup cena3d" id="mockup">
          ${aparelhoHTML(p, cor, 'mockup')}
        </div>`}
      </header>

      <div class="produto-corpo">

        <div class="produto-ficha">
          <h2 class="specs-titulo">Especificações</h2>
          <ul class="specs">
            ${(p.specs || []).map(([k, v]) => `
              <li><span class="k">${escapar(k)}</span><span class="v">${escapar(v)}</span></li>`).join('')}
            <li><span class="k">Garantia</span><span class="v">12 meses</span></li>
            <li><span class="k">Nota fiscal</span><span class="v">Emitida em todo aparelho</span></li>
          </ul>
        </div>

        <aside class="escolhas">
          ${temCores ? `
          <div class="opcao">
            <div class="opcao-topo">
              <h3>Cor</h3>
              <span class="escolhido" id="cor-escolhida">${escapar(cor)}</span>
            </div>
            <div class="opcao-lista" id="lista-cores" role="group" aria-label="Escolher cor">
              ${p.cores.map((c, i) => `
                <button class="opt" type="button" data-v="${escapar(c)}" aria-pressed="${c === cor}"
                        ${REGRAS.esgotada(p, c) ? 'disabled data-esgotada="true"' : ''}>
                  <span class="swatch" style="background:${corHex(c)}" aria-hidden="true"></span>${escapar(c)}
                  ${REGRAS.esgotada(p, c) ? '<small>Esgotado</small>' : ''}
                </button>`).join('')}
            </div>
          </div>` : ''}

          ${temCaps ? `
          <div class="opcao">
            <div class="opcao-topo">
              <h3>${rotuloCap}</h3>
              <span class="escolhido" id="cap-escolhida">${escapar(capacidade)}</span>
            </div>
            <div class="opcao-lista" id="lista-caps" role="group" aria-label="Escolher ${rotuloCap.toLowerCase()}">
              ${p.capacidades.map((c, i) => `
                <button class="opt opt--cap" type="button" data-v="${escapar(c)}" aria-pressed="${c === capacidade}"
                        ${REGRAS.esgotada(p, c) ? 'disabled data-esgotada="true"' : ''}>
                  <span>${escapar(c)}</span>
                  <small>${REGRAS.esgotada(p, c) ? 'Esgotado' : brl(REGRAS.precoDe(p, c).final)}</small>
                </button>`).join('')}
            </div>
          </div>` : ''}

          <div class="compra">
            <a class="btn btn--grande btn--largo" id="btn-comprar" target="_blank" rel="noopener" href="#">
              ${ICONE_WA} ${status === 'esgotado' ? 'Avise-me quando chegar' : status === 'encomenda' ? 'Encomendar pelo WhatsApp' : 'Comprar pelo WhatsApp'}
            </a>
            ${status === 'esgotado' ? '' : `
            <button class="btn btn--vazio btn--grande btn--largo" type="button" id="btn-sacola">
              Adicionar ao carrinho
            </button>`}

            <!-- O que a pessoa precisa saber no segundo em que decide,
                 e não três rolagens depois do botão. -->
            <ul class="garantias">
              <li>Aparelho lacrado de fábrica</li>
              <li>Nota fiscal no seu nome</li>
              <li>Garantia de 12 meses com a ${escapar(CONFIG.nome)}</li>
            </ul>

            <p class="troca-usado">
              <a class="seta" target="_blank" rel="noopener"
                 href="${waLink(`Olá! Quero avaliar meu aparelho usado na troca do ${p.nome}. Posso mandar o modelo e o estado?`)}">
                Tenho um usado para dar na troca
              </a>
            </p>
          </div>
        </aside>

      </div>

      <section class="relacionados">
        <div class="sec-topo">
          <h2 class="t-lg">Também na loja</h2>
          <a class="seta" href="index.html?cat=${p.categoria}#catalogo">Ver toda a linha</a>
        </div>
        <div class="grade-destaques" id="grade-relacionados"></div>
      </section>
    </div>`;

  /* ---- Barra fixa de compra (celular) ---- */
  document.querySelector('#barra-nome').textContent = p.nome;
  const caixaPreco = raiz.querySelector('#produto-preco');
  const pintarPreco = () => {
    const info = REGRAS.precoDe(p, capacidade);
    const pct = info.base ? Math.round((info.desconto / info.base) * 100) : 0;
    const nomeOferta = info.oferta ? (info.oferta.rotulo || (evento && evento.selo) || 'Oferta') : '';
    caixaPreco.classList.toggle('tem-oferta', !!info.oferta);
    caixaPreco.innerHTML = `
      ${info.oferta ? `<span class="selo-oferta">${escapar(nomeOferta)}${pct >= 1 ? ` <b>−${pct}%</b>` : ''}</span>` : ''}
      ${info.oferta ? `<s class="preco-de">${brl(info.base)}</s>` : ''}
      <b>${brl(info.final)}</b>
      <span>${parcela(info.final)} sem juros · à vista com desconto no Pix</span>
      ${info.oferta && info.oferta.fim ? `<span class="preco-validade">Oferta válida até ${info.oferta.fim.split('-').reverse().join('/')}</span>` : ''}`;
    document.querySelector('#barra-valor').textContent = brl(info.final);
    // O número novo "assenta" no lugar quando a capacidade muda.
    if (caixaPreco.dataset.valor && caixaPreco.dataset.valor !== String(info.final)) {
      caixaPreco.classList.remove('mudou');
      void caixaPreco.offsetWidth;
      caixaPreco.classList.add('mudou');
    }
    caixaPreco.dataset.valor = String(info.final);
  };
  pintarPreco();

  /* ---- Link de compra sempre atualizado ---- */
  const btn = raiz.querySelector('#btn-comprar');
  const btnBarra = document.querySelector('#barra-btn');

  const atualizar = () => {
    pintarPreco();
    const info = REGRAS.precoDe(p, capacidade);
    const util = (v) => v && v !== 'Único';
    const detalhe = [capacidade, cor].filter(util).join(', ');
    const nome = `${p.nome}${detalhe ? ` (${detalhe})` : ''}`;
    const msg = status === 'esgotado'
      ? `Olá! O ${nome} aparece esgotado no site da ${CONFIG.nome}. Vocês me avisam quando chegar?`
      : info.oferta
        ? `Olá! Tenho interesse no ${nome} na oferta${evento ? ` de ${evento.nome}` : ''}, por ${brl(info.final)}, que vi no site da ${CONFIG.nome}. Ainda está disponível?`
        : msgProduto(p, cor, capacidade);
    const href = waLink(msg);
    btn.href = href;
    if (btnBarra) btnBarra.href = href;
  };
  atualizar();

  /* Adicionar ao carrinho. A peça que voa é a vista que está na tela:
     é o que a pessoa estava olhando quando decidiu. */
  const btnSacola = raiz.querySelector('#btn-sacola');
  btnSacola?.addEventListener('click', () => {
    const peca = raiz.querySelector('.galeria-quadro:not([aria-hidden]) img')
              || raiz.querySelector('#mockup .poco');
    adicionarNaSacola(p, cor, capacidade, peca);

    // Confirmação curta no próprio botão, e ele volta ao normal. Um
    // aviso que fica na tela vira sujeira na segunda vez.
    btnSacola.dataset.feito = 'true';
    btnSacola.textContent = 'No carrinho';
    clearTimeout(btnSacola._voltar);
    btnSacola._voltar = setTimeout(() => {
      btnSacola.dataset.feito = 'false';
      btnSacola.textContent = 'Adicionar ao carrinho';
    }, 1600);
  });

  const ligarOpcoes = (seletor, saida, aplicar) => {
    const lista = raiz.querySelector(seletor);
    if (!lista) return;
    lista.addEventListener('click', (e) => {
      const b = e.target.closest('.opt');
      if (!b) return;
      lista.querySelectorAll('.opt').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      aplicar(b.dataset.v);
      const rotulo = raiz.querySelector(saida);
      if (rotulo) rotulo.textContent = b.dataset.v;
      atualizar();
    });
  };

  // Escolher a cor troca a vista. É o motivo de a peça existir
  // grande: um pontinho de 15px não mostra o que é "Azul-profundo", e
  // a foto mostra.
  const mockup = raiz.querySelector('#mockup');

  /* A galeria mostra a cor escolhida e os ângulos que o produto
     tiver. Escolher a cor troca a FOTO no lugar; as setas, quando
     existem, andam entre ângulos. São dois eixos diferentes e nenhum
     mexe no outro. */
  const galeria = typeof ligarGaleria === 'function'
    ? ligarGaleria(raiz, p, cor)
    : null;

  /* Sem galeria (produto ainda sem foto) o desenho esquemático mantém
     o arraste para girar, que é o gesto que ele sempre teve. */
  const peca = mockup?.querySelector('.poco');
  if (peca && typeof montarGiro === 'function') {
    peca.tabIndex = 0;
    peca.setAttribute('role', 'img');
    peca.setAttribute('aria-label',
      `${p.nome}. Arraste ou use as setas para girar.`);
    montarGiro(peca);
  }
  ligarOpcoes('#lista-cores', '#cor-escolhida', (v) => {
    cor = v;
    if (galeria) galeria.trocarCor(v);
    else trocarCorAparelho(mockup, v, p);
  });
  ligarOpcoes('#lista-caps',  '#cap-escolhida', (v) => { capacidade = v; });

  /* ---- Relacionados ---- */
  const relacionados = raiz.querySelector('#grade-relacionados');
  const naVitrine = PRODUTOS.filter(REGRAS.visivel);
  let lista = naVitrine.filter((o) => o.categoria === p.categoria && o.id !== p.id);
  if (lista.length < 3) {
    lista = lista.concat(
      naVitrine.filter((o) => o.id !== p.id && !lista.includes(o) && o.destaque === 'principal')
    );
  }
  relacionados.innerHTML = lista.slice(0, 3)
    .map((o) => cardHTML(o, 'card--terco card--peq'))
    .join('');
  relacionados.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('vis'));

  /* ---- A barra só aparece quando o botão principal sai da tela ---- */
  const barra = document.querySelector('.barra-compra');
  if (barra && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entrada]) => {
      barra.dataset.visible = String(!entrada.isIntersecting && entrada.boundingClientRect.top < 0);
    }, { threshold: 0 }).observe(btn);
  }

  // O aviso de armazenamento sobe para cima da barra, e para isso o
  // CSS precisa da altura dela. Mesma razão do `--aviso-h`: ela muda
  // com o tamanho de fonte do usuário e com a safe-area do aparelho,
  // então um número fixo erra justamente nos aparelhos que têm faixa
  // embaixo — os que mais precisam de acerto. Acima de 900px a barra
  // não é exibida e a medida sai zero: o `if` deixa o valor de reserva
  // do CSS em pé em vez de escrever um zero que encavalaria os dois.
  if (barra) {
    const medirBarra = () => {
      const h = barra.getBoundingClientRect().height;
      if (h) document.documentElement.style.setProperty('--barra-h', `${Math.round(h)}px`);
    };
    medirBarra();
    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(medirBarra).observe(barra);
    } else {
      window.addEventListener('resize', medirBarra, { passive: true });
    }
  }
});

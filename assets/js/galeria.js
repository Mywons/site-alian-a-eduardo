/* =============================================================
   ALIANÇA ONE — a galeria do produto
   -------------------------------------------------------------
   As setas que trocam a VISTA do aparelho na página do produto:
   de lado, de costas, a tela ligada, a caixa.

   O QUE ENTRA NELA:

     1. a foto da cor escolhida — sempre, e sempre primeiro;
     2. as vistas extras que o `data.js` declarar em `vistas: []`.

   E o que NÃO entra: as outras cores. A galeria já passeou por elas,
   e era o gesto errado — a coluna de escolhas ao lado existe
   exatamente para isso, com nome escrito e amostra da cor. Duas
   maneiras de fazer a mesma coisa não são duas funções, são uma
   função e um ruído. Trocar a cor troca a foto NO LUGAR, com
   cross-fade; as setas ficam para o que elas são: ângulos.

   Por isso, hoje, **nenhum produto tem setas**. O item 2 está vazio,
   e o motivo é que a foto não existe: os bancos de render da Apple
   publicam um frontal por cor e mais nada — perfil e traseira saem de
   fotografar o aparelho. A galeria já sabe exibi-las e some sozinha
   enquanto não houver: com uma vista só, não há seta, ponto nem
   arraste, e o que sobra é a foto.

   No dia em que a foto existir, é uma linha no `data.js` e nenhuma
   aqui.

   ---------------------------------------------------------------
   O MOVIMENTO, quando há o que passar, segue as quatro regras do
   resto do site, e as três ferramentas vêm prontas do `gesto.js`:

     1. o trilho segue o dedo 1:1, respeitando onde ele pegou;
     2. na primeira e na última vista ele resiste em vez de travar
        (`limitar`/`elastico`);
     3. ao soltar, a vista de repouso é a mais próxima de ONDE O DEDO
        IA (`projetar`), não de onde ele parou;
     4. a mola recebe a velocidade do dedo e pode ser agarrada no meio
        do voo, sem salto.

   Tudo é `transform` no compositor. Nada de biblioteca, e o site
   continua abrindo com dois cliques.
   ============================================================= */

/* As vistas do produto, na ordem em que aparecem. A primeira é a cor
   escolhida e é a única que muda de arquivo depois; as outras são
   ângulos fixos. */
function vistasDoProduto(p, cor) {
  if (typeof temFoto !== 'function' || !temFoto(p)) return [];

  const escolhida = cor || p.cores?.[0] || '';
  const vistas = [{
    src: fotoProduto(p, escolhida),
    principal: true,
    rotulo: `${p.nome} na cor ${escolhida}`,
    legenda: escolhida
  }];

  for (const v of (Array.isArray(p.vistas) ? p.vistas : [])) {
    if (!v || !v.src) continue;
    vistas.push({
      src: v.src,
      principal: false,
      rotulo: v.rotulo || `${p.nome}, ${v.legenda || 'outra vista'}`,
      legenda: v.legenda || 'Outra vista'
    });
  }

  return vistas;
}

const ICONE_ANTES = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg>';
const ICONE_DEPOIS = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

/* ---------- O HTML ----------
   Uma vista só não é galeria: sem setas, sem pontos e sem gesto. */
function galeriaHTML(p, cor) {
  const vistas = vistasDoProduto(p, cor);
  if (vistas.length === 0) return '';

  const uma = vistas.length === 1;

  const quadros = vistas.map((v, i) => `
      <li class="galeria-quadro"${v.principal ? ' data-principal="true"' : ''} ${i === 0 ? '' : 'aria-hidden="true"'}>
        <img class="foto" src="${v.src}" alt="${escapar(v.rotulo)}"
             draggable="false" decoding="async"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}
             onerror="this.closest('.galeria-quadro').dataset.semFoto='true'">
      </li>`).join('');

  const pontos = vistas.map((v, i) => `
      <button class="galeria-ponto" type="button" data-vista="${i}"
              aria-label="Ver ${escapar(v.legenda)}" aria-current="${i === 0}"></button>`).join('');

  /* Quem recebe o foco muda com o modo, e é sempre UM só: com várias
     vistas o alvo do teclado é o palco (setas passam a vista); com uma
     vista só o alvo é o quadro (setas giram a peça). Dois elementos
     focáveis fazendo coisas parecidas seria uma parada de tab a mais
     sem nada a mais para fazer. */
  return `
  <div class="galeria" id="galeria" data-uma="${uma}">
    <div class="galeria-palco" id="galeria-palco"${uma ? '' : ' tabindex="0"'} role="group"
         aria-label="${escapar(p.nome)}. ${uma ? 'Arraste ou use as setas para girar.' : 'Arraste ou use as setas para ver as outras vistas.'}">
      <ul class="galeria-trilho" id="galeria-trilho">${quadros}</ul>
    </div>

    ${uma ? '' : `
    <button class="galeria-seta galeria-seta--antes" type="button" data-passo="-1" aria-label="Vista anterior">${ICONE_ANTES}</button>
    <button class="galeria-seta galeria-seta--depois" type="button" data-passo="1" aria-label="Próxima vista">${ICONE_DEPOIS}</button>

    <div class="galeria-pontos" id="galeria-pontos">${pontos}</div>`}

    <p class="galeria-legenda" id="galeria-legenda" aria-live="polite">
      ${escapar(vistas[0].legenda)}${uma ? '' : ` · 1 de ${vistas.length}`}
    </p>
  </div>`;
}

/* ---------- O comportamento ---------- */
function ligarGaleria(raiz, p, cor) {
  const galeria = raiz?.querySelector('#galeria');
  if (!galeria) return null;

  const palco = galeria.querySelector('#galeria-palco');
  const trilho = galeria.querySelector('#galeria-trilho');
  const legenda = galeria.querySelector('#galeria-legenda');
  const pontos = [...galeria.querySelectorAll('.galeria-ponto')];
  const quadros = [...galeria.querySelectorAll('.galeria-quadro')];
  const vistas = vistasDoProduto(p, cor);
  const total = vistas.length;
  if (!palco || !trilho || total === 0) return null;

  let atual = 0;
  const largura = () => palco.getBoundingClientRect().width || 1;

  const pintar = (x) => { trilho.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`; };
  const mola = molinha(pintar, { rigidez: 200, atrito: 30 });

  const parado = typeof semMovimento === 'function' && semMovimento();

  /* O que muda quando a vista muda, e nada disso é decoração:
     o rótulo é lido em voz alta, o `aria-hidden` tira as vistas
     escondidas da navegação por leitor de tela, e as setas de ponta
     desligam em vez de sumirem — um botão que some move o layout. */
  const marcar = () => {
    const v = vistas[atual];
    if (legenda) legenda.textContent = total === 1
      ? v.legenda
      : `${v.legenda} · ${atual + 1} de ${total}`;

    pontos.forEach((b, i) => b.setAttribute('aria-current', String(i === atual)));
    quadros.forEach((q, i) => {
      if (i === atual) q.removeAttribute('aria-hidden');
      else q.setAttribute('aria-hidden', 'true');
    });

    galeria.querySelectorAll('.galeria-seta').forEach((b) => {
      const passo = Number(b.dataset.passo);
      b.disabled = (passo < 0 && atual === 0) || (passo > 0 && atual === total - 1);
    });
  };

  /* Sem movimento a galeria não desliza: ela troca de vista por
     opacidade, e o trilho fica parado no lugar. */
  const aplicarSemMovimento = () => {
    quadros.forEach((q, i) => { q.dataset.ativa = String(i === atual); });
  };

  const ir = (i, velocidade) => {
    atual = Math.max(0, Math.min(total - 1, i));
    marcar();
    if (parado) aplicarSemMovimento();
    else mola.para(-atual * largura(), velocidade);
  };

  /* ---- Setas e pontos ---- */
  galeria.addEventListener('click', (e) => {
    const seta = e.target.closest('.galeria-seta');
    if (seta) { ir(atual + Number(seta.dataset.passo)); return; }
    const ponto = e.target.closest('.galeria-ponto');
    if (ponto) ir(Number(ponto.dataset.vista));
  });

  /* ---- Teclado ----
     Quem chega pelo tab também passa as vistas. */
  palco.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); ir(atual - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); ir(atual + 1); }
    else if (e.key === 'Home') { e.preventDefault(); ir(0); }
    else if (e.key === 'End') { e.preventDefault(); ir(total - 1); }
  });

  /* ---------- Trocar a cor ----------
     A cor não é uma vista ao lado: é a MESMA vista com outro arquivo.
     Troca no lugar, com cross-fade, e a galeria não sai do lugar —
     quem escolheu a cor está olhando para o aparelho, não pedindo
     para virá-lo.

     O arquivo novo é carregado ANTES de entrar: sem isso o
     cross-fade sai para o vazio e volta, que é pior que um corte. */
  const trocarCor = (novaCor) => {
    const quadro = galeria.querySelector('.galeria-quadro[data-principal="true"]');
    const img = quadro?.querySelector('.foto');
    if (!img) return;

    const nova = new Image();
    nova.onload = () => {
      quadro.dataset.trocando = 'true';
      // Espera o quadro seguinte para o navegador registrar o estado
      // de saída; sem isso a troca é um corte seco.
      requestAnimationFrame(() => {
        img.src = nova.src;
        img.alt = `${p.nome} na cor ${novaCor}`;
        vistas[0].legenda = novaCor;
        vistas[0].rotulo = img.alt;
        delete quadro.dataset.semFoto;
        marcar();
        requestAnimationFrame(() => { quadro.dataset.trocando = 'false'; });
      });
    };
    nova.onerror = () => { quadro.dataset.semFoto = 'true'; };
    nova.src = fotoProduto(p, novaCor);
  };

  /* ---------- Uma vista só ----------
     Não há o que passar, e o gesto volta a ser o que sempre foi na
     página do produto: ARRASTAR PARA GIRAR. A peça inclina no eixo Y,
     resiste no limite e assenta com a mesma mola — é o `montarGiro` do
     `gesto.js`, sem nada de novo.

     Ele mora no QUADRO, e não no palco: o palco tem `overflow:
     hidden` e cortaria a própria inclinação nas bordas. */
  if (total === 1) {
    const quadro = quadros[0];
    if (quadro && typeof montarGiro === 'function') {
      quadro.tabIndex = 0;
      quadro.setAttribute('role', 'img');
      quadro.setAttribute('aria-label', `${p.nome}. Arraste ou use as setas para girar.`);
      montarGiro(quadro);
    }
  }

  marcar();
  if (parado) { aplicarSemMovimento(); return { trocarCor, get atual() { return atual; } }; }

  pintar(0);

  /* ---- O arraste ----
     `touch-action: pan-y` no CSS: o dedo continua rolando a página na
     vertical, e só o horizontal é nosso. Sem isso a galeria sequestra
     a rolagem e o celular fica preso nela. */
  if (total > 1) {
    let pegando = false, xInicial = 0, baseInicial = 0, historico = [];

    palco.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      pegando = true;
      palco.setPointerCapture(e.pointerId);
      palco.dataset.pegando = 'true';

      // Agarrar no meio do voo assume o valor QUE ESTÁ NA TELA. Sem
      // isso a peça salta para o alvo lógico no primeiro movimento.
      baseInicial = mola.valor;
      mola.fixa(baseInicial);
      xInicial = e.clientX;
      historico = [{ x: e.clientX, t: performance.now() }];
    });

    palco.addEventListener('pointermove', (e) => {
      if (!pegando) return;
      const l = largura();
      const bruto = baseInicial + (e.clientX - xInicial);

      // Rubber-band nas duas pontas: fora do trilho cada pixel rende
      // menos, e a resistência cresce. Travar duro leria como "quebrou".
      const minimo = -(total - 1) * l;
      let x = bruto;
      if (bruto > 0) x = elastico(bruto, l);
      else if (bruto < minimo) x = minimo - elastico(minimo - bruto, l);
      mola.fixa(x);

      historico.push({ x: e.clientX, t: performance.now() });
      if (historico.length > 6) historico.shift();
    });

    const soltar = (e) => {
      if (!pegando) return;
      pegando = false;
      palco.dataset.pegando = 'false';
      try { palco.releasePointerCapture(e.pointerId); } catch (_) {}

      // Velocidade do FIM do gesto, tirada de um histórico curto: o
      // último evento sozinho é ruído do sensor.
      const primeiro = historico[0];
      const ultimo = historico[historico.length - 1];
      const dt = ultimo && primeiro ? ultimo.t - primeiro.t : 0;
      const v = dt > 0 ? ((ultimo.x - primeiro.x) / dt) * 1000 : 0;

      // Para onde ele IA, e não onde parou. Um peteleco de 20px com
      // velocidade alta passa a vista inteira; um arraste lento de
      // 20px volta para onde estava.
      const l = largura();
      const destino = mola.valor + projetar(v);
      ir(Math.round(-destino / l), v);
    };

    palco.addEventListener('pointerup', soltar);
    palco.addEventListener('pointercancel', soltar);
    // Arrastar a imagem para fora do navegador não é o gesto daqui.
    palco.addEventListener('dragstart', (e) => e.preventDefault());
  }

  /* Girar o aparelho ou redimensionar a janela muda a largura do
     palco, e o trilho precisa reassentar na vista certa — senão ele
     fica parado num deslocamento que já não corresponde a nada. */
  let redimensionando = 0;
  window.addEventListener('resize', () => {
    clearTimeout(redimensionando);
    redimensionando = setTimeout(() => mola.fixa(-atual * largura()), 120);
  });

  return { trocarCor, get atual() { return atual; } };
}

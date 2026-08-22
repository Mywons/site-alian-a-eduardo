/* =============================================================
   ALIANÇA ONE — a imagem de cada produto
   -------------------------------------------------------------
   Cada produto tem a foto oficial do aparelho, uma por cor, em
   assets/img/produtos/<id>/<cor>.webp. Trocar a cor na página do
   produto troca a foto, com cross-fade.

   Quando um produto não tem foto — porque você acabou de criar e
   ainda não colocou o arquivo — ele cai no mockup desenhado em SVG
   que vem depois neste arquivo: silhueta correta da categoria,
   preenchida na cor escolhida. Assim um produto novo nunca aparece
   com buraco no lugar da imagem.

   A tabela de cores abaixo pinta a bolinha ao lado de cada opção e
   também o mockup de reserva, então as duas nunca discordam.
   ============================================================= */

/* ---------- Cores reais dos produtos ----------
   O nome da cor no catálogo vira um valor. É a mesma tabela que
   pinta o pontinho ao lado da opção na página do produto, então
   a bolinha e o mockup nunca discordam. */

const CORES_HEX = {
  /* iPhone */
  'laranja-cósmico': '#d4691f', 'azul-profundo': '#2f3d5c', 'prateado': '#d8d9d6',
  'lavanda': '#cfc5e0', 'azul-névoa': '#b9c8d6', 'sálvia': '#b9c3ab',
  'preto': '#1f2022', 'branco': '#f0efec',
  'azul-céu': '#a9c2d6', 'dourado-claro': '#d9c9a8', 'branco-nuvem': '#ebe8e2',
  'preto-espacial': '#2a2b2e',
  'titânio-deserto': '#bda07d', 'titânio-natural': '#bcb7ad',
  'titânio-preto': '#3b3a38', 'titânio-branco': '#e7e5e0',
  'ultramarino': '#4557c4', 'azul-petróleo': '#a8ccc4', 'rosa': '#ecc6cd',
  'azul': '#7f9fc4', 'amarelo': '#e6cf7e', 'verde': '#8fc0a4',

  /* Mac */
  'estelar': '#e8dfd2', 'meia-noite': '#2e3541', 'laranja': '#e8823c',
  'roxo': '#a58fc4', 'cinza-espacial': '#5e6265',

  /* Watch */
  'titânio natural': '#b6ada2', 'titânio preto': '#3d3b3a',
  'preto brilhante': '#1e1f21', 'ouro rosé': '#dfb6a5'
};

/* Nem toda opção é cor: "Único", "49mm", "Com ANC". Quando não
   for, o aparelho recebe o tom neutro da própria categoria em vez
   de um cinza qualquer. */
const NEUTRO_CATEGORIA = {
  iphone: '#c8c3bb',
  mac:    '#c4c7cb',
  ipad:   '#b9bfc4',
  watch:  '#cfc7bd',
  audio:  '#e4e1db',
  acessorios: '#d2cec7'
};

const corHex = (nome, categoria) =>
  CORES_HEX[String(nome).toLowerCase()] || NEUTRO_CATEGORIA[categoria] || '#c2bdb6';

/* ---------- Derivações de cor ----------
   Um tom só entra na página como cor exata; todo o resto é
   uma mistura dele, para o mockup nunca sair da mesma família. */

const TOM = {
  corpo:   'var(--cor)',
  claro:   'color-mix(in oklab, var(--cor) 74%, white)',
  escuro:  'color-mix(in oklab, var(--cor) 76%, black)',
  fundo:   'color-mix(in oklab, var(--cor) 30%, black)',
  tela:    'color-mix(in oklab, var(--cor) 16%, black)',
  vidro:   'color-mix(in oklab, var(--cor) 55%, black)',
  borda:   'color-mix(in oklab, var(--cor) 62%, black)',
  metal:   'color-mix(in oklab, var(--cor) 55%, white)',
  faixa:   'color-mix(in oklab, var(--cor) 82%, black)'
};

let contadorUid = 0;
const novoUid = () => `ap${++contadorUid}`;

/* Papel de parede da tela: um degradê suave derivado da própria
   cor do aparelho. Abstrato de propósito — não é uma captura de
   tela, e não deve ser confundido com uma. */
function papel(uid) {
  return `
    <radialGradient id="${uid}-p" cx="30%" cy="16%" r="118%">
      <stop offset="0%"  style="stop-color:${TOM.claro}" stop-opacity="0.62"/>
      <stop offset="46%" style="stop-color:${TOM.vidro}" stop-opacity="0.55"/>
      <stop offset="100%" style="stop-color:${TOM.fundo}" stop-opacity="0.96"/>
    </radialGradient>`;
}

/* Sombra de contato: o aparelho apoiado, não flutuando no vazio.
   Elipse suave, nunca a sombra dura de um render de estúdio. */
function apoio(uid, cx, cy, rx, ry = 7) {
  return `
    <radialGradient id="${uid}-s" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="#2a2622" stop-opacity="0.20"/>
      <stop offset="62%" stop-color="#2a2622" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#2a2622" stop-opacity="0"/>
    </radialGradient>
    <ellipse class="ap-apoio" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${uid}-s)"/>`;
}

/* ---------- Formas por categoria ---------- */

/* iPhone, de frente. A largura muda com o modelo: o Pro Max é
   largo, o Air é o mais estreito da linha. */
function formaIphone(uid, id = '') {
  const air = id.includes('air');
  const max = id.includes('max');
  const pro = id.includes('pro');

  const w = max ? 102 : air ? 90 : pro ? 96 : 94;
  const h = max ? 202 : 194;
  const x = (240 - w) / 2;
  const y = (238 - h) / 2;
  const r = w * 0.185;
  const moldura = air ? 4 : 5;     // o Air tem a borda mais fina da linha

  const sx = x + moldura, sy = y + moldura;
  const sw = w - moldura * 2, sh = h - moldura * 2;

  return `
    <defs>${papel(uid)}</defs>
    ${apoio(uid, 120, y + h + 6, w * 0.52)}

    <!-- corpo, na cor real do produto -->
    <rect class="ap-corpo" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>

    <!-- tela -->
    <rect class="ap-tela" x="${sx}" y="${sy}" width="${sw}" height="${sh}"
          rx="${r - moldura}" fill="url(#${uid}-p)"/>

    <!-- ilha dinâmica -->
    <rect class="ap-preto" x="${120 - 16}" y="${sy + 9}" width="32" height="9.5" rx="4.75"/>

    <!-- botões laterais -->
    <rect class="ap-metal" x="${x + w - 1.6}" y="${y + h * 0.28}" width="2.6" height="30" rx="1.3"/>
    <rect class="ap-metal" x="${x - 1}" y="${y + h * 0.24}" width="2.6" height="15" rx="1.3"/>
    <rect class="ap-metal" x="${x - 1}" y="${y + h * 0.24 + 21}" width="2.6" height="15" rx="1.3"/>

    ${pro ? `<!-- linha de antena, marca visual dos modelos em titânio -->
    <rect class="ap-linha" x="${x + w * 0.28}" y="${y - 0.6}" width="${w * 0.44}" height="1.4" rx="0.7"/>` : ''}`;
}

/* iPad. Mais largo, borda uniforme, câmera no lado maior — como
   nos modelos atuais. */
function formaIpad(uid, id = '') {
  const pro = id.includes('pro');
  const w = pro ? 152 : 142;
  const h = pro ? 196 : 190;
  const x = (240 - w) / 2;
  const y = (238 - h) / 2;
  const r = 15;
  const moldura = pro ? 6 : 8;

  return `
    <defs>${papel(uid)}</defs>
    ${apoio(uid, 120, y + h + 6, w * 0.5)}

    <rect class="ap-corpo" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>
    <rect class="ap-tela" x="${x + moldura}" y="${y + moldura}"
          width="${w - moldura * 2}" height="${h - moldura * 2}" rx="${r - moldura + 1}"
          fill="url(#${uid}-p)"/>

    <!-- câmera frontal, no lado maior -->
    <circle class="ap-preto" cx="${x + moldura / 2}" cy="${y + h / 2}" r="2"/>

    <!-- encaixe magnético do Pencil -->
    <rect class="ap-linha" x="${x + w * 0.3}" y="${y - 0.6}" width="${w * 0.4}" height="1.6" rx="0.8"/>`;
}

/* MacBook: tampa, dobradiça e a base em cunha. */
function formaMacbook(uid) {
  return `
    <defs>${papel(uid)}</defs>
    ${apoio(uid, 120, 182, 104, 8)}

    <!-- tampa -->
    <rect class="ap-corpo" x="40" y="46" width="160" height="106" rx="8"/>
    <rect class="ap-tela" x="45.5" y="51.5" width="149" height="92" rx="4" fill="url(#${uid}-p)"/>
    <!-- entalhe da câmera -->
    <rect class="ap-preto" x="108" y="51.5" width="24" height="6" rx="0"/>

    <!-- base -->
    <rect class="ap-claro" x="36" y="152" width="168" height="9" rx="2.5"/>
    <path class="ap-corpo" d="M30 161 H210 L204 170 Q202.6 172 200 172 H40 Q37.4 172 36 170 Z"/>
    <!-- recorte para abrir a tampa -->
    <rect class="ap-escuro" x="104" y="161" width="32" height="2.6" rx="1.3"/>`;
}

/* iMac: tela, queixo na cor, pé em alumínio. */
function formaImac(uid) {
  return `
    <defs>${papel(uid)}</defs>
    ${apoio(uid, 120, 208, 62, 7)}

    <rect class="ap-corpo" x="36" y="36" width="168" height="132" rx="9"/>
    <rect class="ap-tela" x="43" y="43" width="154" height="102" rx="4" fill="url(#${uid}-p)"/>
    <!-- queixo, a assinatura do iMac -->
    <rect class="ap-claro" x="36" y="145" width="168" height="23" rx="0"/>
    <path class="ap-claro" d="M36 160 H204 V159 Q204 168 195 168 H45 Q36 168 36 159 Z"/>

    <!-- pescoço e pé -->
    <rect class="ap-metal" x="112" y="168" width="16" height="30" rx="2"/>
    <rect class="ap-metal" x="80" y="197" width="80" height="7" rx="3.5"/>`;
}

/* Mac mini: um bloco, e é isso. */
function formaMacmini(uid) {
  return `
    ${apoio(uid, 120, 152, 62, 7)}
    <rect class="ap-corpo" x="58" y="94" width="124" height="52" rx="13"/>
    <rect class="ap-claro" x="58" y="94" width="124" height="4" rx="2"/>
    <circle class="ap-luz" cx="72" cy="138" r="2.4"/>
    <rect class="ap-escuro" x="150" y="139" width="24" height="1.6" rx="0.8"/>`;
}

/* Apple Watch: caixa, coroa, pulseira. O Ultra é maior, mais
   quadrado, e tem o botão de ação. */
function formaWatch(uid, id = '') {
  const ultra = id.includes('ultra');
  const w = ultra ? 78 : 68;
  const h = ultra ? 92 : 82;
  const x = (240 - w) / 2;
  const y = (238 - h) / 2;
  const r = ultra ? 20 : 22;
  const moldura = ultra ? 7 : 5;

  const pw = w * 0.62;
  const px = 120 - pw / 2;

  return `
    <defs>${papel(uid)}</defs>
    ${apoio(uid, 120, y + h + 44, w * 0.42, 5)}

    <!-- pulseira -->
    <path class="ap-faixa" d="M${px} ${y + 8} H${px + pw} V22 Q${px + pw} 14 ${px + pw - 8} 14 H${px + 8} Q${px} 14 ${px} 22 Z"/>
    <path class="ap-faixa" d="M${px} ${y + h - 8} H${px + pw} V${238 - 22} Q${px + pw} ${238 - 14} ${px + pw - 8} ${238 - 14} H${px + 8} Q${px} ${238 - 14} ${px} ${238 - 22} Z"/>

    <!-- caixa -->
    <rect class="ap-corpo" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>
    <rect class="ap-tela" x="${x + moldura}" y="${y + moldura}"
          width="${w - moldura * 2}" height="${h - moldura * 2}" rx="${r - moldura}"
          fill="url(#${uid}-p)"/>

    <!-- coroa digital e botão lateral -->
    <rect class="ap-metal" x="${x + w - 1}" y="${y + h * 0.30}" width="6" height="13" rx="3"/>
    <rect class="ap-metal" x="${x + w - 0.5}" y="${y + h * 0.56}" width="4" height="12" rx="2"/>
    ${ultra ? `<rect class="ap-acao" x="${x - 4.5}" y="${y + h * 0.42}" width="5" height="14" rx="2.5"/>` : ''}`;
}

/* AirPods: o estojo, com a tampa marcada e o LED. */
function formaEstojo(uid, id = '') {
  const pro = id.includes('pro');
  const w = pro ? 84 : 88;
  const h = pro ? 78 : 70;
  const x = (240 - w) / 2;
  const y = (238 - h) / 2;

  return `
    ${apoio(uid, 120, y + h + 6, w * 0.52)}
    <rect class="ap-corpo" x="${x}" y="${y}" width="${w}" height="${h}" rx="${pro ? 22 : 26}"/>
    <!-- linha da tampa -->
    <path class="ap-tracado" d="M${x + 1} ${y + h * 0.34} H${x + w - 1}" stroke-width="1.4"/>
    <circle class="ap-luz" cx="120" cy="${y + h * 0.62}" r="2.6"/>
    <rect class="ap-escuro" x="${120 - 11}" y="${y + h - 5}" width="22" height="1.8" rx="0.9"/>`;
}

/* AirPods Max: arco e conchas. */
function formaFone(uid) {
  return `
    <defs>${papel(uid)}</defs>
    ${apoio(uid, 120, 192, 68, 7)}

    <!-- arco -->
    <path class="ap-arco" d="M62 132 V96 Q62 46 120 46 Q178 46 178 96 V132"
          stroke-width="11" stroke-linecap="round"/>
    <path class="ap-almofada" d="M84 62 Q120 40 156 62"
          stroke-width="9" stroke-linecap="round"/>

    <!-- hastes -->
    <rect class="ap-metal" x="58.5" y="118" width="7" height="26" rx="3.5"/>
    <rect class="ap-metal" x="174.5" y="118" width="7" height="26" rx="3.5"/>

    <!-- conchas -->
    <rect class="ap-corpo" x="40" y="136" width="48" height="60" rx="20"/>
    <rect class="ap-corpo" x="152" y="136" width="48" height="60" rx="20"/>
    <rect class="ap-tela" x="46" y="142" width="36" height="48" rx="15" fill="url(#${uid}-p)"/>
    <rect class="ap-tela" x="158" y="142" width="36" height="48" rx="15" fill="url(#${uid}-p)"/>
    <rect class="ap-metal" x="186" y="146" width="6" height="11" rx="3"/>`;
}

/* Apple Pencil: cilindro com o lado chato e a ponta cônica. */
function formaCaneta(uid) {
  return `
    ${apoio(uid, 120, 206, 46, 5)}
    <g transform="rotate(-32 120 120)">
      <rect class="ap-corpo" x="106" y="34" width="28" height="150" rx="14"/>
      <!-- lado chato, o que encosta no iPad -->
      <rect class="ap-claro" x="106" y="46" width="4" height="126" rx="2"/>
      <!-- ponta -->
      <path class="ap-metal" d="M110 184 H130 L124 202 Q120 208 116 202 Z"/>
      <rect class="ap-linha" x="106" y="76" width="28" height="1.6"/>
    </g>`;
}

/* Magic Keyboard: base e a malha de teclas, sugerida, não desenhada
   tecla a tecla. */
function formaTeclado(uid) {
  const teclas = [];
  for (let l = 0; l < 4; l++) {
    for (let c = 0; c < 13; c++) {
      teclas.push(`<rect class="ap-tecla" x="${48 + c * 11.4}" y="${116 + l * 12}"
        width="9.4" height="10" rx="2"/>`);
    }
  }
  return `
    ${apoio(uid, 120, 178, 90, 7)}
    <!-- tampa, levantada -->
    <path class="ap-escuro" d="M52 40 H188 Q194 40 194 46 V108 H46 V46 Q46 40 52 40 Z"/>
    <!-- base -->
    <rect class="ap-corpo" x="34" y="108" width="172" height="62" rx="7"/>
    ${teclas.join('')}
    <rect class="ap-tecla" x="92" y="164" width="56" height="4" rx="2"/>`;
}

/* Carregador MagSafe: o disco e o cabo. */
function formaMagsafe(uid) {
  return `
    ${apoio(uid, 120, 150, 44, 6)}
    <path class="ap-cabo" d="M120 138 Q120 186 168 196" stroke-width="6" stroke-linecap="round"/>
    <circle class="ap-corpo" cx="120" cy="106" r="42"/>
    <circle class="ap-aro" cx="120" cy="106" r="42" stroke-width="2"/>
    <circle class="ap-tela" cx="120" cy="106" r="26"/>
    <circle class="ap-tracado" cx="120" cy="106" r="26" stroke-width="1.4"/>`;
}

/* ---------- Escolha da forma ---------- */

function escolherForma(p, uid) {
  const id = String(p.id || '');

  if (p.categoria === 'iphone') return formaIphone(uid, id);
  if (p.categoria === 'ipad')   return formaIpad(uid, id);
  if (p.categoria === 'watch')  return formaWatch(uid, id);

  if (p.categoria === 'mac') {
    if (id.includes('imac'))   return formaImac(uid);
    if (id.includes('mini'))   return formaMacmini(uid);
    return formaMacbook(uid);
  }

  if (p.categoria === 'audio') {
    if (id.includes('max')) return formaFone(uid);
    return formaEstojo(uid, id);
  }

  if (id.includes('pencil'))   return formaCaneta(uid);
  if (id.includes('keyboard')) return formaTeclado(uid);
  if (id.includes('magsafe'))  return formaMagsafe(uid);

  return formaEstojo(uid, id);
}

/* ---------- Caminho da foto ----------
   O nome do arquivo é o nome da cor, sem acento e com hífen: é o
   que o script de download gravou, e é o que você repete se for
   acrescentar uma cor nova à mão. */

const semAcento = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const arquivoDaCor = (cor) =>
  semAcento(cor).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const fotoProduto = (p, cor) =>
  `assets/img/produtos/${p.id}/${arquivoDaCor(cor || p.cores?.[0] || '')}.webp`;

/* Um produto sem `fotos: false` no data.js é tratado como fotografado.
   Quem cria um produto novo e ainda não tem a imagem põe `fotos: false`
   e recebe o desenho, sem quebrar nada. */
const temFoto = (p) => p.fotos !== false && Array.isArray(p.cores) && p.cores.length > 0;

/* ---------- Montagem ----------
   `variante` decide o peso da peça:
     'mockup' — página do produto, grande
     'capa'   — a peça da capa
     'card'   — vitrine
     'linha'  — miniatura do catálogo e do carrinho
*/
function aparelhoHTML(p, cor, variante = 'card') {
  const escolhida = cor || p.cores?.[0] || '';
  const nomeado = escolhida && CORES_HEX[String(escolhida).toLowerCase()];
  const rotulo = `${p.nome}${escolhida ? ` na cor ${escolhida}` : ''}`;
  const hex = corHex(escolhida, p.categoria);

  if (temFoto(p)) {
    // A miniatura do catálogo não precisa carregar antes de aparecer.
    const preguica = variante === 'linha' || variante === 'card' ? ' loading="lazy"' : '';
    return `
  <div class="poco poco--${variante} poco--foto" data-cat="${escapar(p.categoria)}" style="--cor:${hex}">
    <img class="foto" src="${fotoProduto(p, escolhida)}" alt="${escapar(rotulo)}"
         decoding="async"${preguica}
         onerror="this.closest('.poco').dataset.semFoto='true'">
  </div>`;
  }

  const uid = novoUid();
  return `
  <div class="poco poco--${variante}" data-cat="${escapar(p.categoria)}" style="--cor:${hex}">
    <svg class="aparelho" viewBox="0 0 240 240" role="img"
         aria-label="Desenho esquemático do ${escapar(rotulo)}">
      ${escolherForma(p, uid)}
    </svg>
  </div>`;
}

/* Troca a cor da peça já na página. Com foto, troca o arquivo e faz
   cross-fade; com o desenho de reserva, só mexe na variável --cor e os
   preenchimentos derivados fazem o cross-fade sozinhos. */
function trocarCorAparelho(raiz, cor, produto) {
  const poco = raiz?.querySelector?.('.poco') || raiz;
  if (!poco?.style) return;

  const categoria = typeof produto === 'string' ? produto : produto?.categoria;
  poco.style.setProperty('--cor', corHex(cor, categoria));

  const foto = poco.querySelector('.foto');
  if (foto && produto && typeof produto !== 'string') {
    const nova = new Image();
    nova.onload = () => {
      poco.dataset.trocando = 'true';
      // Espera o quadro seguinte para o navegador registrar o estado
      // de saída antes de mudar o src; sem isso a troca é um corte seco.
      requestAnimationFrame(() => {
        foto.src = nova.src;
        foto.alt = `${produto.nome} na cor ${cor}`;
        requestAnimationFrame(() => { poco.dataset.trocando = 'false'; });
      });
    };
    nova.onerror = () => { poco.dataset.semFoto = 'true'; };
    nova.src = fotoProduto(produto, cor);
    return;
  }

  const svg = poco.querySelector('.aparelho');
  if (svg) {
    const base = svg.getAttribute('aria-label') || '';
    svg.setAttribute('aria-label', base.replace(/ na cor .*$/, '') + ` na cor ${cor}`);
  }
}

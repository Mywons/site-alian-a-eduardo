/* =============================================================
   ALIANÇA — comportamento compartilhado
   Sem framework, sem build. Só abrir o HTML.
   ============================================================= */

/* ---------- Onde as coisas ficam guardadas ----------
   O certo é o localStorage. Só que ele **não existe** quando o site é
   aberto com dois cliques, direto do arquivo: em `file://` o navegador
   trata cada documento como origem opaca e lança SecurityError só de
   encostar nele.

   Abrir assim é uma propriedade central deste site — está escrito no
   LEIA-ME e é como o dono vai testar. Então o carrinho precisa de um
   plano B, e o único que sobrevive à navegação entre páginas em
   `file://` é o `window.name`: ele acompanha a aba, inclusive de um
   arquivo para outro.

   É antigo e é feio. É também a diferença entre um carrinho que
   funciona e um que perde tudo a cada clique.

   O window.name viaja com a aba, então ele só é usado quando não há
   alternativa, e é limpo assim que um armazenamento de verdade
   aparece. Os links para o WhatsApp abrem em aba nova com `noopener`,
   então nada disso acompanha a pessoa para fora do site. */

const GUARDA_MARCA = 'aliancaone:';

const guarda = (() => {
  try {
    const teste = '__t';
    localStorage.setItem(teste, teste);
    localStorage.removeItem(teste);
    return {
      tipo: 'navegador',
      ler:    (c) => localStorage.getItem(c),
      gravar: (c, v) => { localStorage.setItem(c, v); },
      apagar: (c) => { localStorage.removeItem(c); }
    };
  } catch (_) { /* file://, aba anônima trancada, ou storage desligado */ }

  const lerMapa = () => {
    try {
      const n = String(window.name || '');
      return n.startsWith(GUARDA_MARCA) ? JSON.parse(n.slice(GUARDA_MARCA.length)) : {};
    } catch (_) { return {}; }
  };
  const gravarMapa = (m) => {
    try { window.name = GUARDA_MARCA + JSON.stringify(m); } catch (_) {}
  };

  return {
    tipo: 'aba',
    ler:    (c) => (c in lerMapa() ? lerMapa()[c] : null),
    gravar: (c, v) => { const m = lerMapa(); m[c] = v; gravarMapa(m); },
    apagar: (c) => { const m = lerMapa(); delete m[c]; gravarMapa(m); }
  };
})();

/* ---------- Utilidades ---------- */

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0
});

const brl = (v) => BRL.format(v);

const parcela = (v) => `ou ${CONFIG.parcelas}x de ${BRL.format(Math.ceil(v / CONFIG.parcelas))}`;

const waLink = (mensagem) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;

const msgProduto = (produto, cor, capacidade) => {
  // "Único" é preenchimento de catálogo, não informação para o vendedor
  const util = (v) => v && v !== 'Único';
  const detalhe = [capacidade, cor].filter(util).join(', ');
  return `Olá! Tenho interesse no ${produto.nome}${detalhe ? ` (${detalhe})` : ''} `
       + `que vi no site da ${CONFIG.nome}. Ainda está disponível?`;
};

const acharProduto = (id) => PRODUTOS.find((p) => p.id === id);

const nomeCategoria = (id) =>
  (CATEGORIAS.find((c) => c.id === id) || {}).nome || 'Catálogo';

const escapar = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const semMovimento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const linkProduto = (p) => `produto.html?id=${encodeURIComponent(p.id)}`;

const ICONE_WA = `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.06s.89 2.39 1.01 2.55c.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z"/>
</svg>`;

/* ---------- Navegação ---------- */

function montarNav() {
  const nav = document.querySelector('.nav-topo');
  if (!nav) return;

  const toggle = nav.querySelector('.nav-toggle');
  const links = nav.querySelector('.nav-links');
  if (!toggle || !links) return;

  const fechar = () => {
    toggle.setAttribute('aria-expanded', 'false');
    links.dataset.open = 'false';
  };

  toggle.addEventListener('click', () => {
    const aberto = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!aberto));
    links.dataset.open = String(!aberto);
  });

  links.addEventListener('click', (e) => { if (e.target.closest('a')) fechar(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
}

/* ---------- Aparelhos soltos no HTML ----------
   Qualquer elemento com data-aparelho="<id do produto>" recebe o
   desenho daquele produto. É assim que a capa põe um iPhone na
   página sem precisar de uma tag <img> apontando para lugar nenhum. */

function montarAparelhosSoltos() {
  document.querySelectorAll('[data-aparelho]').forEach((el) => {
    const p = acharProduto(el.dataset.aparelho);
    if (!p) return;
    el.innerHTML = aparelhoHTML(p, el.dataset.cor || p.cores?.[0], 'capa');
  });
}

/* ---------- Entrada da página ----------
   Uma coreografia curta, uma vez só. A ordem é a ordem de leitura,
   e o atraso entre as peças é o mesmo em todas as páginas. */

function montarEntrada() {
  document.querySelectorAll('[data-entra]').forEach((el, i) => {
    if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i);
  });

  // Espera a fonte carregar para o texto não entrar duas vezes:
  // uma na fallback e outra quando a Switzer chega.
  const soltar = () => document.documentElement.classList.add('pronto');
  if (document.fonts?.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 600))])
      .then(soltar);
  } else {
    soltar();
  }
}

/* ---------- Filete da navegação ----------
   Sem borda enquanto nada passa por baixo. O filete existe para
   separar o conteúdo da barra; sem conteúdo embaixo, ele é ruído. */

function montarNavRolagem() {
  const nav = document.querySelector('.nav-topo');
  if (!nav) return;

  let ticking = false;
  const medir = () => {
    nav.dataset.rolado = String(window.scrollY > 6);
    ticking = false;
  };

  medir();
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(medir);
  }, { passive: true });
}

/* ---------- Revelação no scroll ---------- */

function montarRevelacoes() {
  const alvos = document.querySelectorAll('[data-reveal]');
  if (!alvos.length) return;

  if (semMovimento() || !('IntersectionObserver' in window)) {
    alvos.forEach((el) => el.classList.add('vis'));
    return;
  }

  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('vis');
      obs.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });

  alvos.forEach((el) => obs.observe(el));
}

/* ---------- Bolha de WhatsApp ---------- */

/* Uma bolinha verde e mais nada. Sem cartão que abre sozinho, sem
   texto, sem botão de fechar: o ícone do WhatsApp já diz tudo o que
   ela faz, e nada tapa o conteúdo. Na página do produto ela carrega
   a mensagem daquele produto. */

function montarWhatsApp() {
  const bolha = document.querySelector('.wa');
  if (!bolha) return;

  const contexto = document.body.dataset.produto;
  const produto = contexto ? acharProduto(contexto) : null;

  bolha.href = waLink(produto
    ? msgProduto(produto)
    : `Olá! Vim pelo site da ${CONFIG.nome} e gostaria de falar com um consultor.`);
}

/* ---------- Peças de produto ---------- */

/* A vitrine não descreve o produto: mostra o aparelho, o nome e o
   preço. A frase de venda mora na página do produto, para quem quis
   saber mais.

   "Comprar" leva para a página do produto, não para a sacola: é lá
   que se escolhe cor e capacidade, e um aparelho de R$ 11 mil não
   entra na sacola sem que a pessoa tenha dito qual. Juntar a variante
   padrão daqui pouparia um clique e devolveria o problema em cheio —
   o vendedor perguntando de novo do outro lado, que é exatamente o
   que a sacola existe para evitar.

   Quem junta é o botão da PÁGINA DO PRODUTO. A vitrine mostra e
   encaminha; a página do produto decide. Da página principal a sacola
   é só leitura: o selo conta o que já está lá dentro e a gaveta abre
   com a lista, venha ela de onde vier. */

function cardHTML(p, classes = 'card--terco card--peq') {
  return `
  <article class="card ${classes}" data-reveal>
    <div class="card-poco">${aparelhoHTML(p, p.cores?.[0], 'card')}</div>
    ${p.linha ? `<p class="olho">${escapar(p.linha)}</p>` : ''}
    <h3 class="card-nome">
      <a class="card-link" href="${linkProduto(p)}">${escapar(p.nome)}</a>
    </h3>
    <p class="card-preco">${brl(p.preco)}<small>${parcela(p.preco)}</small></p>
    <div class="card-acoes">
      <a class="btn" href="${linkProduto(p)}"
         aria-label="Comprar ${escapar(p.nome)}">Comprar</a>
    </div>
  </article>`;
}

function linhaHTML(p) {
  return `
  <article class="linha" data-reveal>
    <div class="linha-poco">${aparelhoHTML(p, p.cores?.[0], 'linha')}</div>
    <div class="linha-txt">
      ${p.linha ? `<p class="olho">${escapar(p.linha)}</p>` : ''}
      <h3 class="linha-nome">
        <a class="linha-link" href="${linkProduto(p)}">${escapar(p.nome)}</a>
      </h3>
    </div>
    <p class="linha-preco">
      <b>${brl(p.preco)}</b>
      <small>${parcela(p.preco)}</small>
    </p>
    <div class="linha-acoes">
      <a class="btn btn--peq" href="${linkProduto(p)}"
         aria-label="Comprar ${escapar(p.nome)}">Comprar</a>
    </div>
  </article>`;
}

/* ---------- Destaques ---------- */

function montarDestaques() {
  const grade = document.querySelector('#grade-destaques');
  if (!grade) return;

  const escolhidos = PRODUTOS.filter((p) => p.destaque === 'principal').slice(0, 5);

  // Tamanho e fundo variam de propósito: 4+2 na primeira linha, 2+2+2 na
  // segunda. Cinco cards idênticos seriam o caminho fácil e o errado.
  //
  // As cinco caixas usam a versão SATURADA de cada família, e a ordem
  // espalha os matizes: laranja, azul, manteiga, verde, rosa. O damasco
  // saiu da lista quando o chão virou laranja — ele sumia dentro dele.
  const formas = [
    'card--largo card--forte',
    'card--alto card--bruma',
    'card--terco card--linho card--peq',
    'card--terco card--musgo card--peq',
    'card--terco card--argila card--peq'
  ];

  grade.innerHTML = escolhidos
    .map((p, i) => cardHTML(p, formas[i] || 'card--terco card--peq'))
    .join('');

  grade.querySelectorAll('[data-reveal]').forEach((el, i) =>
    el.style.setProperty('--delay', `${Math.min(i, 5) * 60}ms`));
}

/* ---------- Catálogo ---------- */

function montarCatalogo() {
  const lista = document.querySelector('#lista-produtos');
  if (!lista) return;

  const chips = document.querySelector('#chips');
  const busca = document.querySelector('#busca');
  const contagem = document.querySelector('#contagem');

  chips.innerHTML = CATEGORIAS.map((c, i) => `
    <button class="chip" type="button" data-cat="${c.id}" aria-pressed="${i === 0}">
      ${escapar(c.nome)}
    </button>`).join('');

  let categoria = 'todos';
  let termo = '';
  let primeira = true;

  /* Vinte e três linhas de uma vez é um paredão. Mostra dez, e quem
     quiser mais pede — o botão diz quantos faltam, para a pessoa saber
     se vale a pena continuar em vez de rolar no escuro. */
  const PASSO = 10;
  let mostrando = PASSO;

  let jaVistas = 0;

  const desenhar = () => {
    const t = termo.trim().toLowerCase();
    const achados = PRODUTOS.filter((p) => {
      const bateCat = categoria === 'todos' || p.categoria === categoria;
      const bateTermo = !t || [p.nome, p.linha, p.chamada, p.resumo]
        .filter(Boolean).join(' ').toLowerCase().includes(t);
      return bateCat && bateTermo;
    });

    if (!achados.length) {
      lista.innerHTML = `
        <div class="vazio">
          <h3>Nada aqui com esse nome</h3>
          <p>Talvez a gente tenha em estoque mesmo sem estar na vitrine.
             Pergunte direto e a resposta vem em minutos.</p>
          <a class="btn" target="_blank" rel="noopener"
             href="${waLink(`Olá! Procuro por "${termo.trim()}" no site da ${CONFIG.nome}. Vocês têm?`)}">
            ${ICONE_WA} Perguntar no WhatsApp
          </a>
        </div>`;
      contagem.textContent = 'Nenhum produto encontrado.';
      return;
    }

    const visiveis = achados.slice(0, mostrando);
    const faltam = achados.length - visiveis.length;

    lista.innerHTML = visiveis.map(linhaHTML).join('')
      + (faltam ? `
        <div class="mais">
          <button class="btn btn--vazio" type="button" id="btn-mais">
            Carregar mais ${faltam === 1 ? 'produto' : `${Math.min(faltam, PASSO)} produtos`}
          </button>
          <p class="mais-conta">${visiveis.length} de ${achados.length}</p>
        </div>` : '');

    contagem.textContent = achados.length === 1
      ? '1 produto na loja.'
      : `${achados.length} produtos na loja.`;

    const novos = lista.querySelectorAll('[data-reveal]');

    // Na primeira pintura o observador cuida da entrada conforme a rolagem,
    // em cascata. Ao trocar de filtro não há cascata: a pessoa pediu um
    // resultado e vê o resultado, inteiro, de uma vez.
    if (primeira) {
      primeira = false;
      novos.forEach((el, i) => el.style.setProperty('--delay', `${Math.min(i, 8) * 35}ms`));
      return;
    }

    // As linhas que já estavam na tela não reaparecem: só as que
    // acabaram de chegar é que entram, e em cascata curta.
    novos.forEach((el, i) => {
      if (i < jaVistas) { el.classList.add('vis'); return; }
      el.style.setProperty('--delay', `${Math.min(i - jaVistas, 6) * 45}ms`);
    });
    jaVistas = visiveis.length;
  };

  // A lista velha some antes da nova chegar. Sem isso o conteúdo troca
  // debaixo do olho e a pessoa perde o lugar onde estava lendo.
  let saindo;
  const trocar = () => {
    if (semMovimento()) { desenhar(); return; }
    clearTimeout(saindo);
    lista.dataset.trocando = 'true';
    saindo = setTimeout(() => {
      desenhar();
      lista.dataset.trocando = 'false';
    }, 160);
  };

  chips.addEventListener('click', (e) => {
    const botao = e.target.closest('.chip');
    if (!botao) return;
    categoria = botao.dataset.cat;
    mostrando = PASSO;
    jaVistas = 0;
    chips.querySelectorAll('.chip').forEach((c) =>
      c.setAttribute('aria-pressed', String(c === botao)));
    trocar();
  });

  let timer;
  busca.addEventListener('input', (e) => {
    termo = e.target.value;
    mostrando = PASSO;
    jaVistas = 0;
    clearTimeout(timer);
    // 120ms só para não redesenhar a cada tecla; imperceptível ao digitar
    timer = setTimeout(trocar, 120);
  });

  lista.addEventListener('click', (e) => {
    if (!e.target.closest('#btn-mais')) return;
    mostrando += PASSO;
    // Sem o fade da troca de filtro: aqui nada sai da tela, só chega
    // mais coisa embaixo. Apagar a lista para repintar seria um susto.
    desenhar();
  });

  // Permite chegar já filtrado: index.html?cat=mac#catalogo
  const inicial = new URLSearchParams(location.search).get('cat');
  if (inicial && CATEGORIAS.some((c) => c.id === inicial)) {
    categoria = inicial;
    chips.querySelectorAll('.chip').forEach((c) =>
      c.setAttribute('aria-pressed', String(c.dataset.cat === inicial)));
  }

  desenhar();
}

/* ---------- O acordeão das objeções ----------
   Uma pergunta aberta por vez. Não é economia de espaço: é para a
   pessoa ler a resposta em vez de varrer sete blocos de texto e não
   ler nenhum.

   A altura anima por `grid-template-rows`, não por `height`: assim o
   conteúdo continua sendo medido pelo navegador e a resposta não
   precisa de altura fixa no CSS. */

function montarPerguntas() {
  const raiz = document.querySelector('#acordeao');
  if (!raiz || typeof PERGUNTAS === 'undefined') return;

  raiz.innerHTML = PERGUNTAS.map((q, i) => `
    <div class="pergunta" data-reveal>
      <h3>
        <button type="button" id="pg-b${i}" aria-expanded="false" aria-controls="pg-r${i}">
          <span>${escapar(q.p)}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </h3>
      <div class="resposta" id="pg-r${i}" role="region" aria-labelledby="pg-b${i}">
        <div><p>${escapar(q.r)}</p></div>
      </div>
    </div>`).join('');

  raiz.addEventListener('click', (e) => {
    const botao = e.target.closest('button[aria-expanded]');
    if (!botao) return;
    const abrindo = botao.getAttribute('aria-expanded') !== 'true';

    // O estado vai no bloco inteiro, não só no botão: o botão mora
    // dentro do <h3> e a resposta é irmã do <h3>, então não há
    // seletor de irmão que alcance uma a partir do outro.
    raiz.querySelectorAll('.pergunta').forEach((bloco) => {
      const b = bloco.querySelector('button[aria-expanded]');
      const aberta = b === botao && abrindo;
      b.setAttribute('aria-expanded', String(aberta));
      bloco.dataset.aberta = String(aberta);
    });
  });
}

/* ---------- Tem alguém atendendo agora? ----------
   A pessoa chega à noite, pelo Instagram, e a primeira dúvida é se
   tem alguém do outro lado. Responder isso antes de ela perguntar
   vale mais do que qualquer texto institucional.

   Não é horário de loja: a Aliança One não tem balcão. É a janela em
   que uma pessoa de verdade responde no WhatsApp.

   Usa o relógio do visitante, que é o mesmo fuso da loja em 99% dos
   casos. Errar por uma hora aqui não custa nada; deixar a pergunta
   sem resposta custa. */

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

function estadoDaLoja(agora = new Date()) {
  const semana = CONFIG.horarios;
  if (!Array.isArray(semana)) return null;

  const hoje = semana[agora.getDay()];
  const hora = agora.getHours() + agora.getMinutes() / 60;

  if (hoje && hora >= hoje[0] && hora < hoje[1]) {
    return { aberta: true, texto: `Atendendo agora · até ${hoje[1]}h` };
  }

  // Fora do horário, dizer quando volta vale mais do que dizer que parou.
  if (hoje && hora < hoje[0]) {
    return { aberta: false, texto: `Fora do horário · volta hoje às ${hoje[0]}h` };
  }

  for (let i = 1; i <= 7; i++) {
    const dia = semana[(agora.getDay() + i) % 7];
    if (!dia) continue;
    const quando = i === 1 ? 'amanhã' : DIAS[(agora.getDay() + i) % 7];
    return { aberta: false, texto: `Fora do horário · volta ${quando} às ${dia[0]}h` };
  }
  return null;
}

function montarEstadoDaLoja() {
  const estado = estadoDaLoja();
  document.querySelectorAll('#estado-loja, .estado').forEach((alvo) => {
    if (!estado) { alvo.remove(); return; }
    alvo.dataset.aberta = String(estado.aberta);
    const txt = alvo.querySelector('.estado-txt');
    if (txt) txt.textContent = estado.texto;
  });
}

/* ---------- Reancorar depois de montar ----------
   Os destaques e o catálogo são montados por JS, então na hora em que
   o navegador pula para `#catalogo` essas duas seções ainda têm altura
   zero. Ele acerta o ponto certo do documento vazio — e quando o
   conteúdo entra, tudo cresce ACIMA daquele ponto e a pessoa termina
   olhando para a seção anterior.

   É por isso que clicar em "Mac" no topo parecia não filtrar nada: o
   filtro estava certo, a rolagem é que ficou para trás. Depois de
   montar, refazemos a conta. */

function reancorar() {
  if (!location.hash || location.hash.length < 2) return;

  let alvo;
  try { alvo = document.querySelector(location.hash); } catch (_) { return; }
  if (!alvo) return;

  const nav = document.querySelector('.nav-topo');
  const folga = (nav ? nav.offsetHeight : 52) + 24;

  const ir = () => {
    const y = alvo.getBoundingClientRect().top + window.scrollY - folga;
    // 'instant' porque isto corrige a posição inicial: uma rolagem
    // suave aqui seria a página andando sozinha na cara da pessoa.
    window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
  };

  requestAnimationFrame(() => requestAnimationFrame(ir));
  // A fonte chega depois e mexe na altura do texto mais uma vez.
  if (document.fonts?.ready) document.fonts.ready.then(ir);
  window.addEventListener('load', ir, { once: true });
}

/* ---------- Aviso de armazenamento ----------
   O site não usa cookie de rastreamento, então o aviso não pede
   consentimento para nada: ele conta o que fica guardado e sai da
   frente. Pedir "aceite" para algo que já é do usuário e nunca sai
   do aparelho dele seria teatro. */

const AVISO_CHAVE = 'alianca:aviso-lido';

function montarAviso() {
  const aviso = document.querySelector('#aviso');
  if (!aviso) return;

  if (guarda.ler(AVISO_CHAVE) === '1') return;

  // No celular o aviso é uma folha colada na base, e os dois botões
  // flutuantes sobem a altura dela para não se empilharem no mesmo
  // canto. A altura é medida do elemento real — ela muda com o
  // tamanho de fonte do usuário e com a safe-area do aparelho, então
  // um número fixo no CSS erraria em metade dos casos.
  const medir = () => {
    const h = aviso.getBoundingClientRect().height;
    if (h) document.documentElement.style.setProperty('--aviso-h', `${Math.round(h + 12)}px`);
  };

  // Espera a página assentar. Uma faixa que aparece junto com o
  // conteúdo compete com ele logo no primeiro segundo.
  setTimeout(() => {
    aviso.hidden = false;
    medir();
    requestAnimationFrame(() => { aviso.dataset.visivel = 'true'; });
  }, 1200);

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(medir).observe(aviso);
  } else {
    window.addEventListener('resize', medir, { passive: true });
  }

  const guardarEFechar = () => {
    aviso.dataset.visivel = 'false';
    guarda.gravar(AVISO_CHAVE, '1');
    document.documentElement.style.removeProperty('--aviso-h');
    setTimeout(() => { aviso.hidden = true; }, 460);
  };

  aviso.querySelector('#aviso-ok')?.addEventListener('click', guardarEFechar);

  // Sair pelo teclado fecha também: a folha cobre a base da tela e
  // quem navega por teclado precisa de uma saída que não seja o
  // ponteiro. Não grava nada diferente — é o mesmo "li e entendi".
  aviso.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') guardarEFechar();
  });
}

/* ---------- Apagar o que está guardado ---------- */

function montarApagar() {
  const botao = document.querySelector('#btn-apagar');
  if (!botao) return;

  botao.addEventListener('click', () => {
    guarda.apagar(SACOLA_CHAVE);
    guarda.apagar(AVISO_CHAVE);

    if (typeof pintarSacola === 'function') pintarSacola();

    const feito = document.querySelector('#apagar-feito');
    if (feito) feito.textContent = 'Pronto. Carrinho vazio e aviso zerado neste navegador.';
  });
}

/* ---------- Preenchimentos gerais ---------- */

function montarGerais() {
  document.querySelectorAll('[data-wa]').forEach((el) => {
    const custom = el.dataset.wa;
    el.href = waLink(custom && custom !== 'true'
      ? custom
      : `Olá! Vim pelo site da ${CONFIG.nome} e gostaria de falar com um consultor.`);
  });

  document.querySelectorAll('[data-campo]').forEach((el) => {
    const v = CONFIG[el.dataset.campo];
    if (v) el.textContent = v;
  });

  const ano = document.querySelector('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // O @ do Instagram e o CNPJ só aparecem se estiverem preenchidos:
  // um link para instagram.com/ e um "CNPJ:" vazio valem menos que nada.
  const sumir = (el, seletorDoBloco) => (el.closest(seletorDoBloco) || el).remove();

  const temInstagram = CONFIG.instagram && CONFIG.instagram !== 'https://instagram.com/';
  document.querySelectorAll('[data-instagram]').forEach((el) => {
    if (!temInstagram) { sumir(el, '[data-instagram-bloco]'); return; }
    el.href = CONFIG.instagram;
    const rotulo = el.querySelector('[data-arroba]');
    if (rotulo) rotulo.textContent = CONFIG.arroba || 'Instagram';
  });

  document.querySelectorAll('[data-cnpj]').forEach((el) => {
    if (!CONFIG.cnpj) { sumir(el, '[data-cnpj-bloco]'); return; }
    el.textContent = CONFIG.cnpj;
  });

  const d = CONFIG.whatsapp;
  const legivel = d.length >= 12
    ? `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, -4)}-${d.slice(-4)}`
    : d;
  document.querySelectorAll('[data-telefone]').forEach((el) => el.textContent = legivel);
}

/* ---------- Início ---------- */

document.addEventListener('DOMContentLoaded', () => {
  montarGerais();
  montarNav();
  montarNavRolagem();
  montarAparelhosSoltos();
  montarDestaques();
  montarCatalogo();
  montarPerguntas();
  reancorar();
  montarWhatsApp();
  montarEstadoDaLoja();
  montarAviso();
  montarApagar();
  montarRevelacoes();
  montarEntrada();
});

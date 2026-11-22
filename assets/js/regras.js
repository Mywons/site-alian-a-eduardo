/* =============================================================
   REGRAS — preço, oferta, disponibilidade e eventos
   -------------------------------------------------------------
   Um arquivo só com as contas, usado em três lugares:
     • no site, para mostrar o preço certo de cada capacidade;
     • no painel (admin.html), para simular e editar;
     • no robô diário (scripts/atualizar-precos.mjs), que recalcula
       os preços pelo dólar do dia.
   Por isso ele não toca em página nenhuma: só recebe dados e
   devolve números.
   ============================================================= */

(function (raiz) {
  'use strict';

  const pad = (n) => String(n).padStart(2, '0');

  /* A data de hoje no fuso do aparelho, em AAAA-MM-DD. É o formato
     dos campos de data do painel, e compara como texto. */
  const hoje = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const dentro = (data, ini, fim) => (!ini || data >= ini) && (!fim || data <= fim);

  /* ---------- Arredondamento ----------
     '9'  → termina em 9       (8.743 → 8.749)
     '99' → termina em 99      (8.743 → 8.799)
     '90' → termina em 90      (8.743 → 8.790)
     '0'  → só tira os centavos                     */
  function arredondar(v, modo = '99') {
    v = Math.max(0, Number(v) || 0);
    if (modo === '9')  return Math.ceil((v + 1) / 10) * 10 - 1;
    if (modo === '99') return Math.ceil((v + 1) / 100) * 100 - 1;
    if (modo === '90') return Math.ceil((v + 10) / 100) * 100 - 10;
    return Math.round(v);
  }

  /* ---------- Preço por capacidade ---------- */

  const capacidadesDe = (p) => (p.capacidades && p.capacidades.length ? p.capacidades : ['Único']);

  /* Preço de tabela, antes de oferta. Sem `precos`, todas as
     capacidades valem `preco` — é como o catálogo nasceu. */
  function precoTabela(p, cap) {
    const t = p.precos || {};
    if (cap && t[cap] != null && t[cap] !== '') return Number(t[cap]);
    return Number(p.preco) || 0;
  }

  const ofertaAtiva = (p, data = hoje()) => {
    const o = p.oferta;
    return !!(o && Number(o.valor) > 0 && dentro(data, o.inicio, o.fim));
  };

  function aplicarOferta(v, o) {
    if (!o) return v;
    const valor = Number(o.valor) || 0;
    const r = o.tipo === 'R$' ? v - valor : v * (1 - valor / 100);
    return Math.max(0, Math.round(r));
  }

  /* Tudo o que a vitrine precisa saber do preço de uma capacidade. */
  function precoDe(p, cap, data = hoje()) {
    const base = precoTabela(p, cap);
    const oferta = ofertaAtiva(p, data) ? p.oferta : null;
    const final = oferta ? aplicarOferta(base, oferta) : base;
    return { base, final, oferta, desconto: base - final };
  }

  /* Opções esgotadas: nomes de cor ou de capacidade. */
  const esgotada = (p, opcao) => (p.esgotadas || []).includes(opcao);

  /* O "a partir de": o menor preço entre as capacidades que ainda
     estão à venda. Se todas esgotaram, o menor de todas. */
  function precoMinimo(p, data = hoje()) {
    const caps = capacidadesDe(p);
    const vendaveis = caps.filter((c) => !esgotada(p, c));
    const lista = (vendaveis.length ? vendaveis : caps).map((c) => precoDe(p, c, data));
    const menor = lista.reduce((a, b) => (b.final < a.final ? b : a), lista[0]);
    const varia = new Set(caps.map((c) => precoTabela(p, c))).size > 1;
    return { ...menor, varia };
  }

  /* 'disponivel' | 'encomenda' | 'esgotado' */
  const statusDe = (p) => p.status || 'disponivel';
  const visivel = (p) => !p.oculto;

  /* ---------- Preço automático pelo dólar ----------
     preço = custo em R$ × (1 + custos extras %) → + margem → arredonda

     `cfg` é LOJA.precificacao. O produto pode trazer a própria margem
     (`margem: { tipo: '%' | 'R$', valor }`); sem ela vale a da loja. */
  function custoEmReais(p, cap, dolar) {
    const c = (p.custos || {})[cap];
    if (c == null || c === '' || !(Number(c) > 0)) return null;
    return (p.moedaCusto || 'USD') === 'USD' ? Number(c) * Number(dolar || 0) : Number(c);
  }

  function precoCalculado(p, cap, cfg, dolar) {
    const custo = custoEmReais(p, cap, dolar);
    if (custo == null) return null;
    const extras = Number(cfg.custosExtras) || 0;
    const m = p.margem && p.margem.valor !== '' && p.margem.valor != null ? p.margem : (cfg.margem || { tipo: '%', valor: 0 });
    let v = custo * (1 + extras / 100);
    v = m.tipo === 'R$' ? v + Number(m.valor || 0) : v * (1 + Number(m.valor || 0) / 100);
    return arredondar(v, cfg.arredondar || '99');
  }

  /* Recalcula o catálogo inteiro. Não muda nada no lugar: devolve a
     lista nova e um relatório. Uma variação maior que o limite NÃO é
     aplicada — vira alerta, para uma pessoa olhar antes. */
  function recalcular(produtos, cfg, dolar) {
    const limite = Number(cfg.limiteVariacao) || 0;
    const mudancas = [];
    const alertas = [];
    const novos = produtos.map((p) => {
      if (p.precoManual) return p;
      const caps = capacidadesDe(p);
      // A tabela inteira, não só o que mudar: uma capacidade que não
      // tem custo (ou ficou travada) continua com o preço que tinha.
      const precos = {};
      caps.forEach((cap) => { precos[cap] = precoTabela(p, cap); });
      let mexeu = false;
      caps.forEach((cap) => {
        const novo = precoCalculado(p, cap, cfg, dolar);
        if (novo == null) return;
        const antigo = precoTabela(p, cap);
        if (novo === antigo) return;
        const variacao = antigo ? ((novo - antigo) / antigo) * 100 : 100;
        const item = { id: p.id, nome: p.nome, cap, antigo, novo, variacao: Math.round(variacao * 10) / 10 };
        if (limite && Math.abs(variacao) > limite) { alertas.push(item); return; }
        precos[cap] = novo;
        mudancas.push(item);
        mexeu = true;
      });
      if (!mexeu) return p;
      return sincronizarPreco({ ...p, precos });
    });
    return { produtos: novos, mudancas, alertas };
  }

  /* `preco` continua existindo (é o "a partir de" de tabela) para o
     resto do código — e a página Corporate — não precisar saber de
     capacidade. */
  function sincronizarPreco(p) {
    const caps = capacidadesDe(p);
    const t = p.precos || {};
    const valores = caps.map((c) => t[c]).filter((v) => v != null && v !== '' && Number(v) > 0).map(Number);
    if (valores.length) p.preco = Math.min(...valores);
    // Limpa capacidade que saiu da lista
    if (p.precos) {
      Object.keys(p.precos).forEach((c) => { if (!caps.includes(c)) delete p.precos[c]; });
      if (!Object.keys(p.precos).length) delete p.precos;
    }
    if (p.custos) {
      Object.keys(p.custos).forEach((c) => { if (!caps.includes(c)) delete p.custos[c]; });
      if (!Object.keys(p.custos).length) delete p.custos;
    }
    return p;
  }

  /* ---------- Eventos ----------
     Cada tema muda a cor da faixa, do botão, dos selos de oferta e
     ganha um cartaz próprio na capa. `inicio`/`fim` são sugestões em
     MM-DD; o painel transforma em data do ano certo. Os textos são
     ponto de partida — o dono reescreve. */
  const TEMAS = [
    { id: 'black-friday', nome: 'Black Friday', inicio: '11-20', fim: '11-30',
      titulo: 'Black Friday Aliança', subtitulo: 'Os menores preços do ano em iPhone, Mac e AirPods. Com nota fiscal e garantia, como sempre.',
      faixa: 'Black Friday Aliança|Até 12x sem juros|Nota fiscal e garantia de 12 meses', selo: 'Black Friday' },
    { id: 'cyber-monday', nome: 'Cyber Monday', inicio: '11-30', fim: '12-02',
      titulo: 'Cyber Monday', subtitulo: 'Mais um dia de preço especial, só pelo WhatsApp.',
      faixa: 'Cyber Monday|Preços especiais hoje|Até 12x sem juros', selo: 'Cyber Monday' },
    { id: 'natal', nome: 'Natal', inicio: '12-01', fim: '12-25',
      titulo: 'O presente certo é Apple.', subtitulo: 'Entrega no mesmo dia em São Paulo, a tempo da ceia.',
      faixa: 'Feliz Natal|Entrega no mesmo dia em SP|Até 12x sem juros', selo: 'Natal' },
    { id: 'ano-novo', nome: 'Ano Novo', inicio: '12-26', fim: '01-06',
      titulo: 'Ano novo, iPhone novo.', subtitulo: 'Comece o ano com o aparelho que você queria.',
      faixa: 'Feliz Ano Novo|Até 12x sem juros|Troque seu usado', selo: 'Ano Novo' },
    { id: 'volta-as-aulas', nome: 'Volta às aulas', inicio: '01-15', fim: '02-28',
      titulo: 'Volta às aulas com MacBook e iPad.', subtitulo: 'O material que dura a faculdade inteira.',
      faixa: 'Volta às aulas|MacBook e iPad em até 12x|Nota fiscal no seu nome', selo: 'Volta às aulas' },
    { id: 'consumidor', nome: 'Semana do Consumidor', inicio: '03-10', fim: '03-17',
      titulo: 'Semana do Consumidor', subtitulo: 'Preço especial e o atendimento de sempre.',
      faixa: 'Semana do Consumidor|Até 12x sem juros|Garantia de 12 meses', selo: 'Consumidor' },
    { id: 'maes', nome: 'Dia das Mães', inicio: '04-28', fim: '05-12',
      titulo: 'Para quem merece o melhor.', subtitulo: 'Presentes Apple para o Dia das Mães, entregues em mãos.',
      faixa: 'Dia das Mães|Entrega no mesmo dia em SP|Até 12x sem juros', selo: 'Dia das Mães' },
    { id: 'namorados', nome: 'Dia dos Namorados', inicio: '06-01', fim: '06-12',
      titulo: 'Um presente para dois.', subtitulo: 'AirPods, Apple Watch e iPhone para o Dia dos Namorados.',
      faixa: 'Dia dos Namorados|Entrega no mesmo dia em SP|Até 12x sem juros', selo: 'Namorados' },
    { id: 'pais', nome: 'Dia dos Pais', inicio: '07-28', fim: '08-12',
      titulo: 'Para o pai que tem tudo.', subtitulo: 'Apple Watch, MacBook e iPhone para o Dia dos Pais.',
      faixa: 'Dia dos Pais|Entrega no mesmo dia em SP|Até 12x sem juros', selo: 'Dia dos Pais' },
    { id: 'lancamento', nome: 'Lançamento Apple', inicio: '09-08', fim: '09-30',
      titulo: 'Chegou a nova geração.', subtitulo: 'Os lançamentos da Apple, lacrados e com nota fiscal.',
      faixa: 'Lançamento|Reserve pelo WhatsApp|Troque seu usado', selo: 'Lançamento' },
    { id: 'criancas', nome: 'Dia das Crianças', inicio: '10-01', fim: '10-12',
      titulo: 'Diversão com garantia.', subtitulo: 'iPad e AirPods para o Dia das Crianças.',
      faixa: 'Dia das Crianças|iPad em até 12x|Entrega no mesmo dia em SP', selo: 'Dia das Crianças' },
    { id: 'aniversario', nome: 'Aniversário da loja', inicio: '', fim: '',
      titulo: 'Aniversário Aliança One', subtitulo: 'A festa é nossa, o presente é seu.',
      faixa: 'Aniversário Aliança One|Preços de aniversário|Até 12x sem juros', selo: 'Aniversário' }
  ];

  const temaDe = (id) => TEMAS.find((t) => t.id === id) || null;

  /* O evento que vale hoje: o primeiro ligado cujas datas incluem a
     data. `?evento=natal` na URL força um tema, para pré-visualizar. */
  function eventoAtivo(loja, data = hoje()) {
    const lista = (loja && loja.eventos) || [];
    return lista.find((e) => e.ativo !== false && temaDe(e.tema) && dentro(data, e.inicio, e.fim)) || null;
  }

  /* Datas sugeridas no ano certo: o próximo período que ainda não
     acabou. Um período que vira o ano (26/12 a 06/01) termina no ano
     seguinte. */
  function datasSugeridas(tema, ref = new Date()) {
    if (!tema.inicio || !tema.fim) return { inicio: '', fim: '' };
    let ano = ref.getFullYear();
    const montar = (a) => {
      const ini = `${a}-${tema.inicio}`;
      const fim = `${tema.fim < tema.inicio ? a + 1 : a}-${tema.fim}`;
      return { inicio: ini, fim };
    };
    let d = montar(ano);
    if (d.fim < hoje(ref)) d = montar(ano + 1);
    return d;
  }

  raiz.REGRAS = {
    hoje, arredondar, capacidadesDe, precoTabela, ofertaAtiva, aplicarOferta, precoDe,
    precoMinimo, esgotada, statusDe, visivel, custoEmReais, precoCalculado, recalcular,
    sincronizarPreco, TEMAS, temaDe, eventoAtivo, datasSugeridas
  };
})(typeof window !== 'undefined' ? window : globalThis);

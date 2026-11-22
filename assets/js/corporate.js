/* =============================================================
   ALIANÇA CORPORATE — comportamento da página
   -------------------------------------------------------------
   Depende só de `data.js` (para o número do WhatsApp e o nome da
   loja) e de `transicao.js` (para a cortina). Nada aqui é
   compartilhado com o site de varejo: são dois ramos, e misturar o
   JS seria a primeira porta para misturar o desenho.
   ============================================================= */

(() => {
  'use strict';

  const cfg = (typeof CONFIG === 'object' && CONFIG) || {};
  const nome = cfg.nome || 'Aliança One';

  const semMovimento = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- As mensagens do WhatsApp ----------
     Mesma regra do varejo: a pessoa nunca precisa explicar o que
     quer. Aqui o que vai escrito não é um produto, é o porte da
     empresa — que é a primeira pergunta que o consultor faria. */

  const MENSAGENS = {
    'corporate':
      `Olá! Vim pela página da ${nome} Corporate e quero equipar a minha equipe com Mac. `
      + 'Podemos começar pelo diagnóstico?',
    'plano-equipe':
      `Olá! Vim pela página da ${nome} Corporate. Tenho até 10 aparelhos para equipar `
      + 'e queria falar sobre o formato Equipe.',
    'plano-escala':
      `Olá! Vim pela página da ${nome} Corporate. Tenho entre 10 e 50 aparelhos para `
      + 'equipar e queria falar sobre o formato Escala.',
    'plano-operacao':
      `Olá! Vim pela página da ${nome} Corporate. Tenho mais de 50 aparelhos e queria `
      + 'falar sobre o formato Operação.'
  };

  function montarWhatsApp() {
    const numero = cfg.whatsapp;
    document.querySelectorAll('[data-wa]').forEach((el) => {
      const msg = MENSAGENS[el.dataset.wa] || MENSAGENS.corporate;
      el.href = numero
        ? `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`
        : '#';
    });

    // O telefone escrito no rodapé, no formato que se lê.
    const d = String(numero || '');
    const legivel = d.length >= 12
      ? `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, -4)}-${d.slice(-4)}`
      : 'WhatsApp';
    document.querySelectorAll('[data-telefone]').forEach((el) => {
      el.textContent = legivel;
    });
  }


  /* ---------- Ferramentas ---------- */

  const BRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0
  });
  const brl = (v) => BRL.format(v);

  const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const semAcento = (t) =>
    String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  /* O mesmo caminho de arquivo do varejo: as fotos são as oficiais de
     cada modelo, uma por cor, e vivem em `assets/img/produtos/`. */
  const arquivoDaCor = (cor) =>
    semAcento(cor).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const fotoDe = (p, cor) => {
    const c = cor || p.cores?.[0] || '';
    return p.imagens?.[c] || `assets/img/produtos/${p.id}/${arquivoDaCor(c)}.webp`;
  };

  const catalogo = () => (typeof PRODUTOS !== 'undefined' && Array.isArray(PRODUTOS))
    ? PRODUTOS.filter((p) => !p.oculto) : [];

  const acharProduto = (id) => catalogo().find((p) => p.id === id);

  const waLink = (msg) => cfg.whatsapp
    ? `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`
    : '#';

  /* ---------- 03 · As máquinas ----------
     Os quatro Macs do catálogo, com a foto oficial de cada um e um
     motivo curto de por que ele entra numa compra de empresa. A ordem não é por
     preço: é por quem ela atende — o time inteiro primeiro, o trabalho
     pesado depois, e as duas máquinas de mesa no fim. */

  const MAQUINAS = [
    {
      id: 'macbook-air-13-m4',
      cor: 'Meia-noite',
      papel: 'O padrão da equipe',
      texto: 'A máquina que serve à maior parte do time. Leve, silenciosa e sem '
           + 'ventoinha — atravessa o expediente longe da tomada.'
    },
    {
      id: 'macbook-pro-14-m5',
      cor: 'Preto-espacial',
      papel: 'Para o trabalho pesado',
      texto: 'Design, vídeo, engenharia e dados. Onde o Air começa a pedir esforço, '
           + 'este não muda de ritmo.'
    },
    {
      id: 'mac-mini-m4',
      cor: 'Prateado',
      papel: 'Posto fixo, custo baixo',
      texto: 'Para quem não sai da mesa. É o jeito mais barato de pôr macOS num posto '
           + 'de trabalho, aproveitando o monitor que a empresa já tem.'
    },
    {
      id: 'imac-24-m4',
      cor: 'Prateado',
      papel: 'Recepção e atendimento',
      texto: 'Computador e monitor numa peça só, sem cabo aparente. Onde a mesa é '
           + 'vista pelo cliente, isso conta.'
    }
  ];

  function montarMaquinas() {
    const grade = document.querySelector('#maquinas-grade');
    if (!grade) return;

    const html = MAQUINAS.map((m) => {
      const p = acharProduto(m.id);
      if (!p) return '';   // produto fora do catálogo: some, não quebra
      const cor = p.cores?.includes(m.cor) ? m.cor : p.cores?.[0];
      return `
      <article class="maquina" data-reveal>
        <div class="maquina-poco">
          <img src="${fotoDe(p, cor)}" alt="${escapar(p.nome)} na cor ${escapar(cor || '')}"
               loading="lazy" decoding="async">
        </div>
        <p class="olho">${escapar(m.papel)}</p>
        <h3>${escapar(p.nome)}</h3>
        <p class="maquina-txt">${escapar(m.texto)}</p>
        <p class="maquina-preco">
          <span>a partir de</span>
          <b>${brl(p.preco)}</b>
          <small>por unidade, no varejo</small>
        </p>
        <a class="btn btn--fumaca btn--largo" target="_blank" rel="noopener"
           href="${waLink(`Olá! Vim pela página da ${nome} Corporate e quero um orçamento de `
                 + `${p.nome} para a minha equipe.`)}">Pedir orçamento</a>
      </article>`;
    }).join('');

    grade.innerHTML = html;
    grade.querySelectorAll('[data-reveal]').forEach((el, i) =>
      el.style.setProperty('--delay', `${Math.min(i, 4) * 70}ms`));
  }

  /* ---------- Montar a lista ----------
     Não é carrinho e não é checkout: é um redator de mensagem. A
     pessoa diz quantas de cada, e o botão abre o WhatsApp com a lista
     inteira escrita e numerada.

     A soma é declarada pelo que ela é — preço de balcão somado — e
     nunca como "seu preço". Inventar um desconto aqui seria a única
     mentira da página, e é justamente o número que o consultor existe
     para dar. */

  const LISTA = ['macbook-air-13-m4', 'macbook-pro-14-m5', 'mac-mini-m4', 'imac-24-m4',
                 'ipad-air-11-m3', 'iphone-17-pro'];

  function montarLista() {
    const caixaLista = document.querySelector('#lista-grade');
    const caixaItens = document.querySelector('#lista-itens');
    const caixaTotal = document.querySelector('#lista-total');
    const valor = document.querySelector('#lista-valor');
    const enviar = document.querySelector('#lista-enviar');
    const limpar = document.querySelector('#lista-limpar');
    if (!caixaLista || !enviar) return;

    const itens = LISTA.map(acharProduto).filter(Boolean);
    if (!itens.length) return;

    const qtd = new Map(itens.map((p) => [p.id, 0]));

    caixaLista.innerHTML = itens.map((p) => {
      const cor = p.cores?.[0] || '';
      return `
      <div class="lista-item" data-id="${escapar(p.id)}">
        <img class="lista-mini" src="${fotoDe(p, cor)}" alt="" aria-hidden="true"
             loading="lazy" decoding="async">
        <div class="lista-nome">
          <b>${escapar(p.nome)}</b>
          <small>${brl(p.preco)} por unidade</small>
        </div>
        <div class="lista-passo">
          <button type="button" data-passo="-1"
                  aria-label="Tirar uma unidade de ${escapar(p.nome)}">&minus;</button>
          <output aria-live="off">0</output>
          <button type="button" data-passo="1"
                  aria-label="Somar uma unidade de ${escapar(p.nome)}">+</button>
        </div>
      </div>`;
    }).join('');

    /* A caixaLista escrita para o WhatsApp. Numerada, com quantidade e
       modelo, e terminando na pergunta que a empresa faria. */
    const mensagem = (escolhidos, total) => {
      const linhas = escolhidos
        .map(([p, n], i) => `${i + 1}. ${n}x ${p.nome}`)
        .join('\n');
      return `Olá! Vim pela página da ${nome} Corporate e quero uma proposta para a `
           + `minha equipe:\n\n${linhas}\n\n`
           + `Soma no preço de varejo: ${brl(total)}.\n`
           + 'Qual fica o valor no CNPJ e em quanto tempo vocês entregam?';
    };

    const pintar = () => {
      const escolhidos = itens
        .map((p) => [p, qtd.get(p.id)])
        .filter(([, n]) => n > 0);

      const total = escolhidos.reduce((soma, [p, n]) => soma + p.preco * n, 0);
      const pecas = escolhidos.reduce((soma, [, n]) => soma + n, 0);

      // O resumo
      if (!escolhidos.length) {
        caixaItens.innerHTML =
          '<p class="lista-vazia">Escolha as quantidades ao lado. A soma aparece aqui.</p>';
        caixaTotal.hidden = true;
        limpar.hidden = true;
        // Com a caixaLista vazia o botão não desabilita: ele abre a
        // conversa genérica, que continua sendo a ação certa para
        // quem chegou até aqui e não quis mexer nas quantidades.
        enviar.href = waLink(MENSAGENS.corporate);
      } else {
        caixaItens.innerHTML = escolhidos.map(([p, n]) => `
          <p class="lista-resumo-linha">
            <span><b>${n}&times;</b> ${escapar(p.nome)}</span>
            <span>${brl(p.preco * n)}</span>
          </p>`).join('');
        valor.textContent = brl(total);
        caixaTotal.hidden = false;
        limpar.hidden = false;
        enviar.href = waLink(mensagem(escolhidos, total));
      }

      enviar.textContent = pecas
        ? `Pedir proposta para ${pecas} ${pecas === 1 ? 'aparelho' : 'aparelhos'}`
        : 'Pedir proposta no WhatsApp';

      // Os contadores
      caixaLista.querySelectorAll('.lista-item').forEach((el) => {
        const n = qtd.get(el.dataset.id) || 0;
        el.querySelector('output').textContent = String(n);
        el.dataset.ativo = n > 0 ? 'true' : 'false';
        el.querySelector('[data-passo="-1"]').disabled = n === 0;
      });
    };

    caixaLista.addEventListener('click', (e) => {
      const botao = e.target.closest('[data-passo]');
      if (!botao) return;
      const item = botao.closest('.lista-item');
      const id = item?.dataset.id;
      if (!id) return;
      const atual = qtd.get(id) || 0;
      // Teto de 200: acima disso não é mais uma caixaLista montada num
      // site, é um contrato — e ele já vira conversa de qualquer jeito.
      qtd.set(id, Math.max(0, Math.min(200, atual + Number(botao.dataset.passo))));
      pintar();
    });

    limpar.addEventListener('click', () => {
      itens.forEach((p) => qtd.set(p.id, 0));
      pintar();
      caixaLista.querySelector('[data-passo="1"]')?.focus();
    });

    pintar();
  }

  /* ---------- 06 · Quem somos ----------
     Os dois fatos que dependem de dado real só aparecem quando o dado
     existe. Mesma regra do varejo: elemento sem verdade não é
     renderizado, em vez de aparecer vazio ou com número inventado. */

  function montarHistoria() {
    const desde = cfg.desde;
    document.querySelectorAll('[data-desde]').forEach((el) => {
      if (!desde) { (el.closest('[data-desde-bloco]') || el).remove(); return; }
      el.textContent = `Desde ${desde}`;
    });

    document.querySelectorAll('[data-cnpj]').forEach((el) => {
      if (!cfg.cnpj) { (el.closest('[data-cnpj-bloco]') || el).remove(); return; }
      el.textContent = cfg.cnpj;
    });

    // Os dois fatos restantes dependem do dono preencher `desde` e
    // `cnpj`. Sem nenhum dos dois, a lista fica vazia — e uma coluna
    // vazia ao lado do texto é pior do que coluna nenhuma: lê como
    // conteúdo que não carregou. Ela sai, e o CSS devolve a largura
    // inteira ao texto. É a mesma regra do resto do site: elemento
    // sem dado verdadeiro não é renderizado.
    const fatos = document.querySelector('.historia-fatos');
    if (fatos && !fatos.children.length) fatos.remove();
  }

  /* ---------- Menu de celular ---------- */

  function montarMenu() {
    const botao = document.querySelector('.menu-btn');
    const links = document.querySelector('#topo-links');
    if (!botao || !links) return;

    const fechar = () => {
      botao.setAttribute('aria-expanded', 'false');
      links.dataset.open = 'false';
      document.body.style.overflow = '';
    };

    botao.addEventListener('click', () => {
      const aberto = botao.getAttribute('aria-expanded') === 'true';
      if (aberto) { fechar(); return; }
      botao.setAttribute('aria-expanded', 'true');
      links.dataset.open = 'true';
      // Trava a rolagem do fundo: a folha do menu cobre a tela e rolar
      // por baixo dela é o tipo de coisa que faz a pessoa se perder.
      document.body.style.overflow = 'hidden';
    });

    // Tocar num link fecha: são âncoras da mesma página, e o menu
    // aberto por cima do destino esconde justamente o que ela pediu.
    links.addEventListener('click', (e) => {
      if (e.target.closest('a')) fechar();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') fechar();
    });

    // Ao voltar para o desktop o menu não pode continuar "aberto":
    // ele deixa de ser folha e vira barra, e a rolagem ficaria travada.
    window.matchMedia('(min-width: 861px)').addEventListener('change', (m) => {
      if (m.matches) fechar();
    });
  }

  /* ---------- Revelação no scroll ---------- */

  function montarRevelacoes() {
    const alvos = document.querySelectorAll('[data-reveal]');
    if (!alvos.length) return;

    if (semMovimento() || !('IntersectionObserver' in window)) {
      alvos.forEach((el) => el.classList.add('visivel'));
      return;
    }

    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visivel');
        obs.unobserve(e.target);   // revela uma vez e sai do caminho
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });

    alvos.forEach((el) => obs.observe(el));
  }

  /* ---------- A barra do topo ----------
     Ela é translúcida, e sobre a capa isso é bonito. Depois que a
     página rola ela ganha chão sólido: texto miúdo passando por cima
     de uma tabela através de um vidro é onde a legibilidade quebra. */

  function montarTopo() {
    const topo = document.querySelector('.topo');
    if (!topo) return;
    let ultimo = null;
    const medir = () => {
      const passou = window.scrollY > 24;
      if (passou !== ultimo) {
        ultimo = passou;
        // O JS só marca o estado; a cor mora na folha. Ele escrevia
        // `var(--onyx)` direto no `style`, e `--onyx` não existe em
        // lugar nenhum do projeto: o navegador descartava o valor e a
        // barra nunca ganhava chão. Cor escrita pelo JS é uma cor que
        // ninguém revisa quando a paleta muda.
        topo.dataset.rolado = String(passou);
      }
    };
    medir();
    window.addEventListener('scroll', medir, { passive: true });
  }


  /* ---------- Entrada da página ----------
     Igual à do varejo: as peças da capa sobem em sequência, e só
     depois que a fonte assenta — senão o texto entra uma vez na
     fallback e de novo quando a Switzer chega. */

  function montarEntrada() {
    document.querySelectorAll('[data-entra]').forEach((el, i) => {
      if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i);
    });

    const soltar = () => document.documentElement.classList.add('pronto');
    if (document.fonts?.ready) {
      Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 600))])
        .then(soltar);
    } else {
      soltar();
    }
  }

  /* ---------- Preenchimentos ---------- */

  function montarGerais() {
    const ano = document.querySelector('#ano');
    if (ano) ano.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', () => {
    montarGerais();
    montarWhatsApp();
    montarMenu();
    montarMaquinas();
    montarLista();
    montarHistoria();
    montarTopo();
    montarRevelacoes();
    montarEntrada();
  });
})();

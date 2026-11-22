/* =============================================================
   CHECKOUT — revisão do pedido, upsell e fechamento
   -------------------------------------------------------------
   O site não cobra: o pedido sai daqui como uma mensagem de
   WhatsApp completa (itens, total, pagamento, entrega e dados do
   cliente) e a loja confirma na conversa.

   Formas de pagamento, de entrega e os upsells ("Leve junto") vêm
   de LOJA.checkout, editados no painel.
   ============================================================= */

(function () {
  'use strict';

  const raiz = document.querySelector('#checkout-corpo');
  if (!raiz) return;

  const CK = (typeof LOJA !== 'undefined' && LOJA.checkout) || {};
  const PAGAMENTOS = (CK.pagamentos && CK.pagamentos.length ? CK.pagamentos : [
    { id: 'pix', nome: 'Pix', detalhe: 'À vista', desconto: 0 },
    { id: 'cartao', nome: 'Cartão de crédito', detalhe: `Até ${CONFIG.parcelas}x sem juros`, desconto: 0 }
  ]).filter((p) => p.ativo !== false);
  const ENTREGAS = (CK.entregas && CK.entregas.length ? CK.entregas : [
    { id: 'combinar', nome: 'Combinar pelo WhatsApp', detalhe: '', endereco: false }
  ]).filter((e) => e.ativo !== false);

  const util = (v) => v && v !== 'Único';
  const dadosSalvos = (() => { try { return JSON.parse(sessionStorage.getItem('alianca:checkout')) || {}; } catch { return {}; } })();
  const estado = {
    pagamento: dadosSalvos.pagamento || PAGAMENTOS[0]?.id,
    entrega: dadosSalvos.entrega || ENTREGAS[0]?.id,
    dados: dadosSalvos.dados || {}
  };
  const guardar = () => { try { sessionStorage.setItem('alianca:checkout', JSON.stringify(estado)); } catch { /* sem storage */ } };

  const pagamentoAtual = () => PAGAMENTOS.find((p) => p.id === estado.pagamento) || PAGAMENTOS[0];
  const entregaAtual = () => ENTREGAS.find((e) => e.id === estado.entrega) || ENTREGAS[0];

  /* ---------- Upsell ---------- */

  function upsellsPara(itens) {
    const dentro = new Set(itens.map((i) => i.id));
    const cats = new Set(itens.map((i) => acharProduto(i.id)?.categoria).filter(Boolean));
    return ((CK.upsells) || [])
      .filter((u) => u.ativo !== false && u.produto && !dentro.has(u.produto))
      .filter((u) => !u.quando || !u.quando.length || u.quando.some((c) => cats.has(c) || dentro.has(c)))
      .map((u) => ({ u, p: acharProduto(u.produto) }))
      .filter(({ p }) => p && REGRAS.visivel(p) && REGRAS.statusDe(p) !== 'esgotado')
      .slice(0, 3);
  }

  function upsellHTML({ u, p }) {
    const cor = u.cor && p.cores?.includes(u.cor) ? u.cor : (p.cores || []).find((c) => !REGRAS.esgotada(p, c)) || p.cores?.[0] || '';
    const cap = u.capacidade && p.capacidades?.includes(u.capacidade) ? u.capacidade
      : (p.capacidades || []).find((c) => !REGRAS.esgotada(p, c)) || p.capacidades?.[0] || '';
    const base = REGRAS.precoDe(p, cap).final;
    const por = Number(u.valor) > 0 ? REGRAS.aplicarOferta(base, u) : base;
    return `
      <article class="up" data-upsell="${escapar(u.id)}" data-cor="${escapar(cor)}" data-cap="${escapar(cap)}">
        <div class="up-poco">${aparelhoHTML(p, cor, 'linha')}</div>
        <div class="up-txt">
          ${u.titulo ? `<small>${escapar(u.titulo)}</small>` : ''}
          <b>${escapar(p.nome)}</b>
          <span>${por < base ? `<s>${brl(base)}</s> ` : ''}<strong>${brl(por)}</strong></span>
        </div>
        <button class="btn btn--peq" type="button" data-adicionar-upsell>Adicionar</button>
      </article>`;
  }

  /* ---------- Itens ---------- */

  function itemHTML(i, n) {
    const p = acharProduto(i.id);
    const detalhe = [i.capacidade, i.cor].filter(util).join(' · ');
    const unit = precoItem(i);
    const cheio = REGRAS.precoDe(p, i.capacidade).base;
    return `
      <li class="ck-item" data-n="${n}">
        <div class="ck-poco">${aparelhoHTML(p, i.cor, 'linha')}</div>
        <div class="ck-item-txt">
          <a href="produto.html?id=${encodeURIComponent(p.id)}"><b>${escapar(p.nome)}</b></a>
          ${detalhe ? `<small>${escapar(detalhe)}</small>` : ''}
          ${i.upsell && unit < cheio ? '<span class="ck-tag">Preço especial</span>' : ''}
          <div class="ck-qtd" role="group" aria-label="Quantidade de ${escapar(p.nome)}">
            <button type="button" data-menos aria-label="Tirar um">−</button>
            <span>${i.qtd}</span>
            <button type="button" data-mais aria-label="Pôr mais um">+</button>
          </div>
        </div>
        <div class="ck-preco">
          ${unit < cheio ? `<s>${brl(cheio * i.qtd)}</s>` : ''}
          <b>${brl(unit * i.qtd)}</b>
        </div>
      </li>`;
  }

  /* ---------- Contas ---------- */

  function contas(itens) {
    const subtotal = totalSacola(itens);
    const pg = pagamentoAtual();
    const pct = Number(pg?.desconto) || 0;
    const desconto = pct > 0 ? Math.round(subtotal * pct / 100) : 0;
    return { subtotal, desconto, pct, total: subtotal - desconto };
  }

  /* ---------- Desenho ---------- */

  const campo = (id, rotulo, tipo = 'text', extra = '') => `
    <label class="ck-campo">
      <span>${rotulo}</span>
      <input name="${id}" type="${tipo}" value="${escapar(estado.dados[id] || '')}" ${extra}>
    </label>`;

  function desenhar() {
    const itens = lerSacola();
    if (!itens.length) {
      raiz.innerHTML = `
        <div class="ck-vazio">
          <h2>Seu carrinho está vazio.</h2>
          <a class="btn btn--grande" href="index.html#catalogo">Ver a loja</a>
        </div>`;
      return;
    }
    const c = contas(itens);
    const ups = upsellsPara(itens);
    const ent = entregaAtual();

    raiz.innerHTML = `
      <div class="ck-grade">
        <form class="ck-form" id="ck-form" novalidate>
          <section class="ck-bloco">
            <h2><span>1</span> Seus dados</h2>
            <div class="ck-campos">
              ${campo('nome', 'Nome completo', 'text', 'required autocomplete="name"')}
              ${campo('telefone', 'WhatsApp', 'tel', 'required autocomplete="tel" inputmode="tel" placeholder="(11) 90000-0000"')}
              ${campo('email', 'E-mail', 'email', 'autocomplete="email"')}
              ${CK.pedirCpf ? campo('cpf', 'CPF (para a nota fiscal)', 'text', 'inputmode="numeric"') : ''}
            </div>
          </section>

          <section class="ck-bloco">
            <h2><span>2</span> Entrega</h2>
            <div class="ck-opcoes">
              ${ENTREGAS.map((e) => `
                <label class="ck-opcao">
                  <input type="radio" name="entrega" value="${escapar(e.id)}" ${e.id === ent.id ? 'checked' : ''}>
                  <span><b>${escapar(e.nome)}</b>${e.detalhe ? `<small>${escapar(e.detalhe)}</small>` : ''}</span>
                </label>`).join('')}
            </div>
            ${ent.endereco ? `<div class="ck-campos">
              ${campo('cep', 'CEP', 'text', 'inputmode="numeric" autocomplete="postal-code"')}
              ${campo('endereco', 'Endereço', 'text', 'autocomplete="street-address"')}
              ${campo('cidade', 'Cidade / UF', 'text', 'autocomplete="address-level2"')}
            </div>` : ''}
          </section>

          <section class="ck-bloco">
            <h2><span>3</span> Pagamento</h2>
            <div class="ck-opcoes">
              ${PAGAMENTOS.map((p) => `
                <label class="ck-opcao">
                  <input type="radio" name="pagamento" value="${escapar(p.id)}" ${p.id === estado.pagamento ? 'checked' : ''}>
                  <span><b>${escapar(p.nome)}</b>${p.detalhe || p.desconto ? `<small>${escapar(p.detalhe || '')}${Number(p.desconto) > 0 ? ` · ${p.desconto}% de desconto` : ''}</small>` : ''}</span>
                </label>`).join('')}
            </div>
          </section>

          <section class="ck-bloco">
            <label class="ck-campo">
              <span>Observações</span>
              <textarea name="obs" rows="3">${escapar(estado.dados.obs || '')}</textarea>
            </label>
          </section>
        </form>

        <aside class="ck-resumo">
          <div class="ck-cartao">
            <h2>Seu pedido</h2>
            <ul class="ck-itens">${itens.map(itemHTML).join('')}</ul>
            ${ups.length ? `
            <section class="ck-up">
              <h3>Leve junto</h3>
              ${ups.map(upsellHTML).join('')}
            </section>` : ''}
            <dl class="ck-contas">
              <div><dt>Subtotal</dt><dd>${brl(c.subtotal)}</dd></div>
              ${c.desconto ? `<div class="ck-desc"><dt>Desconto ${escapar(pagamentoAtual().nome)} (${c.pct}%)</dt><dd>− ${brl(c.desconto)}</dd></div>` : ''}
              <div class="ck-total"><dt>Total</dt><dd>${brl(c.total)}</dd></div>
              <div class="ck-parcela"><dt></dt><dd>${parcela(c.subtotal)} sem juros</dd></div>
            </dl>
            <button class="btn btn--grande btn--largo" type="submit" form="ck-form" id="ck-enviar">
              ${ICONE_WA} Finalizar pedido
            </button>
            <p class="ck-erro" id="ck-erro" role="alert"></p>
          </div>
        </aside>
      </div>`;
  }

  /* ---------- Eventos ---------- */

  raiz.addEventListener('input', (e) => {
    if (e.target.name && e.target.type !== 'radio') {
      estado.dados[e.target.name] = e.target.value;
      guardar();
    }
  });

  raiz.addEventListener('change', (e) => {
    if (e.target.name === 'pagamento') { estado.pagamento = e.target.value; guardar(); desenhar(); }
    if (e.target.name === 'entrega') { estado.entrega = e.target.value; guardar(); desenhar(); }
  });

  raiz.addEventListener('click', (e) => {
    const item = e.target.closest('.ck-item');
    if (item && (e.target.closest('[data-mais]') || e.target.closest('[data-menos]'))) {
      const itens = lerSacola();
      const i = itens[+item.dataset.n];
      if (!i) return;
      i.qtd += e.target.closest('[data-mais]') ? 1 : -1;
      gravarSacola(itens.filter((x) => x.qtd > 0));
      pintarSacola();
      desenhar();
      return;
    }
    const up = e.target.closest('[data-adicionar-upsell]');
    if (up) {
      const card = up.closest('.up');
      const regra = (CK.upsells || []).find((u) => u.id === card.dataset.upsell);
      if (!regra) return;
      const itens = lerSacola();
      itens.push({ id: regra.produto, cor: card.dataset.cor, capacidade: card.dataset.cap, qtd: 1, upsell: regra.id });
      gravarSacola(itens);
      pintarSacola();
      desenhar();
    }
  });

  raiz.addEventListener('submit', (e) => {
    e.preventDefault();
    const itens = lerSacola();
    const erro = raiz.querySelector('#ck-erro');
    const d = estado.dados;
    const faltam = [];
    if (!String(d.nome || '').trim()) faltam.push('nome');
    if (String(d.telefone || '').replace(/\D/g, '').length < 10) faltam.push('WhatsApp');
    if (faltam.length) {
      erro.textContent = `Preencha ${faltam.join(' e ')}.`;
      raiz.querySelector(`[name="${faltam[0] === 'nome' ? 'nome' : 'telefone'}"]`)?.focus();
      return;
    }
    erro.textContent = '';

    const c = contas(itens);
    const pg = pagamentoAtual();
    const ent = entregaAtual();
    const numero = `AO-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    const linhas = itens.map((i, n) => {
      const p = acharProduto(i.id);
      const det = [i.capacidade, i.cor].filter(util).join(', ');
      return `${n + 1}. ${i.qtd > 1 ? `${i.qtd}× ` : ''}${p.nome}${det ? ` (${det})` : ''} — ${brl(precoItem(i) * i.qtd)}`;
    });
    const msg = [
      `Olá! Quero finalizar meu pedido no site da ${CONFIG.nome}.`,
      `Pedido ${numero}`,
      '',
      ...linhas,
      '',
      `Subtotal: ${brl(c.subtotal)}`,
      c.desconto ? `Desconto ${pg.nome} (${c.pct}%): − ${brl(c.desconto)}` : null,
      `Total: ${brl(c.total)}`,
      `Pagamento: ${pg.nome}`,
      `Entrega: ${ent.nome}`,
      ent.endereco && (d.cep || d.endereco || d.cidade) ? `Endereço: ${[d.endereco, d.cidade, d.cep].filter(Boolean).join(' · ')}` : null,
      '',
      `Nome: ${d.nome}`,
      `WhatsApp: ${d.telefone}`,
      d.email ? `E-mail: ${d.email}` : null,
      d.cpf ? `CPF: ${d.cpf}` : null,
      d.obs ? `Observações: ${d.obs}` : null
    ].filter((l) => l !== null).join('\n');

    const link = waLink(msg);
    window.open(link, '_blank', 'noopener');
    gravarSacola([]);
    pintarSacola();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    raiz.innerHTML = `
      <div class="ck-feito">
        <span class="ck-feito-ok" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path pathLength="1" d="M5 12.5 10 17.5 19 7.5"/></svg>
        </span>
        <h2>Pedido ${numero} enviado</h2>
        <p>A conversa abriu no WhatsApp com o pedido completo.</p>
        <div class="ck-feito-acoes">
          <a class="btn btn--grande" href="${link}" target="_blank" rel="noopener">${ICONE_WA} Abrir o WhatsApp de novo</a>
          <a class="seta" href="index.html">Voltar à loja</a>
        </div>
      </div>`;
  });

  document.addEventListener('DOMContentLoaded', desenhar);
})();

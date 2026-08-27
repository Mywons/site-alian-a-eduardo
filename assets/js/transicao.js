/* =============================================================
   A TROCA DE RAMO — a bola que cresce
   -------------------------------------------------------------
   A Aliança tem duas caras: a loja de varejo, laranja, e a
   Corporate, preta. Trocar de uma para a outra por um corte seco faz
   parecer que a pessoa saiu do site. A bola existe para dizer o
   contrário: é a MESMA superfície mudando de cor.

   O gesto nasce ONDE A PESSOA TOCOU. Uma bola da cor do outro ramo
   abre a partir do dedo e engole a página. Isso é o oposto de uma
   cortina genérica: a transição fica ancorada no gesto que a causou,
   e é por isso que ela parece resposta e não espera.

   O truque que faz a emenda sumir: a bola é pintada exatamente com a
   COR DE FUNDO da página de destino. Quando a navegação acontece, o
   que estava na tela e o que chega são a mesma cor — não existe
   quadro de emenda para aparecer. A página nova só precisa trazer o
   conteúdo de volta, e é o que ela faz.

   Sem dependência e sem travar nada: se qualquer coisa falhar, o
   link continua sendo um link.
   ============================================================= */

(() => {
  const CHAVE = 'alianca:troca';
  const raiz = document.documentElement;
  const bola = document.querySelector('#troca');
  if (!bola) return;

  const semMovimento = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Ease-out-expo, a mesma curva do resto dos dois sites. A bola
     precisa sair rápido do dedo e assentar devagar: é o que faz
     parecer que ela tem tamanho, e não que é um círculo escalando. */
  const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

  /* O raio que cobre a tela inteira a partir de um ponto qualquer é a
     distância até o canto MAIS LONGE — não a diagonal da tela, que
     erraria para menos em toda origem fora do centro e deixaria um
     naco de página aparecendo no canto. */
  const raioQueCobre = (x, y) => {
    const l = window.innerWidth, a = window.innerHeight;
    return Math.max(
      Math.hypot(x, y),
      Math.hypot(l - x, y),
      Math.hypot(x, a - y),
      Math.hypot(l - x, a - y)
    );
  };

  /* ---------- Metade 1: a página que chega ----------
     Não há cortina para tirar: a bola terminou exatamente na cor
     desta página. O que falta é devolver o conteúdo, e ele sobe um
     pouco enquanto aparece — o mesmo gesto do resto do site. */
  const chegar = () => {
    if (!raiz.classList.contains('chegando')) return;
    // A revelação é uma animação CSS com `both`: ela se completa
    // sozinha e termina visível. O JS não participa disso — só tira a
    // classe depois, para não deixar estado pendurado no <html>. Se
    // esta linha nunca rodar, a página aparece do mesmo jeito.
    setTimeout(() => raiz.classList.remove('chegando'), 1000);
  };

  /* ---------- Metade 2: a página que sai ---------- */
  const sair = (destino, cor, x, y) => {
    raiz.classList.add('trocando');
    try { sessionStorage.setItem(CHAVE, '1'); } catch (e) { /* segue sem */ }

    let foi = false;
    const ir = () => { if (!foi) { foi = true; window.location.href = destino; } };

    bola.style.background = cor;

    if (semMovimento()) {
      bola.style.clipPath = 'none';
      bola.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: 180, easing: 'linear', fill: 'forwards' })
        .finished.then(ir).catch(ir);
      setTimeout(ir, 500);
      return;
    }

    const r = raioQueCobre(x, y);

    const cresce = bola.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${r}px at ${x}px ${y}px)` }
      ],
      { duration: 620, easing: EXPO, fill: 'forwards' }
    );

    cresce.finished.then(ir).catch(ir);
    // Rede de segurança: ninguém fica preso dentro da bola.
    setTimeout(ir, 1000);
  };

  /* ---------- O gatilho ---------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-troca]');
    if (!link) return;

    // Não sequestra o que o navegador faz melhor: abrir em outra aba,
    // baixar, ou seguir um clique de botão do meio.
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target && link.target !== '_self') return;

    const destino = link.getAttribute('href');
    if (!destino || destino.startsWith('#')) return;

    e.preventDefault();

    // Onde a bola nasce: o ponto do clique. Quando o clique veio do
    // teclado (Enter num link), `clientX` é 0 — aí ela nasce do centro
    // do próprio link, que é onde o foco está.
    let x = e.clientX, y = e.clientY;
    if (!x && !y) {
      const c = link.getBoundingClientRect();
      x = c.left + c.width / 2;
      y = c.top + c.height / 2;
    }

    sair(destino, link.dataset.troca || '#000', x, y);
  });

  /* Voltar pelo histórico devolve a página do cache com a bola ainda
     por cima. Limpa. */
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      raiz.classList.remove('trocando', 'chegando');
      // Limpar o style inline NÃO desfaz uma animação da Web Animations
      // API com `fill: 'forwards'` — ela continua segurando o valor
      // final. Sem cancelar, voltar pelo histórico devolvia a página
      // com a bola ainda cobrindo a tela inteira.
      bola.getAnimations?.().forEach((a) => a.cancel());
      bola.style.clipPath = '';
      bola.style.background = '';
      bola.style.opacity = '';
    }
  });

  chegar();
})();

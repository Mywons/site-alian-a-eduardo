/* =============================================================
   ALIANÇA ONE — gesto e profundidade
   -------------------------------------------------------------
   Um gesto só, na página do produto: arrastar a peça para girá-la.
   A capa ficou parada de propósito — movimento ali competiria com a
   manchete, que é o que precisa ser lido primeiro.

   O que faz esse gesto parecer físico não é um motor 3D. São quatro
   coisas, e nenhuma precisa de biblioteca:

     1. a peça segue o dedo 1:1, respeitando onde ele pegou
     2. no limite ela resiste em vez de travar (rubber-band)
     3. ao soltar, ela continua na velocidade em que estava
     4. o movimento pode ser agarrado e revertido a qualquer instante

   Tudo aqui é `transform` no compositor. Nada de canvas, nada de
   download extra, e o site continua abrindo com dois cliques.
   ============================================================= */

/* ---------- Mola ----------
   Criticamente amortecida por padrão: chega e para, sem quicar.
   Guarda a velocidade, então uma mola interrompida no meio do voo
   continua de onde estava em vez de dar um salto. */

function molinha(aoMudar, { rigidez = 170, atrito = 26 } = {}) {
  let valor = 0, alvo = 0, velocidade = 0, rodando = false, quadro = 0;

  const passo = (agora) => {
    const dt = Math.min((agora - quadro) / 1000, 1 / 30);
    quadro = agora;

    const forca = (alvo - valor) * rigidez;
    velocidade += (forca - velocidade * atrito) * dt;
    valor += velocidade * dt;

    // Parou de valer a pena animar: assenta exatamente no alvo para
    // não ficar um resto de subpixel tremendo para sempre.
    if (Math.abs(alvo - valor) < 0.01 && Math.abs(velocidade) < 0.05) {
      valor = alvo; velocidade = 0; rodando = false;
      aoMudar(valor);
      return;
    }
    aoMudar(valor);
    requestAnimationFrame(passo);
  };

  const ligar = () => {
    if (rodando) return;
    rodando = true;
    quadro = performance.now();
    requestAnimationFrame(passo);
  };

  return {
    para(v, velocidadeInicial) {
      alvo = v;
      if (velocidadeInicial !== undefined) velocidade = velocidadeInicial;
      ligar();
    },
    // Usado durante o arraste: a posição é ditada pelo dedo, não pela mola.
    fixa(v) { valor = alvo = v; velocidade = 0; rodando = false; aoMudar(valor); },
    get valor() { return valor; },
    get velocidade() { return velocidade; }
  };
}

/* ---------- Projeção de momento ----------
   Para onde a peça IA quando o dedo soltou. É a mesma decaída
   exponencial que o iOS usa na rolagem — não a fórmula de física de
   colégio, que erra o alvo por muito. */

const projetar = (velocidade, decaimento = 0.998) =>
  (velocidade / 1000) * decaimento / (1 - decaimento);

/* ---------- Rubber-band ----------
   Passando do limite, a peça continua respondendo mas cada pixel
   arrastado rende menos. Travar duro leria como "quebrou". */

const elastico = (excesso, dimensao, constante = 0.55) =>
  (excesso * dimensao * constante) / (dimensao + constante * Math.abs(excesso));

const limitar = (v, limite) =>
  Math.abs(v) <= limite ? v : Math.sign(v) * (limite + elastico(Math.abs(v) - limite, limite));

/* ---------- Arraste para girar ----------
   O gesto de verdade, na página do produto. */

function montarGiro(alvo, { limite = 18 } = {}) {
  if (!alvo) return;

  let angulo = 0;
  const pintar = () => { alvo.style.transform = `rotateY(${mola.valor.toFixed(2)}deg)`; };
  const mola = molinha(pintar, { rigidez: 150, atrito: 24 });

  if (semMovimento()) return;

  let pegando = false, xInicial = 0, anguloInicial = 0;
  let historico = [];

  const grausPorPixel = () => {
    const largura = alvo.getBoundingClientRect().width || 300;
    // Uma largura inteira de arraste equivale a girar quatro limites:
    // gesto curto, resposta visível, sem precisar varrer a tela.
    return (limite * 4) / largura;
  };

  alvo.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    pegando = true;
    alvo.setPointerCapture(e.pointerId);
    alvo.dataset.pegando = 'true';

    // Agarrar no meio do voo cancela a mola e assume o valor da tela:
    // sem isso, a peça daria um salto de volta ao alvo lógico.
    anguloInicial = mola.valor;
    mola.fixa(anguloInicial);
    xInicial = e.clientX;
    historico = [{ x: e.clientX, t: performance.now() }];
  });

  alvo.addEventListener('pointermove', (e) => {
    if (!pegando) return;
    const bruto = anguloInicial + (e.clientX - xInicial) * grausPorPixel();
    angulo = limitar(bruto, limite);
    mola.fixa(angulo);

    historico.push({ x: e.clientX, t: performance.now() });
    if (historico.length > 6) historico.shift();
  });

  const soltar = (e) => {
    if (!pegando) return;
    pegando = false;
    alvo.dataset.pegando = 'false';
    try { alvo.releasePointerCapture(e.pointerId); } catch (_) {}

    // Velocidade do fim do gesto, em graus por segundo, tirada do
    // histórico curto — o último evento sozinho é ruído.
    const primeiro = historico[0];
    const ultimo = historico[historico.length - 1];
    const dt = ultimo && primeiro ? ultimo.t - primeiro.t : 0;
    const vPx = dt > 0 ? ((ultimo.x - primeiro.x) / dt) * 1000 : 0;
    const vGrau = vPx * grausPorPixel();

    // Onde ela ia parar se ninguém segurasse. Serve para decidir se o
    // arremesso foi forte o bastante para valer um repouso girado.
    const projetado = limitar(angulo + projetar(vGrau), limite);
    const repouso = Math.abs(projetado) > limite * 0.55 ? Math.sign(projetado) * limite * 0.6 : 0;

    mola.para(repouso, vGrau);
  };

  alvo.addEventListener('pointerup', soltar);
  alvo.addEventListener('pointercancel', soltar);

  // Quem navega por teclado também gira a peça.
  alvo.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const passo = e.key === 'ArrowRight' ? 6 : -6;
    mola.para(Math.max(-limite, Math.min(limite, mola.valor + passo)));
  });
}

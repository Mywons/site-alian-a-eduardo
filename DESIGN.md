# Design

## A camada Apple

O varejo foi redesenhado no idioma de apple.com, por cima da folha que já existia (seção
**24b** de `style.css`, e os tokens da seção 1 trocados para a paleta neutra):

- **Chão** `#f5f5f7` e **cartão** `#ffffff`, tinta `#1d1d1f`, secundário `#6e6e73`.
- **Capa centrada**: olho laranja, nome do aparelho grande, uma frase, as duas ações e a
  foto embaixo. A diagonal saiu.
- **Trilho de categorias** com a foto de cada família, como na Apple Store.
- **Os principais** são telhas sem raio, centradas, com a foto embaixo; a primeira ocupa a
  largura inteira e é **preta** — a telha dos modelos Pro na Apple.
- **Toda a loja** virou prateleira: cartões brancos de 18px com as bolinhas de cor.
- **Compromissos** deixou de ser a faixa laranja: três cartões brancos sobre o cinza.
- O laranja `#FF6200` continua preenchendo o botão (tinta preta, 5,6:1) e `--acao`
  continua escrevendo link e olho. As notas abaixo sobre papel off-white descrevem a
  versão anterior e valem como histórico.

## A camada vitrine

Por cima da camada Apple veio a estrutura de uma loja de eletrônicos que vende bem
(seção **24c** de `style.css`), sem levar a voz junto:

- **Faixa de condições** preta no topo de toda página do varejo, passando sozinha:
  12x, Pix, nota fiscal, entrega, garantia. Só o que a loja sempre oferece — nada de
  "Black Friday" ou "últimas unidades". Para com `prefers-reduced-motion`.
- **Palco** na capa: quatro cartazes de 28px de raio (iPhone escuro com brilho laranja,
  Mac claro, pagamento em laranja, Corporate preto), com scroll-snap, pontos, setas no
  desktop e troca a cada 6,5s que para no toque, no foco, no hover e com movimento reduzido.
- **Vitrines por categoria**: quatro cartões cinza com etiqueta branca e a foto vazando
  pela borda, e dois largos — Áudio em laranja, Acessórios em preto.
- **Selos** em cartões brancos sobre faixa escura, com ícone de traço laranja.
- **Olho** em caixa alta acima de cada título de seção, e **rodapé preto** com os
  títulos em laranja.
- Ficou de fora a seção de avaliações: sem avaliação real para mostrar, ela seria
  depoimento inventado (ver PRODUCT.md).

## Duas marcas, duas folhas

O projeto tem **dois ramos**, e cada um tem folha de estilo própria:

| Ramo | Página | Folha | Chão | Acento |
|---|---|---|---|---|
| **Aliança One** (varejo) | `index`, `produto`, `sobre`, `privacidade` | `assets/css/style.css` | Off-white quente | `#FF6200` |
| **Aliança Corporate** (B2B) | `corporate.html` | `assets/css/corporate.css` | Preto absoluto | `#db7102` |

Nenhum token atravessa de uma folha para a outra. O que os dois ramos compartilham é a
**família de tipo**, a **curva de movimento**, as **durações** e as **formas** (pílula,
raio de canto, filete de 1px). É de propósito: quem chega no Corporate vindo do varejo
precisa reconhecer a casa, e o que muda tem de ser a cor e o ritmo, não a voz.

Os dois são **imagens espelhadas**: um é papel com um laranja, o outro é preto com um
laranja treze graus ao lado. É essa simetria que faz a troca de ramo ler como virar uma página do
mesmo catálogo, e não como sair para outro site.

## Visual Theme — Aliança One

**Papel, e o laranja como detalhe.** Loja Apple: off-white quente, tipo grande, muito ar,
botão em pílula, lista de produtos densa e legível. O laranja do iPhone 17 aparece em
poucos lugares e sempre com trabalho a fazer — nunca como decoração.

Esta é a inversão que governa a folha inteira, e ela tem data. O site já foi o contrário:
chão laranja, tinta branca, laranja em toda superfície. O argumento contra não é de
gosto, é de **quanto laranja o olho aguenta**. Um chão saturado obriga a página a se
defender dele: toda tinta vira branca, todo secundário some, toda cor de produto briga
com a cor da loja, e o botão — que é a única coisa que precisa ser encontrada — deixa de
ter para onde se destacar.

Sobre papel o laranja volta a ser o que uma marca precisa que ele seja: **a coisa que o
olho encontra primeiro, justamente porque não está em todo lugar.**

### Onde o laranja pode aparecer

A lista é curta de propósito, e ela é a regra:

- **O filete da capa** — a diagonal, com 5px de espessura.
- **O botão**, cheio, com a tinta preta por cima.
- **Um card da vitrine**, o `--forte`. Um por página; dois viram faixa.
- O carrinho flutuante e o chip de categoria ativo.
- **Uma superfície inteira**: a faixa dos compromissos, no pé da página. É a única, e é a
  coisa mais barulhenta do site — cabe porque está sozinha, e porque tudo em cima dela é
  tinta preta.
- Em texto — o fecho de cada manchete (`<em>`), o olho, a seta de link, o chevron das
  dúvidas e o monograma do rodapé — entra a **versão escura do mesmo matiz**, pelo motivo
  medido na paleta abaixo.

### A etiqueta "Destaque da semana" é preta

Ela flutua sobre a foto do aparelho, e ali o laranja tinha dois problemas: brigava com o
Laranja-cósmico do próprio iPhone logo atrás dela, e repetia a cor do botão da esquerda numa
peça que **não é ação — é legenda**. Preto resolve os dois de uma vez, e é o que uma etiqueta
de fotografia sempre foi.

### A capa: o corte virou um filete

A capa continua **cortada por uma diagonal**, e essa é a assinatura da página. O que
mudou é do que o corte é feito.

Ele era uma metade de laranja cheio contra uma metade de branco. Numa página off-white,
uma metade laranja deixa de ser detalhe e vira chão — a primeira tela sozinha carregava
mais laranja que o resto do site inteiro.

Agora o corte separa **dois papéis**: areia à esquerda, onde mora o argumento, e o papel
mais alvo à direita, que é o palco do aparelho. A diferença entre os dois é de **1,04:1**
— quase nada, e é exatamente o ponto: quem desenha a diagonal não é o contraste entre as
metades, é **um filete de laranja correndo sobre a divisa**.

Uma linha de 5px carrega a composição inteira porque é a única coisa saturada do quadro.
É o argumento da folha levado ao caso mais difícil: quanto menos laranja há na página,
mais longe cada grama dele chega.

A inclinação é de 10 pontos percentuais — sai de 55% no topo e chega a 45% na base. O
corte é pintado por um `::before` (o painel de areia) e um `::after` (o filete), ambos
com `clip-path`, atrás de tudo, e **nenhum recebe conteúdo**. O conteúdo continua numa
grade de duas colunas normais, para que o corte possa inclinar sem que uma linha de texto
a mais empurre a divisa.

No celular o corte **deita**: vira uma inclinação de 34px na base do painel do argumento,
com o filete acompanhando num `::after` do próprio elemento. Ali ele não pode morar nos
pseudos da capa — seria uma porcentagem da altura total, e essa altura muda com o número
de linhas da manchete.

### A vitrine flutua

Os cartões de destaque têm 28px de raio e sombra dupla — uma camada curta que cola o
objeto no chão e uma longa que dá volume. Uma sombra só, dura, é o que faz parecer
adesivo. Num chão de papel a sombra finalmente tem contra o que existir.

O poço de cada peça tem raio **8px menor** que o do cartão que o contém. Essa diferença é
o que cria a moldura fina em volta do aparelho.

A elevação vive **apenas na vitrine e nas peças que se levantam**. Seções, faixas e linhas
de catálogo continuam separadas por cor e por filete.

## Color Palette — Aliança One

**Toda cor da folha é declarada dentro do gamut sRGB, e isso é verificado, não presumido.**
Uma cor fora do gamut não é rejeitada pelo navegador: ela é *cortada canal a canal*, e
cortar canal desloca o matiz. O laranja original (`#c44800`) era declarado fora, o azul
estourava para baixo de zero, e o matiz caía de 45 para 36 — chegava ao olho como vermelho
queimado. É essa a razão de ele nunca ter parecido laranja.

### Os três degraus do papel

Off-white, nunca `#fff`. Os três são o mesmo papel com o croma da marca dentro (0,004 a
0,012 no matiz 70–78) — é essa gota de laranja que faz o cinza parecer quente em vez de
poeira.

A ordem entre eles é a de uma lista agrupada de iOS, e é o contrário do que parece: **o
chão da página é o degrau do meio, o cartão é mais claro que ele, e o recuo é mais
escuro.** É assim que um cartão se levanta sem borda — a sombra confirma o que a luz já
disse.

| Token | Valor | Papel |
|---|---|---|
| `--chao` | `oklch(0.968 0.009 74)` · `#f8f4ee` | O chão da página |
| `--chao-2` | `oklch(0.993 0.004 78)` · `#fefcfa` | Cartão, campo, chip |
| `--fundo` / `--papel-2` | `oklch(0.945 0.011 70)` · `#f2ece5` | Recuo, hover, poço, faixa |
| `--papel` | `oklch(0.988 0.006 76)` · `#fdfbf7` | O papel mais alvo |

### O laranja da marca é `#FF6200`, e a física dele define a paleta

`#FF6200` mede `oklch(0.691 0.207 42)`. A luminância relativa dele é **0.30**, e daí sai um
teto que nenhuma escolha de projeto contorna:

> O melhor contraste que `#FF6200` pode alcançar contra um fundo claro é **3,00:1 — no
> branco puro.** Não existe fundo mais claro que branco.

Sobre o papel do site ele fecha **2,74:1**. Como texto, reprova; como grafismo essencial,
reprova. Não é questão de calibrar o papel — é aritmética.

Do outro lado, ele é **excelente como chão**: a tinta preta quente por cima dele fecha
**5,79:1**, melhor do que os 5,43:1 que o Laranja-cósmico dava.

Daí a divisão de trabalho, e ela não é "dois laranjas": é **o mesmo matiz 42 em duas
luzes**, cada uma no trabalho que a física permite.

| Token | Valor | Papel |
|---|---|---|
| `--marca` / `--forte` | `#FF6200` · `oklch(0.691 0.207 42)` | **PREENCHE**: botão, cartão forte, faixa, etiqueta, carrinho, chip, filete |
| `--marca-funda` | `oklch(0.655 0.19 42)` · `#eb5e15` | Hover do preenchimento · preto por cima 5,08:1 |
| `--acao` | `oklch(0.53 0.16 42)` · `#b44200` | **ESCREVE**: rótulo, link, seta, chevron, monograma, foco · 5,14:1 |
| `--acao-funda` | `oklch(0.475 0.143 42)` · `#9b3801` | Hover do laranja escrito |
| `--sobre-claro` | `oklch(0.48 0.145 42)` · `#9d3900` | Tinta laranja sobre botão de papel · 6,7:1 |
| `--forte-tinta` / `--tinta` | `oklch(0.22 0.012 50)` · `#1f1916` | A tinta preta quente · 15,9:1 no chão, 5,79:1 no laranja |
| `--suave` | `oklch(0.475 0.020 55)` · `#665952` | Secundário · 6,15:1 no chão |
| `--linha` | `oklch(0.22 0.012 50 / 0.12)` | O filete |

Visualmente **o site é `#FF6200`**: ele é quem preenche tudo o que tem área. O irmão escuro
só aparece em texto miúdo — que é justamente onde `#FF6200` seria ilegível de qualquer
jeito.

**O Laranja-cósmico saiu.** Ele era um segundo tom de superfície, e dois laranjas de
superfície numa página que tem um laranja de marca é exatamente a diluição que a folha
inteira existe para evitar.

**O secundário se rebaixa escurecendo.** É a única regra do site que a inversão virou de
cabeça para baixo: no chão laranja ela era o contrário, e os dois níveis tinham de ficar
quase juntos em luz.

### A regra que governa toda superfície laranja

Papel sobre `#FF6200` dá **2,90:1** e reprova até em texto grande. Preto quente dá
**5,79:1** em qualquer tamanho. A regra sai sozinha:

> **Sobre laranja, a tinta é PRETA. Nunca papel miúdo, nunca papel grande.**

E uma armadilha que a medição pegou: **rebaixar essa tinta por opacidade reprova.** Por
isso não há dois brilhos dentro de uma peça laranja — há **uma tinta só**, e o que separa
manchete de corpo, ou numeral de rótulo, é **peso e tamanho**, nunca brilho. É por isso que
o "01" da faixa dos compromissos é preto como o resto: quem o distingue são os 2,4rem em
peso 700 no meio de um bloco de 15px.

Dentro do laranja o botão **inverte**: papel cheio com `--sobre-claro` por cima (6,7:1).
Laranja sobre laranja não é botão. A mesma inversão vale dentro do card `--forte`.

### O cabeçalho tem um estado de tinta, não três

A barra tinha três estados, um por chão que ela atravessava. A inversão apagou dois de
uma vez: agora **todos** os chãos por baixo dela são claros — o papel das páginas
internas, os dois lados da capa e o vidro quando ela rola.

Sobra **uma tinta só**, o preto quente, e ela se lê nos três: 16,6:1 no papel, 5,79:1 no
laranja, 15,4:1 no vidro. A variável `--nav-tinta` continua existindo porque os filhos
leem dela, mas não muda mais de valor — e uma classe inteira de bug de contraste deixou
de ter onde morar.

Rolada, a barra vira **material**: papel translúcido (`color-mix` a 78%) com
`backdrop-filter: blur(20px)`, e o conteúdo passa por baixo. É o único `backdrop-filter`
da folha junto com a barra de compra, e existe porque a barra atravessa a página inteira —
um chão sólido cortaria a foto da capa e o topo de cada seção. Quem pede
`prefers-reduced-transparency` recebe papel cheio.

### Nenhum poço tem chão

O quadrado claro atrás do aparelho saiu de toda a vitrine. A foto já vem recortada em
alpha, e um retângulo atrás dela devolve exatamente a moldura que o recorte existe para
tirar. O poço continua existindo como *caixa*, para o card não pular de tamanho conforme a
silhueta, mas é uma caixa invisível. A única exceção é a página do produto, onde a peça
aparece sozinha e sem fundo flutuaria no vazio — e ali o poço é papel com **6%** da cor do
próprio produto dentro (sobre chão claro a mistura precisa ser mais discreta do que era
sobre laranja).

### A porta para o outro ramo

O Corporate **não é uma categoria de produto, é outra empresa** — e o menu precisa dizer
isso antes do clique. Como link de texto no meio de "iPhone, Mac, iPad" ele lia como mais
um item de catálogo e sumia.

Virou uma **pílula preta no grupo de ações, à direita**, onde moram as coisas que levam
para fora desta loja. Preta de propósito: numa barra de papel ela é a única mancha escura,
e o único aviso honesto de que a página inteira vai mudar de cor. Dentro dela, o monograma
**no laranja do Corporate, direto sobre o preto** — a pílula carrega as duas cores da outra página em
miniatura — e uma seta de canto dizendo "sai daqui".

O monograma já morou dentro de um disco colorido, com o "A" recortado em preto. O disco
saiu: a 22px ele lia como um **selo colado na pílula**, e o que se via de longe era a
bolinha, não a marca. Sem ele a pílula é inteira preta com uma coisa colorida só dentro —
a letra. O "A" pôde crescer de 11 para 15px porque não precisa mais caber num círculo.

A miniatura já mostrou ouro, e depois amarelo. Nenhum dos dois existe mais lá. **Uma
miniatura que promete uma página que não existe é pior que nenhuma**, e é por isso que ela
troca junto com o acento do outro ramo, sempre.

No celular ela sai da barra (só cabem marca, WhatsApp e menu sem os alvos caírem abaixo de
44px) e reaparece **dentro do menu**, como um bloco escuro com subtítulo — que é onde há
espaço para explicar o que o Corporate é.

## Visual Theme — Aliança Corporate

**Teatro preto, hardware luminoso.** A página é um filme: preto absoluto engole tudo menos
a fotografia do produto, o tipo em escala grande e uma nota de laranja.

O chão é `#000` puro, e não um cinza-azulado. O que ele existe para fazer é **sumir**:
sobre preto absoluto a foto recortada em alpha não tem borda, não tem plano de fundo e não
tem onde terminar — o objeto existe num vazio. Qualquer cinza devolve uma caixa em volta
do produto.

### O racionamento de cor é a identidade

Esta é a regra que governa tudo, e ela não é preferência estética: a página lê como um
filme em preto e branco com **uma nota de laranja**.

| Token | Valor | Papel |
|---|---|---|
| `--preto` | `#000000` | Canvas |
| `--carvao` | `#1d1d1f` | Cartão sobre o canvas |
| `--fumaca` | `#333336` | Botão terciário, plano eleito |
| `--seda` | `#f5f5f7` | Texto principal · 19,3:1 |
| `--cinza` | `#86868b` | Secundário no escuro · 5,8:1 |
| `--platina` | `#cccccc` | Menu 12px · 13,1:1 |
| `--laranja` | `#db7102` · `oklch(0.66 0.163 55)` | **Único preenchimento cromático** · 6,37:1 no preto |
| `--laranja-alto` | `oklch(0.72 0.17 55)` · `#f3821d` | Hover do preenchimento |
| `--laranja-fundo` | `oklch(0.50 0.123 55)` · `#974c02` | O acento na faixa branca · 6,3:1 |

**O acento é `#db7102` — laranja vivo, um degrau abaixo do brilho máximo.** É o croma
(0.163) que faz dele "vivo", e a luz rebaixada (0.66) que impede o par preto-laranja de
virar sinalização de obra.

Ele já foi **amarelo** e já foi **ouro velho**. O amarelo saiu porque preto com amarelo é
fita de advertência antes de ser marca; o ouro saiu porque lia como metal de catálogo de
uísque, e não como a cor de uma loja de tecnologia.

Os números seguram: 6,37:1 sobre preto, e tinta escura por cima a 6,37:1 também — acima do
que o azul da Apple dava nas duas direções (4,47 e 4,70), na mesma função.

**O parentesco com o varejo.** Este laranja fica a **13° do `#FF6200`** da loja, e é a menor
distância que os dois ramos já tiveram. O que os separa deixou de ser o matiz: é o **chão**.
Lá o laranja é o detalhe de uma página de papel; aqui é a única cor de uma página preta.
Duas notas do mesmo instrumento, tocadas em salas opostas.

**O que está fora:** azul, verde, roxo, amarelo e ouro. Diluir o laranja com um segundo
acento desmonta o sistema. Encher um botão com o tom de *link* também está fora: confunde
a hierarquia da ação. E laranja em superfície larga, nunca — um preenchimento por tela,
muito preto em volta e tipo grande. O risco do par preto-laranja é virar sinalização de
obra, e o que impede isso é o racionamento.

Na faixa branca a tinta inverte. **O `--cinza` da referência reprova ali** (3,62:1), então
o secundário claro é `#6e6e73` (5,07:1).

### Três regras duras, todas da referência

- **Peso máximo 600.** 700 não existe: com o tracking negativo desta escala, ele lê como
  desespero.
- **Título nenhum abaixo de 28px.** A escala começa em subtítulo e sobe.
- **Sombra nenhuma.** A profundidade vem de contraste tonal, do raio de 28px e do vidro
  fosco — nunca de `box-shadow`.

Só três curvas existem: pílula (9999px), cartão (28px) e link (10px).

### A porta para o varejo é o espelho exato da outra

A regra que governa as duas portas é a mesma, e ela não é "usar a cor do outro": é
**mostrar o destino em miniatura, com os papéis que a cor tem lá**.

- o chão da pílula é o **chão** da outra página;
- o monograma dentro dela é o **acento** da outra página.

No varejo isso dá pílula preta com o "A" em `#db7102`. Aqui dá pílula off-white com o "A"
em `#FF6200`. Os dois lados são o mesmo retrato invertido.

**O disco atrás do monograma saiu dos dois lados no mesmo dia.** A 20–22px ele lia como um
selo colado na pílula, e o que se via de longe era a bolinha, não a marca. Sem ele a pílula
é de uma cor só, com uma única coisa colorida dentro: a letra. E o "A" pôde crescer, porque
não precisa mais caber num círculo.

Uma pílula clara é a coisa mais brilhante de uma barra preta, e é por isso que ela é a
**menor**: 30px de altura contra os 32 do botão laranja. Quem for grande aqui é a ação,
não a saída.

No celular ela sai da barra pelo mesmo motivo que a do varejo sai — marca, WhatsApp e o
botão do menu já somam a largura de um iPhone — e reaparece como um bloco no pé do menu.
Enquanto ela ficava na barra, **o botão do menu ia parar fora da tela**, atrás do
`overflow-x: hidden` do corpo: a navegação inteira do Corporate era inalcançável no
celular.

### O celular não é a mesma página mais estreita

Esta folha foi desenhada num canvas de 1440 e, no telefone, ela apenas **desabava** para
uma coluna. Nada era reproporcionado, e a conta somava: **15.566px de altura no celular
contra 10.835 no desktop.** Uma página que fica *mais longa* quando a tela encolhe está
dizendo que ninguém olhou para ela nesse tamanho.

Três causas, todas de proporção:

**1. O tipo não descia.** A manchete de seção fica em 56px numa coluna de 1120 — 5% dela.
No telefone ela parava em 32px numa coluna de 346 — **9,2%**. Quase o dobro em tamanho
relativo, e é por isso que toda manchete ocupava três linhas e todo cartão comia uma tela.

A regra "título nenhum abaixo de 28px" continua valendo. Ela sempre foi sobre **proporção**,
e 28px era a expressão dela num canvas de 1120; numa coluna de 346 a mesma proporção dá
20px. A escala inteira desce um degrau abaixo de 640px, e desce **fluida** — um iPhone SE
tem 320px e um Pro Max tem 430, e 34% de diferença de largura não recebe a mesma manchete.

| Token | Desktop | Celular (320 → 640) |
|---|---|---|
| `--t-hero` | 44 → 80px | 33 → 38px |
| `--t-xl` | 32 → 56px | 22 → 26px |
| `--t-lg` | 28 → 40px | 20 → 23px |
| `--t-md` | 28px fixo | 18 → 20px |

**2. O ritmo não encolhia.** `--section` de 72px em cima e 72 embaixo são 144px de preto
entre cada par de seções. Oito seções depois, 1.150px de página sem nada dentro. No celular
ele cai para 56px.

**3. Os cartões não adensavam.** Padding de 48px e título de 28px numa caixa de 346
deixavam cada máquina com **579px** — um cartão por tela, quatro telas para ver quatro
aparelhos. Com a escala nova e o padding ajustado, 484px.

Resultado: **13.606px**, e o MacBook da capa passou a aparecer na primeira tela.

### Duas correções que a revisão de celular encontrou

- **O terciário sumia na faixa branca.** `.btn--fumaca` era `#f5f5f7` ali — exatamente o
  chão do cartão de máquina. O botão desaparecia dentro dele e sobrava o texto solto, sem
  nada que dissesse "isto se toca". Ele desce um degrau e ganha um aro de 1px: num cartão
  claro é a **borda** que desenha o botão, a mesma conclusão a que o trilho de categorias do
  varejo chegou.
- **O filete das etapas deitou.** No desktop ele corre na horizontal ligando um passo ao
  seguinte. Empilhado numa coluna ele era simplesmente desligado, e as quatro etapas viravam
  quatro parágrafos soltos que não diziam ser uma sequência. Agora ele é **vertical**, desce
  do numeral até o passo de baixo, e o numeral vai para a canaleta à esquerda — que é o
  desenho que uma sequência empilhada pede.

### O vidro é a única exceção ao chapado

`rgba(66,66,69,0.72)` com `backdrop-filter: blur(20px)`, e ele existe por um motivo
funcional: a barra de preço passa **por cima do aparelho**, e um fundo sólido cortaria a
fotografia ao meio.

### A contraluz sangra, mas não para fora da tela

A elipse de luz atrás do MacBook tem **118% da largura do palco** e sangra de propósito —
sem isso ela termina com uma aresta reta no meio do quadro. Só que a parte que sangra para
fora da *tela* não pode continuar existindo: no celular ela empurrava a largura de layout
de 390 para 399px, e a barra do topo, presa a essa largura, levava o botão do menu junto.

A capa leva `overflow-x: clip` — e não `hidden`, que criaria um contêiner de rolagem e
mataria qualquer `position: sticky` dentro dela. `clip` corta sem criar rolagem, e em um
eixo só.

## A troca de ramo — a bola que cresce

Laranja ⇄ preto, em `assets/js/transicao.js` (sem dependência).

O gesto **nasce onde a pessoa tocou**: uma bola da cor do outro ramo abre a partir do
dedo e engole a página. Isso é o oposto de uma cortina genérica — a transição fica
ancorada no gesto que a causou, e por isso parece resposta, não espera.

O truque que faz a emenda sumir: a bola é pintada **exatamente com a cor de fundo da
página de destino**. Quando a navegação acontece, o que estava na tela e o que chega são
a mesma cor, então não existe quadro de emenda para aparecer. A página nova só precisa
trazer o conteúdo de volta — e faz isso com uma subida curta de 14px.

Três detalhes que o desenho exigiu:

- **O raio é a distância até o canto mais longe**, não a diagonal da tela. A diagonal
  erraria para menos em toda origem fora do centro e deixaria um naco de página
  aparecendo no canto.
- **A classe `chegando` é posta por um script inline no `<head>`**, antes da primeira
  pintura. Se esperasse o JS do rodapé, existiria um quadro com a página à mostra, e o
  corte apareceria justamente onde a transição existe para não aparecer.
- **A revelação da chegada é uma animação CSS com `both`, nunca um par de classes
  trocadas pelo JS.** Esta é a correção de um bug real: na primeira versão o conteúdo
  ficava em `opacity: 0` esperando o JS pôr uma classe. Se o `requestAnimationFrame`
  atrasasse — aba em segundo plano, carga lenta — ou se o JS falhasse por qualquer
  motivo, a página ficava invisível **para sempre**, e o que sobrava na tela era só a
  cor de fundo do corpo: a página inteira vazia, sem conteúdo nenhum. Como animação,
  ela se completa sozinha e termina visível; o JS não participa da visibilidade.

E um detalhe que o `bfcache` exigiu: **limpar o `style` inline não desfaz uma animação
da Web Animations API com `fill: 'forwards'`** — ela continua segurando o valor final.
Sem `getAnimations().forEach(a => a.cancel())`, voltar pelo botão do histórico devolvia
a página com a bola ainda cobrindo a tela inteira.

Com `prefers-reduced-motion`, a bola vira um fade de 180ms.

## Typography

O site pede primeiro a **SF Pro do sistema** (`-apple-system`), em texto e em manchete, e
cai na **Inter** (Google Fonts, 400/500/600/700) para quem não a tem. Antes era a Switzer;
a troca veio com a camada Apple (seção 24b de `style.css`). A Apple não licencia a SF
Pro para servir na web, então ela não pode ser baixada; o que dá para fazer é pedi-la ao
sistema operacional, e a maior parte de quem compra aqui está num aparelho Apple. Quem
não a tem cai na Inter — a mais próxima dela em proporção e desenho entre as livres. A manchete troca de arquivo, não de voz, e continua sendo uma família só na
percepção de quem lê.

Regras de escala:
- Manchete fluida com `clamp()`, razão ≥ 1,3 entre degraus.
- Tracking negativo cresce com o tamanho: `-0.04em` na manchete, `-0.032em` nos títulos
  de seção, `-0.01em` no corpo, `+0.02em` nos olhos pequenos.
- Leading inverso ao tamanho: `1.03` na manchete, `1.55` no corpo.
- `text-wrap: balance` nas manchetes e subtítulos: nenhuma palavra órfã na última linha.
- Corpo limitado a 62ch.
- Fallback: `Helvetica Neue`/`Arial` com `size-adjust`, para o texto não pular.

## Spacing & Layout

- Escala de 4px com passos irregulares: `4 8 12 16 24 32 48 72 112 160`.
- Seções com respiro fluido: `clamp(72px, 10vw, 152px)`. O ar é parte do produto.
- Dois contêineres: 1120px para leitura (capa, atendimento, produto) e 1320px para
  grades (destaques, catálogo, rodapé).
- Navegação fixa de 52px, translúcida com `backdrop-filter`, conteúdo passando por baixo.
- **Nada de grade de cards iguais.** Os destaques usam 4+2 na primeira linha e 2+2+2 na
  segunda, e cada chão é de uma família: areia, bruma, argila, musgo, linho, grafite, e
  **um** deles no laranja cheio. Cards idênticos seriam o caminho fácil e o errado;
  chãos iguais também.
- O catálogo não usa cards: usa **linhas**. Vinte e três produtos em card viram um mural;
  em linha viram uma lista que se lê de cima a baixo em segundos.

## Components

- **Marca**: o "A" da Aliança One reduzido à estrutura — o vértice e os dois blocos da base,
  separados pela fenda que o logo original tem. Três polígonos, uma cor, sem gradiente
  metálico e sem o aperto de mão: a mão desenhada vira borrão a 16px, e a marca precisa
  viver a 16px. Vetor inline, nunca imagem. Aparece na navegação, no favicon e como
  assinatura no rodapé.
- **Navegação**: fixa, translúcida, marca à esquerda, categorias no centro, WhatsApp à
  direita. No celular vira folha branca de tela cheia, e o WhatsApp do topo perde a
  palavra: fica só o ícone num alvo de 44px, para o canal continuar a um toque mesmo com
  o menu fechado. O "One" da marca é o mesmo nome um peso abaixo — contraste de peso,
  não uma segunda cor nem uma segunda família. O carrinho não mora aqui: ele é um
  botão flutuante, alcançável pelo polegar em qualquer ponto da página.
- **Os dois botões do rodapé**: carrinho à direita, WhatsApp à esquerda. São ações
  diferentes e não podem dividir o mesmo canto — errar o toque ali manda a pessoa para
  fora do site. O carrinho é laranja com ícone de papel, sempre: o botão não muda de cor
  para avisar que tem item dentro, quem avisa é o selo de contagem, e um sinal só basta.
  O anel em volta do selo é da cor do **chão da página**, não da tinta — ele existe para
  abrir um vão entre o selo e o botão, e um vão só some se for da cor do que está atrás.
  No hover o carrinho **atravessa**: sai de cena pela direita e volta entrando pela
  esquerda, como se tivesse dado a volta. A saída acelera (está indo embora) e a entrada
  desacelera (está chegando e parando) — duas curvas num gesto só, dentro de uma janela
  de 28px que recorta o ícone na borda do botão.
- **Capa**: assimétrica, cortada por uma diagonal. O argumento à esquerda — selo,
  manchete, subtítulo, botão e link com seta, três fatos sob um filete — sobre um papel
  areia; a foto do aparelho à direita, sobre o papel mais alvo. Entre os dois, **um
  filete de laranja de 5px** com a mesma inclinação. Nem o painel nem o filete recebem
  conteúdo: são pseudo-elementos com `clip-path`, atrás de tudo. No celular o corte deita
  e vira a base inclinada do painel do argumento, com o filete acompanhando.
- **Selo da capa**: caixa-alta pequena com tracking aberto, um lacre desenhado ao lado e
  **nenhuma moldura**. Uma pílula com contorno em volta de três palavras seria uma
  moldura sem função — o que carrega a linha é o tracking e o desenho.
- **Fecho da manchete**: `sem dúvida.` é **laranja chapado**, não um degradê. Já foi uma
  rampa recortada no texto; saiu junto com todos os outros degradês, e pelo mesmo motivo:
  um degradê embaixo de texto muda de contraste ao longo de si mesmo, e o valor que vale
  é sempre o da ponta pior — nunca o do meio, que é o que se vê e o que se mede por
  engano. Uma cor só é um número só, verdadeiro no texto inteiro. O `<em>` continua
  existindo porque marca a frase que fecha o argumento; dentro de superfície laranja
  cheia ele inverte para papel.
- **Trilho de categorias**: pílulas de papel roláveis na horizontal, com **aro de 22%** da
  tinta. Elas já foram invisíveis: um chip de `--chao-2` sobre o chão `--chao` é uma
  diferença de **1,07:1**, abaixo do limiar em que o olho reconhece uma borda, e o aro de
  10% não dava conta sozinho — o trilho inteiro lia como texto solto no ar. Numa página de
  papel quem desenha um objeto é a **borda**, não o preenchimento: não há para onde
  escurecer o chão nem para onde clarear o chip. No hover cada uma acende **na cor da
  própria família** — a diferença entre a pílula parada e a pílula com o dedo em cima é de
  matiz, não de brilho.
- **Card de destaque**: bloco de cor com o mockup no topo, olho, nome, preço colado na
  base e **uma** ação. Sem frase de venda: ela mora na página do produto. Cinco variantes
  de fundo, três larguras. O card largo é o único com o aparelho ao lado do texto.
- **Linha de catálogo**: miniatura do aparelho, nome à esquerda, preço à direita, um botão
  no fim. O botão fica em contorno enquanto o cursor não chega na linha — parado, o
  catálogo é uma lista de nomes e preços, não um mural de botões laranja. No celular ele
  sai e quem diz "tem mais aqui" é o chevron.
- **A sacola só enche na página do produto.** Nos cards e nas linhas, "Comprar" leva para
  os detalhes; o botão que junta mora lá, depois da escolha de cor e capacidade. Um
  aparelho de R$ 11 mil não entra na sacola sem que a pessoa tenha dito qual — juntar a
  variante padrão da vitrine pouparia um clique e devolveria o problema em cheio, com o
  vendedor perguntando de novo do outro lado.

  **Da página principal a sacola é só leitura**, e ela funciona: o selo do botão
  flutuante conta o que já está lá dentro e a gaveta abre com a lista inteira, quantidade,
  total e o botão que fecha o pedido — em qualquer página do site, porque o estado mora no
  navegador, não na página.
- **Botão primário**: pílula `#FF6200` cheia com a tinta preta por cima (5,79:1),
  `:active { scale: .97 }`. Dentro de qualquer superfície laranja ele inverte: papel cheio
  com `--sobre-claro` por cima.
- **Link com seta**: laranja, o chevron desliza 3px no hover. O gesto da Apple.
- **Bolha de WhatsApp**: uma bolinha verde de 56px com o ícone, no canto inferior
  esquerdo, e nada mais. Sem cartão que abre sozinho, sem texto, sem botão de fechar — o
  ícone já diz o que ela faz.
- **Gaveta do carrinho**: folha branca pela direita (pelo rodapé no celular), véu escuro
  por baixo, linha por item com miniatura, variante, preço e um seletor de quantidade em
  pílula. Cada linha traz o parcelado abaixo do valor, e o pé fixa o total à vista, o
  parcelado do pedido inteiro e o botão que fecha. A pessoa nunca sai da página em
  que estava, e é por isso que o fundo continua visível.
- **Acordeão das perguntas**: uma aberta por vez, filete entre elas, nada de card — é
  uma lista de dúvidas, não um mural. A altura anima por `grid-template-rows` de `0fr`
  para `1fr`, então o navegador continua medindo o conteúdo e a resposta nunca corta.
  O estado fica no bloco, não no botão: o botão mora dentro do `<h3>` e a resposta é
  irmã do `<h3>`, então não há seletor de irmão que alcance uma a partir do outro.
- **Faixa das dúvidas**: chão de papel no degrau mais fundo, não laranja. As dúvidas são
  o momento em que a pessoa está mais perto de desistir, e é por isso que têm chão
  próprio — só que a faixa dos compromissos já é cósmica, e duas superfícies cheias a
  duas seções de distância transformam o acento em fundo. O que dá cor à seção é a
  manchete, e o **chevron laranja** de cada linha, que é a única peça colorida dela: ele
  diz onde tocar.
- **Atendimento no menu**: pílula discreta em vez de mais uma cor. Não é uma categoria
  de produto como as outras — é para onde vai quem ainda não decidiu comprar, e num
  público que chega desconfiado esse é o destino mais importante do menu.
- **Faixa do Instagram**: a única seção do site com chão escuro (`--noite`). É de
  propósito — social é outro lugar, e parecer outro lugar ajuda a pessoa a entender
  para onde ela vai ao clicar. Sem feed falso e sem contagem de seguidores: não há como
  trazer post real sem API, e o resto seria banco de imagem.
- **Âncora de preço**: valor do varejo oficial riscado + quanto o cliente economiza, numa
  pílula de laranja a 12% sobre o chão, com o laranja fundo por cima. Só renderiza quando `precoOficial` existe no `data.js` e é
  maior que o preço da loja.
- **Garantias no ponto de decisão**: quatro linhas com marca de conferido, coladas no
  botão de comprar da página do produto. Antes elas estavam a três rolagens do botão.
- **Aviso de armazenamento**: faixa estreita no rodapé, um botão só, não escurece nada,
  não volta depois de fechada.
- **Peça do produto** (`assets/js/aparelho.js`): a imagem oficial em `.webp`, com
  `object-fit: contain` e padding em px — porcentagem se resolve pela largura, e numa
  caixa larga e baixa isso encolheria o aparelho até virar um selo. Quatro tamanhos:
  `capa`, `card`, `linha` (miniatura) e `mockup` (página do produto).
- **Mockup de reserva** (mesmo arquivo): um SVG de 240×240 por produto, com
  forma escolhida pela categoria e pelo id (o Pro Max é mais largo, o Air mais estreito,
  o Watch Ultra mais quadrado). Todo preenchimento é derivado de uma única variável CSS
  `--cor` por `color-mix`, então trocar a cor na página do produto faz a peça inteira
  fazer cross-fade em 420ms sem redesenhar nada. Quatro tamanhos: `capa` (292px, com
  sombra de contato), `card`, `linha` (miniatura de 44 a 58px) e `mockup` (página do
  produto). Duas cores fogem da derivação porque não são escolha de cor: o LED de carga
  e o botão de ação do Watch Ultra, laranja no aparelho de verdade.

## A galeria do produto

As setas que trocam a **vista** do aparelho: de lado, de costas, a tela ligada, a caixa.

**O que entra nela:** a foto da cor escolhida — sempre, e sempre primeiro — e as vistas
extras que o `data.js` declarar em `vistas: []`.

**E o que não entra: as outras cores.** A galeria já passeou por elas, e era o gesto errado.
A coluna de escolhas ao lado existe exatamente para isso, com o nome escrito e a amostra da
cor; duas maneiras de fazer a mesma coisa não são duas funções, são uma função e um ruído.
Trocar a cor troca a foto **no lugar**, com cross-fade, e a galeria não sai de onde está —
quem escolheu a cor está olhando para o aparelho, não pedindo para virá-lo. As setas ficam
para o que elas são: ângulos.

Por isso, hoje, **nenhum produto tem setas.** O campo `vistas` está vazio, e o motivo é que
a foto não existe: os bancos de render da Apple publicam um frontal por cor e mais nada —
perfil e traseira saem de fotografar o aparelho. A galeria some sozinha enquanto não houver:
com uma vista só, não há seta, ponto nem trilho, e o que sobra é a foto.

No dia em que a foto existir, é uma linha no `data.js` e nenhuma de código.

### Os dois modos, e quem recebe o foco em cada um

O foco é sempre de **um** elemento só, e ele muda com o modo — dois elementos focáveis
fazendo coisas parecidas seria uma parada de tab a mais sem nada a mais para fazer.

| Modo | Foco | O que as setas do teclado fazem | Arraste |
|---|---|---|---|
| Uma vista (hoje) | o **quadro** | giram a peça no eixo Y | `montarGiro` |
| Com `vistas` | o **palco** | passam a vista | trilho horizontal |

Com uma vista só o gesto volta a ser o que sempre foi na página do produto: **arrastar para
girar**. É o mesmo `montarGiro` do `gesto.js`, e ele mora no quadro, não no palco — o palco
tem `overflow: hidden` e cortaria a própria inclinação nas bordas.

### O movimento, quando há o que passar

Segue as quatro regras de tudo o que se pega no site, e as três ferramentas vêm prontas do
`gesto.js` (`molinha`, `projetar`, `elastico`):

1. o trilho segue o dedo **1:1**, respeitando onde ele pegou;
2. na primeira e na última vista ele **resiste** em vez de travar;
3. ao soltar, a vista de repouso é a mais próxima de **onde o dedo ia**, não de onde ele
   parou — é o que faz um peteleco de 20px passar uma vista inteira e um arraste lento de
   20px voltar para onde estava;
4. a mola recebe a **velocidade do dedo** e pode ser agarrada no meio do voo, sem salto.

Três detalhes que o desenho exigiu:

- **A altura mora no palco, não no quadro.** Uma `aspect-ratio` num item de flex é só um
  tamanho *preferido*, e o tamanho mínimo automático do conteúdo passa por cima dela. A foto
  do iPhone tem 989px de altura intrínseca, e era essa altura que vencia — o aparelho ocupava
  uma tela e meia. Com a razão no palco, a cadeia de alturas fica definida de cima para baixo.
- **As setas desligam nas pontas, não somem.** Um botão que some move os outros de lugar, e
  o dedo erra o alvo na segunda vez. Elas são vidro fosco porque passam por cima da
  fotografia: um chão opaco cortaria a peça ao meio.
- **`touch-action: pan-y`.** O dedo continua rolando a página na vertical; só o horizontal é
  da galeria. Sem isso ela sequestra a rolagem no celular.

Com `prefers-reduced-motion`, o trilho vira uma pilha e as vistas se cruzam por opacidade.
As setas, os pontos e o teclado continuam funcionando.

## Motion

- Curva única: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). Sem bounce, sem elastic.
- Durações: 130ms para toque, 220ms para hover, 620ms para revelação.
- Só `transform` e `opacity`. Nunca propriedades de layout.
- Movimento é discreto de propósito: revelação curta no scroll, chevron que desliza,
  card que sobe 3px. Nada compete com o conteúdo.
- **Um gesto, e só na página do produto.** A capa ficou parada de propósito: movimento
  ali competiria com a manchete, que é o que precisa ser lido primeiro. A referência era
  um clone do site da Apple em
  Three.js + GSAP, com 866 KB de modelo e 35 MB de vídeo. Nada disso entrou: o que faz
  aquilo parecer físico não é o renderizador, são quatro comportamentos, e os quatro
  cabem em CSS 3D e Pointer Events (`assets/js/gesto.js`, sem dependência):
  **(1)** a peça segue o dedo 1:1 respeitando onde ele pegou; **(2)** no limite ela
  resiste em vez de travar, com o amortecimento progressivo do rubber-band — 200° de
  arraste chegam a 33°; **(3)** ao soltar, a velocidade do gesto vira a velocidade
  inicial da mola, e o repouso sai da **projeção de momento** exponencial que o iOS usa
  na rolagem, não da fórmula de física de colégio; **(4)** agarrar no meio do voo
  cancela a mola e assume o valor que está na tela, então nada dá salto.
  A mola é criticamente amortecida: assenta em 52 quadros sem passar do alvo (medido).
- **A entrada da capa é a única que não desliza.** A foto do aparelho **assenta**: chega
  desfocada em 22px e um passo maior, e para — como uma lente encontrando o foco. Anima
  `filter`, que não é `transform` nem `opacity`; a exceção é deliberada e cabe por ser
  uma peça só, uma vez por visita, e nunca durante a rolagem.
- **A exceção é o carrinho.** Ao adicionar um produto, o mockup na cor escolhida voa da página
  até o botão do carrinho em um arco de 640ms, e ele pulsa quando a peça chega. São as duas perguntas
  que a pessoa faz ao tocar em adicionar — *foi?* e *foi o quê?* — respondidas por
  movimento em vez de por um aviso na tela. A gaveta desliza em 460ms, o véu aparece em
  320ms, e a linha removida encolhe a altura antes de sumir para a lista não saltar.
- Com `prefers-reduced-motion`, a peça que voa **não chega a ser criada** e a gaveta
  aparece por opacidade.
- `prefers-reduced-motion: reduce` remove deslocamentos e deixa só fade de 160ms.

## Honestidade como restrição de design

A loja não tem endereço físico, e o site não finge que tem. A regra que sai disso vale
para todo o sistema: **elemento sem dado verdadeiro não é renderizado.**

| Dado ausente | O que some |
|---|---|
| `CONFIG.instagram` no valor de exemplo | A faixa escura inteira e o link do rodapé |
| `CONFIG.cnpj` vazio | O item na faixa da capa e na página de atendimento |
| `precoOficial` ausente no produto | A âncora de preço |
| `imagens` (sempre) | Nada — o campo não é usado por página nenhuma |

Some em vez de aparecer vazio, e some em vez de aparecer com número inventado. É a
mesma decisão da fotografia — *melhor nenhuma imagem do que uma imagem que mente* —
aplicada ao texto e ao preço.

## Imagery

**A imagem oficial de cada modelo, uma por cor.** Cada produto tem a sua em
`assets/img/produtos/<id>/<cor>.webp`, recortada em alpha, sem fundo e sem sombra de
estúdio — a sombra e o chão são desenhados pela página. Trocar a cor na página do
produto troca o arquivo com cross-fade de 260ms.

Vieram do repositório aberto [littlebyteorg/apple-device-images](https://github.com/littlebyteorg/apple-device-images),
que indexa por **identificador de hardware**, não por nome comercial — `iPhone18,1` é o
iPhone 17 Pro, `iPhone17,1` é o 16 Pro. O mapeamento está registrado no LEIA-ME, junto
com o script que baixa e converte.

Como as cores do catálogo passaram a ser exatamente as que existem em imagem, a lista de
cores de cada produto **é** a lista de arquivos. Uma cor sem arquivo não aparece.

**A capa é a exceção**: usa uma composição dos três acabamentos do modelo anunciado, e
não uma peça só. Ela entra em cena diferente do resto — ver Motion.

**Reserva desenhada.** Produto sem imagem (`fotos: false` no `data.js`, ou arquivo
ausente) cai no mockup em SVG: silhueta correta da categoria, preenchida na cor
escolhida por `color-mix` a partir de uma variável só. Isso existe para um produto novo
nunca nascer com buraco no lugar da imagem, e é diagrama assumido, não render.


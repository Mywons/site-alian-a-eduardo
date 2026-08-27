# Design

## Duas marcas, duas folhas

O projeto tem **dois ramos**, e cada um tem folha de estilo própria:

| Ramo | Página | Folha | Chão | Assinatura |
|---|---|---|---|---|
| **Aliança One** (varejo) | `index`, `produto`, `sobre`, `privacidade` | `assets/css/style.css` | Laranja | Capa partida |
| **Aliança Corporate** (B2B) | `corporate.html` | `assets/css/corporate.css` | Preto | Régua numerada |

Nenhum token atravessa de uma folha para a outra. O que os dois ramos compartilham é a
**família de tipo**, a **curva de movimento**, as **durações** e as **formas** (pílula,
raio de canto, filete de 1px). É de propósito: quem chega no Corporate vindo do laranja
precisa reconhecer a casa, e o que muda tem de ser a cor e o ritmo, não a voz.

O Corporate chegou a ter uma serifa (Gambetta) nas manchetes. Ela saiu: fazia parecer
**outra empresa**, e não outro ramo da mesma.

## Visual Theme — Aliança One

Loja Apple. Branco quente, laranja do iPhone 17 e uma tinta quase preta. A referência é o
próprio site da Apple: navegação fina, manchete grande, muito ar, botão em pílula, lista
de produtos densa e legível.

**A capa é cortada por uma DIAGONAL: laranja vivo à esquerda, branco à direita.** É a
única composição do site em que as duas cores da marca aparecem no mesmo quadro — e é
por isso que ela é a primeira coisa que a pessoa vê: a página inteira se explica ali. À
esquerda o argumento; à direita, só o aparelho, recortado em alpha sobre branco, sem
chão nem sombra de estúdio desenhados.

O corte é pintado por um `::before` com `clip-path`, atrás de tudo, e **nunca recebe
conteúdo**. O conteúdo continua numa grade de duas colunas normais — assim a diagonal
pode inclinar quanto quiser sem que uma linha de texto a mais empurre a divisa para o
lado. A inclinação é de 10 pontos: sai de 55% no topo e chega a 45% na base; o texto
para em 42%, com margem de sobra.

No celular o corte **deita**: vira uma inclinação de 34px na base da faixa laranja. Ali
ele não pode morar no `::before` da capa — seria uma porcentagem da altura total, e essa
altura muda com o número de linhas da manchete. Passa a ser pintado no próprio elemento
laranja, que sabe onde o conteúdo dele termina.

### A vitrine flutua

O site era chapado por decisão, e **essa decisão mudou na vitrine**. Os cartões de
destaque passaram a ter 28px de raio e sombra dupla — uma camada curta que cola o objeto
no chão e uma longa que dá volume. Uma sombra só, dura, é o que faz parecer adesivo.

O poço de cada peça tem raio **8px menor** que o do cartão que o contém. Essa diferença
é o que cria a moldura fina em volta do aparelho; sem ela, poço e cartão viram uma peça
só e o produto encosta na aresta externa.

A elevação vive **apenas na vitrine e nas peças que se levantam** — cartões, etiqueta da
capa, aviso, chips. Seções, faixas e linhas de catálogo continuam separadas por cor e
por filete, como sempre foram.

## Color Palette — Aliança One

**Toda a família foi trazida para dentro do gamut sRGB.** O laranja anterior (`#c44800`)
era declarado fora: o canal azul estourava para baixo de zero, o navegador cortava, e o
matiz caía de 45 para 36 — chegava ao olho como **vermelho queimado**, não como laranja.
É essa a razão de o laranja antigo nunca ter parecido laranja. Nenhum token da paleta
atual corta.

Existem **duas intensidades do mesmo laranja**, e a diferença entre elas não é estética,
é de contrato de leitura:

| Token | Valor | Papel |
|---|---|---|
| `--chao` | `oklch(0.565 0.160 45)` · `#bf4f04` | Chão de trabalho — onde mora texto miúdo branco (4,63:1) |
| `--chao-2` | `oklch(0.505 0.140 45)` · `#a34400` | Cards, chips, barra rolada |
| `--fundo` | `oklch(0.445 0.130 44)` · `#8b3500` | Poço, hover, etiqueta |
| `--cosmico` | `oklch(0.665 0.155 52)` · `#dc7426` | **Laranja-cósmico do iPhone 17** — superfície |
| `--papel` | `oklch(0.985 0.008 72)` | O branco das ilhas e da metade direita da capa |
| `--tinta` / `--acao` | `oklch(0.985 0.008 72)` | Branco, sobre o chão de trabalho |
| `--suave` | `oklch(0.978 0.016 72)` | Secundário no chão (4,52:1) |
| `--escuro` | `oklch(0.22 0.012 50)` | Preto quente — a tinta do cósmico e das ilhas |
| `--sobre-claro` | `oklch(0.535 0.140 46)` · `#ac4d15` | O laranja que se escreve sobre o branco (5,25:1) |

### Os dois gradientes

O site deixou de ser chapado: o laranja tem rampa. Mas **uma rampa embaixo de texto tem
um custo** — o contraste muda ao longo dela, e quem valida só no meio publica um site que
reprova nas pontas. As duas rampas foram medidas **nas duas extremidades**, e o
verificador do projeto aprendeu a ler paradas de gradiente justamente por causa disso
(antes ele lia `backgroundColor`, que num gradiente é transparente, e media contra o
elemento de trás — um número que não existe na tela).

| Rampa | De → até | Carrega | Janela |
|---|---|---|---|
| `--grad-vivo` | `#e0730a` → `#d0662e` | Tinta **escura** | ink 5,48 → 4,65 · branco grande 3,03 → 3,57 |
| `--grad-chao` | `#bf4e0b` → `#ab4b19` | Texto **branco miúdo** | branco 4,66 → 5,35 |

A janela do `--grad-vivo` é apertada dos dois lados: **acima de L 0.67 o branco da
manchete cai abaixo de 3:1, e abaixo de L 0.62 a tinta escura cai abaixo de 4,5:1.** As
pontas ficam exatamente dentro disso. O par mais apertado da página inteira é o numeral
branco da faixa de compromissos: **3,03:1** na ponta clara.

`--grad-vivo` ocupa a capa, a faixa dos compromissos e a barra rolada. `--grad-chao`
atravessa destaques e catálogo como uma rampa contínua, para as duas seções lerem como um
degradê só e não como duas faixas.

### O cabeçalho tem três estados

A barra passa por chãos diferentes, e cada um pede uma tinta. Em vez de repetir a lista
de filhos em cada caso, **a tinta virou uma variável** (`--nav-tinta`) e os filhos leem
dela:

1. **Rolada, em qualquer página** → rampa viva, tinta escura.
2. **No topo do índice** → transparente sobre a diagonal, que é laranja de um lado e
   branco do outro. Tinta escura é a única que se lê nos dois.
3. **No topo das outras páginas** → transparente sobre o laranja de trabalho, tinta branca.

### Nenhum poço tem chão

O quadrado claro atrás do aparelho **saiu de toda a vitrine**. A foto já vem recortada em
alpha, e um retângulo atrás dela devolve exatamente a moldura que o recorte existe para
tirar — o produto passa a parecer colado num selo em vez de estar na página. O poço
continua existindo como *caixa*, para o card não pular de tamanho conforme a silhueta do
produto, mas é uma caixa invisível. A única exceção é a página do produto, onde a peça
aparece sozinha e sem fundo flutuaria no vazio.

### A regra que governa os dois laranjas

O Laranja-cósmico é **claro demais para texto miúdo branco**: 3,06:1. Ele só passa em
manchete, que é texto grande e pede 3:1. Então onde o cósmico é superfície, a tinta
**vira escura** — preto quente fecha **5,43:1** nele, em qualquer tamanho.

Isso foi medido tom a tom, com conversão OKLCH→sRGB de verdade, e o resultado é uma
regra dura:

> **No Laranja-cósmico: ou manchete branca, ou tinta preta. Nunca branco miúdo.**

E uma armadilha que a medição pegou: **rebaixar a tinta escura por opacidade reprova.**
A mesma tinta a 86% já cai para 4,49:1. Por isso não há dois brilhos dentro do painel
laranja — há **uma tinta só**, e o que separa manchete de corpo é **peso e tamanho**,
nunca brilho. É a mesma inversão de hierarquia que o site já usava, aplicada ao contrário.

Onde o cósmico é superfície: a **metade esquerda da capa** e a **faixa dos compromissos**.

### A porta para o outro ramo

O Corporate **não é uma categoria de produto, é outra empresa** — e o menu precisa dizer
isso antes do clique. Como link de texto no meio de "iPhone, Mac, iPad" ele lia como
mais um item de catálogo e sumia.

Virou uma **pílula preta no grupo de ações, à direita**, onde moram as coisas que levam
para fora desta loja. Preta de propósito: é a cor do ramo do outro lado, e num menu
laranja ela é o único aviso honesto de que a página inteira vai mudar de cor. Dentro
dela, o monograma num disco de **ouro** — a pílula carrega as duas cores da outra página
em miniatura — e uma seta de canto dizendo "sai daqui".

No celular ela sai da barra (só cabem marca, WhatsApp e menu sem os alvos caírem abaixo
de 44px) e reaparece **dentro do menu**, como um bloco escuro com subtítulo — que é onde
há espaço para explicar o que o Corporate é, em vez de só nomeá-lo.

### A barra sobre a capa partida

No topo do índice a barra é transparente, e por baixo dela passam **as duas cores**.
Branco sumiria na metade direita; laranja sumiria na esquerda. A única tinta que se lê
nas duas é o preto quente — 5,43:1 no laranja, 16,6:1 no branco — e é para ele que a
barra troca enquanto está no alto. Assim que a página rola, ela ganha chão sólido e tudo
volta a ser branco. Escopado por `:has(.capa-lado--laranja)`, para valer só onde a capa
é partida.

## Visual Theme — Aliança Corporate

**Teatro preto, hardware luminoso.** A página é um filme: preto absoluto engole tudo
menos a fotografia do produto, o tipo em escala grande e uma nota de azul.

O chão é `#000` puro, e não um cinza-azulado. O que ele existe para fazer é **sumir**:
sobre preto absoluto a foto recortada em alpha não tem borda, não tem plano de fundo e
não tem onde terminar — o objeto existe num vazio. Qualquer cinza devolve uma caixa em
volta do produto. A capa é uma tela inteira com o MacBook Pro em 1180px, e a barra de
preço flutua sobre ele em vidro fosco.

### O racionamento de cor é a identidade

Esta é a regra que governa tudo, e ela não é preferência estética: a página lê como um
filme em preto e branco com **duas notas de azul**.

| Token | Valor | Papel |
|---|---|---|
| `--preto` | `#000000` | Canvas |
| `--carvao` | `#1d1d1f` | Cartão sobre o canvas |
| `--fumaca` | `#333336` | Botão terciário, plano eleito |
| `--seda` | `#f5f5f7` | Texto principal · 19,3:1 |
| `--cinza` | `#86868b` | Secundário no escuro · 5,8:1 |
| `--platina` | `#cccccc` | Menu 12px · 13,1:1 |
| `--azul` | `#0071e3` | **Único preenchimento cromático** · branco por cima 4,70:1 |
| `--azul-link` | `#2997ff` | Texto de link e grifo · 6,96:1 |
| `--azul-fundo` | `#0066cc` | Link na faixa branca · 5,57:1 |

**O ouro saiu.** Ele era um segundo acento cromático, e diluir o azul com um segundo
acento desmonta o sistema — verde, laranja e roxo estão fora pelo mesmo motivo. Encher um
botão com o tom de *link* também está fora: confunde a hierarquia da ação.

Na faixa branca a tinta inverte. **O `--cinza` da referência reprova ali** (3,62:1), então
o secundário claro é `#6e6e73` (5,07:1) — o mesmo tipo de armadilha que o `--platina` já
tinha criado no cartão gelo.

### Três regras duras, todas da referência

- **Peso máximo 600.** 700 não existe: com o tracking negativo desta escala, ele lê como
  desespero.
- **Título nenhum abaixo de 28px.** A escala começa em subtítulo e sobe.
- **Sombra nenhuma.** A profundidade vem de contraste tonal, do raio de 28px e do vidro
  fosco — nunca de `box-shadow`.

Só três curvas existem: pílula (9999px), cartão (28px) e link (10px).

### O que saiu junto

A **régua lateral** foi removida. Além de não pertencer ao sistema — a referência é
explícita: *sem sidebar, navegação horizontal em texto e nada mais* — ela passava por
cima do conteúdo assim que o contêiner cresceu para 1440px e não sobrou margem para ela.

O **olho laranja** também saiu, pelo racionamento. Restou um único ponto de laranja na
página inteira: a bolinha de 9px do link de volta para o varejo, que não é ação — é
bandeira do outro ramo.

### O vidro é a única exceção ao chapado

`rgba(66,66,69,0.72)` com `backdrop-filter: blur(20px)`, e ele existe por um motivo
funcional: a barra de preço passa **por cima do aparelho**, e um fundo sólido cortaria a
fotografia ao meio.

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
  cor de fundo do corpo: a página inteira laranja, sem conteúdo nenhum. Como animação,
  ela se completa sozinha e termina visível; o JS não participa da visibilidade.

E um detalhe que o `bfcache` exigiu: **limpar o `style` inline não desfaz uma animação
da Web Animations API com `fill: 'forwards'`** — ela continua segurando o valor final.
Sem `getAnimations().forEach(a => a.cancel())`, voltar pelo botão do histórico devolvia
a página com a bola ainda cobrindo a tela inteira.

Com `prefers-reduced-motion`, a bola vira um fade de 180ms.

## Typography

**Switzer** (Fontshare) nos pesos 400/500/600/700 carrega o site inteiro, e as manchetes
grandes pedem a **SF Pro do sistema** antes dela (`--display`). A Apple não licencia a SF
Pro para servir na web, então ela não pode ser baixada; o que dá para fazer é pedi-la ao
sistema operacional, e a maior parte de quem compra aqui está num aparelho Apple. Quem
não a tem cai na Switzer — escolhida justamente por ser a mais próxima dela em proporção
e desenho. A manchete troca de arquivo, não de voz, e continua sendo uma família só na
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
  segunda, e os cinco chãos são diferentes: grafite, areia, laranja-tênue, bruma e
  argila. Cinco cards idênticos seriam o caminho fácil e o errado; cinco chãos iguais
  também.
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
  fora do site. O carrinho é tinta com ícone branco, sempre: o botão não muda de cor para
  avisar que tem item dentro, quem avisa é o número em laranja, e um sinal só basta.
  No hover o carrinho **atravessa**: sai de cena pela direita e volta entrando pela
  esquerda, como se tivesse dado a volta. A saída acelera (está indo embora) e a entrada
  desacelera (está chegando e parando) — duas curvas num gesto só, dentro de uma janela
  de 28px que recorta o ícone na borda do botão.
- **Capa**: assimétrica. O argumento à esquerda — selo, manchete, subtítulo, botão e link
  com seta, três fatos sob um filete — e a foto do aparelho à direita, sobre uma cunha
  diagonal quente. A cunha é a única superfície do site que puxa o laranja para além do
  gesto, e ela é chão: nunca recebe texto nem botão. No celular ela deixa de cortar a
  composição e vira um chão atrás da foto.
- **Selo da capa**: caixa-alta pequena com tracking aberto, um lacre desenhado ao lado e
  **nenhuma moldura**. Uma pílula com contorno em volta de três palavras seria uma
  moldura sem função — o que carrega a linha é o tracking e o desenho.
- **Fecho da manchete em degradê**: `sem dúvida.` recebe uma rampa dentro da própria
  família do laranja, do tom de ação ao tom quente, com `box-decoration-break: clone`
  para cada linha quebrada receber a rampa inteira. A `color` sólida fica declarada antes
  como piso, para o texto continuar legível onde o recorte no texto não funcionar. O
  ponto mais claro da rampa foi fechado em 4,4:1 no branco — acima do exigido para texto
  grande, que é 3:1.
- **Trilho de categorias**: pílulas cinza-neve, roláveis na horizontal.
- **Card de destaque**: bloco de cor com o mockup no topo, olho, nome, preço colado na
  base e **uma** ação. Sem frase de venda: ela mora na página do produto. Cinco variantes
  de fundo, três larguras. O card largo é o único com o aparelho ao lado do texto.
- **Linha de catálogo**: miniatura do aparelho, nome à esquerda, preço à direita, um
  botão no fim. O botão fica em contorno enquanto o cursor não chega na linha — parado, o
  catálogo é uma lista de nomes e preços, não um mural de botões laranja.
- **"Comprar" leva para os detalhes.** Nos cards e nas linhas ele abre a página do
  produto, porque é lá que se escolhe cor e capacidade. Só a página do produto tem o
  botão que abre a conversa, e é isso que faz a mensagem chegar completa do outro lado.
- **Botão primário**: pílula laranja com texto branco, `:active { scale: .97 }`.
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
- **Faixa das dúvidas**: o único chão saturado, em `--laranja`. Manchete em SF Pro com
  rampa **branca** — a mesma ideia da rampa laranja, invertida: do branco puro a um
  branco quente, sem sair para outra cor. A parada mais escura foi fechada em 4,9:1
  sobre o chão. Os filetes do acordeão deixam de ser o cinza `--linha`, que sumiria, e
  passam a ser branco rebaixado a 28%.
- **Atendimento no menu**: pílula discreta em vez de mais uma cor. Não é uma categoria
  de produto como as outras — é para onde vai quem ainda não decidiu comprar, e num
  público que chega desconfiado esse é o destino mais importante do menu.
- **Faixa do Instagram**: a única seção do site com chão escuro (`--grafite`). É de
  propósito — social é outro lugar, e parecer outro lugar ajuda a pessoa a entender
  para onde ela vai ao clicar. Sem feed falso e sem contagem de seguidores: não há como
  trazer post real sem API, e o resto seria banco de imagem.
- **Âncora de preço**: valor do varejo oficial riscado + quanto o cliente economiza, em
  pílula `--laranja-tenue`. Só renderiza quando `precoOficial` existe no `data.js` e é
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


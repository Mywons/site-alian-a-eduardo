# Design

## Visual Theme

Loja Apple, sem fotografia. Branco quente como chão, cinza-neve para separar seções,
tinta quase preta no texto e um único laranja que aparece pouco e sempre com intenção.

A referência é o próprio site da Apple: navegação fina e translúcida, manchete enorme
centralizada, muito ar, botão em pílula, lista de produtos densa e legível. A diferença
é que aqui não há render nem foto de produto: **a tipografia carrega a página e o
desenho confirma o que ela diz.** Cada produto aparece como um mockup em SVG — silhueta
correta da categoria, preenchida na cor real que o cliente escolheu. É diagrama, não
render: não tem brilho de estúdio nem reflexo no chão, e por isso nunca finge ser uma
foto do aparelho. A página continua coerente quando o estoque muda, porque nada aqui
depende de um arquivo de imagem existir.

Estratégia de cor: **Restrained, com dois cortes.** O laranja fica abaixo de 10% da
superfície — botão, link, olho, foco — e sobe a chão inteiro em duas faixas: as dúvidas
e o destaque. Fora delas, a página é branco quente e preto quente. Um bloco claro por página
quebra o laranja — a faixa das dúvidas — e é ele que respira.

A cor cai nas dúvidas por um motivo, não por rodízio: é o trecho em que a pessoa está
mais perto de desistir, e o único em que ela lê texto corrido. Um bloco de perguntas em
cinza sobre branco é o tipo de coisa que se rola por cima.

O laranja que ocupa a superfície é **o mesmo token de ação**, não um segundo laranja.
Quando ele vira chão, tudo em cima dele é branco ou quase, e cada tom foi medido contra
o chão. Fora dessas seções ele volta a ser só gesto: botão, link, olho, foco.

O ritmo importa mais que a contagem: o corte cai nas dúvidas porque é o único trecho de
texto corrido da página e o momento em que a pessoa está mais perto de desistir.

Claro por decisão: o cliente compra de dia, no meio de outras dez abas, e precisa bater
o olho e entender em dois segundos. O site chegou a ser drenched em terracota e em
laranja vivo, e nos dois casos o custo apareceu no mesmo lugar — a hierarquia de leitura,
que num chão saturado só cabe se o secundário quase encostar no primário. Num catálogo
de 23 linhas com tabela de specs, isso não vale a troca. O laranja voltou a ser gesto, e
ocupa superfície só onde há pouco texto.

## Color Palette

Branco quente como chão, preto quente no texto, e o laranja vivo da marca como gesto —
`#ba3100`, o mesmo de sempre. O que mudou em relação à primeira versão clara do site é
que o **degradê virou parte do sistema**, e não enfeite de manchete.

O laranja é declarado **além do gamut sRGB de propósito**: o recorte que o navegador faz
é o que entrega o tom saturado; o equivalente "correto" dentro do gamut sai apagado.

| Token | Valor | Papel | Contraste |
|---|---|---|---|
| `--chao` | `oklch(0.99 0.004 75)` · `#fdfbf9` | Documento | — |
| `--chao-2` | `oklch(0.967 0.009 68)` · `#f8f3ee` | Seções, cards | — |
| `--fundo` | `oklch(0.938 0.014 66)` · `#f1e9e1` | Poço, hover | — |
| `--tinta` | `oklch(0.22 0.012 50)` | Texto | 16,9:1 no chão · 14,4:1 no pior |
| `--suave` | `oklch(0.48 0.016 50)` | Secundário | 6,4:1 no chão · 5,5:1 no pior |
| `--acao` | `oklch(0.52 0.19 45)` · `#ba3100` | Botão, link, olho, foco | 5,8:1 no chão |

### O degradê como sistema

Ele aparece em quatro lugares, e em todos vale a mesma regra: **a rampa anda dentro de
uma família só de matiz, e o contraste é fechado na parada mais clara dela** — que é
onde ele reprovaria.

| Onde | Rampa | Medido |
|---|---|---|
| Botão primário (`--rampa-acao`) | `0.56 0.19 50` → `0.455 0.185 41` | branco a **4,9:1** no topo |
| Faixa das dúvidas (`--forte`) | `0.56 0.19 50` → `0.47 0.185 42` | branco a **4,9:1** · secundário a **4,6:1** |
| Faixa do Instagram | `0.275 0.028 42` → `--noite` | branco a **14,5:1** |
| Fecho das manchetes | laranja → âmbar, e o inverso na faixa | ver Typography |

Um botão liso e um botão em degradê custam a mesma coisa em código. A diferença é que a
rampa dá volume à peça sem sombra nenhuma — e sombra num site de papel branco é o que
mais o envelhece.

### Chãos por categoria, em duas intensidades

A cor diz de que família é o produto antes de você ler o nome — e ela existe em dois
pesos, porque as duas situações são diferentes.

**Pálidos** (`--areia`, `--bruma`, `--musgo`, `--argila`, `--linho`, `--grafite`), croma
0,024–0,032: servem a seções inteiras e às pílulas do trilho, que se repetem pela página.
Secundário entre 8,6:1 e 8,9:1.

**Vivos** (`--areia-viva`, `--bruma-viva`, …), croma 0,06–0,115: as caixas dos destaques.
São seis blocos aparecendo uma vez só — é onde a cor pode pesar sem cansar.

Dentro de uma caixa viva, **o texto muda junto**. O secundário cinza do resto do site
reprova ali (4,1:1 no pior caso), então cada caixa carrega dois tons próprios: `--olho`
para o rótulo e `--sub` para o miúdo, ambos escuros e no matiz da própria família.
Medidos: preto entre 11,4:1 e 12,4:1, `--sub` entre 5,2:1 e 5,5:1, `--olho` entre
4,9:1 e 5,4:1.

O poço da foto também some dentro delas: um retângulo quase branco no meio da cor viraria
uma janela colada no card, e o aparelho é recortado em alpha — assenta direto no chão
colorido.

A ordem das cinco caixas espalha os matizes de propósito: laranja, azul, damasco, verde,
rosa. Dois tons quentes vizinhos virariam uma mancha só.

### Os dois momentos de cor

A página é clara do começo ao fim, com dois cortes: a **faixa laranja das dúvidas** —
que cai ali porque é o único trecho de texto corrido e o momento em que a pessoa está
mais perto de desistir — e a **faixa noite do Instagram**, escura porque social é outro
lugar, e parecer outro lugar ajuda a entender para onde se está clicando.

O hover escurece um degrau, como manda um site claro. O card de destaque é o único com o
laranja de superfície.

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


# Aliança One

Vitrine digital de uma loja de iPhone, Mac, iPad, Apple Watch e áudio em São Paulo.

Não há checkout nem pagamento: todo caminho do site termina em uma conversa de WhatsApp
com a mensagem **já escrita**, com modelo, cor, capacidade e total. Existe um carrinho,
mas ele é uma lista de compras que vive no navegador do próprio cliente e vira uma única
mensagem — não um caixa. O site leva a pessoa até essa conversa já convencida e já
sabendo o que pedir.

O site tem **dois ramos**. `index.html` é a loja de varejo, de chão laranja. `corporate.html`
é a Aliança Corporate, o braço B2B: chão preto, outra voz, folha de estilo própria. Cada
um tem a sua porta para o outro, e a passagem de um para o outro é uma transição só.

HTML, CSS e JavaScript puros. Sem build, sem dependência, sem framework, sem servidor.
Dois cliques em `index.html` e o site abre.

---

## Rodar

```
# basta abrir o arquivo
xdg-open index.html

# ou, se preferir servir (o site funciona dos dois jeitos)
python3 -m http.server 8000
```

Única conexão externa: a fonte Switzer, na Fontshare. Se ela não carregar, o site cai
para Helvetica/Arial com métricas ajustadas e não pula nem quebra o layout.

## Publicar

Suba a pasta inteira, mantendo a estrutura, em qualquer hospedagem estática — Hostinger,
Vercel, Netlify, GitHub Pages. Não renomeie `assets/`. Se a hospedagem pedir uma "pasta
pública", aponte para a raiz desta pasta.

**Antes de publicar**, duas coisas em `assets/js/data.js`:

1. trocar `whatsapp: '5511999999999'` pelo número real da loja;
2. conferir todos os preços — os que estão aí são estimativas de mercado, colocadas para
   o site não nascer vazio.

## Estrutura

```
index.html                capa, destaques, catálogo completo, compromissos
produto.html              página de produto (abre com ?id=... na URL)
sobre.html                atendimento: quem é a loja, endereço, horário, pagamento
privacidade.html          o que fica guardado no navegador, e um botão que apaga
corporate.html            Aliança Corporate — o braço B2B, de folha e voz próprias
assets/img/               a imagem da capa (webp + png de fallback)
assets/img/produtos/      a imagem oficial de cada modelo, uma por cor
assets/css/style.css      a folha do varejo, em 25 seções numeradas
assets/css/corporate.css  a folha do Corporate, em 18 — nenhum token atravessa
assets/js/data.js         configuração da loja e catálogo — o arquivo do dono
assets/js/aparelho.js     desenho SVG dos aparelhos e a tabela de cores reais
assets/js/app.js          navegação, catálogo, destaques, aviso, estado da loja
assets/js/gesto.js        mola, rubber-band, projeção de momento e arraste
assets/js/carrinho.js     o carrinho: juntar, somar e virar uma mensagem só
assets/js/produto.js      monta a página do produto a partir do ?id=
assets/js/corporate.js    o comportamento da página B2B, só ele e o data.js
assets/js/transicao.js    a bola que cresce entre um ramo e o outro
```

Quatro páginas de varejo, um catálogo. Tudo que aparece na tela — destaques, linhas do
catálogo, página de produto, relacionados, mensagens de WhatsApp — é montado a partir de
`PRODUTOS`, em `data.js`. Adicionar um produto é copiar um bloco e editar. O Corporate
não usa o catálogo: ele vende formato de contrato, não peça avulsa, e só toma do
`data.js` o número do WhatsApp e o nome da loja.

## Decisões que valem saber

- **Toda imagem é do aparelho que está à venda**, uma por cor: 72 arquivos em
  `assets/img/produtos/`, e escolher outra cor troca a imagem com cross-fade. Produto
  novo sem imagem cai num mockup desenhado em SVG, na cor certa, em vez de nascer com
  buraco.
- **A marca é vetor, não imagem.** O "A" da Aliança One reduzido a três polígonos: o vértice
  e os dois blocos da base, com a fenda do logo original. Escrito direto no HTML, nítido
  do favicon ao rodapé.
- **O carrinho tem uma animação com função.** Ao juntar um produto, o mockup na cor
  escolhida voa em arco até o botão do carrinho, e ele pulsa quando a peça chega: as duas
  perguntas de quem toca em adicionar (foi? e foi o quê?) respondidas sem um aviso na
  tela. Com `prefers-reduced-motion`, a peça que voa nem chega a ser criada.
- **Nada é afirmado sem dado.** Sem Instagram preenchido, a faixa some. Sem CNPJ, o
  item some. Sem `precoOficial`, a comparação com o varejo não existe. O site prefere
  ficar calado a preencher com número inventado — a loja não tem endereço físico, e a
  confiança que sustenta a venda não sobrevive a uma prova falsa.
- **Sem cookie nenhum.** Nada de Analytics, pixel ou rastreador. Guarda o carrinho e a marca
  do aviso lido, as duas no navegador do visitante. A faixa na tela conta isso em vez de
  pedir consentimento, e `privacidade.html` explica item por item, com um botão que apaga
  tudo na hora.
- **O laranja é o chão e o branco é o gesto** (`#bf4f04`, o tom do iPhone 17): tudo que
  carregava laranja — botão, link, foco, a faixa forte — trocou de lado. Funciona com
  WCAG AA inteiro porque a hierarquia mudou de mecanismo: num fundo claro o secundário
  se rebaixa escurecendo, e sobre laranja vivo é isso que reprova; aqui os dois níveis
  ficam quase juntos em luz e o que os separa é peso e tamanho.
- **O laranja anterior nunca foi laranja.** `#c44800` era declarado fora do gamut sRGB:
  o canal azul estourava para baixo de zero, o navegador cortava e o matiz caía de 45
  para 36 — chegava ao olho como vermelho queimado. A família inteira foi trazida para
  dentro do gamut, e as duas rampas do site são medidas **nas duas pontas**, não só no
  meio: num degradê o contraste muda ao longo dele, e quem valida no meio publica um
  site que reprova nas bordas.
- **A profundidade é racionada.** Sombra existe só na vitrine e no que se levanta —
  cartões, etiqueta da capa, aviso, chips. Seção, faixa e linha de catálogo continuam
  separadas por cor e, quando ela não basta, por um filete de 1px. No Corporate não há
  uma `box-shadow` sequer: lá a profundidade é tonal.
- **Um gesto físico, na página do produto**: arraste para girar a peça, com rastreio
  1:1, rubber-band no limite (200° de arraste chegam a 33°), projeção de momento na
  soltura e mola criticamente amortecida que assenta em 52 quadros sem passar do alvo.
  Em `assets/js/gesto.js`, sem uma linha de dependência. A capa ficou parada: movimento
  ali competiria com a manchete.
- **Dois ramos, e nenhum token atravessa.** O Corporate é preto absoluto com uma única
  nota de azul — sem verde, sem laranja, sem ouro; encher um botão com o tom de link
  também está fora, porque confunde a hierarquia da ação. O que os dois ramos dividem é
  a família de tipo, a curva de movimento e as formas. Quem chega do laranja precisa
  reconhecer a casa e ver que mudou de ala.
- **A troca de ramo nasce no dedo.** Uma bola da cor da página de **destino** abre a
  partir do ponto do clique e engole a tela; como ela termina exatamente na cor de fundo
  de quem chega, não existe quadro de emenda para aparecer. O raio é a distância até o
  canto mais longe, não a diagonal da tela — que erraria para menos em toda origem fora
  do centro. E a revelação da chegada é animação CSS com `both`, nunca um par de classes
  trocadas pelo JS: se o JS falhar, a página aparece do mesmo jeito.
- **Acessível de verdade:** navegação completa por teclado com foco visível, alvos de
  44px no celular, `prefers-reduced-motion`, `prefers-contrast` e
  `prefers-reduced-transparency` respeitados.
- **Uma curva de movimento só** (`cubic-bezier(0.16, 1, 0.3, 1)`), e só `transform` e
  `opacity`. Nada compete com o preço nem com o botão de comprar.

## Documentação

| Arquivo | Para quem |
|---|---|
| [LEIA-ME.md](LEIA-ME.md) | **O dono da loja.** Trocar o WhatsApp, mexer em produto, preço e cor, o carrinho, os cookies, o logo, publicar. |
| [PRODUCT.md](PRODUCT.md) | Quem é a marca, quem é o cliente e por que o site é assim. |
| [DESIGN.md](DESIGN.md) | Cores medidas, tipografia, espaçamento, componentes e movimento. |

---

Revendedora independente, sem vínculo com a Apple Inc. Apple, iPhone, iPad, Mac e Apple
Watch são marcas registradas da Apple Inc.

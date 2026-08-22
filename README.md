# Aliança One

Vitrine digital de uma loja de iPhone, Mac, iPad, Apple Watch e áudio em São Paulo.

Não há checkout nem pagamento: todo caminho do site termina em uma conversa de WhatsApp
com a mensagem **já escrita**, com modelo, cor, capacidade e total. Existe um carrinho,
mas ele é uma lista de compras que vive no navegador do próprio cliente e vira uma única
mensagem — não um caixa. O site leva a pessoa até essa conversa já convencida e já
sabendo o que pedir.

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
index.html            capa, destaques, catálogo completo, compromissos
produto.html          página de produto (abre com ?id=... na URL)
sobre.html            atendimento: quem é a loja, endereço, horário, pagamento
privacidade.html      o que fica guardado no navegador, e um botão que apaga
assets/img/           a imagem da capa (webp + png de fallback)
assets/img/produtos/  a imagem oficial de cada modelo, uma por cor
assets/css/style.css  folha única, em 23 seções numeradas
assets/js/data.js     configuração da loja e catálogo — o arquivo do dono
assets/js/aparelho.js desenho SVG dos aparelhos e a tabela de cores reais
assets/js/app.js      navegação, catálogo, destaques, aviso, estado da loja
assets/js/gesto.js    mola, rubber-band, projeção de momento e arraste
assets/js/carrinho.js o carrinho: juntar, somar e virar uma mensagem só
assets/js/produto.js  monta a página do produto a partir do ?id=
```

Três páginas, um catálogo. Tudo que aparece na tela — destaques, linhas do catálogo,
página de produto, relacionados, mensagens de WhatsApp — é montado a partir de
`PRODUTOS`, em `data.js`. Adicionar um produto é copiar um bloco e editar.

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
- **Branco quente, preto quente e o laranja vivo** (`#ba3100`) como gesto — abaixo de
  10% da superfície, subindo a chão inteiro só em duas faixas. O degradê é parte do
  sistema, não enfeite: botão, faixa das dúvidas, faixa do Instagram e o fecho das
  manchetes. Em todos, o contraste foi fechado **na parada mais clara da rampa**, que é
  onde ele reprovaria. As 33 combinações do sistema foram medidas, hovers inclusive.
- **Um gesto físico, na página do produto**: arraste para girar a peça, com rastreio
  1:1, rubber-band no limite (200° de arraste chegam a 33°), projeção de momento na
  soltura e mola criticamente amortecida que assenta em 52 quadros sem passar do alvo.
  Em `assets/js/gesto.js`, sem uma linha de dependência. A capa ficou parada: movimento
  ali competiria com a manchete.
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

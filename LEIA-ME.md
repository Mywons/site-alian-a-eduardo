# Aliança One — site da loja

Site estático. Não precisa instalar nada, não precisa de servidor. Dê dois cliques em
`index.html` para abrir no navegador, ou jogue a pasta inteira em qualquer hospedagem
(Hostinger, Vercel, Netlify, GitHub Pages).

```
index.html                capa, destaques, catálogo completo, compromissos
produto.html              página de produto (abre com ?id=... na URL)
sobre.html                atendimento: quem é a loja, endereço, horário
privacidade.html          o que o site guarda no navegador e como apagar
corporate.html            a página para empresas (veja a seção 11)
assets/img/               a foto do aparelho da capa
assets/css/style.css
assets/css/corporate.css  o visual da página para empresas, só dela
assets/js/data.js         ← número do WhatsApp, horários, categorias e produtos
assets/js/aparelho.js     desenho dos aparelhos e a tabela de cores
assets/js/app.js          comportamento comum a todas as páginas
assets/js/gesto.js        o arraste, a inclinação e a física da mola
assets/js/carrinho.js     o carrinho: juntar, somar e virar mensagem
assets/js/produto.js      monta a página do produto
assets/js/corporate.js    o que a página para empresas faz
assets/js/transicao.js    a passagem de uma cara do site para a outra
PRODUCT.md                quem é a marca e por que o site é assim
DESIGN.md                 cores, tipografia, espaçamento e movimento
```

Preço, produto e foto você muda pelo **painel**: abra `admin.html` no site publicado
(ex.: `https://seusite.com.br/admin.html`). Veja a seção 0 logo abaixo.

O resto — WhatsApp, horários, perguntas — fica em **`assets/js/data.js`**.

---

## 0. Painel de administração (`admin.html`)

O painel mostra todos os produtos numa tabela e deixa você:

- **mudar o preço** direto na linha (e o preço do varejo oficial, que gera o "você economiza");
- **reajustar vários preços de uma vez** por percentual, com arredondamento para terminar em 9;
- **ligar/desligar o destaque** de "Os principais" e **mudar a ordem** com as setas;
- **cadastrar produto novo** e **editar** nome, categoria, texto, cores, capacidades e especificações;
- **enviar a foto de cada cor** (PNG, JPG ou WEBP — o painel reduz e converte sozinho);
- **apagar** um produto.

Nada vai para o site até você tocar em **Publicar no site**. Aí o painel grava tudo
num commit só no GitHub, e a hospedagem publica sozinha em cerca de 1 minuto.

### Primeiro acesso: a chave do GitHub

O site não tem servidor, então o painel salva direto no repositório. Para isso ele
precisa de uma chave (token) **sua**:

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
2. **Generate new token**. Nome: "Painel da loja". Escolha a validade.
3. **Repository access → Only select repositories** → o repositório do site.
4. **Permissions → Repository permissions → Contents: Read and write**.
5. Gere, copie e cole no painel. Marque "Lembrar neste aparelho" para não pedir de novo.

A chave fica só no navegador de quem entrou. Não mande para ninguém; quem tiver a
chave consegue mudar o site. Para cortar o acesso, apague o token no GitHub.

Em **Repositório e ramo** você confere para onde o painel grava. O padrão é o ramo
`main` — tem de ser o mesmo ramo que a hospedagem publica.

### Modo de teste

"Abrir em modo de teste" deixa mexer em tudo sem chave. Em vez de publicar, o botão
baixa um `catalogo.js` novo, que você pode subir à mão em `assets/js/`.

### Onde fica o catálogo

Os produtos moram em `assets/js/catalogo.js`, que o painel reescreve inteiro a cada
publicação. Dá para editar à mão, mas mantenha o formato JSON (aspas duplas, sem
comentários dentro da lista). As fotos enviadas vão para
`assets/img/produtos/<id-do-produto>/<cor>.webp`.

---

## 1. Trocar o número do WhatsApp (faça isso primeiro)

Abra `assets/js/data.js`. Primeira linha do bloco `CONFIG`:

```js
whatsapp: '5511999999999',
```

Formato: **código do país + DDD + número, só dígitos, sem espaço, sem traço, sem parêntese.**
Exemplo: `(11) 98765-4321` vira `5511987654321`.

Esse é o único lugar. Trocar aqui muda todos os pontos de contato do site de uma vez:
link do topo, botão da capa, botão de cada produto no catálogo, botão de cada destaque,
botão de comprar da página do produto, bolha fixa no canto, barra de compra do celular
e rodapé.

Enquanto estiver, ajuste também `endereco`, `horario` e `email` no mesmo bloco.
Eles aparecem no rodapé de todas as páginas e na página de atendimento.

**E ajuste `horarios` logo abaixo.** É o mesmo horário, escrito em número, para a página
de atendimento saber dizer "Aberta agora · fecha às 19h" ou "Fechada · abre amanhã às
10h". Domingo é o primeiro da lista, sábado é o último; `null` quer dizer que não abre
naquele dia. Se você mexer no `horario` escrito e esquecer do `horarios` em número, o
aviso na tela vai discordar do texto logo ao lado.

## 2. A mensagem que o cliente envia

O cliente nunca digita nada. Ao tocar em comprar, o WhatsApp abre com o texto pronto:

> Olá! Tenho interesse no **iPhone 17 Pro Max (256GB, Cosmic Orange)** que vi no site da
> Aliança One. Ainda está disponível?

A cor e a capacidade são as que ele selecionou na página do produto. Para mudar o texto,
edite a função `msgProduto` no topo de `assets/js/app.js`.

## 3. Adicionar, editar ou remover um produto

O jeito fácil é o painel (seção 0). À mão: tudo em `assets/js/catalogo.js`, dentro de `PRODUTOS`. Copie um bloco inteiro e edite (em JSON, com aspas duplas):

```js
{
  id: 'iphone-17-pro-max',        // único; vira o endereço: produto.html?id=iphone-17-pro-max
  nome: 'iPhone 17 Pro Max',
  categoria: 'iphone',            // iphone | mac | ipad | watch | audio | acessorios
  linha: 'Cosmic Orange',         // olho laranja acima do nome (2 a 3 palavras)
  preco: 11499,                   // só o número, sem R$ e sem centavos
  destaque: 'principal',          // apague esta linha se não for aparecer em "Os principais"
  chamada: 'A peça central da vitrine.',   // uma frase, aparece no card e na lista
  resumo: 'Titânio, tela de 6,9...',       // parágrafo da página do produto
  cores: ['Cosmic Orange', 'Prata Profundo'],
  capacidades: ['256GB', '512GB', '1TB'],
  specs: [ ['Tela', '6,9" ...'], ['Chip', 'A19 Pro'] ]
}
```

Regras práticas:

- **"Os principais"** mostra os cinco primeiros produtos com `destaque: 'principal'`, na
  ordem em que aparecem na lista. Hoje são: iPhone 17 Pro Max, iPhone 17 Pro, iPhone 17,
  MacBook Air e Apple Watch Ultra 3.
- **Cor com bolinha certa:** as cores conhecidas já têm a bolinha na tonalidade correta,
  e é a mesma cor que pinta o desenho do aparelho. Para uma cor nova, adicione o nome e
  o valor em `CORES_HEX`, no topo de `assets/js/aparelho.js`. Se você esquecer, nada
  quebra: o aparelho recebe o tom neutro da categoria e a bolinha acompanha.
- **Cor ou capacidade com uma opção só não aparece** na página do produto. O site só
  mostra o seletor quando existe escolha de verdade.

## 4. As imagens dos produtos

Cada produto tem a imagem oficial do modelo, **uma por cor**, em:

```
assets/img/produtos/<id-do-produto>/<cor>.webp
```

O nome do arquivo é o nome da cor sem acento e com hífen: `Laranja-cósmico` vira
`laranja-cosmico.webp`. É assim que o site acha a imagem — não há lista de arquivos em
lugar nenhum, o caminho é montado a partir do nome da cor.

**Isso quer dizer que a lista `cores` de cada produto é, na prática, a lista de arquivos
que existem.** Acrescentou uma cor no `data.js`? Ponha o arquivo com o nome
correspondente, ou aquela cor vai aparecer vazia.

### De onde elas vieram

Do repositório aberto `littlebyteorg/apple-device-images`. Atenção a um detalhe que
confunde: ele indexa por **identificador de hardware**, não pelo nome comercial.
`iPhone18,1` é o iPhone 17 Pro; `iPhone17,1` é o **16** Pro. O mapeamento usado foi:

| Produto | Chave no repositório |
|---|---|
| iPhone 17 Pro e Pro Max | `iPhone18,1` |
| iPhone 17 | `iPhone18,3` |
| iPhone Air | `iPhone18,4` |
| iPhone 16 Pro | `iPhone17,1` |
| iPhone 16 | `iPhone17,3` |
| iPhone 15 | `iPhone15,4` |
| MacBook Pro | `Mac15,6` |
| MacBook Air | `Mac16,12` |
| iMac | `Mac16,3` |
| Mac mini | `Mac16,10` |
| iPad Pro | `iPad16,5` |
| iPad Air | `iPad16,1` |
| iPad | `iPad13,18` |
| Watch Ultra | `Watch7,12` |
| Watch Series | `Watch7,19` |
| Watch SE | `Watch6,15` |
| AirPods Pro | `AirPodsPro1,2-usbc-case` |
| AirPods | `AirPods1,5-case` |
| AirPods Max | `AirPodsMax1,1-usbc` |

**Não existe imagem do iPhone 17 Pro Max** no repositório, então ele usa a do 17 Pro.
São o mesmo desenho em tamanhos diferentes, e numa foto recortada isso não aparece —
mas fica registrado aqui para você saber.

Um aviso que vale a pena: são **renders oficiais da Apple**, redistribuídos por esse
repositório sem arquivo de licença. Revendedor usar a imagem oficial do produto que
vende é prática comum do mercado, mas a decisão é sua. Se preferir fotografar os seus
próprios aparelhos, é só trocar os arquivos mantendo os nomes.

### Um produto novo, sem imagem

Não quebra nada. Escreva `fotos: false` no bloco do produto e ele ganha um **desenho**
automático: a silhueta certa da categoria, na cor escolhida. Quando você tiver a
imagem, coloque o arquivo e apague essa linha.

### Bolinha de cor

A tabela `CORES_HEX`, no topo de `assets/js/aparelho.js`, pinta a bolinha ao lado de
cada opção e também o desenho de reserva. Cor nova sem entrada na tabela recebe um tom
neutro da categoria — não quebra, só fica genérica.

### A imagem da capa

É a única que não vem do catálogo: mostra os três acabamentos do modelo anunciado
juntos, e está em `assets/img/`. Para trocá-la, ponha o PNG **recortado, sem fundo**
em `assets/img/`, troque os dois nomes dentro de `<picture>` no `index.html`, o `alt` e
a linha `<link rel="preload">` no topo do arquivo.

## 5. Preços

Os preços em `data.js` são estimativas de mercado, colocadas para o site não nascer vazio.
**Confira e ajuste todos antes de publicar.** O "12x de R$ ..." é calculado sozinho a
partir do `preco`; para mudar o número de parcelas, altere `parcelas: 12` no `CONFIG`.

## 6. Preencha isto ou o bloco some

Três coisas no `CONFIG`, em `assets/js/data.js`, controlam blocos inteiros do site. Se
você não preencher, **o bloco não aparece** — em vez de aparecer errado ou mentindo:

```js
instagram: 'https://instagram.com/',   // troque pelo endereço real do perfil
arroba:    '@aliancaone',              // como o @ aparece escrito
cnpj:      '',                         // vazio = o item some da faixa e do atendimento
```

- **`instagram`** — enquanto estiver nesse valor de exemplo, a **seção escura do
  Instagram some da home** e o link some do rodapé. Troque pelo endereço real e ela
  volta sozinha. Essa seção é o elemento mais importante do site para quem não tem loja
  de rua: é a prova de que a loja existe.
- **`cnpj`** — enquanto vazio, some da faixa de garantias da capa e da página de
  atendimento. Preencha: é o argumento mais forte que você tem contra "e se for golpe?".
- **`atende`** — a região de entrega, mostrada no atendimento.

### Preço do varejo oficial (opcional, por produto)

Em qualquer produto do `PRODUTOS` você pode acrescentar uma linha:

```js
precoOficial: 11499,   // o que a Apple cobra pelo mesmo aparelho
```

Quando ela existe **e é maior que o seu preço**, a página do produto mostra o valor
riscado e quanto o cliente economiza. Quando não existe, não aparece nada. Nenhuma
comparação é inventada pelo site — se você não colocar o número, ele não fala no
assunto.

## 7. As perguntas que travam a compra

O bloco `PERGUNTAS`, em `data.js`, é o acordeão da home. Cada pergunta ali é uma pessoa
a menos precisando mandar mensagem para decidir.

```js
{ p: 'A pergunta, do jeito que o cliente faz',
  r: 'A resposta, do jeito que você responderia no WhatsApp' }
```

Apague um bloco para tirar a pergunta; mova para mudar a ordem.

**Três respostas foram escritas por mim a partir do que dava para deduzir e você
precisa conferir antes de publicar**, porque elas prometem coisas em seu nome:

| Pergunta | O que ela promete hoje |
|---|---|
| Como funciona a garantia de 12 meses? | Que você atende a garantia direto, contada da entrega |
| Vocês aceitam meu usado na troca? | Que você avalia caso a caso e responde com um valor |
| Entregam fora de São Paulo? | Que você envia para todo o Brasil com rastreio |

Se alguma não for verdade, mude o texto ou apague o bloco. Uma promessa quebrada aqui
custa mais que a venda: custa o boca a boca, que é de onde vem metade dos seus clientes.

## 8. O carrinho

O cliente pode juntar vários produtos antes de falar com você. Funciona assim:

- Só a **página do produto** adiciona ao carrinho, porque é lá que ele escolhe cor e
  capacidade. Nos cards e no catálogo, "Comprar" leva para essa página.
- O carrinho fica no navegador **dele**, não em servidor nenhum. Se ele limpar o
  navegador, ele esvazia — e isso está dito na página de privacidade.
- **Abrindo o site com dois cliques, o navegador bloqueia o armazenamento normal.**
  Em `file://` cada arquivo é tratado como um site diferente, e o Chrome derruba o
  `localStorage`. O site percebe isso e passa a guardar o carrinho em `window.name`,
  que acompanha a aba: continua funcionando ao navegar entre as páginas, e some quando
  a aba fecha. Servindo o site por HTTP (ou publicado), volta a valer o normal, que
  sobrevive a fechar o navegador.
- O botão do carrinho fica no canto inferior direito; o do WhatsApp, no esquerdo. São
  ações diferentes e ficam longe uma da outra de propósito.
- Com item dentro, o carrinho sugere **um ou dois acessórios** que combinam com a
  categoria do que já está lá (iPhone puxa MagSafe e AirPods; iPad puxa Pencil e
  teclado). Para mudar essas duplas, edite `ACESSORIO_POR_CATEGORIA` no
  `assets/js/carrinho.js`.
- Ao tocar em "Fechar pedido no WhatsApp", chega para você **uma** mensagem numerada:

  > Olá! Quero fechar este pedido no site da Aliança One:
  >
  > 1. 2× iPhone 17 Pro (256GB, Cosmic Orange) — R$ 19.998
  > 2. AirPods Pro 3 (Branco) — R$ 2.499
  >
  > Total à vista: R$ 32.496

Para mudar esse texto, edite `msgSacola` no topo de `assets/js/carrinho.js`.

## 9. Cookies, ou melhor, a falta deles

O site **não usa cookie nenhum**. Não tem Google Analytics, não tem pixel, não tem
rastreamento. Ele guarda duas coisas no navegador do visitante: o carrinho dele e a marca
de que já leu o aviso. Só isso, e nada sai do aparelho dele.

Por isso a faixa que aparece no rodapé **avisa** em vez de pedir permissão, e a página
`privacidade.html` explica item por item, com um botão que apaga tudo na hora.

Se um dia você colocar Analytics, pixel do Instagram ou qualquer rastreador, **essa
página passa a mentir** — e aí ela precisa ser reescrita e a faixa precisa virar um pedido
de consentimento de verdade, com opção de recusar. Não é detalhe jurídico: é o mesmo
motivo pelo qual o site não inventa depoimento.

## 10. O logo

O logo original (metálico, com o aperto de mão, sobre preto) não entra numa página clara
de fundo branco sem virar uma mancha. O que está no site é o mesmo "A", redesenhado em
vetor: o vértice e os dois blocos da base, com a fenda no meio, em laranja e de uma cor
só. São três `<path>` escritos direto no HTML, sem arquivo de imagem — por isso ele fica
nítido em qualquer tela e some junto com o resto se você trocar a cor da marca.

Ele aparece em três lugares: navegação, favicon (dentro da `<link rel="icon">` de cada
página) e rodapé. Para mudar o desenho, os três precisam mudar juntos.

## 11. A página para empresas (Corporate)

`corporate.html` é a **segunda cara do site**: a mesma loja falando com empresa em vez
de com pessoa. Chão preto, sem catálogo e sem carrinho — ali não se vende peça avulsa,
se vende contrato. O visitante chega nela pelo link "Aliança Corporate" no menu e no
rodapé de todas as páginas, e volta pelo "Loja de varejo".

**Ela usa do `data.js` só duas coisas:** o número do WhatsApp e o nome da loja. Trocar o
número na seção 1 já arruma a página inteira, e não há nada de Corporate para preencher
lá dentro.

**As mensagens são outras.** Quem toca em um botão dessa página não manda "tenho
interesse no iPhone 17 Pro" — manda o **porte da empresa**, que é a primeira coisa que
você perguntaria:

> Olá! Vim pela página da Aliança One Corporate. Tenho entre 10 e 50 aparelhos para
> equipar e queria falar sobre o formato Escala.

São quatro textos, no começo de `assets/js/corporate.js`, no bloco `MENSAGENS`: um geral
e um para cada formato (Equipe, Escala, Frota). Mude o texto entre aspas e pronto.

**O resto do texto está escrito no `corporate.html`**, não no `data.js` — inclusive os
três formatos e o que cada um inclui. Abra o arquivo em um editor de texto e procure a
frase que quer trocar; ela está lá escrita por extenso.

> ⚠️ **Leia a lista de cada formato antes de publicar.** Está prometido por escrito:
> nota fiscal no CNPJ, garantia de 12 meses respondida por você, entrega em mãos na
> Grande São Paulo e consultor no WhatsApp em horário comercial. É promessa de contrato
> com empresa — se algum desses itens não for verdade hoje, apague a linha. A página
> inteira do site funciona assim: **melhor não dizer do que dizer o que não se cumpre.**

De propósito, a página não tem preço nenhum. O valor sai do diagnóstico, e um número
inventado aqui custaria a conversa inteira.

## 12. Publicar

Suba a pasta inteira, mantendo a estrutura. Não renomeie `assets/`.
Se a hospedagem pedir uma "pasta pública" ou "raiz do site", aponte para esta pasta.

---

## Decisões que valem saber

- **Fonte**: a SF Pro do próprio aparelho (iPhone, Mac) e, para quem não tem, a Inter do
  Google Fonts. Se a internet do visitante bloquear, o site cai para Helvetica/Arial sem
  quebrar o layout.
- **A bolha do WhatsApp** é só uma bolinha verde com o ícone. Não abre cartão, não
  aparece sozinha e não interrompe ninguém: é um botão. Na página do produto ela já
  carrega a mensagem daquele produto.
- **O carrinho** guarda o que o cliente juntou mesmo se ele fechar a aba, porque mora no
  navegador dele. Ninguém do lado da loja vê o carrinho de ninguém — ele só existe quando
  chega como mensagem.
- **O desenho do aparelho**: um SVG por produto, sem arquivo de imagem e sem download.
  Carrega instantâneo, fica nítido em qualquer tela e muda de cor em cross-fade.
- **Contraste**: todo texto passa em WCAG AA, e passa também quando o cursor está em
  cima — o hover escurece o card, e é nesse fundo, o pior do site, que as cores foram
  fechadas. O laranja funciona como texto sobre branco (5,9:1) e como botão com texto
  branco (5,9:1), com o mesmo valor nos dois sentidos.
- **Movimento**: quem tem "reduzir movimento" ligado recebe o site sem deslocamentos,
  só com transições curtas de opacidade.
- **Teclado**: dá para navegar o site inteiro sem mouse, com foco visível em laranja.
- **Celular**: na página do produto, uma barra de compra aparece no rodapé assim que o
  botão principal sai da tela, e a bolha do WhatsApp sobe para não colidir com ela. A
  gaveta do carrinho sobe do rodapé em vez de entrar pela direita: é de onde o polegar vem.

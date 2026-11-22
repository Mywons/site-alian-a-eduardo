/* =============================================================
   ALIANÇA — configuração da loja e catálogo
   -------------------------------------------------------------
   TROQUE O NÚMERO DE WHATSAPP NA LINHA ABAIXO E ACABOU.
   Formato: código do país + DDD + número, só dígitos.
   Ex.: (11) 98765-4321  ->  5511987654321
   ============================================================= */

const CONFIG = {
  whatsapp: '5511999999999',
  nome: 'Aliança One',
  email: 'contato@aliancastore.com.br',
  instagram: 'https://instagram.com/',
  arroba: '@aliancaone',
  cnpj: '',                       // só dígitos ou formatado; vazio = não aparece
  atende: '',
  horario: 'Segunda a sábado, 10h às 19h',
  parcelas: 12,

  /* Ano em que a loja começou. Alimenta o bloco "Quem somos" da página
     Corporate — numa venda para empresa alguém sempre pergunta há
     quanto tempo a loja existe. Vazio = o fato não é renderizado, em
     vez de aparecer com um número inventado. Ex.: '2019'. */
  desde: '',

  /* Horário de ATENDIMENTO, em número: é o que faz a página dizer
     "Atende agora" ou "Volta a atender amanhã às 10h". Não é horário
     de loja — a Aliança One não tem balcão, vende por WhatsApp e
     entrega. Domingo é 0, segunda é 1, e assim por diante.
     [abre, fecha] em hora cheia; null quando não atende naquele dia. */
  horarios: [
    null,        // domingo
    [10, 19],    // segunda
    [10, 19],    // terça
    [10, 19],    // quarta
    [10, 19],    // quinta
    [10, 19],    // sexta
    [10, 19]     // sábado
  ]
};

/* -------------------------------------------------------------
   PERGUNTAS — as objeções que travam a compra
   -------------------------------------------------------------
   Cada pergunta não respondida aqui é uma pessoa que não manda
   mensagem. Responda como você responderia no WhatsApp: curto,
   direto, sem promessa que você não vai conseguir cumprir.

   Para tirar uma pergunta, apague o bloco. Para mudar a ordem,
   mova o bloco. A ordem é a ordem em que aparecem na página.
   ------------------------------------------------------------- */

const PERGUNTAS = [
  {
    p: 'Onde vocês ficam?',
    r: 'Somos de São Paulo e atendemos pelo WhatsApp. Prazo e forma de entrega '
     + 'são combinados com você na conversa, antes do pagamento.'
  },
  {
    p: 'O aparelho é original e lacrado?',
    r: 'Sim. Aparelho original, novo e lacrado de fábrica.'
  },
  {
    p: 'Vem nota fiscal?',
    r: 'Vem, no seu nome e no CNPJ da loja, em toda venda. A nota é o que garante '
     + 'a procedência do aparelho e o que você usa se precisar da Apple depois.'
  },
  {
    p: 'Como funciona a garantia de 12 meses?',
    r: 'São 12 meses respondidos pela Aliança One, contados da compra. Deu problema '
     + 'de fábrica, você fala com a gente pelo mesmo WhatsApp da compra.'
  },
  {
    p: 'Como eu pago?',
    r: 'Pix, com desconto à vista, ou cartão de crédito em até 12x.'
  },
  {
    p: 'Vocês aceitam meu usado na troca?',
    r: 'Avaliamos caso a caso. Mande o modelo, a capacidade e o estado do seu '
     + 'aparelho que a gente responde com o valor de abatimento.'
  }
];

/* -------------------------------------------------------------
   CATEGORIAS — a ordem daqui é a ordem dos filtros do catálogo
   ------------------------------------------------------------- */

const CATEGORIAS = [
  { id: 'todos',      nome: 'Tudo' },
  { id: 'iphone',     nome: 'iPhone' },
  { id: 'mac',        nome: 'Mac' },
  { id: 'ipad',       nome: 'iPad' },
  { id: 'watch',      nome: 'Watch' },
  { id: 'audio',      nome: 'Áudio' },
  { id: 'acessorios', nome: 'Acessórios' }
];

/* -------------------------------------------------------------
   PRODUTOS
   Para adicionar um produto, copie um bloco inteiro e edite.
   O campo "id" precisa ser único: ele é o endereço da página
   do produto (produto.html?id=SEU-ID).

   -----------------------------------------------------------
   VISTAS EXTRAS — a foto de lado, de costas, da caixa
   -----------------------------------------------------------
   A galeria da página do produto mostra a foto da COR escolhida,
   lendo `assets/img/produtos/<id>/<cor>.webp`, e trocar de cor troca
   essa foto no lugar. Para acrescentar ÂNGULOS — perfil, traseira,
   tela ligada, o que houver — basta listá-los aqui: é isso que faz
   as setas e os pontos NASCEREM. Sem este campo não há galeria para
   passar, e a página mostra a foto sozinha.

     vistas: [
       { src: 'assets/img/produtos/iphone-17-pro-max/costas.webp',
         legenda: 'De costas' },
       { src: 'assets/img/produtos/iphone-17-pro-max/lado.webp',
         legenda: 'De perfil' }
     ]

   `legenda` é o que aparece embaixo da foto e no rótulo do ponto.
   `src` é o caminho do arquivo, relativo à raiz do site.

   Nenhum produto usa este campo hoje, e o motivo é que a foto não
   existe: os bancos de render da Apple que costumam alimentar
   catálogos publicam UM frontal por cor e mais nada. Perfil e
   traseira saem de fotografar o aparelho — e no dia em que
   saírem, é só listar aqui. Nada de código muda.
   ------------------------------------------------------------- */

/* Os PRODUTOS moram em assets/js/catalogo.js e são editados pelo
   painel admin.html — preço, foto, cor, capacidade, destaque. */

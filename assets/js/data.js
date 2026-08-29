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
  atende: 'São Paulo e todo o Brasil',
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
    r: 'Somos de São Paulo e trabalhamos por WhatsApp e entrega, sem loja de rua. '
     + 'Na capital a entrega é em mãos, no mesmo dia, e você confere o lacre na hora. '
     + 'Para o resto do Brasil enviamos com rastreio.'
  },
  {
    p: 'O aparelho é original e lacrado?',
    r: 'Sim. Aparelho lacrado, de fábrica, com a caixa aberta por você na entrega. '
     + 'Se o lacre não estiver íntegro, a compra não acontece.'
  },
  {
    p: 'Vem nota fiscal?',
    r: 'Vem, no seu nome e no CNPJ da loja, em toda venda. A nota é o que garante '
     + 'a procedência do aparelho e o que você usa se precisar da Apple depois.'
  },
  {
    p: 'Como funciona a garantia de 12 meses?',
    r: 'São 12 meses respondidos pela Aliança One, contados da entrega. Deu problema '
     + 'de fábrica, você fala com a gente pelo mesmo WhatsApp da compra.'
  },
  {
    p: 'Como eu pago?',
    r: 'Pix, com desconto à vista; cartão em até 12x; ou dinheiro na entrega, '
     + 'combinado antes. Em São Paulo dá para pagar só depois de conferir o aparelho.'
  },
  {
    p: 'Vocês aceitam meu usado na troca?',
    r: 'Avaliamos caso a caso. Mande o modelo, a capacidade e o estado do seu '
     + 'aparelho que a gente responde com o valor de abatimento.'
  },
  {
    p: 'Entregam fora de São Paulo?',
    r: 'Sim, para todo o Brasil, com rastreio e embalagem reforçada. Em São Paulo '
     + 'a entrega sai no mesmo dia; fora, o prazo depende do destino.'
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

const PRODUTOS = [
  {
    id: 'iphone-17-pro-max',
    nome: 'iPhone 17 Pro Max',
    categoria: 'iphone',
    linha: 'Cosmic Orange',
    preco: 11499,
    destaque: 'principal',
    chamada: 'A peça central da vitrine.',
    resumo: 'Titânio, tela de 6,9 polegadas a 120Hz e a maior autonomia que a Apple já colocou em um iPhone. O laranja Cosmic é a cor da temporada e a que mais sai daqui.',
    cores: ['Laranja-cósmico', 'Azul-profundo', 'Prateado'],
    capacidades: ['256GB', '512GB', '1TB'],
    specs: [
      ['Tela', '6,9" Super Retina XDR · ProMotion 120Hz'],
      ['Chip', 'A19 Pro'],
      ['Câmeras', 'Tripla 48MP · teleobjetiva 8x'],
      ['Bateria', 'Até 39h de vídeo'],
      ['Material', 'Titânio de grau aeroespacial']
    ]
  },
  {
    id: 'iphone-17-pro',
    nome: 'iPhone 17 Pro',
    categoria: 'iphone',
    linha: 'Cosmic Orange',
    preco: 9999,
    destaque: 'principal',
    chamada: 'Tudo do Pro Max, no tamanho de uma mão.',
    resumo: 'O mesmo chip A19 Pro e o mesmo sistema de câmeras do Pro Max em um corpo de 6,3 polegadas. Para quem quer o topo de linha sem abrir mão de usar o telefone com uma mão só.',
    cores: ['Laranja-cósmico', 'Azul-profundo', 'Prateado'],
    capacidades: ['256GB', '512GB', '1TB'],
    specs: [
      ['Tela', '6,3" Super Retina XDR · ProMotion 120Hz'],
      ['Chip', 'A19 Pro'],
      ['Câmeras', 'Tripla 48MP · teleobjetiva 8x'],
      ['Bateria', 'Até 33h de vídeo'],
      ['Material', 'Titânio de grau aeroespacial']
    ]
  },
  {
    id: 'iphone-17',
    nome: 'iPhone 17',
    categoria: 'iphone',
    linha: 'Linha 2025',
    preco: 7499,
    destaque: 'principal',
    chamada: 'O ponto exato entre preço e desejo.',
    resumo: 'Tela de 120Hz que antes era exclusividade do Pro, câmera principal de 48MP e o chip A19. É o modelo que mais recomendamos para quem está trocando de um iPhone 12 ou 13.',
    cores: ['Lavanda', 'Azul-névoa', 'Sálvia', 'Preto', 'Branco'],
    capacidades: ['256GB', '512GB'],
    specs: [
      ['Tela', '6,3" Super Retina XDR · ProMotion 120Hz'],
      ['Chip', 'A19'],
      ['Câmeras', 'Dupla 48MP'],
      ['Bateria', 'Até 30h de vídeo'],
      ['Material', 'Alumínio e Ceramic Shield 2']
    ]
  },
  {
    id: 'iphone-air',
    nome: 'iPhone Air',
    categoria: 'iphone',
    linha: '5,6 mm de espessura',
    preco: 8999,
    chamada: '5,6 milímetros.',
    resumo: 'O iPhone mais fino já feito, em titânio, sem parecer frágil na mão. Quem pega uma vez costuma não querer devolver.',
    cores: ['Azul-céu', 'Dourado-claro', 'Branco-nuvem', 'Preto-espacial'],
    capacidades: ['256GB', '512GB', '1TB'],
    specs: [
      ['Tela', '6,5" Super Retina XDR · ProMotion 120Hz'],
      ['Chip', 'A19 Pro'],
      ['Espessura', '5,6 mm'],
      ['Câmera', '48MP Fusion'],
      ['Material', 'Titânio']
    ]
  },
  {
    id: 'iphone-16-pro',
    nome: 'iPhone 16 Pro',
    categoria: 'iphone',
    linha: 'Geração anterior',
    preco: 6999,
    chamada: 'O topo de linha do ano passado, pelo preço de um intermediário.',
    resumo: 'Continua sendo um telefone excepcional: titânio, 120Hz, câmera de 48MP com teleobjetiva. A geração anterior é sempre a compra mais inteligente da vitrine.',
    cores: ['Titânio-deserto', 'Titânio-natural', 'Titânio-preto', 'Titânio-branco'],
    capacidades: ['128GB', '256GB', '512GB'],
    specs: [
      ['Tela', '6,3" Super Retina XDR · ProMotion 120Hz'],
      ['Chip', 'A18 Pro'],
      ['Câmeras', 'Tripla 48MP · teleobjetiva 5x'],
      ['Bateria', 'Até 27h de vídeo'],
      ['Material', 'Titânio']
    ]
  },
  {
    id: 'iphone-16',
    nome: 'iPhone 16',
    categoria: 'iphone',
    linha: 'Geração anterior',
    preco: 5299,
    chamada: 'Entrada na linha atual sem parecer entrada.',
    resumo: 'Botão de Controle da Câmera, chip A18 e as cores mais bonitas que a Apple lançou em anos. Uma escolha segura para presente.',
    cores: ['Ultramarino', 'Azul-petróleo', 'Rosa', 'Preto', 'Branco'],
    capacidades: ['128GB', '256GB'],
    specs: [
      ['Tela', '6,1" Super Retina XDR'],
      ['Chip', 'A18'],
      ['Câmeras', 'Dupla 48MP'],
      ['Bateria', 'Até 22h de vídeo'],
      ['Material', 'Alumínio']
    ]
  },
  {
    id: 'iphone-15',
    nome: 'iPhone 15',
    categoria: 'iphone',
    linha: 'Custo-benefício',
    preco: 4199,
    chamada: 'O primeiro iPhone com USB-C.',
    resumo: 'Ainda recebe atualizações por anos, já usa USB-C e tem a Dynamic Island. O melhor primeiro iPhone que existe hoje.',
    cores: ['Azul', 'Rosa', 'Amarelo', 'Verde', 'Preto'],
    capacidades: ['128GB', '256GB'],
    specs: [
      ['Tela', '6,1" Super Retina XDR'],
      ['Chip', 'A16 Bionic'],
      ['Câmeras', 'Dupla 48MP'],
      ['Bateria', 'Até 20h de vídeo'],
      ['Conexão', 'USB-C']
    ]
  },

  {
    id: 'macbook-pro-14-m5',
    nome: 'MacBook Pro 14" M5',
    categoria: 'mac',
    linha: 'Trabalho pesado',
    preco: 18999,
    chamada: 'A máquina de quem edita, compila e renderiza.',
    resumo: 'Tela Liquid Retina XDR com nano-textura opcional, silêncio absoluto em uso normal e bateria que atravessa o dia inteiro de trabalho fora de casa.',
    cores: ['Preto-espacial', 'Prateado'],
    capacidades: ['16GB / 512GB', '24GB / 1TB', '32GB / 1TB'],
    specs: [
      ['Tela', '14,2" Liquid Retina XDR · 120Hz'],
      ['Chip', 'Apple M5'],
      ['Bateria', 'Até 24h'],
      ['Portas', '3× Thunderbolt 5, HDMI, SDXC'],
      ['Peso', '1,55 kg']
    ]
  },
  {
    id: 'macbook-air-13-m4',
    nome: 'MacBook Air 13" M4',
    categoria: 'mac',
    linha: 'Sem ventoinha',
    preco: 10499,
    destaque: 'principal',
    chamada: 'Leve o suficiente para você esquecer que está na mochila.',
    resumo: 'Sem ventoinha, sem barulho, 18 horas de bateria e potência de sobra para tudo que não seja edição de vídeo profissional. É o Mac que mais vendemos.',
    cores: ['Azul-céu', 'Estelar', 'Prateado', 'Meia-noite'],
    capacidades: ['16GB / 256GB', '16GB / 512GB', '24GB / 1TB'],
    specs: [
      ['Tela', '13,6" Liquid Retina'],
      ['Chip', 'Apple M4'],
      ['Bateria', 'Até 18h'],
      ['Peso', '1,24 kg'],
      ['Refrigeração', 'Passiva, sem ventoinha']
    ]
  },
  {
    id: 'imac-24-m4',
    nome: 'iMac 24" M4',
    categoria: 'mac',
    linha: 'Sete cores',
    preco: 13499,
    chamada: 'Um computador que você deixa à mostra.',
    resumo: 'Sete cores, 11,5 milímetros de espessura e uma tela 4,5K que faz qualquer sala de casa parecer um estúdio.',
    cores: ['Laranja', 'Azul', 'Rosa', 'Roxo', 'Verde', 'Amarelo', 'Prateado'],
    capacidades: ['16GB / 256GB', '16GB / 512GB'],
    specs: [
      ['Tela', '24" Retina 4,5K'],
      ['Chip', 'Apple M4'],
      ['Câmera', 'Center Stage 12MP'],
      ['Som', '6 alto-falantes com Spatial Audio'],
      ['Espessura', '11,5 mm']
    ]
  },
  {
    id: 'mac-mini-m4',
    nome: 'Mac mini M4',
    categoria: 'mac',
    linha: 'Cabe na palma',
    preco: 6299,
    chamada: 'O Mac mais barato é também o mais surpreendente.',
    resumo: 'Cabe na palma da mão, usa o mesmo chip do MacBook Air e liga no monitor que você já tem. Entrada perfeita no ecossistema.',
    cores: ['Prateado'],
    capacidades: ['16GB / 256GB', '16GB / 512GB', '24GB / 1TB'],
    specs: [
      ['Chip', 'Apple M4'],
      ['Tamanho', '12,7 × 12,7 cm'],
      ['Portas', '2× USB-C frontais, 3× Thunderbolt 4'],
      ['Rede', 'Gigabit Ethernet'],
      ['Consumo', 'Menos que uma lâmpada']
    ]
  },

  {
    id: 'ipad-pro-13-m5',
    nome: 'iPad Pro 13" M5',
    categoria: 'ipad',
    linha: 'Tela tandem OLED',
    preco: 14999,
    chamada: 'A melhor tela que a Apple já fabricou.',
    resumo: 'Duas camadas de OLED sobrepostas para um preto real com brilho de HDR. Fino a ponto de parecer impossível, potente a ponto de substituir o notebook de muita gente.',
    cores: ['Preto-espacial', 'Prateado'],
    capacidades: ['256GB', '512GB', '1TB'],
    specs: [
      ['Tela', '13" Ultra Retina XDR tandem OLED'],
      ['Chip', 'Apple M5'],
      ['Espessura', '5,1 mm'],
      ['Compatível', 'Apple Pencil Pro, Magic Keyboard'],
      ['Conexão', 'Thunderbolt / USB 4']
    ]
  },
  {
    id: 'ipad-air-11-m3',
    nome: 'iPad Air 11" M3',
    categoria: 'ipad',
    linha: 'O equilíbrio',
    preco: 7299,
    chamada: 'Potência de Mac em uma prancheta.',
    resumo: 'Roda tudo com folga, aceita Apple Pencil Pro e custa metade do Pro. Para desenho, estudo e consumo de conteúdo, é mais iPad do que a maioria precisa.',
    cores: ['Azul', 'Roxo', 'Estelar', 'Cinza-espacial'],
    capacidades: ['128GB', '256GB', '512GB'],
    specs: [
      ['Tela', '11" Liquid Retina'],
      ['Chip', 'Apple M3'],
      ['Câmera', 'Center Stage horizontal'],
      ['Compatível', 'Apple Pencil Pro'],
      ['Peso', '460 g']
    ]
  },
  {
    id: 'ipad-11',
    nome: 'iPad 11"',
    categoria: 'ipad',
    linha: 'Entrada',
    preco: 3799,
    chamada: 'O tablet da casa.',
    resumo: 'Para a criança estudar, para assistir na cama, para a receita na cozinha. Simples, resistente e barato o suficiente para circular pela casa sem susto.',
    cores: ['Azul', 'Rosa', 'Amarelo', 'Prateado'],
    capacidades: ['128GB', '256GB'],
    specs: [
      ['Tela', '11" Liquid Retina'],
      ['Chip', 'A16'],
      ['Bateria', 'Até 10h'],
      ['Compatível', 'Apple Pencil (USB-C)'],
      ['Peso', '477 g']
    ]
  },

  {
    id: 'watch-ultra-3',
    nome: 'Apple Watch Ultra 3',
    categoria: 'watch',
    linha: 'Titânio 49mm',
    preco: 9299,
    destaque: 'principal',
    chamada: 'Feito para o mar, usado no escritório.',
    resumo: 'Mergulho até 100 metros, satélite para emergência fora de área e 42 horas de bateria. O relógio mais bonito da linha, mesmo para quem nunca vai mergulhar.',
    cores: ['Titânio natural', 'Titânio preto'],
    capacidades: ['49mm GPS + Cellular'],
    specs: [
      ['Caixa', 'Titânio 49mm'],
      ['Tela', 'Até 3000 nits'],
      ['Bateria', 'Até 42h · 72h em economia'],
      ['Resistência', '100m · norma EN13319'],
      ['Extra', 'Mensagem via satélite']
    ]
  },
  {
    id: 'watch-series-11',
    nome: 'Apple Watch Series 11',
    categoria: 'watch',
    linha: 'O clássico',
    preco: 5199,
    chamada: 'Saúde no pulso, o dia inteiro.',
    resumo: 'Monitoramento de sono, alerta de hipertensão, ECG e uma tela que não apaga. É o relógio que mais muda o hábito de quem compra.',
    cores: ['Preto brilhante', 'Ouro rosé', 'Prateado', 'Cinza-espacial'],
    capacidades: ['42mm', '46mm'],
    specs: [
      ['Tela', 'Always-On Retina LTPO3'],
      ['Bateria', 'Até 24h'],
      ['Saúde', 'ECG, oxigênio, temperatura'],
      ['Resistência', '50m'],
      ['Carregamento', 'Rápido: 0 a 80% em 30 min']
    ]
  },
  {
    id: 'watch-se-3',
    nome: 'Apple Watch SE 3',
    categoria: 'watch',
    linha: 'Primeiro relógio',
    preco: 2899,
    chamada: 'Tudo que importa, metade do preço.',
    resumo: 'Notificações, treinos, detecção de queda e Apple Pay. Falta pouca coisa em relação ao Series e sobra diferença no bolso.',
    cores: ['Meia-noite', 'Estelar', 'Prateado'],
    capacidades: ['40mm', '44mm'],
    specs: [
      ['Tela', 'Retina'],
      ['Bateria', 'Até 18h'],
      ['Segurança', 'Detecção de queda e de acidente'],
      ['Resistência', '50m'],
      ['Pagamento', 'Apple Pay']
    ]
  },

  {
    id: 'airpods-pro-3',
    nome: 'AirPods Pro 3',
    categoria: 'audio',
    linha: 'Cancelamento de ruído',
    preco: 2499,
    destaque: 'principal',
    chamada: 'O silêncio virou item de luxo.',
    resumo: 'O melhor cancelamento de ruído do mercado, medição de batimentos durante o treino e tradução ao vivo. Cabem no bolso da calça e mudam o metrô inteiro.',
    cores: ['Branco'],
    capacidades: ['Único'],
    specs: [
      ['Áudio', 'Cancelamento adaptativo'],
      ['Bateria', 'Até 8h · 30h com o estojo'],
      ['Sensores', 'Frequência cardíaca'],
      ['Resistência', 'IP57 · suor e chuva'],
      ['Extra', 'Tradução ao vivo']
    ]
  },
  {
    id: 'airpods-4',
    nome: 'AirPods 4',
    categoria: 'audio',
    linha: 'Formato aberto',
    preco: 1499,
    chamada: 'Para quem odeia ponteira de silicone.',
    resumo: 'Formato aberto, agora com cancelamento de ruído — coisa que ninguém achava possível sem vedação. Áudio espacial incluso.',
    cores: ['Branco'],
    capacidades: ['Com ANC', 'Sem ANC'],
    specs: [
      ['Formato', 'Aberto, sem ponteira'],
      ['Bateria', 'Até 5h · 30h com o estojo'],
      ['Áudio', 'Espacial personalizado'],
      ['Resistência', 'IP54'],
      ['Estojo', 'USB-C']
    ]
  },
  {
    id: 'airpods-max',
    nome: 'AirPods Max',
    categoria: 'audio',
    linha: 'Headphone over-ear',
    preco: 4999,
    chamada: 'Alumínio, malha e uma cúpula de silêncio.',
    resumo: 'Peso e acabamento de equipamento profissional, com a conveniência da Apple. Para quem escuta música sentado, de olhos fechados.',
    cores: ['Meia-noite', 'Estelar', 'Roxo', 'Laranja', 'Azul'],
    capacidades: ['Único'],
    specs: [
      ['Drivers', '40mm dinâmicos sob medida'],
      ['Bateria', 'Até 20h com ANC'],
      ['Áudio', 'Espacial com rastreio de cabeça'],
      ['Material', 'Alumínio anodizado e malha'],
      ['Conexão', 'USB-C com áudio lossless']
    ]
  },

  {
    id: 'apple-pencil-pro',
    nome: 'Apple Pencil Pro',
    categoria: 'acessorios',
    linha: 'Para iPad',
    preco: 1399,
    chamada: 'Gira na mão como um pincel de verdade.',
    resumo: 'Sensor de rotação, aperto para trocar de ferramenta e resposta tátil. Quem desenha percebe a diferença nos primeiros dez segundos.',
    cores: ['Branco'],
    capacidades: ['Único'],
    specs: [
      ['Sensores', 'Rotação, aperto e pressão'],
      ['Resposta', 'Feedback tátil'],
      ['Pareamento', 'Magnético no iPad'],
      ['Extra', 'Buscar via app Buscar'],
      ['Compatível', 'iPad Pro M4+ e iPad Air M2+']
    ]
  },
  {
    id: 'magic-keyboard-ipad',
    nome: 'Magic Keyboard para iPad Pro',
    categoria: 'acessorios',
    linha: 'Teclado com trackpad',
    preco: 3199,
    chamada: 'Transforma o iPad em notebook em um clique.',
    resumo: 'Trackpad com clique real, fileira de teclas de função e apoio flutuante em alumínio. A conversão mais rápida de tablet para máquina de trabalho.',
    cores: ['Preto'],
    capacidades: ['11"', '13"'],
    specs: [
      ['Trackpad', 'Vidro com haptics'],
      ['Teclas', 'Retroiluminadas'],
      ['Porta', 'USB-C de passagem'],
      ['Estrutura', 'Alumínio'],
      ['Proteção', 'Frente e verso']
    ]
  },
  {
    id: 'magsafe-charger',
    nome: 'Carregador MagSafe 25W',
    categoria: 'acessorios',
    linha: 'Original Apple',
    preco: 499,
    chamada: 'Encaixa sozinho, no lugar certo.',
    resumo: 'Ímã na posição exata, carga rápida de 25W nos modelos compatíveis e cabo trançado de dois metros. O acessório que todo cliente acaba levando junto.',
    cores: ['Branco'],
    capacidades: ['1m', '2m'],
    specs: [
      ['Potência', 'Até 25W'],
      ['Encaixe', 'Alinhamento magnético'],
      ['Cabo', 'Trançado'],
      ['Compatível', 'iPhone 12 em diante'],
      ['Origem', 'Original Apple, lacrado']
    ]
  }
];

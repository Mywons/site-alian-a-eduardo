/* =============================================================
   LOJA — eventos e preço automático (gerado pelo painel)
   -------------------------------------------------------------
   Reescrito pelo painel (admin.html) e pelo robô diário de preços.
   Mantenha o formato JSON se editar à mão.
   ============================================================= */
const LOJA = {
  "precificacao": {
    "automatico": false,
    "dolar": 5.89,
    "dolarAjuste": 0,
    "dolarEm": "2026-11-19",
    "custosExtras": 0,
    "margem": {
      "tipo": "%",
      "valor": 15
    },
    "arredondar": "99",
    "limiteVariacao": 8,
    "ultimaExecucao": "",
    "alertas": []
  },
  "eventos": [
    {
      "id": "black-friday-2026",
      "tema": "black-friday",
      "titulo": "Black Friday Aliança",
      "subtitulo": "Os menores preços do ano em iPhone, Mac e AirPods. Com nota fiscal e garantia, como sempre.",
      "faixa": "Black Friday Aliança|Até 12x sem juros|Nota fiscal e garantia de 12 meses",
      "inicio": "2026-11-23",
      "fim": "2026-11-30",
      "ativo": false
    },
    {
      "id": "natal-2026",
      "tema": "natal",
      "titulo": "O presente certo é Apple.",
      "subtitulo": "Presentes Apple para quem você ama, em até 12x sem juros.",
      "faixa": "Feliz Natal|Nota fiscal no seu nome|Até 12x sem juros",
      "inicio": "2026-12-01",
      "fim": "2026-12-25",
      "ativo": false
    }
  ],
  "site": {
    "faixa": [
      "Até 12x sem juros no cartão",
      "Desconto à vista no Pix",
      "Nota fiscal no seu nome",
      "Garantia de 12 meses",
      "Aparelhos lacrados"
    ],
    "cartazes": [
      {
        "id": "iphone-18-pro",
        "ativo": true,
        "estilo": "estreia",
        "olho": "Novo",
        "titulo": "iPhone 18 Pro",
        "fecho": "",
        "frase": "O novo topo de linha. Reserve o seu.",
        "fatos": "Lacrado|Nota fiscal no seu nome|Até 12x sem juros",
        "botao": {
          "texto": "Comprar",
          "tipo": "link",
          "valor": "produto.html?id=iphone-18-pro"
        },
        "link": {
          "texto": "Reservar pelo WhatsApp",
          "tipo": "whatsapp",
          "valor": "Olá! Vim pelo site da Aliança One e quero reservar o iPhone 18 Pro."
        },
        "imagem": "assets/img/iphone-18-pro.webp",
        "alt": "Dois iPhone 18 Pro em vinho, um de costas com a câmera tripla e outro de frente com a tela acesa."
      },
      {
        "id": "iphone-duo",
        "ativo": true,
        "estilo": "perola",
        "olho": "Novo",
        "titulo": "iPhone Duo",
        "fecho": "",
        "frase": "Abre. Dobra. Cabe no bolso.",
        "fatos": "Lacrado|Nota fiscal no seu nome|Até 12x sem juros",
        "botao": {
          "texto": "Comprar",
          "tipo": "link",
          "valor": "produto.html?id=iphone-duo"
        },
        "link": {
          "texto": "Reservar pelo WhatsApp",
          "tipo": "whatsapp",
          "valor": "Olá! Vim pelo site da Aliança One e quero reservar o iPhone Duo."
        },
        "imagem": "assets/img/iphone-duo.webp",
        "alt": "iPhone Duo branco entreaberto: de um lado a câmera dupla, do outro a tela acesa."
      },
      {
        "id": "macbook-air",
        "ativo": true,
        "estilo": "claro",
        "olho": "MacBook Air 13\" M4",
        "titulo": "Leve na mochila.",
        "fecho": "Pesado no trabalho.",
        "frase": "Chip M4, 18 horas de bateria e zero barulho.",
        "fatos": "",
        "botao": {
          "texto": "Ver o MacBook Air",
          "tipo": "link",
          "valor": "produto.html?id=macbook-air-13-m4"
        },
        "link": {
          "texto": "Todos os Mac",
          "tipo": "link",
          "valor": "index.html?cat=mac#catalogo"
        },
        "imagem": "assets/img/produtos/macbook-air-13-m4/azul-ceu.webp",
        "alt": "MacBook Air na cor Azul-céu."
      },
      {
        "id": "pagamento",
        "ativo": true,
        "estilo": "laranja",
        "olho": "Pagamento",
        "titulo": "Até 12x sem juros.",
        "fecho": "Ou desconto no Pix.",
        "frase": "Parcele no cartão ou pague à vista no Pix com desconto.",
        "fatos": "",
        "botao": {
          "texto": "Falar com um consultor",
          "tipo": "whatsapp",
          "valor": "Olá! Vim pelo site da Aliança One e quero saber das condições de pagamento."
        },
        "link": {
          "texto": "",
          "tipo": "link",
          "valor": ""
        },
        "imagem": "assets/img/produtos/airpods-max/laranja.webp",
        "alt": "AirPods Max laranja."
      },
      {
        "id": "corporate",
        "ativo": true,
        "estilo": "escuro",
        "olho": "Aliança Corporate",
        "titulo": "Mac para a sua equipe,",
        "fecho": "no CNPJ.",
        "frase": "Lotes, nota fiscal da empresa e um consultor só para a conta.",
        "fatos": "",
        "botao": {
          "texto": "Conhecer o Corporate",
          "tipo": "link",
          "valor": "corporate.html"
        },
        "link": {
          "texto": "",
          "tipo": "link",
          "valor": ""
        },
        "imagem": "assets/img/corporate-macbook-pro.webp",
        "alt": "MacBook Pro aberto."
      }
    ],
    "destaques": [
      "iphone-18-pro",
      "iphone-duo",
      "iphone-17-pro-max",
      "macbook-air-13-m4",
      "airpods-pro-3"
    ],
    "secoes": {
      "vitrines": {
        "olho": "Nossos produtos",
        "titulo": "Tudo da Apple,",
        "fecho": "num lugar só."
      },
      "destaques": {
        "olho": "Mais vendidos",
        "titulo": "Os favoritos",
        "fecho": "da Aliança One."
      },
      "catalogo": {
        "olho": "Em até 12x sem juros",
        "titulo": "Toda a loja.",
        "fecho": "Escolha o seu."
      },
      "perguntas": {
        "olho": "Dúvidas",
        "titulo": "Antes de",
        "fecho": "mandar mensagem."
      }
    },
    "selos": [
      {
        "titulo": "Nota fiscal",
        "texto": "Emitida no seu nome, em toda venda."
      },
      {
        "titulo": "Garantia de 12 meses",
        "texto": "Respondida pela própria Aliança One."
      },
      {
        "titulo": "Lacrado de fábrica",
        "texto": "Aparelho novo, na caixa original."
      },
      {
        "titulo": "Atendimento no WhatsApp",
        "texto": "Fale direto com a loja, do pedido ao pós-venda."
      }
    ],
    "perguntas": [],
    "contato": {}
  }
};

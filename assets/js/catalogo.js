/* =============================================================
   CATÁLOGO — gerado pelo painel (admin.html)
   -------------------------------------------------------------
   Este arquivo é reescrito inteiro sempre que alguém salva no
   painel de administração. Pode editar à mão, mas mantenha o
   formato JSON (aspas duplas, sem comentário dentro da lista),
   senão o painel não consegue ler de volta.
   ============================================================= */
const PRODUTOS = [
  {
    "id": "iphone-18-pro",
    "nome": "iPhone 18 Pro",
    "categoria": "iphone",
    "linha": "Novo",
    "preco": 11999,
    "precos": {
      "256GB": 11999,
      "512GB": 13499,
      "1TB": 15499,
      "2TB": 18499
    },
    "status": "encomenda",
    "chamada": "Chip A20 Pro e câmera de 48 MP com abertura variável.",
    "resumo": "Tela de 6,3\" a 120 Hz, chip A20 Pro e sistema de câmera Fusion Pro de 48 MP. Quatro cores, de 256 GB a 2 TB. Lacrado, com nota fiscal e até 12x sem juros.",
    "cores": [
      "Bordô",
      "Preto",
      "Prateado",
      "Glacial"
    ],
    "coresHex": {
      "Bordô": "#6b2a35",
      "Preto": "#2b2b2d",
      "Prateado": "#d9d9d6",
      "Glacial": "#a9c3dc"
    },
    "imagens": {
      "Bordô": "assets/img/produtos/iphone-18-pro/bordo.webp",
      "Preto": "assets/img/produtos/iphone-18-pro/preto.webp",
      "Prateado": "assets/img/produtos/iphone-18-pro/prateado.webp",
      "Glacial": "assets/img/produtos/iphone-18-pro/glacial.webp"
    },
    "capacidades": [
      "256GB",
      "512GB",
      "1TB",
      "2TB"
    ],
    "specs": [
      [
        "Tela",
        "6,3\" Super Retina XDR · ProMotion até 120 Hz"
      ],
      [
        "Chip",
        "A20 Pro"
      ],
      [
        "Câmeras",
        "Fusion Pro de 48 MP · abertura variável"
      ],
      [
        "Bateria",
        "Até 34h de reprodução de vídeo"
      ],
      [
        "Estrutura",
        "Alumínio unibody · Ceramic Shield 2"
      ],
      [
        "Resistência",
        "IP68"
      ]
    ],
    "vistas": [
      {
        "src": "assets/img/produtos/iphone-18-pro/frente-e-verso.webp",
        "legenda": "Frente e verso"
      }
    ]
  },
  {
    "id": "iphone-duo",
    "nome": "iPhone Duo",
    "categoria": "iphone",
    "linha": "Novo · dobrável",
    "preco": 15999,
    "precos": {
      "256GB": 15999,
      "512GB": 17499,
      "1TB": 19499,
      "2TB": 22499
    },
    "status": "encomenda",
    "chamada": "O primeiro iPhone dobrável. Tela de 7,6\" que cabe no bolso.",
    "resumo": "Aberto, uma tela de 7,6\"; fechado, um iPhone de 5,4\". Chip A20 Pro, câmera dupla de 48 MP e estrutura em titânio. Lacrado, com nota fiscal e até 12x sem juros.",
    "cores": [
      "Branco-estrela",
      "Céu noturno"
    ],
    "coresHex": {
      "Branco-estrela": "#ecebe6",
      "Céu noturno": "#2f3b52"
    },
    "imagens": {
      "Branco-estrela": "assets/img/produtos/iphone-duo/branco-estrela.webp",
      "Céu noturno": "assets/img/produtos/iphone-duo/ceu-noturno.webp"
    },
    "capacidades": [
      "256GB",
      "512GB",
      "1TB",
      "2TB"
    ],
    "specs": [
      [
        "Telas",
        "Interna 7,6\" dobrável · externa 5,4\""
      ],
      [
        "Chip",
        "A20 Pro"
      ],
      [
        "Câmeras",
        "Dupla Fusion de 48 MP"
      ],
      [
        "Bateria",
        "Até 44h de vídeo na tela externa"
      ],
      [
        "Estrutura",
        "Titânio · 5,2 mm aberto"
      ],
      [
        "Resistência",
        "IP68"
      ]
    ],
    "vistas": [
      {
        "src": "assets/img/produtos/iphone-duo/fechado.webp",
        "legenda": "Fechado"
      },
      {
        "src": "assets/img/produtos/iphone-duo/retrato.webp",
        "legenda": "Aberto"
      },
      {
        "src": "assets/img/produtos/iphone-duo/notebook.webp",
        "legenda": "Modo notebook"
      },
      {
        "src": "assets/img/produtos/iphone-duo/tenda.webp",
        "legenda": "Modo tenda"
      },
      {
        "src": "assets/img/produtos/iphone-duo/paisagem.webp",
        "legenda": "Duas telas"
      }
    ]
  },
  {
    "id": "iphone-17-pro-max",
    "nome": "iPhone 17 Pro Max",
    "categoria": "iphone",
    "linha": "Cosmic Orange",
    "preco": 11499,
    "chamada": "A maior tela e a maior bateria da linha 17.",
    "resumo": "Titânio, tela de 6,9\" a 120Hz e câmera tripla de 48MP com teleobjetiva 8x. Lacrado, com nota fiscal no seu nome e até 12x sem juros.",
    "cores": [
      "Laranja-cósmico",
      "Azul-profundo",
      "Prateado"
    ],
    "capacidades": [
      "256GB",
      "512GB",
      "1TB"
    ],
    "specs": [
      [
        "Tela",
        "6,9\" Super Retina XDR · ProMotion 120Hz"
      ],
      [
        "Chip",
        "A19 Pro"
      ],
      [
        "Câmeras",
        "Tripla 48MP · teleobjetiva 8x"
      ],
      [
        "Bateria",
        "Até 39h de vídeo"
      ],
      [
        "Material",
        "Titânio de grau aeroespacial"
      ]
    ],
    "destaque": "principal"
  },
  {
    "id": "iphone-17-pro",
    "nome": "iPhone 17 Pro",
    "categoria": "iphone",
    "linha": "Cosmic Orange",
    "preco": 9999,
    "chamada": "O Pro completo em 6,3 polegadas.",
    "resumo": "Chip A19 Pro e a mesma câmera tripla do Pro Max, num tamanho confortável para usar com uma mão. Lacrado, com nota fiscal e garantia de 12 meses.",
    "cores": [
      "Laranja-cósmico",
      "Azul-profundo",
      "Prateado"
    ],
    "capacidades": [
      "256GB",
      "512GB",
      "1TB"
    ],
    "specs": [
      [
        "Tela",
        "6,3\" Super Retina XDR · ProMotion 120Hz"
      ],
      [
        "Chip",
        "A19 Pro"
      ],
      [
        "Câmeras",
        "Tripla 48MP · teleobjetiva 8x"
      ],
      [
        "Bateria",
        "Até 33h de vídeo"
      ],
      [
        "Material",
        "Titânio de grau aeroespacial"
      ]
    ]
  },
  {
    "id": "iphone-17",
    "nome": "iPhone 17",
    "categoria": "iphone",
    "linha": "Linha 2025",
    "preco": 7499,
    "chamada": "Tela de 120Hz e câmera de 48MP sem pagar preço de Pro.",
    "resumo": "Chip A19, tela ProMotion de 120Hz e câmera principal de 48MP. A troca ideal para quem está no iPhone 12, 13 ou 14.",
    "cores": [
      "Lavanda",
      "Azul-névoa",
      "Sálvia",
      "Preto",
      "Branco"
    ],
    "capacidades": [
      "256GB",
      "512GB"
    ],
    "specs": [
      [
        "Tela",
        "6,3\" Super Retina XDR · ProMotion 120Hz"
      ],
      [
        "Chip",
        "A19"
      ],
      [
        "Câmeras",
        "Dupla 48MP"
      ],
      [
        "Bateria",
        "Até 30h de vídeo"
      ],
      [
        "Material",
        "Alumínio e Ceramic Shield 2"
      ]
    ]
  },
  {
    "id": "iphone-air",
    "nome": "iPhone Air",
    "categoria": "iphone",
    "linha": "5,6 mm de espessura",
    "preco": 8999,
    "chamada": "O iPhone mais fino já feito.",
    "resumo": "Titânio, 5,6 mm de espessura e tela de 6,5\". Leve no bolso, resistente na mão. Lacrado, com nota fiscal e até 12x sem juros.",
    "cores": [
      "Azul-céu",
      "Dourado-claro",
      "Branco-nuvem",
      "Preto-espacial"
    ],
    "capacidades": [
      "256GB",
      "512GB",
      "1TB"
    ],
    "specs": [
      [
        "Tela",
        "6,5\" Super Retina XDR · ProMotion 120Hz"
      ],
      [
        "Chip",
        "A19 Pro"
      ],
      [
        "Espessura",
        "5,6 mm"
      ],
      [
        "Câmera",
        "48MP Fusion"
      ],
      [
        "Material",
        "Titânio"
      ]
    ]
  },
  {
    "id": "iphone-16-pro",
    "nome": "iPhone 16 Pro",
    "categoria": "iphone",
    "linha": "Geração anterior",
    "preco": 6999,
    "chamada": "Topo de linha por preço de intermediário.",
    "resumo": "Titânio, tela de 120Hz e câmera de 48MP com teleobjetiva. Desempenho de sobra por anos, por bem menos que o lançamento.",
    "cores": [
      "Titânio-deserto",
      "Titânio-natural",
      "Titânio-preto",
      "Titânio-branco"
    ],
    "capacidades": [
      "128GB",
      "256GB",
      "512GB"
    ],
    "specs": [
      [
        "Tela",
        "6,3\" Super Retina XDR · ProMotion 120Hz"
      ],
      [
        "Chip",
        "A18 Pro"
      ],
      [
        "Câmeras",
        "Tripla 48MP · teleobjetiva 5x"
      ],
      [
        "Bateria",
        "Até 27h de vídeo"
      ],
      [
        "Material",
        "Titânio"
      ]
    ]
  },
  {
    "id": "iphone-16",
    "nome": "iPhone 16",
    "categoria": "iphone",
    "linha": "Geração anterior",
    "preco": 5299,
    "chamada": "Chip A18 e Controle da Câmera com ótimo preço.",
    "resumo": "Botão de Controle da Câmera, chip A18 e cinco cores. Ótima escolha para presente ou primeiro iPhone.",
    "cores": [
      "Ultramarino",
      "Azul-petróleo",
      "Rosa",
      "Preto",
      "Branco"
    ],
    "capacidades": [
      "128GB",
      "256GB"
    ],
    "specs": [
      [
        "Tela",
        "6,1\" Super Retina XDR"
      ],
      [
        "Chip",
        "A18"
      ],
      [
        "Câmeras",
        "Dupla 48MP"
      ],
      [
        "Bateria",
        "Até 22h de vídeo"
      ],
      [
        "Material",
        "Alumínio"
      ]
    ]
  },
  {
    "id": "iphone-15",
    "nome": "iPhone 15",
    "categoria": "iphone",
    "linha": "Custo-benefício",
    "preco": 4199,
    "chamada": "iPhone com USB-C e Dynamic Island pelo menor preço.",
    "resumo": "USB-C, Dynamic Island e atualizações garantidas por anos. O jeito mais barato de entrar no iPhone com nota fiscal e garantia.",
    "cores": [
      "Azul",
      "Rosa",
      "Amarelo",
      "Verde",
      "Preto"
    ],
    "capacidades": [
      "128GB",
      "256GB"
    ],
    "specs": [
      [
        "Tela",
        "6,1\" Super Retina XDR"
      ],
      [
        "Chip",
        "A16 Bionic"
      ],
      [
        "Câmeras",
        "Dupla 48MP"
      ],
      [
        "Bateria",
        "Até 20h de vídeo"
      ],
      [
        "Conexão",
        "USB-C"
      ]
    ]
  },
  {
    "id": "macbook-pro-14-m5",
    "nome": "MacBook Pro 14\" M5",
    "categoria": "mac",
    "linha": "Trabalho pesado",
    "preco": 18999,
    "chamada": "Para editar, programar e renderizar sem esperar.",
    "resumo": "Tela Liquid Retina XDR, chip M5 e bateria para um dia inteiro de trabalho fora de casa. Nota fiscal no seu nome ou no CNPJ da empresa.",
    "cores": [
      "Preto-espacial",
      "Prateado"
    ],
    "capacidades": [
      "16GB / 512GB",
      "24GB / 1TB",
      "32GB / 1TB"
    ],
    "specs": [
      [
        "Tela",
        "14,2\" Liquid Retina XDR · 120Hz"
      ],
      [
        "Chip",
        "Apple M5"
      ],
      [
        "Bateria",
        "Até 24h"
      ],
      [
        "Portas",
        "3× Thunderbolt 5, HDMI, SDXC"
      ],
      [
        "Peso",
        "1,55 kg"
      ]
    ]
  },
  {
    "id": "macbook-air-13-m4",
    "nome": "MacBook Air 13\" M4",
    "categoria": "mac",
    "linha": "Sem ventoinha",
    "preco": 10499,
    "chamada": "O Mac mais vendido da loja.",
    "resumo": "Chip M4, 18 horas de bateria e zero barulho, porque não tem ventoinha. Leve para a faculdade, para o trabalho e para viagem.",
    "cores": [
      "Azul-céu",
      "Estelar",
      "Prateado",
      "Meia-noite"
    ],
    "capacidades": [
      "16GB / 256GB",
      "16GB / 512GB",
      "24GB / 1TB"
    ],
    "specs": [
      [
        "Tela",
        "13,6\" Liquid Retina"
      ],
      [
        "Chip",
        "Apple M4"
      ],
      [
        "Bateria",
        "Até 18h"
      ],
      [
        "Peso",
        "1,24 kg"
      ],
      [
        "Refrigeração",
        "Passiva, sem ventoinha"
      ]
    ],
    "destaque": "principal"
  },
  {
    "id": "imac-24-m4",
    "nome": "iMac 24\" M4",
    "categoria": "mac",
    "linha": "Sete cores",
    "preco": 13499,
    "chamada": "Tudo-em-um com tela 4,5K e 11,5 mm de espessura.",
    "resumo": "Chip M4, tela 4,5K e sete cores. É só ligar na tomada: teclado e mouse já vêm na caixa.",
    "cores": [
      "Laranja",
      "Azul",
      "Rosa",
      "Roxo",
      "Verde",
      "Amarelo",
      "Prateado"
    ],
    "capacidades": [
      "16GB / 256GB",
      "16GB / 512GB"
    ],
    "specs": [
      [
        "Tela",
        "24\" Retina 4,5K"
      ],
      [
        "Chip",
        "Apple M4"
      ],
      [
        "Câmera",
        "Center Stage 12MP"
      ],
      [
        "Som",
        "6 alto-falantes com Spatial Audio"
      ],
      [
        "Espessura",
        "11,5 mm"
      ]
    ]
  },
  {
    "id": "mac-mini-m4",
    "nome": "Mac mini M4",
    "categoria": "mac",
    "linha": "Cabe na palma",
    "preco": 6299,
    "chamada": "O Mac de menor preço, com o chip do MacBook Air.",
    "resumo": "Chip M4 num corpo do tamanho da palma da mão. Ligue no monitor, teclado e mouse que você já tem.",
    "cores": [
      "Prateado"
    ],
    "capacidades": [
      "16GB / 256GB",
      "16GB / 512GB",
      "24GB / 1TB"
    ],
    "specs": [
      [
        "Chip",
        "Apple M4"
      ],
      [
        "Tamanho",
        "12,7 × 12,7 cm"
      ],
      [
        "Portas",
        "2× USB-C frontais, 3× Thunderbolt 4"
      ],
      [
        "Rede",
        "Gigabit Ethernet"
      ],
      [
        "Consumo",
        "Menos que uma lâmpada"
      ]
    ]
  },
  {
    "id": "ipad-pro-13-m5",
    "nome": "iPad Pro 13\" M5",
    "categoria": "ipad",
    "linha": "Tela tandem OLED",
    "preco": 14999,
    "chamada": "A melhor tela que a Apple já colocou num iPad.",
    "resumo": "Tela OLED tandem de 13\" com preto real e brilho de HDR, chip M5 e corpo finíssimo. Com o Magic Keyboard, substitui o notebook.",
    "cores": [
      "Preto-espacial",
      "Prateado"
    ],
    "capacidades": [
      "256GB",
      "512GB",
      "1TB"
    ],
    "specs": [
      [
        "Tela",
        "13\" Ultra Retina XDR tandem OLED"
      ],
      [
        "Chip",
        "Apple M5"
      ],
      [
        "Espessura",
        "5,1 mm"
      ],
      [
        "Compatível",
        "Apple Pencil Pro, Magic Keyboard"
      ],
      [
        "Conexão",
        "Thunderbolt / USB 4"
      ]
    ]
  },
  {
    "id": "ipad-air-11-m3",
    "nome": "iPad Air 11\" M3",
    "categoria": "ipad",
    "linha": "O equilíbrio",
    "preco": 7299,
    "chamada": "Chip M3 e Apple Pencil Pro por metade do preço do Pro.",
    "resumo": "Desempenho de sobra para estudo, desenho e trabalho, compatível com Apple Pencil Pro e Magic Keyboard.",
    "cores": [
      "Azul",
      "Roxo",
      "Estelar",
      "Cinza-espacial"
    ],
    "capacidades": [
      "128GB",
      "256GB",
      "512GB"
    ],
    "specs": [
      [
        "Tela",
        "11\" Liquid Retina"
      ],
      [
        "Chip",
        "Apple M3"
      ],
      [
        "Câmera",
        "Center Stage horizontal"
      ],
      [
        "Compatível",
        "Apple Pencil Pro"
      ],
      [
        "Peso",
        "460 g"
      ]
    ]
  },
  {
    "id": "ipad-11",
    "nome": "iPad 11\"",
    "categoria": "ipad",
    "linha": "Entrada",
    "preco": 3799,
    "chamada": "O iPad para a família inteira.",
    "resumo": "Para estudar, assistir e jogar. Tela de 11\", quatro cores e o menor preço da linha iPad.",
    "cores": [
      "Azul",
      "Rosa",
      "Amarelo",
      "Prateado"
    ],
    "capacidades": [
      "128GB",
      "256GB"
    ],
    "specs": [
      [
        "Tela",
        "11\" Liquid Retina"
      ],
      [
        "Chip",
        "A16"
      ],
      [
        "Bateria",
        "Até 10h"
      ],
      [
        "Compatível",
        "Apple Pencil (USB-C)"
      ],
      [
        "Peso",
        "477 g"
      ]
    ]
  },
  {
    "id": "watch-ultra-3",
    "nome": "Apple Watch Ultra 3",
    "categoria": "watch",
    "linha": "Titânio 49mm",
    "preco": 9299,
    "chamada": "O Apple Watch mais resistente e com mais bateria.",
    "resumo": "Titânio, mergulho até 100 metros, SOS via satélite e até 42 horas de bateria.",
    "cores": [
      "Titânio natural",
      "Titânio preto"
    ],
    "capacidades": [
      "49mm GPS + Cellular"
    ],
    "specs": [
      [
        "Caixa",
        "Titânio 49mm"
      ],
      [
        "Tela",
        "Até 3000 nits"
      ],
      [
        "Bateria",
        "Até 42h · 72h em economia"
      ],
      [
        "Resistência",
        "100m · norma EN13319"
      ],
      [
        "Extra",
        "Mensagem via satélite"
      ]
    ]
  },
  {
    "id": "watch-series-11",
    "nome": "Apple Watch Series 11",
    "categoria": "watch",
    "linha": "O clássico",
    "preco": 5199,
    "chamada": "Saúde e treino no pulso, o dia inteiro.",
    "resumo": "Sono, ECG, alerta de hipertensão e tela sempre ligada. O Apple Watch mais escolhido.",
    "cores": [
      "Preto brilhante",
      "Ouro rosé",
      "Prateado",
      "Cinza-espacial"
    ],
    "capacidades": [
      "42mm",
      "46mm"
    ],
    "specs": [
      [
        "Tela",
        "Always-On Retina LTPO3"
      ],
      [
        "Bateria",
        "Até 24h"
      ],
      [
        "Saúde",
        "ECG, oxigênio, temperatura"
      ],
      [
        "Resistência",
        "50m"
      ],
      [
        "Carregamento",
        "Rápido: 0 a 80% em 30 min"
      ]
    ]
  },
  {
    "id": "watch-se-3",
    "nome": "Apple Watch SE 3",
    "categoria": "watch",
    "linha": "Primeiro relógio",
    "preco": 2899,
    "chamada": "Apple Watch completo pelo menor preço.",
    "resumo": "Notificações, treinos, detecção de queda e Apple Pay. Tudo o que importa no dia a dia.",
    "cores": [
      "Meia-noite",
      "Estelar",
      "Prateado"
    ],
    "capacidades": [
      "40mm",
      "44mm"
    ],
    "specs": [
      [
        "Tela",
        "Retina"
      ],
      [
        "Bateria",
        "Até 18h"
      ],
      [
        "Segurança",
        "Detecção de queda e de acidente"
      ],
      [
        "Resistência",
        "50m"
      ],
      [
        "Pagamento",
        "Apple Pay"
      ]
    ]
  },
  {
    "id": "airpods-pro-3",
    "nome": "AirPods Pro 3",
    "categoria": "audio",
    "linha": "Cancelamento de ruído",
    "preco": 2499,
    "chamada": "O melhor cancelamento de ruído da Apple.",
    "resumo": "Cancelamento de ruído ativo, medição de batimentos no treino e tradução ao vivo. Resistentes a suor e chuva.",
    "cores": [
      "Branco"
    ],
    "capacidades": [
      "Único"
    ],
    "specs": [
      [
        "Áudio",
        "Cancelamento adaptativo"
      ],
      [
        "Bateria",
        "Até 8h · 30h com o estojo"
      ],
      [
        "Sensores",
        "Frequência cardíaca"
      ],
      [
        "Resistência",
        "IP57 · suor e chuva"
      ],
      [
        "Extra",
        "Tradução ao vivo"
      ]
    ],
    "destaque": "principal"
  },
  {
    "id": "airpods-4",
    "nome": "AirPods 4",
    "categoria": "audio",
    "linha": "Formato aberto",
    "preco": 1499,
    "chamada": "Confortável o dia todo, sem ponteira de silicone.",
    "resumo": "Formato aberto com opção de cancelamento de ruído, áudio espacial e estojo USB-C.",
    "cores": [
      "Branco"
    ],
    "capacidades": [
      "Com ANC",
      "Sem ANC"
    ],
    "specs": [
      [
        "Formato",
        "Aberto, sem ponteira"
      ],
      [
        "Bateria",
        "Até 5h · 30h com o estojo"
      ],
      [
        "Áudio",
        "Espacial personalizado"
      ],
      [
        "Resistência",
        "IP54"
      ],
      [
        "Estojo",
        "USB-C"
      ]
    ]
  },
  {
    "id": "airpods-max",
    "nome": "AirPods Max",
    "categoria": "audio",
    "linha": "Headphone over-ear",
    "preco": 4999,
    "chamada": "Som de estúdio com cancelamento de ruído.",
    "resumo": "Alumínio, almofadas em malha, áudio espacial e cancelamento de ruído. Cinco cores.",
    "cores": [
      "Meia-noite",
      "Estelar",
      "Roxo",
      "Laranja",
      "Azul"
    ],
    "capacidades": [
      "Único"
    ],
    "specs": [
      [
        "Drivers",
        "40mm dinâmicos sob medida"
      ],
      [
        "Bateria",
        "Até 20h com ANC"
      ],
      [
        "Áudio",
        "Espacial com rastreio de cabeça"
      ],
      [
        "Material",
        "Alumínio anodizado e malha"
      ],
      [
        "Conexão",
        "USB-C com áudio lossless"
      ]
    ]
  },
  {
    "id": "apple-pencil-pro",
    "nome": "Apple Pencil Pro",
    "categoria": "acessorios",
    "linha": "Para iPad",
    "preco": 1399,
    "chamada": "Precisão de caneta de verdade no iPad.",
    "resumo": "Sensor de rotação, aperto para trocar de ferramenta e resposta tátil. Ideal para desenho e anotações.",
    "cores": [
      "Branco"
    ],
    "capacidades": [
      "Único"
    ],
    "specs": [
      [
        "Sensores",
        "Rotação, aperto e pressão"
      ],
      [
        "Resposta",
        "Feedback tátil"
      ],
      [
        "Pareamento",
        "Magnético no iPad"
      ],
      [
        "Extra",
        "Buscar via app Buscar"
      ],
      [
        "Compatível",
        "iPad Pro M4+ e iPad Air M2+"
      ]
    ]
  },
  {
    "id": "magic-keyboard-ipad",
    "nome": "Magic Keyboard para iPad Pro",
    "categoria": "acessorios",
    "linha": "Teclado com trackpad",
    "preco": 3199,
    "chamada": "Transforma o iPad Pro em notebook.",
    "resumo": "Trackpad de vidro, teclas retroiluminadas e fileira de funções. Protege frente e verso.",
    "cores": [
      "Preto"
    ],
    "capacidades": [
      "11\"",
      "13\""
    ],
    "specs": [
      [
        "Trackpad",
        "Vidro com haptics"
      ],
      [
        "Teclas",
        "Retroiluminadas"
      ],
      [
        "Porta",
        "USB-C de passagem"
      ],
      [
        "Estrutura",
        "Alumínio"
      ],
      [
        "Proteção",
        "Frente e verso"
      ]
    ]
  },
  {
    "id": "magsafe-charger",
    "nome": "Carregador MagSafe 25W",
    "categoria": "acessorios",
    "linha": "Original Apple",
    "preco": 499,
    "chamada": "Carregamento rápido de 25W, encaixe magnético.",
    "resumo": "Original Apple, lacrado. Encaixa sozinho no lugar certo e carrega até 25W nos modelos compatíveis.",
    "cores": [
      "Branco"
    ],
    "capacidades": [
      "1m",
      "2m"
    ],
    "specs": [
      [
        "Potência",
        "Até 25W"
      ],
      [
        "Encaixe",
        "Alinhamento magnético"
      ],
      [
        "Cabo",
        "Trançado"
      ],
      [
        "Compatível",
        "iPhone 12 em diante"
      ],
      [
        "Origem",
        "Original Apple, lacrado"
      ]
    ]
  }
];

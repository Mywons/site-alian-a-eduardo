/* =============================================================
   BIBLIOTECA — modelos Apple prontos para cadastrar
   -------------------------------------------------------------
   Usada só pelo painel: "Adicionar da biblioteca" copia um destes
   blocos para o catálogo já com especificações, cores e capacidades.
   O dono só põe preço, estoque e, se quiser, a foto de cada cor.

   Sem foto (fotos: false) o site desenha o aparelho na cor certa.
   Os modelos que já estão no catálogo não aparecem na lista.
   Para acrescentar um modelo novo aqui, copie um bloco e edite.
   ============================================================= */

const BIBLIOTECA = [
  /* ---------------- iPhone ---------------- */
  {
    id: 'iphone-16e', nome: 'iPhone 16e', categoria: 'iphone', linha: 'O iPhone de entrada',
    chamada: 'Chip A18 e câmera de 48MP pelo menor preço da linha.',
    resumo: 'O mesmo chip da linha 16, tela OLED de 6,1 polegadas, Face ID e USB-C. Para quem quer um iPhone atual sem pagar pelo topo.',
    cores: ['Preto', 'Branco'], capacidades: ['128GB', '256GB', '512GB'],
    specs: [['Tela', '6,1" Super Retina XDR OLED'], ['Chip', 'A18'], ['Câmera', '48MP Fusion'], ['Desbloqueio', 'Face ID'], ['Conector', 'USB-C']]
  },
  {
    id: 'iphone-16-plus', nome: 'iPhone 16 Plus', categoria: 'iphone', linha: 'Tela grande',
    chamada: 'A tela grande e a bateria longa do iPhone 16.',
    resumo: 'Tela de 6,7 polegadas, chip A18, Controle da Câmera e Botão de Ação. A maior bateria da linha 16 sem o preço do Pro.',
    cores: ['Preto', 'Branco', 'Rosa', 'Azul-petróleo', 'Ultramarino'], capacidades: ['128GB', '256GB', '512GB'],
    specs: [['Tela', '6,7" Super Retina XDR'], ['Chip', 'A18'], ['Câmeras', 'Dupla 48MP + ultra-angular 12MP'], ['Botões', 'Ação e Controle da Câmera'], ['Conector', 'USB-C']]
  },
  {
    id: 'iphone-16-pro-max', nome: 'iPhone 16 Pro Max', categoria: 'iphone', linha: 'Titânio',
    chamada: 'O Pro Max da geração anterior, em titânio.',
    resumo: 'Tela de 6,9 polegadas, chip A18 Pro e teleobjetiva 5x. Um topo de linha que continua sobrando para qualquer uso.',
    cores: ['Titânio-preto', 'Titânio-branco', 'Titânio-natural', 'Titânio-deserto'], capacidades: ['256GB', '512GB', '1TB'],
    specs: [['Tela', '6,9" Super Retina XDR · ProMotion'], ['Chip', 'A18 Pro'], ['Câmeras', 'Tripla 48MP · teleobjetiva 5x'], ['Material', 'Titânio'], ['Conector', 'USB-C']]
  },

  /* ---------------- Mac ---------------- */
  {
    id: 'macbook-air-15-m4', nome: 'MacBook Air 15" M4', categoria: 'mac', linha: 'Tela grande, sem ventoinha',
    chamada: 'O Air de tela grande.',
    resumo: 'Tela Liquid Retina de 15,3 polegadas, chip M4 e silêncio total: não tem ventoinha. Bateria para o dia inteiro.',
    cores: ['Azul-céu', 'Prateado', 'Estelar', 'Meia-noite'], capacidades: ['16GB · 256GB', '16GB · 512GB', '24GB · 512GB'],
    specs: [['Tela', '15,3" Liquid Retina'], ['Chip', 'Apple M4'], ['Memória', 'A partir de 16GB'], ['Bateria', 'Até 18h'], ['Portas', '2× Thunderbolt 4 · MagSafe']]
  },
  {
    id: 'macbook-pro-16-m4-pro', nome: 'MacBook Pro 16" M4 Pro', categoria: 'mac', linha: 'Para trabalho pesado',
    chamada: 'A maior tela e a maior bateria de um Mac portátil.',
    resumo: 'Tela Liquid Retina XDR de 16,2 polegadas, chip M4 Pro e portas para tudo: HDMI, SD e Thunderbolt 5.',
    cores: ['Preto-espacial', 'Prateado'], capacidades: ['24GB · 512GB', '48GB · 512GB', '48GB · 1TB'],
    specs: [['Tela', '16,2" Liquid Retina XDR'], ['Chip', 'Apple M4 Pro'], ['Memória', 'A partir de 24GB'], ['Bateria', 'Até 24h'], ['Portas', 'Thunderbolt 5 · HDMI · SD · MagSafe']]
  },
  {
    id: 'mac-studio-m4-max', nome: 'Mac Studio M4 Max', categoria: 'mac', linha: 'Estação de trabalho',
    chamada: 'Potência de estúdio num bloco de alumínio.',
    resumo: 'Chip M4 Max, portas na frente e atrás e silêncio mesmo sob carga. Para edição de vídeo, 3D e música.',
    cores: ['Prateado'], capacidades: ['36GB · 512GB', '48GB · 1TB'],
    specs: [['Chip', 'Apple M4 Max'], ['Memória', 'A partir de 36GB'], ['Portas', 'Thunderbolt 5 · HDMI · 10Gb Ethernet'], ['Frente', 'USB-C e leitor SD'], ['Formato', 'Desktop compacto']]
  },

  /* ---------------- iPad ---------------- */
  {
    id: 'ipad-mini-a17-pro', nome: 'iPad mini', categoria: 'ipad', linha: 'Chip A17 Pro',
    chamada: 'Cabe numa mão e no bolso do casaco.',
    resumo: 'Tela de 8,3 polegadas, chip A17 Pro e compatível com Apple Pencil Pro. O iPad para ler, anotar e levar para todo lado.',
    cores: ['Cinza-espacial', 'Azul', 'Roxo', 'Estelar'], capacidades: ['128GB', '256GB', '512GB'],
    specs: [['Tela', '8,3" Liquid Retina'], ['Chip', 'A17 Pro'], ['Caneta', 'Apple Pencil Pro e USB-C'], ['Conector', 'USB-C'], ['Desbloqueio', 'Touch ID']]
  },
  {
    id: 'ipad-air-13-m3', nome: 'iPad Air 13" M3', categoria: 'ipad', linha: 'Tela grande',
    chamada: 'O Air com tela de 13 polegadas.',
    resumo: 'Chip M3 e a maior tela da linha Air. Com Magic Keyboard vira estação de trabalho; com Pencil Pro, prancheta.',
    cores: ['Cinza-espacial', 'Azul', 'Roxo', 'Estelar'], capacidades: ['128GB', '256GB', '512GB', '1TB'],
    specs: [['Tela', '13" Liquid Retina'], ['Chip', 'Apple M3'], ['Caneta', 'Apple Pencil Pro'], ['Conector', 'USB-C'], ['Desbloqueio', 'Touch ID']]
  },
  {
    id: 'ipad-pro-11-m5', nome: 'iPad Pro 11" M5', categoria: 'ipad', linha: 'Tela Ultra Retina XDR',
    chamada: 'O Pro no tamanho que viaja.',
    resumo: 'Tela OLED Ultra Retina XDR de 11 polegadas, chip M5 e corpo finíssimo. O iPad mais rápido no tamanho mais portátil.',
    cores: ['Preto-espacial', 'Prateado'], capacidades: ['256GB', '512GB', '1TB', '2TB'],
    specs: [['Tela', '11" Ultra Retina XDR'], ['Chip', 'Apple M5'], ['Caneta', 'Apple Pencil Pro'], ['Conector', 'Thunderbolt / USB 4'], ['Desbloqueio', 'Face ID']]
  },

  /* ---------------- Casa e acessórios ---------------- */
  {
    id: 'apple-tv-4k', nome: 'Apple TV 4K', categoria: 'acessorios', linha: 'Para a sala',
    chamada: 'Transforma qualquer TV em Apple.',
    resumo: 'Chip A15 Bionic, HDR10+ e Dolby Vision, e o Siri Remote com USB-C. Streaming, jogos e AirPlay na TV da sala.',
    cores: ['Preto'], capacidades: ['64GB Wi-Fi', '128GB Wi-Fi + Ethernet'],
    specs: [['Chip', 'A15 Bionic'], ['Vídeo', '4K HDR10+ · Dolby Vision'], ['Áudio', 'Dolby Atmos'], ['Controle', 'Siri Remote USB-C'], ['Casa', 'Central da casa inteligente']]
  },
  {
    id: 'homepod-mini', nome: 'HomePod mini', categoria: 'audio', linha: 'Caixa inteligente',
    chamada: 'Som de 360 graus do tamanho de uma laranja.',
    resumo: 'Áudio que enche o cômodo, Siri e controle da casa inteligente. Em par, vira som estéreo.',
    cores: ['Branco', 'Meia-noite', 'Amarelo', 'Laranja', 'Azul'], capacidades: ['Único'],
    specs: [['Áudio', '360 graus'], ['Assistente', 'Siri'], ['Casa', 'Central da casa inteligente'], ['Extra', 'Par estéreo e Intercom'], ['Conector', 'USB-C']]
  },
  {
    id: 'airtag', nome: 'AirTag', categoria: 'acessorios', linha: 'Localizador',
    chamada: 'Nunca mais procure a chave.',
    resumo: 'Prende na chave, na mochila ou na mala e aparece no app Buscar do iPhone, com busca precisa.',
    cores: ['Branco'], capacidades: ['1 unidade', '4 unidades'],
    specs: [['App', 'Buscar'], ['Busca', 'Precisa, nos iPhones compatíveis'], ['Resistência', 'IP67'], ['Bateria', 'CR2032, trocável'], ['Pareamento', 'Um toque no iPhone']]
  },
  {
    id: 'apple-pencil-usb-c', nome: 'Apple Pencil (USB-C)', categoria: 'acessorios', linha: 'Para iPad',
    chamada: 'A Pencil de entrada, que carrega no cabo.',
    resumo: 'Precisão de pixel e baixa latência para anotar e desenhar, com carregamento e pareamento pelo USB-C.',
    cores: ['Branco'], capacidades: ['Único'],
    specs: [['Recursos', 'Precisão de pixel · inclinação'], ['Pareamento', 'USB-C'], ['Fixação', 'Magnética na lateral'], ['Compatível', 'iPads com USB-C'], ['Origem', 'Original Apple, lacrado']]
  },
  {
    id: 'magic-mouse-usb-c', nome: 'Magic Mouse', categoria: 'acessorios', linha: 'Superfície Multi-Touch',
    chamada: 'Gestos do trackpad num mouse.',
    resumo: 'Superfície Multi-Touch para rolar e deslizar, bateria recarregável pelo USB-C.',
    cores: ['Branco', 'Preto'], capacidades: ['Único'],
    specs: [['Superfície', 'Multi-Touch'], ['Conexão', 'Bluetooth'], ['Bateria', 'Recarregável'], ['Conector', 'USB-C'], ['Compatível', 'Mac e iPad']]
  },
  {
    id: 'magic-keyboard-touch-id', nome: 'Magic Keyboard com Touch ID', categoria: 'acessorios', linha: 'Para Mac',
    chamada: 'Desbloqueia o Mac com o dedo.',
    resumo: 'Teclado sem fio com Touch ID para desbloquear e pagar, nos Mac com chip Apple.',
    cores: ['Branco', 'Preto'], capacidades: ['Sem teclado numérico', 'Com teclado numérico'],
    specs: [['Segurança', 'Touch ID'], ['Conexão', 'Bluetooth'], ['Bateria', 'Recarregável'], ['Conector', 'USB-C'], ['Compatível', 'Mac com chip Apple']]
  },
  {
    id: 'fonte-usb-c-20w', nome: 'Carregador USB-C 20W', categoria: 'acessorios', linha: 'Original Apple',
    chamada: 'Carga rápida no iPhone e no iPad.',
    resumo: 'Fonte original de 20W: 50% de carga no iPhone em cerca de 30 minutos. Cabo vendido à parte.',
    cores: ['Branco'], capacidades: ['Único'],
    specs: [['Potência', '20W'], ['Saída', 'USB-C'], ['Carga rápida', 'iPhone e iPad'], ['Tomada', 'Padrão brasileiro'], ['Origem', 'Original Apple, lacrado']]
  },
  {
    id: 'cabo-usb-c-240w', nome: 'Cabo USB-C 240W (2m)', categoria: 'acessorios', linha: 'Original Apple',
    chamada: 'Um cabo para Mac, iPad e iPhone.',
    resumo: 'Cabo trançado de 2 metros que carrega até 240W, do iPhone ao MacBook Pro.',
    cores: ['Branco'], capacidades: ['Único'],
    specs: [['Potência', 'Até 240W'], ['Comprimento', '2m'], ['Acabamento', 'Trançado'], ['Pontas', 'USB-C nas duas'], ['Origem', 'Original Apple, lacrado']]
  }
];

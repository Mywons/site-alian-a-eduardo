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
    "margem": { "tipo": "%", "valor": 15 },
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
      "subtitulo": "Entrega no mesmo dia em São Paulo, a tempo da ceia.",
      "faixa": "Feliz Natal|Entrega no mesmo dia em SP|Até 12x sem juros",
      "inicio": "2026-12-01",
      "fim": "2026-12-25",
      "ativo": false
    }
  ]
};

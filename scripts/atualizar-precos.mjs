/* =============================================================
   ROBÔ DE PREÇOS — roda todo dia pelo GitHub Actions
   -------------------------------------------------------------
   1. Lê assets/js/loja.js. Se o preço automático estiver
      desligado no painel, não faz nada.
   2. Busca o dólar do dia: PTAX de venda do Banco Central e, se
      ele falhar, a cotação comercial do open.er-api.com.
   3. Recalcula o preço de todo produto que tem custo cadastrado
      e não está marcado como "preço manual", com a regra do painel
      (assets/js/regras.js — a MESMA conta que o painel simula).
   4. Uma variação maior que a trava NÃO é aplicada: vira aviso no
      painel, para uma pessoa olhar.
   5. Grava catalogo.js e loja.js. O workflow faz o commit.

   Rodar à mão:  node scripts/atualizar-precos.mjs
   Simular sem gravar:  node scripts/atualizar-precos.mjs --simular
   ============================================================= */

import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arq = (p) => path.join(raiz, p);
const SIMULAR = process.argv.includes('--simular');

function carregar(arquivos, nomes) {
  const ctx = { console };
  vm.createContext(ctx);
  const codigo = arquivos.map((a) => fs.readFileSync(arq(a), 'utf8')).join('\n;\n')
    + `\n;this.__saida = { ${nomes.map((n) => `${n}: typeof ${n} !== 'undefined' ? ${n} : undefined`).join(', ')} };`;
  vm.runInContext(codigo, ctx);
  return ctx.__saida;
}

const { PRODUTOS, LOJA } = carregar(['assets/js/catalogo.js', 'assets/js/loja.js'], ['PRODUTOS', 'LOJA']);
const { REGRAS } = carregar(['assets/js/regras.js'], ['REGRAS']);

const cfg = LOJA.precificacao || {};
if (!cfg.automatico && !SIMULAR) {
  console.log('Preço automático desligado no painel. Nada a fazer.');
  process.exit(0);
}

const fmt = (d) => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;

async function ptax() {
  const fim = new Date();
  const ini = new Date(fim.getTime() - 10 * 864e5); // fim de semana e feriado não têm cotação
  const url = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/'
    + 'CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)'
    + `?@dataInicial='${fmt(ini)}'&@dataFinalCotacao='${fmt(fim)}'`
    + '&$format=json&$orderby=dataHoraCotacao%20desc&$top=1';
  const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const j = await r.json();
  const v = j?.value?.[0];
  if (!v?.cotacaoVenda) throw new Error('PTAX sem cotação');
  return { valor: v.cotacaoVenda, data: v.dataHoraCotacao.slice(0, 10), fonte: 'PTAX (Banco Central)' };
}

async function comercial() {
  const r = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(20000) });
  const j = await r.json();
  if (!j?.rates?.BRL) throw new Error('open.er-api sem BRL');
  return { valor: j.rates.BRL, data: new Date().toISOString().slice(0, 10), fonte: 'open.er-api.com' };
}

let cotacao;
try { cotacao = await ptax(); } catch (e) {
  console.log(`PTAX falhou (${e.message}); tentando a cotação comercial.`);
  cotacao = await comercial();
}

const dolar = Math.round(cotacao.valor * 100) / 100;
const efetivo = dolar + (Number(cfg.dolarAjuste) || 0);
console.log(`Dólar ${dolar.toFixed(2)} (${cotacao.fonte}, ${cotacao.data})${cfg.dolarAjuste ? ` + ajuste ${cfg.dolarAjuste}` : ''}`);

const { produtos, mudancas, alertas } = REGRAS.recalcular(PRODUTOS, cfg, efetivo);

for (const m of mudancas) console.log(`  ${m.nome} ${m.cap}: ${m.antigo} → ${m.novo} (${m.variacao > 0 ? '+' : ''}${m.variacao}%)`);
for (const a of alertas) console.log(`  TRAVADO ${a.nome} ${a.cap}: ${a.antigo} → ${a.novo} (${a.variacao}%) passa da trava de ${cfg.limiteVariacao}%`);
console.log(`${mudancas.length} preços atualizados, ${alertas.length} travados.`);

if (SIMULAR) process.exit(0);

const agora = new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T');
LOJA.precificacao = { ...cfg, dolar, dolarEm: cotacao.data, ultimaExecucao: agora, alertas };

const cabecalho = (texto) => texto.slice(0, texto.indexOf('const '));
const catTxt = fs.readFileSync(arq('assets/js/catalogo.js'), 'utf8');
const lojaTxt = fs.readFileSync(arq('assets/js/loja.js'), 'utf8');
fs.writeFileSync(arq('assets/js/catalogo.js'), `${cabecalho(catTxt)}const PRODUTOS = ${JSON.stringify(produtos, null, 2)};\n`);
fs.writeFileSync(arq('assets/js/loja.js'), `${cabecalho(lojaTxt)}const LOJA = ${JSON.stringify(LOJA, null, 2)};\n`);
console.log('Arquivos gravados.');

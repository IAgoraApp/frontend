import test from 'node:test';
import assert from 'node:assert/strict';
import { destinoInterno, encerrarSessao, iniciarSessao, temSessao, inicioDaSessao, perfilDaRota, destinoAposAcesso } from './sessao.js';
import { destinoMercado, tipoUsuarioDaRota, rotaPessoalDoMomento } from './navegacao.js';

test('homes e perfis antigos retornam à variante correspondente ao momento escolhido', () => {
  assert.equal(rotaPessoalDoMomento('/perfil', 'preparacao'), '/perfil-b');
  assert.equal(rotaPessoalDoMomento('/home', 'preparacao'), '/home-b');
  assert.equal(rotaPessoalDoMomento('/perfil-b', 'morando'), '/perfil');
  assert.equal(rotaPessoalDoMomento('/home-b', 'morando'), '/home');
  assert.equal(rotaPessoalDoMomento('/empresa/perfil', 'preparacao'), '/empresa/perfil');
  assert.equal(rotaPessoalDoMomento('/rotina', 'preparacao'), '/rotina');
});

test('links de módulos compartilhados preservam o perfil de origem A ou B', () => {
  for (const caminho of ['/checklists', '/marketplace', '/buscar', '/calculadoras', '/cozinha']) {
    assert.equal(tipoUsuarioDaRota(caminho, 'preparacao'), 'consumidorB');
    assert.equal(tipoUsuarioDaRota(caminho, 'morando'), 'consumidorA');
  }
  assert.equal(tipoUsuarioDaRota('/perfil', 'preparacao'), 'consumidorA');
  assert.equal(tipoUsuarioDaRota('/perfil-b', 'morando'), 'consumidorB');
});

test('a navegação interna exige acesso, mantém a sessão e bloqueia após sair', () => {
  const dados = new Map();
  globalThis.sessionStorage = {
    getItem: chave => dados.get(chave) ?? null,
    setItem: (chave, valor) => dados.set(chave, valor),
    removeItem: chave => dados.delete(chave),
  };
  try {
    assert.equal(temSessao(), false);
    iniciarSessao();
    assert.equal(temSessao(), true);
    assert.equal(dados.size, 2);
    encerrarSessao();
    assert.equal(temSessao(), false);
    assert.equal(dados.size, 0);
  } finally {
    encerrarSessao();
    delete globalThis.sessionStorage;
  }
});

test('o acesso funciona na sessão atual mesmo sem armazenamento disponível', () => {
  assert.equal(temSessao(), false);
  iniciarSessao();
  assert.equal(temSessao(), true);
  encerrarSessao();
  assert.equal(temSessao(), false);
});

test('a página inicial depois do acesso corresponde ao perfil A, B ou empresa', () => {
  iniciarSessao();
  assert.equal(inicioDaSessao('morando'), '/home');
  assert.equal(inicioDaSessao('preparacao'), '/home-b');
  iniciarSessao('empresa');
  assert.equal(inicioDaSessao('morando'), '/empresa');
  assert.equal(inicioDaSessao('preparacao'), '/empresa');
  encerrarSessao();
});

test('retorno do login preserva consultas e âncoras e recusa destinos externos', () => {
  assert.equal(destinoInterno('/financas?visao=contas#resumo', '/home'), '/financas?visao=contas#resumo');
  for (const destino of [null, {}, 'https://exemplo.com', '//exemplo.com', '/\\exemplo.com', '/\n/exemplo.com']) {
    assert.equal(destinoInterno(destino, '/home'), '/home');
  }
});

test('rotas empresariais e aliases exigem a sessão correspondente sem confundir perfis públicos', () => {
  for (const rota of ['/empresa', '/empresa/contatos/joao', '/dashboard', '/meus-servicos/123', '/anunciar-servico', '/perfil-empresa', '/contatos/joao']) {
    assert.equal(perfilDaRota(rota), 'empresa');
  }
  for (const rota of ['/empresas/casa-em-dia', '/servicos/limpeza', '/perfil-b', '/home', '/onboarding']) {
    assert.equal(perfilDaRota(rota), 'pessoal');
  }
});

test('trocar o tipo de perfil no login descarta um retorno incompatível para evitar ciclo de acesso', () => {
  assert.equal(destinoAposAcesso('/empresa/anuncios?status=ativo', '/home-b', 'pessoal'), '/home-b');
  assert.equal(destinoAposAcesso('/financas?visao=contas', '/empresa', 'empresa'), '/empresa');
  assert.equal(destinoAposAcesso('/empresa/anuncios?status=ativo', '/empresa', 'empresa'), '/empresa/anuncios?status=ativo');
  assert.equal(destinoAposAcesso('/financas?visao=contas', '/home', 'pessoal'), '/financas?visao=contas');
});

test('marketplace preserva a área empresarial em links, filtros e retornos', () => {
  for (const destino of ['/buscar?busca=limpeza', '/buscar/mapa', '/marketplace/filtros', '/servicos/limpeza/contato', '/empresas/casa-em-dia', '/favoritos', '/meus-contatos/123']) {
    assert.equal(destinoMercado(destino, '/empresa/marketplace'), '/empresa' + destino);
    assert.equal(destinoMercado(destino, '/marketplace'), destino);
  }
  assert.equal(destinoMercado('/empresa/anunciar', '/empresa/buscar'), '/empresa/anunciar');
  assert.equal(destinoMercado('/sejaparceiro', '/empresa/buscar'), '/sejaparceiro');
  assert.deepEqual(destinoMercado({ pathname: '/buscar', search: '?busca=limpeza' }, '/empresa/buscar'), { pathname: '/empresa/buscar', search: '?busca=limpeza' });
});

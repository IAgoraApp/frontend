import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { EstadoCarregamento, PaginaDadosIndisponiveis } from './estadoDados';
import { contaApi } from './contaApi';
import { registroDaApi } from './contratoApi';
import { ContextoServidor } from './contextoServidor';
import { carregarJornada } from '../../features/minha-jornada/jornadaApi';
import { carregarPerfil } from '../../features/perfil/perfilApi';
import { carregarCobrancas } from '../../features/perfil/cobrancasApi';
import { carregarFinancas } from '../../features/financas/financasApi';
import { carregarRotina } from '../../features/rotina/rotinaApi';
import { carregarCozinha } from '../../features/cozinha/cozinhaApi';
import { carregarCasa } from '../../features/casa/casaApi';
import {
  carregarDinheiro,
  carregarMoradia,
} from '../../features/financas-B/planejamentoApi';
import { carregarAprendizado } from '../../features/aprendendo/aprendizadoApi';
import { carregarMarketplace } from '../../features/marketplace/marketplaceApi';
import { carregarEmpresa } from '../../features/empresa/empresaApi';

async function consultar(sessao, escopo, detalhe, signal) {
  const opcoes = { token: sessao.token, signal };
  const perfil =
    sessao.tipo === 1
      ? registroDaApi(await contaApi(`/perfis/user/${sessao.id}`, opcoes))
      : null;
  const base = {
    users: [{ id: sessao.id, email: sessao.email, tipo: sessao.tipo }],
    perfil: perfil ? [perfil] : [],
  };

  if (perfil && ['inicio-a', 'inicio-b'].includes(escopo)) {
    escopo = perfil.tipo === 2 ? 'inicio-b' : 'inicio-a';
  }
  if (escopo === 'empresa') {
    return { ...base, ...(await carregarEmpresa(opcoes, detalhe)) };
  }
  if (escopo === 'marketplace') {
    const mercado = await carregarMarketplace(
      detalhe,
      sessao.tipo === 2,
      opcoes
    );
    return { ...base, ...mercado };
  }
  if (escopo === 'inicio-a') {
    const [casa, rotina, financas] = await Promise.all([
      carregarCasa(sessao.id, perfil, opcoes),
      carregarRotina(sessao.id, opcoes),
      carregarFinancas(sessao.id, opcoes),
    ]);
    const cozinha = await carregarCozinha(sessao.id, casa, opcoes);
    return { ...base, ...casa, ...rotina, ...financas, ...cozinha };
  }
  if (escopo === 'dinheiro' || escopo === 'inicio-b') {
    const [dinheiro, moradia, jornada, aprendizado] = await Promise.all([
      carregarDinheiro(sessao.id, opcoes),
      carregarMoradia(sessao.id, opcoes),
      carregarJornada(sessao.id, opcoes),
      escopo === 'inicio-b' ? carregarAprendizado(sessao.id, null, opcoes) : {},
    ]);
    return { ...base, ...dinheiro, ...moradia, ...jornada, ...aprendizado };
  }
  if (escopo === 'aprendizado')
    return {
      ...base,
      ...(await carregarAprendizado(sessao.id, detalhe.aula, opcoes)),
    };
  if (escopo === 'cobrancas')
    return { ...base, ...(await carregarCobrancas(opcoes)) };
  if (escopo === 'perfil' && perfil) return { ...base, ...await carregarPerfil(sessao.id, perfil, opcoes) };
  if (escopo === 'financas')
    return { ...base, ...(await carregarFinancas(sessao.id, opcoes)) };
  if (escopo === 'rotina')
    return { ...base, ...(await carregarRotina(sessao.id, opcoes)) };
  if (escopo === 'casa' || escopo === 'cozinha') {
    const casa = await carregarCasa(sessao.id, perfil, opcoes);
    const cozinha =
      escopo === 'cozinha'
        ? await carregarCozinha(sessao.id, casa, opcoes)
        : {};
    return { ...base, ...casa, ...cozinha };
  }
  return base;
}

function Carregador({ sessao, escopo, aula, chat, servico, cobrancas, children }) {
  const requisicao = useRef(null);
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const { id, email, tipo, token } = sessao;

  const atualizar = useCallback(async () => {
    requisicao.current?.abort();
    const controller = new AbortController();
    requisicao.current = controller;
    try {
      const resultado = await consultar(
        { id, email, tipo, token },
        escopo,
        { aula, chat, servico, cobrancas },
        controller.signal
      );
      if (!controller.signal.aborted) {
        setDados(resultado);
        setErro('');
      }
    } catch (falha) {
      if (!controller.signal.aborted) setErro(falha.message);
    }
  }, [id, email, tipo, token, escopo, aula, chat, servico, cobrancas]);

  useEffect(() => {
    let ativo = true;
    queueMicrotask(() => {
      if (ativo) void atualizar();
    });
    return () => {
      ativo = false;
      requisicao.current?.abort();
    };
  }, [atualizar]);
  if (erro) return <PaginaDadosIndisponiveis erro={erro} tentar={atualizar} />;
  if (!dados) return <EstadoCarregamento />;
  return (
    <ContextoServidor.Provider value={{ dados, atualizar }}>
      {children}
    </ContextoServidor.Provider>
  );
}

const rotasMarketplace =
  /^\/(empresa\/(marketplace|buscar)|marketplace|buscar|categorias?|servicos|empresas|servicos-contratados|meus-contatos|favoritos)(\/|$)/;

function escopoDaPagina(pathname, tipo, params) {
  if (rotasMarketplace.test(pathname)) return 'marketplace';
  if (tipo === 2) return 'empresa';
  if (
    /^\/(financas-b|planejamento|encontrar-casa|minhajornada)(\/|$)/.test(
      pathname
    )
  )
    return 'dinheiro';
  if (
    /^\/perfil(?:-b)?$/.test(pathname) &&
    ['assinatura', 'pagamentos'].includes(params.get('visao'))
  )
    return 'cobrancas';
  if (/^\/(despensa|cozinha)(\/|$)/.test(pathname)) return 'cozinha';
  if (/^\/(casa|limpeza)(\/|$)/.test(pathname)) return 'casa';
  return (
    {
      '/home': 'inicio-a',
      '/home-b': 'inicio-b',
      '/financas': 'financas',
      '/rotina': 'rotina',
      '/aprendendo': 'aprendizado',
    }[pathname] ?? 'perfil'
  );
}

export default function DadosServidor({ sessao, children }) {
  const { pathname, search } = useLocation();
  if (!sessao) return children;
  const params = new URLSearchParams(search);
  const escopo = escopoDaPagina(
    pathname.toLowerCase().replace(/\/$/, ''),
    sessao.tipo,
    params
  );
  const aula = escopo === 'aprendizado' ? Number(params.get('aula')) : 0;
  const chat = Number(
    pathname.match(/\/(?:meus-contatos|contatos)\/(\d+)(\/|$)/)?.[1] ?? 0
  );
  const servico = Number(
    pathname.match(/\/(?:servicos|anuncios|meus-servicos)\/(\d+)(\/|$)/)?.[1] ??
      0
  );
  const cobrancas = escopo === 'empresa' && (
    /^\/(?:empresa\/anuncios|meus-servicos)\/\d+\/?$/.test(pathname) ||
    ['/empresa/perfil', '/perfil-empresa'].includes(pathname.replace(/\/$/, '')) &&
      ['assinatura', 'pagamentos'].includes(params.get('visao'))
  );
  return (
    <Carregador
      key={[sessao.token, escopo, aula, chat, servico, cobrancas].join(':')}
      cobrancas={cobrancas}
      chat={chat}
      servico={servico}
      aula={aula}
      sessao={sessao}
      escopo={escopo}
    >
      {children}
    </Carregador>
  );
}

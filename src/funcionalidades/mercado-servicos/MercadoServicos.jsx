import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Rodape } from '../../compartilhado/indice';
import { useEmpresa } from '../../aplicacao/estado/estadoEmpresa';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../aplicacao/estado/estadoPlataforma';
import {
  obterCatalogoMercado,
  pinosMapaSaoPaulo,
} from './conteudo';
import {
  AvaliacoesServico,
  DetalheServico,
  PerfilEmpresaPublico,
  SolicitacaoContato,
  VisaoBuscarServicos,
  VisaoCategoriaServicos,
  VisaoFavoritosMercado,
  VisaoFiltrosMercado,
  VisaoMapaServicos,
  VisaoMeusContatosMercado,
  VisaoPrincipalMercado,
} from './componentes/indice';

export default function MercadoServicos({
  dentroDaEmpresa = false,
  visao = 'hub',
}) {
  const { pathname, search } = useLocation();
  const { dados, erro } = useEmpresa();
  const [estadoPlataforma, setEstadoPlataforma] = useState(lerEstadoPlataforma);

  useEffect(() => {
    const aoAtualizar = () => setEstadoPlataforma(lerEstadoPlataforma());
    window.addEventListener('iagora:estado', aoAtualizar);
    window.addEventListener('storage', aoAtualizar);
    return () => {
      window.removeEventListener('iagora:estado', aoAtualizar);
      window.removeEventListener('storage', aoAtualizar);
    };
  }, []);

  const favoritos = estadoPlataforma.servicosFavoritos || [];
  const { empresas, servicos, avaliacoes, contatos } = obterCatalogoMercado(
    dados,
    estadoPlataforma
  );

  function alternarFavorito(servicoId) {
    const atual = lerEstadoPlataforma();
    const listaAtual = atual.servicosFavoritos || [];
    const proximos = listaAtual.includes(servicoId)
      ? listaAtual.filter(item => item !== servicoId)
      : [...listaAtual, servicoId];
    const proximoEstado = { ...atual, servicosFavoritos: proximos };
    salvarEstadoPlataforma(proximoEstado);
    setEstadoPlataforma(proximoEstado);
  }

  function adicionarAvaliacao(novaAvaliacao) {
    const atual = lerEstadoPlataforma();
    const proximas = [novaAvaliacao, ...(atual.avaliacoesServicos || [])];
    const proximoEstado = { ...atual, avaliacoesServicos: proximas };
    salvarEstadoPlataforma(proximoEstado);
    setEstadoPlataforma(proximoEstado);
  }

  return (
    <div
      key={pathname}
      lang='pt-BR'
      className='flex min-w-0 flex-1 flex-col bg-white font-corpo text-(--azul-titulo)'
    >
      {erro && (
        <Container classe='pt-5'>
          <p
            role='alert'
            className='rounded-xl border border-[#f8ccb4] bg-[#fff7ed] p-4 text-sm text-[#9a3412]'
          >
            Não foi possível carregar alguns dados locais. Exibindo o catálogo
            demonstrativo sem apagar registros salvos.
          </p>
        </Container>
      )}

      <div className='flex-1'>
        {visao === 'hub' && (
          <VisaoPrincipalMercado
            dentroDaEmpresa={dentroDaEmpresa}
            empresas={empresas}
            servicos={servicos}
            favoritos={favoritos}
            aoAlternarFavorito={alternarFavorito}
          />
        )}
        {visao === 'buscar' && (
          <VisaoBuscarServicos
            key={search}
            empresas={empresas}
            servicos={servicos}
            favoritos={favoritos}
            aoAlternarFavorito={alternarFavorito}
          />
        )}
        {visao === 'filtros' && <VisaoFiltrosMercado key={search} />}
        {visao === 'mapa' && (
          <VisaoMapaServicos
            pinos={pinosMapaSaoPaulo}
            servicos={servicos}
            empresas={empresas}
          />
        )}
        {visao === 'categoria' && (
          <VisaoCategoriaServicos
            empresas={empresas}
            servicos={servicos}
            favoritos={favoritos}
            aoAlternarFavorito={alternarFavorito}
          />
        )}
        {visao === 'servico' && (
          <DetalheServico
            empresas={empresas}
            servicos={servicos}
            avaliacoes={avaliacoes}
            favoritos={favoritos}
            aoAlternarFavorito={alternarFavorito}
          />
        )}
        {visao === 'indisponivel' && <DetalheServico indisponivel />}
        {visao === 'avaliacoes' && (
          <AvaliacoesServico
            servicos={servicos}
            empresas={empresas}
            avaliacoes={avaliacoes}
            aoAdicionarAvaliacao={adicionarAvaliacao}
          />
        )}
        {visao === 'perfil' && (
          <PerfilEmpresaPublico
            empresas={empresas}
            servicos={servicos}
            avaliacoes={avaliacoes}
          />
        )}
        {visao === 'contato' && (
          <SolicitacaoContato servicos={servicos} empresas={empresas} />
        )}
        {visao === 'favoritos' && (
          <VisaoFavoritosMercado
            servicos={servicos}
            empresas={empresas}
            favoritos={favoritos}
            aoAlternarFavorito={alternarFavorito}
          />
        )}
        {visao === 'contatos' && (
          <VisaoMeusContatosMercado contatos={contatos} />
        )}
      </div>

      {!dentroDaEmpresa && <Rodape variante='inicial' />}
    </div>
  );
}

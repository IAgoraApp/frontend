import { IconeEstrela } from '../../../compartilhado/interface/IndicadoresFuncionais';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LinkNavegacao as Link } from '../../../compartilhado/interface/LinkNavegacao';

import {
  Botao,
  CampoFormulario,
  Container,
  EstadoVazio,
  SeloEditorial,
  Titulo,
} from '../../../compartilhado/interface/indice';
import { atualizarEmpresa } from '../../../aplicacao/estado/estadoEmpresa';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../../aplicacao/estado/estadoPlataforma';

export default function SolicitacaoContato({
  servicos = [],
  empresas = [],
}) {
  const { id } = useParams();
  const servico = servicos.find(item => item.id === id);
  const empresa = empresas.find(item => item.id === servico?.empresaId);
  const plataforma = lerEstadoPlataforma();

  const [nome, setNome] = useState(plataforma.perfil?.nomeCompleto || '');
  const [contato, setContato] = useState(plataforma.perfil?.telefone || '');
  const [regiao, setRegiao] = useState(
    plataforma.perfil?.bairro
      ? `${plataforma.perfil.bairro}, ${plataforma.perfil.cidade || 'São Paulo'}`
      : ''
  );
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [idGerado, setIdGerado] = useState('');

  if (!servico || !empresa) {
    return (
      <Container como='main' classe='py-10 pb-16'>
        <EstadoVazio
          varianteAlerta='erro'
          titulo='Serviço não encontrado'
          descricao='Não foi possível abrir o formulário de contato para este anúncio.'
          textoAcao='Voltar para a busca'
          rotaAcao='/buscar'
        />
      </Container>
    );
  }

  function enviarPedido(evento) {
    evento.preventDefault();
    if (!nome.trim() || !contato.trim() || !mensagem.trim()) {
      setErro('Preencha seu nome, contato e a mensagem sobre o que precisa.');
      return;
    }
    if (
      !contato.includes('@') &&
      contato.replace(/\D/g, '').length < 10
    ) {
      setErro('Informe um telefone com DDD ou um e-mail válido para retorno.');
      return;
    }
    if (
      contato.includes('@') &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato)
    ) {
      setErro('Informe um e-mail válido.');
      return;
    }

    const agora = new Date().toISOString();
    const novoIdContato = crypto.randomUUID();
    const idMensagem = crypto.randomUUID();

    try {
      atualizarEmpresa(anterior => ({
        ...anterior,
        contatos: [
          ...anterior.contatos,
          {
            id: novoIdContato,
            empresaId: empresa.id,
            nome: nome.trim(),
            contato: contato.trim(),
            anuncioId: servico.id,
            servico: servico.titulo,
            situacao: 'naoLido',
            criadoEm: agora,
            mensagens: [
              {
                id: idMensagem,
                autor: 'cliente',
                texto: mensagem.trim(),
                data: agora,
              },
            ],
          },
        ],
        anuncios: anterior.anuncios.map(item =>
          item.id === servico.id
            ? {
                ...item,
                contatosRecebidos: (item.contatosRecebidos || 0) + 1,
              }
            : item
        ),
      }));

      const atual = lerEstadoPlataforma();
      const novoContatoCliente = {
        id: novoIdContato,
        empresaId: empresa.id,
        empresaNome: empresa.nome,
        anuncioId: servico.id,
        servico: servico.titulo,
        regiao: regiao.trim() || servico.regiao,
        situacao: 'Em andamento',
        atualizadoEm: 'Agora mesmo',
        mensagens: [
          {
            id: idMensagem,
            autor: 'cliente',
            texto: mensagem.trim(),
            data: agora,
          },
        ],
      };

      salvarEstadoPlataforma({
        ...atual,
        contatosCliente: [
          novoContatoCliente,
          ...(atual.contatosCliente || []),
        ],
      });

      setErro('');
      setIdGerado(novoIdContato);
    } catch (excecao) {
      setErro(excecao.message || 'Não foi possível registrar o pedido agora.');
    }
  }

  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <header className='space-y-3 border-b border-[#e6edf2] pb-6'>
        <Link
          to={`/servicos/${servico.id}`}
          className='inline-flex items-center text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
        >
 Voltar para o serviço
        </Link>
        <SeloEditorial texto='COMBINAR ATENDIMENTO' />
        <Titulo
          como='h1'
          classe='text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'
        >
          Entrar em contato com {empresa.nome}
        </Titulo>
        <p className='max-w-[680px] text-base text-(--texto-apoio)'>
          Descreva o tamanho do espaço, o que precisa resolver e seus melhores
          dias para atendimento.
        </p>
      </header>

      <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]'>
        <section className='rounded-2xl border border-[#dbe5ed] bg-white p-6 sm:p-8'>
          {idGerado ? (
            <div
              role='status'
              className='space-y-4 rounded-2xl border border-[#abefc6] bg-[#ecfdf3] p-6 text-[#18794e]'
            >
              <Titulo
                como='h2'
                classe='text-2xl font-extrabold text-(--azul-titulo)'
              >
                Solicitação enviada com sucesso
              </Titulo>
              <p className='text-sm leading-relaxed text-(--azul-titulo)'>
                Seu pedido já foi registrado no histórico de conversas deste
                navegador e também aparece na área de contatos da empresa{' '}
                <strong>{empresa.nome}</strong>.
              </p>
              <div className='flex flex-wrap gap-3 pt-1'>
                <Botao
                  como={Link}
                  to={`/meus-contatos/${idGerado}`}
                  cor='laranja'
                >
                  Abrir conversa em Meus contatos
                </Botao>
                <Botao
                  como={Link}
                  to='/buscar'
                  variante='secundario'
                >
                  Explorar mais serviços
                </Botao>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={enviarPedido} className='space-y-5'>
              <div className='grid gap-5 sm:grid-cols-2'>
                <CampoFormulario
                  id='contato-nome'
                  rotulo='Seu nome'
                  value={nome}
                  onChange={evento => {
                    setNome(evento.target.value);
                    if (erro) setErro('');
                  }}
                  placeholder='Nome completo'
                  maxLength={100}
                  required
                />
                <CampoFormulario
                  id='contato-canal'
                  rotulo='Seu contato (WhatsApp ou e-mail)'
                  value={contato}
                  onChange={evento => {
                    setContato(evento.target.value);
                    if (erro) setErro('');
                  }}
                  placeholder='(11) 99999-0000 ou voce@email.com'
                  maxLength={150}
                  required
                />
              </div>

              <CampoFormulario
                id='contato-regiao'
                rotulo='Região ou bairro do atendimento'
                value={regiao}
                onChange={evento => setRegiao(evento.target.value)}
                placeholder='Ex: Vila Mariana, São Paulo'
                maxLength={150}
              />

              <label
                htmlFor='contato-mensagem'
                className='flex flex-col gap-2 text-sm font-bold text-(--azul-titulo)'
              >
                Mensagem para a empresa
                <textarea
                  id='contato-mensagem'
                  rows={5}
                  value={mensagem}
                  onChange={evento => {
                    setMensagem(evento.target.value);
                    if (erro) setErro('');
                  }}
                  maxLength={2000}
                  placeholder='Conte os detalhes do atendimento, metragem aproximada e preferência de data...'
                  className='rounded-xl border border-[#dbe5ed] bg-white p-4 text-base font-normal text-(--azul-titulo) placeholder:text-(--texto-apoio) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal)'
                  required
                />
              </label>

              <p className='text-xs text-(--texto-apoio)'>
                Demonstração local: sua solicitação fica salva neste navegador e
                sincronizada com o painel de contatos da empresa.
              </p>

              {erro && (
                <p role='alert' className='text-sm font-semibold text-[#b42318]'>
                  {erro}
                </p>
              )}

              <Botao type='submit' cor='laranja' classe='px-7!'>
                Enviar solicitação
              </Botao>
            </form>
          )}
        </section>

        <aside className='space-y-4 rounded-2xl border border-[#f8ccb4] bg-[#fce8dc] p-6'>
          <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
            RESUMO DO SERVIÇO
          </p>
          <img
            src={servico.imagem}
            alt={servico.titulo}
            className='aspect-[16/10] w-full rounded-xl object-cover'
          />
          <Titulo
            como='h2'
            classe='text-xl font-extrabold text-(--azul-titulo)'
          >
            {servico.titulo}
          </Titulo>
          <p className='text-sm font-bold text-(--texto-apoio)'>
            {empresa.nome} · <IconeEstrela /> {servico.nota}
          </p>
          <dl className='space-y-2 border-t border-[#f3bfa1] pt-3 text-sm'>
            <div className='flex justify-between gap-2'>
              <dt className='text-(--texto-apoio)'>Valor base</dt>
              <dd className='font-bold text-(--azul-titulo)'>
                {servico.preco}
              </dd>
            </div>
            <div className='flex justify-between gap-2'>
              <dt className='text-(--texto-apoio)'>Região</dt>
              <dd className='text-right font-bold text-(--azul-titulo)'>
                {servico.regiao}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </Container>
  );
}

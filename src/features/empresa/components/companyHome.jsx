import { BriefcaseBusiness, MessageCircle, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Botao, Container, Titulo } from '../../../shared/ui';
import { hoje } from '../../../app/dados/bancoMvp';
import CabecalhoInicio from '../../home/components/CabecalhoInicio';
import CartaoAgenda from '../../home/components/CartaoAgenda';
import '../../home/home.css';

const atalhos = [
  {
    rota: '/empresa/anuncios',
    rotulo: 'Meus serviços',
    Icone: BriefcaseBusiness,
  },
  { rota: '/empresa/contatos', rotulo: 'Atendimentos', Icone: MessageCircle },
  { rota: '/empresa/perfil', rotulo: 'Perfil da empresa', Icone: UserRound },
];

export default function InicioEmpresa({ empresa, servicos, pedidos }) {
  const pendentes = pedidos.filter(p => p.status === 'pendente');
  const eventos = pedidos
    .filter(
      p => p.data_agendamento && ['aceito', 'em_andamento'].includes(p.status)
    )
    .map(p => ({
      id: p.id,
      data: p.data_agendamento.slice(0, 10),
      titulo: servicos.find(s => s.id === p.servico_id)?.titulo,
      subtitulo: new Date(p.data_agendamento).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      tipo: 'atendimento',
      rota: '/empresa/contatos',
    }));
  return (
    <div
      lang='pt-BR'
      className='empresa-inicio inicio-tela min-w-0 bg-white font-corpo text-(--azul-titulo)'
    >
      <Container como='main' classe='inicio-conteudo'>
        <CabecalhoInicio
          titulo='Oi! Como vai seu negócio?'
          rotulo='Sua empresa'
          contexto={empresa?.nome ?? 'Perfil comercial'}
          destino='/empresa/perfil'
          acao='Ver perfil'
          atalhos={atalhos}
        />
        <div className='inicio-paineis grid items-stretch gap-5 lg:grid-cols-2'>
          <section
            className='inicio-tarefas flex min-w-0 items-center rounded-md bg-(--azul-escuro) p-7 sm:p-10'
            aria-labelledby='empresa-tarefas'
          >
            <div className='min-w-0 max-w-lg'>
              <p className='text-xs font-bold'>Atendimentos</p>
              <Titulo
                id='empresa-tarefas'
                classe='mt-4 text-3xl font-extrabold text-white!'
              >
                {pendentes.length
                  ? `${pendentes.length} em negociação`
                  : 'Tudo em dia'}
              </Titulo>
              <p className='mt-4 text-white/90'>
                {eventos.filter(e => e.data === hoje()).length} atendimentos
                agendados para hoje.
              </p>
              <Botao
                como={Link}
                to='/empresa/contatos'
                cor='laranja'
                classe='mt-6 min-h-13 rounded-full px-8'
              >
                Ver atendimentos
              </Botao>
            </div>
          </section>
          <section
            className='inicio-agenda flex min-w-0 flex-col justify-between gap-6'
            aria-label='Agenda de atendimentos'
          >
            <CartaoAgenda
              eventosDisponiveis={eventos}
              rotaVazia='/empresa/contatos'
              acaoVazia='Ver atendimentos →'
            />
          </section>
        </div>
      </Container>
    </div>
  );
}

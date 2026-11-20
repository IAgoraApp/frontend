import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hoje, moeda } from '../../../app/dados/bancoMvp';
import { listar, resumoMoradia } from '../../preparacao/modelo';
import {
  nomeCategoria,
  servicoPublico,
} from '../../marketplace/marketplaceDados';
import { Titulo } from '../../../shared/ui/index';

import fotoCasa from '../../casa/assets/residencia-minha.png';
import fotoLimpeza from '../../casa/assets/casa-organizada-notebook.jpg';
import fotoCozinha from '../../casa/assets/cozinha-comida-boa.jpg';
import fotoServicos from '../../casa/assets/servicos-davi-igor.jpg';
import arteFinancas from '../../landing-page/assets/05-financas-3d.png';

import arteIA from '../../rotina/assets/robot.png';

const quantidade = (total, singular, plural) =>
  `${total} ${total === 1 ? singular : plural}`;

export function ResumoPlataforma({ banco, preparacao = false }) {
  const { b, perfil, casa, comodos, limpezas, transacoes } = banco;
  const dia = hoje();
  const contas = transacoes.filter(
    t => t.tipo === 'despesa' && t.status === 'pendente'
  );
  const valorPendente = contas.reduce(
    (total, conta) => total + Number(conta.valor),
    0
  );
  const limpezasPendentes = limpezas.filter(
    item => item.proxima_vez && item.proxima_vez <= dia
  );
  const listas = b.compras.filter(lista => lista.casa_id === casa?.id);
  const itensPendentes = b.compra_item.filter(
    item => !item.comprado && listas.some(lista => lista.id === item.compras_id)
  );

  const proximaConta = contas
    .filter(conta => conta.vencimento)
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento))[0];
  const usuario = perfil?.user_id;
  const plano =
    preparacao &&
    listar(b, 'plano_moradia', usuario).find(item => item.status === 'ativo');
  const custosPlano = plano
    ? listar(b, 'custo_moradia', usuario, plano.id)
    : [];
  const categoriasDisponiveis = preparacao
    ? [
        ...new Set(
          b.servico
            .filter(servico =>
              servicoPublico(
                servico,
                b.perfil_empresa.find(
                  empresa => empresa.id === servico.empresa_id
                )
              )
            )
            .map(servico => servico.categoria)
        ),
      ]
    : [];
  const totalDoUsuario = colecao =>
    b[colecao].filter(item => item.user_id === usuario).length;
  const casaCards = preparacao
    ? [
        [
          fotoCasa,
          'Imóveis desejados',
          quantidade(
            totalDoUsuario('casa_desejada'),
            'imóvel cadastrado',
            'imóveis cadastrados'
          ),
          '/encontrar-casa',
        ],
        [
          fotoLimpeza,
          'Minha jornada',
          quantidade(totalDoUsuario('jornada'), 'jornada', 'jornadas'),
          '/minhajornada',
        ],
        [
          fotoCozinha,
          'Aprendendo a morar',
          quantidade(
            b.progresso_aula.filter(
              item => item.user_id === usuario && item.concluida
            ).length,
            'aula concluída',
            'aulas concluídas'
          ),
          '/aprendendo',
        ],
      ]
    : [
        [
          fotoCasa,
          casa?.nome || 'Minha residência',
          quantidade(
            comodos.length,
            'cômodo cadastrado',
            'cômodos cadastrados'
          ),
          '/casa',
        ],
        [
          fotoLimpeza,
          'Limpeza',
          limpezasPendentes.length
            ? quantidade(
                limpezasPendentes.length,
                'atividade até hoje',
                'atividades até hoje'
              )
            : 'Limpezas de hoje em dia',
          '/limpeza',
        ],
        [
          fotoCozinha,
          'Cozinha',
          itensPendentes.length
            ? quantidade(
                itensPendentes.length,
                'item por comprar',
                'itens por comprar'
              )
            : 'Receitas, despensa e compras',
          '/cozinha',
        ],
      ];
  return (
    <section className='inicio-resumo' aria-labelledby='inicio-resumo-titulo'>
      <Titulo id='inicio-resumo-titulo'>Visão geral</Titulo>

      <section
        className='inicio-financas'
        aria-labelledby='inicio-financas-titulo'
      >
        <div>
          <Titulo como='h3' id='inicio-financas-titulo'>
            Finanças
          </Titulo>
          {preparacao ? (
            <>
              <p className='inicio-financas-valor'>
                {custosPlano.length
                  ? moeda(
                      resumoMoradia(
                        plano.renda_mensal,
                        plano.reserva_atual,
                        custosPlano
                      ).inicial
                    )
                  : 'Custos da mudança'}
              </p>
              <p>
                {custosPlano.length
                  ? 'Gastos iniciais registrados no seu plano'
                  : 'Cadastre os gastos iniciais para estimar quanto precisa guardar.'}
              </p>
            </>
          ) : (
            <>
              <p className='inicio-financas-valor'>{moeda(valorPendente)}</p>
              <p>
                {contas.length
                  ? `A pagar em ${quantidade(contas.length, 'lançamento', 'lançamentos')}`
                  : 'Nenhum pagamento pendente'}
              </p>
              {proximaConta && (
                <p className='inicio-financas-conta'>
                  {proximaConta.vencimento < dia
                    ? 'Em atraso'
                    : 'Próximo vencimento'}{' '}
                  <strong>{proximaConta.descricao}</strong>
                </p>
              )}
            </>
          )}
          <Link
            className='inicio-resumo-link'
            to={preparacao ? '/financas-b?visao=custos' : '/financas'}
          >
            Ver minhas finanças <ChevronRight size={18} aria-hidden='true' />
          </Link>
        </div>
        <img src={arteFinancas} alt='' loading='lazy' />
      </section>

      <section
        className='inicio-resumo-grupo'
        aria-labelledby='inicio-casa-titulo'
      >
        <Titulo como='h3' id='inicio-casa-titulo'>
          {preparacao ? 'Minha mudança' : 'Minha casa'}
        </Titulo>
        <ul className='inicio-casa-cartoes'>
          {casaCards.map(([foto, nome, resumo, rota]) => (
            <li key={rota}>
              <Link className='inicio-foto-cartao' to={rota}>
                <img src={foto} alt='' loading='lazy' />
                <span className='inicio-foto-legenda'>
                  <span>
                    <strong>{nome}</strong>
                    <span>{resumo}</span>
                  </span>
                  <ChevronRight size={20} aria-hidden='true' />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className='inicio-servicos-grade'>
        <section
          className='inicio-servico inicio-servico-mercado'
          aria-labelledby='inicio-marketplace-titulo'
        >
          <img src={fotoServicos} alt='' loading='lazy' />
          <div className='inicio-servico-conteudo'>
            <Titulo como='h3' id='inicio-marketplace-titulo'>
              Marketplace
            </Titulo>
            <p>
              Encontre profissionais, confira avaliações e escolha quem chamar
              para cuidar da sua casa.
            </p>
            {preparacao ? (
              categoriasDisponiveis.length > 0 && (
                <ul
                  className='inicio-mercado-categorias'
                  aria-label='Categorias de serviços'
                >
                  {categoriasDisponiveis.map(categoria => (
                    <li key={categoria}>
                      <Link to={'/categoria/' + categoria}>
                        {nomeCategoria(categoria)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <ul
                className='inicio-mercado-categorias'
                aria-label='Categorias de serviços'
              >
                <li>
                  <Link to='/categoria/limpeza'>Limpeza</Link>
                </li>
                <li>
                  <Link to='/categoria/manutencao'>Manutenção</Link>
                </li>
                <li>
                  <Link to='/categoria/mudancas'>Mudanças</Link>
                </li>
              </ul>
            )}
            <Link className='inicio-resumo-link' to='/marketplace'>
              Explorar serviços <ChevronRight size={18} aria-hidden='true' />
            </Link>
          </div>
        </section>
        <section
          className='inicio-servico inicio-servico-ia'
          aria-labelledby='inicio-ia-titulo'
        >
          <img src={arteIA} alt='' loading='lazy' />
          <div className='inicio-servico-conteudo'>
            <Titulo como='h3' id='inicio-ia-titulo'>
              {preparacao ? 'Ajuda para planejar' : 'Assistente IA'}
            </Titulo>
            <p>
              {preparacao
                ? 'Consulte orientações para interpretar seus custos e organizar as próximas etapas.'
                : 'Peça ajuda para organizar a semana, planejar uma mudança ou cuidar da casa.'}
            </p>
            <p className='inicio-ia-exemplo'>
              {preparacao
                ? 'Respostas prontas sobre o planejamento'
                : '“Como montar uma rotina para a semana?”'}
            </p>
            <Link
              className='inicio-resumo-link'
              to={preparacao ? '/ia-b' : '/ia'}
            >
              {preparacao ? 'Ver orientações' : 'Conversar com a IA'}{' '}
              <ChevronRight size={18} aria-hidden='true' />
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}

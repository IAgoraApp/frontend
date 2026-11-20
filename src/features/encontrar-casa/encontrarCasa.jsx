import { useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Plus,
  Sofa,
  Wallet,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { acessoLocal } from '../../app/dados/acessoLocal';
import {
  alterarBancoPreparacao,
  dataCurta,
  moeda,
  useBancoMvp,
} from '../../app/dados/bancoMvp';
import { Botao, EstadoVazio } from '../../shared/ui';
import { EditorMvp, ResumoMvp } from '../../shared/ui/mvp';
import { BotaoCasa, DialogoCasa } from '../casa/components/casaUi';
import PerfilCasa from '../casa/components/perfilCasa';
import LayoutPreparacao, { painel } from '../preparacao/LayoutPreparacao';
import { listar } from '../preparacao/modelo';
import { tipoValorImovel } from '../preparacao/valorImovel';
import {
  gravarPrevisaoMudanca,
  lerPrevisaoMudanca,
} from '../preparacao/previsaoMudanca';
import { resumirOrcamento } from '../financas-B/dinheiroDados';
import fotoApartamento from './assets/apartamento-vila-mariana.jpg';
import fotoStudio from './assets/studio-sp-iagora.jpg';
import '../casa/casaA.css';
import EditorImovel from './EditorImovel';
import { opcoesMobilia } from './imovelDados';

const camposPrevisao = [
  {
    nome: 'mudanca_prevista',
    rotulo: 'Data prevista',
    tipo: 'date',
    obrigatorio: false,
  },
];

function salvarPrevisao(usuario, data) {
  alterarBancoPreparacao(banco => gravarPrevisaoMudanca(banco, usuario, data));
}

export default function EncontrarCasa() {
  const { b, perfil } = useBancoMvp();
  const [params, setParams] = useSearchParams();
  const [editor, setEditor] = useState(null);
  const [editarPrevisao, setEditarPrevisao] = useState(false);
  const [excluir, setExcluir] = useState(false);
  const [erro, setErro] = useState('');
  const usuario = perfil?.user_id;
  const imoveis = listar(b, 'casa_desejada', usuario);
  const imovel =
    imoveis.find(item => item.id === Number(params.get('imovel'))) ??
    imoveis[0];
  const indice = imoveis.indexOf(imovel);
  const tipoValor = tipoValorImovel(imovel);
  const mobilia = opcoesMobilia.find(
    ([valor]) => valor === imovel?.mobilia
  )?.[1];
  const endereco = b.endereco.find(item => item.id === imovel?.endereco_id);
  const dataPrevista = lerPrevisaoMudanca(b, usuario);
  const rotaPlano = imovel ? '/financas-b?imovel=' + imovel.id : '/financas-b';
  const resumo = resumirOrcamento(b, usuario, imovel);

  function selecionarImovel(indiceDestino) {
    const destino = imoveis[indiceDestino];
    if (!destino) return;
    setParams(
      anteriores => {
        const proximos = new URLSearchParams(anteriores);
        proximos.set('imovel', destino.id);
        return proximos;
      },
      { preventScrollReset: true }
    );
  }

  function abrirEditor(registro) {
    setEditor(registro ?? {});
  }

  function confirmarExclusao() {
    try {
      alterarBancoPreparacao(banco => {
        banco.casa_desejada = banco.casa_desejada.filter(
          item => item.id !== imovel.id || item.user_id !== usuario
        );
        banco.vinculos_planos_imoveis =
          banco.vinculos_planos_imoveis?.filter(
            item => item.imovel_id !== imovel.id || item.user_id !== usuario
          ) ?? [];
      });
      setExcluir(false);
      setParams({});
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <LayoutPreparacao
      titulo='Imóveis desejados'
      descricao='Acompanhe as opções que você considera para a mudança.'
      chaveSecao='imoveis-desejados'
      acao={
        acessoLocal && (
          <BotaoCasa onClick={() => abrirEditor()}>
            <Plus size={17} aria-hidden='true' /> Adicionar imóvel
          </BotaoCasa>
        )
      }
    >
      {acessoLocal && usuario && (
        <section
          className='imoveis-previsao'
          aria-labelledby='imoveis-previsao-titulo'
        >
          <CalendarDays size={22} aria-hidden='true' />
          <div>
            <h2 id='imoveis-previsao-titulo'>Mudança prevista</h2>
            <p>{dataPrevista ? dataCurta(dataPrevista) : 'Data a definir'}</p>
          </div>
          <button
            type='button'
            onClick={() => {
              setErro('');
              setEditarPrevisao(true);
            }}
          >
            {dataPrevista ? 'Alterar data' : 'Definir data'}
          </button>
        </section>
      )}
      {!acessoLocal ? (
        <EstadoVazio
          titulo='Disponível na prévia local'
          descricao='A lista de imóveis aguarda integração com o servidor.'
        />
      ) : !imovel ? (
        <EstadoVazio
          titulo='Nenhum imóvel cadastrado'
          descricao='Adicione uma opção para guardar o endereço, o valor e suas observações.'
        />
      ) : (
        <>
          <div
            className='imoveis-navegacao'
            role='group'
            aria-label='Opções de moradia'
          >
            <h2>Opções de moradia</h2>
            <div className='imoveis-setas'>
              <button
                type='button'
                aria-label='Imóvel anterior'
                disabled={indice === 0}
                onClick={() => selecionarImovel(indice - 1)}
              >
                <ChevronLeft size={20} aria-hidden='true' />
              </button>
              <span aria-live='polite'>
                {indice + 1} de {imoveis.length}
              </span>
              <button
                type='button'
                aria-label='Próximo imóvel'
                disabled={indice === imoveis.length - 1}
                onClick={() => selecionarImovel(indice + 1)}
              >
                <ChevronRight size={20} aria-hidden='true' />
              </button>
            </div>
          </div>
          <div className='imoveis-destaque'>
            <PerfilCasa
              casa={{
                nome: imovel.titulo,
                tipo: imovel.tipo ?? 'Tipo a definir',
              }}
              foto={
                /studio|kitnet/i.test(imovel.tipo)
                  ? fotoStudio
                  : fotoApartamento
              }
              legendaFoto='Foto de referência de um imóvel'
            >
              <p className='imoveis-status-mobilia'>
                <Sofa size={17} aria-hidden='true' />{' '}
                {mobilia ?? 'Mobília a confirmar'}
              </p>
              <div className='imoveis-endereco'>
                <MapPin size={19} aria-hidden='true' />
                {endereco ? (
                  <div>
                    <strong>
                      {[endereco.cidade, endereco.estado]
                        .filter(Boolean)
                        .join(' / ') || 'Endereço'}
                    </strong>
                    <p>
                      {[endereco.rua, endereco.numero, endereco.complemento]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    <p>
                      {[
                        endereco.bairro,
                        endereco.cep &&
                          'CEP ' +
                            String(endereco.cep).replace(
                              /^(\d{5})(\d{3})$/,
                              '$1-$2'
                            ),
                        endereco.pais,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                ) : (
                  <span>Endereço ainda não informado</span>
                )}
              </div>
              <button
                type='button'
                className='imoveis-editar-ficha'
                onClick={() => abrirEditor(imovel)}
              >
                <Pencil size={16} aria-hidden='true' /> Editar imóvel
              </button>
            </PerfilCasa>
            {imovel.descricao && (
              <div className='imoveis-observacoes'>
                <h3>Observações</h3>
                <p>{imovel.descricao}</p>
              </div>
            )}
          </div>
          <ResumoMvp
            itens={[
              [
                tipoValor === 'total'
                  ? 'Valor total do imóvel'
                  : tipoValor === 'mensal'
                    ? 'Valor mensal do imóvel'
                    : 'Valor do imóvel',
                imovel.valor == null ? 'A definir' : moeda(imovel.valor),
              ],
              [
                'Renda mensal',
                resumo.renda != null ? moeda(resumo.renda) : 'A informar',
              ],
              [
                'Gastos mensais no plano',
                resumo.temCustoMensal
                  ? moeda(resumo.gastosFuturos)
                  : 'A estimar',
              ],
            ]}
          />
          <div className='casa-paineis'>
            <Link className='casa-painel-atalho' to={rotaPlano}>
              <span className='casa-painel-titulo'>
                <Wallet size={19} aria-hidden='true' /> Gerenciar financeiro
                <ArrowUpRight size={16} aria-hidden='true' />
              </span>
              <span className='casa-painel-previa'>
                {resumo.renda > 0 &&
                imovel.valor != null &&
                tipoValor === 'mensal'
                  ? 'O valor mensal equivale a ' +
                    (imovel.valor / resumo.renda).toLocaleString('pt-BR', {
                      style: 'percent',
                      maximumFractionDigits: 1,
                    }) +
                    ' da renda do plano.'
                  : 'Use um plano para simular o impacto do imóvel no orçamento.'}
              </span>
            </Link>
            <Link
              className='casa-painel-atalho'
              to='/minhajornada?etapa=compras'
            >
              <span className='casa-painel-titulo'>
                <ClipboardList size={19} aria-hidden='true' /> Checklist de
                compras
                <ArrowUpRight size={16} aria-hidden='true' />
              </span>
              <span className='casa-painel-previa'>
                Confira o que já tem e o que falta para a mudança.
              </span>
            </Link>
          </div>
        </>
      )}
      {editarPrevisao && (
        <DialogoCasa
          titulo='Mudança prevista'
          classe='imoveis-modal imoveis-modal-data'
          aoFechar={() => setEditarPrevisao(false)}
        >
          <p className='imoveis-editor-ajuda'>
            Escolha a data que você tem em mente para a mudança.
          </p>
          <EditorMvp
            cabecalho={false}
            campos={camposPrevisao}
            inicial={{ mudanca_prevista: dataPrevista }}
            onSave={valores =>
              salvarPrevisao(usuario, valores.mudanca_prevista)
            }
            onClose={() => setEditarPrevisao(false)}
            rotuloSalvar='Salvar data'
            acaoSecundaria={
              dataPrevista && (
                <button
                  type='button'
                  className='font-bold text-(--vermelho-alerta)'
                  onClick={() => {
                    try {
                      salvarPrevisao(usuario, null);
                      setEditarPrevisao(false);
                    } catch (falha) {
                      setErro(falha.message);
                    }
                  }}
                >
                  Remover data
                </button>
              )
            }
          />
          {erro && <p role='alert'>{erro}</p>}
        </DialogoCasa>
      )}
      {editor && (
        <EditorImovel
          usuario={usuario}
          imovel={editor}
          endereco={b.endereco.find(item => item.id === editor.endereco_id)}
          aoSalvar={id => setParams({ imovel: id })}
          aoFechar={() => setEditor(null)}
          aoExcluir={
            editor.id
              ? () => {
                  setEditor(null);
                  setErro('');
                  setExcluir(true);
                }
              : undefined
          }
        />
      )}
      {excluir && imovel && (
        <DialogoCasa
          titulo='Excluir imóvel?'
          aoFechar={() => setExcluir(false)}
        >
          <p>{imovel.titulo} será removido das opções de moradia.</p>
          {erro && (
            <p className={painel} role='alert'>
              {erro}
            </p>
          )}
          <div className='mt-4 flex flex-wrap justify-end gap-2'>
            <Botao
              type='button'
              variante='contorno'
              onClick={() => setExcluir(false)}
            >
              Cancelar
            </Botao>
            <Botao type='button' onClick={confirmarExclusao}>
              Excluir imóvel
            </Botao>
          </div>
        </DialogoCasa>
      )}
    </LayoutPreparacao>
  );
}

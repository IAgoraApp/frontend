import { useState } from 'react';
import {
  Archive,
  ArrowUpRight,
  CalendarDays,
  DoorOpen,
  Pencil,
  ShoppingBasket,
  Sparkles,
  Store,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PerfilCasa from './components/perfilCasa';
import { BotaoCasa, DialogoCasa } from './components/casaUi';
import './casaA.css';
import { alterarBanco, dataCurta, useBancoMvp } from '../../app/dados/bancoMvp';
import {
  ColecaoMvp,
  EditorMvp,
  PaginaMvp,
  ResumoMvp,
} from '../../shared/ui/mvp';
export default function CasaA() {
  const { b, casa, comodos, endereco, limpezas } = useBancoMvp();
  const [editar, setEditar] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [painel, setPainel] = useState(null);
  const cuidados = limpezas
    .slice()
    .sort((a, c) =>
      (a.proxima_vez || '9999').localeCompare(c.proxima_vez || '9999')
    )
    .slice(0, 3);
  return (
    <div className='casa-identidade'>
      <PaginaMvp
        titulo='Minha casa'
        acao={
          <BotaoCasa
            classe='casa-editar-residencia'
            onClick={() => setEditar(true)}
          >
            <Pencil size={15} aria-hidden='true' /> Editar residência
          </BotaoCasa>
        }
      >
        <p className='sr-only' role='status'>
          {salvo && 'Residência atualizada nesta sessão.'}
        </p>
        {editar && (
          <DialogoCasa
            titulo='Editar residência'
            aoFechar={() => setEditar(false)}
          >
            <div className='casa-edicao-modal'>
              <EditorMvp
                cabecalho={false}
                titulo='Editar residência'
                inicial={{ ...endereco, nome: casa.nome, tipo: casa.tipo }}
                campos={[
                  { nome: 'nome', rotulo: 'Nome da casa' },
                  { nome: 'tipo', rotulo: 'Tipo de moradia' },
                  ...[
                    'rua',
                    'numero',
                    'bairro',
                    'cidade',
                    'estado',
                    'cep',
                    'complemento',
                  ].map(nome => ({
                    nome,
                    rotulo: {
                      rua: 'Rua',
                      numero: 'Número',
                      bairro: 'Bairro',
                      cidade: 'Cidade',
                      estado: 'Estado',
                      cep: 'CEP',
                      complemento: 'Complemento',
                    }[nome],
                    obrigatorio: nome !== 'complemento',
                  })),
                ]}
                onClose={() => setEditar(false)}
                onSave={v => {
                  alterarBanco(db => {
                    db.casa = db.casa.map(c =>
                      c.id === casa.id
                        ? { ...c, nome: v.nome, tipo: v.tipo }
                        : c
                    );
                    db.endereco = db.endereco.map(e =>
                      e.id === casa.endereco_id
                        ? {
                            ...e,
                            ...Object.fromEntries(
                              [
                                'rua',
                                'numero',
                                'bairro',
                                'cidade',
                                'estado',
                                'cep',
                                'complemento',
                              ].map(k => [k, v[k]])
                            ),
                          }
                        : e
                    );
                  });
                  setSalvo(true);
                }}
              />
            </div>
          </DialogoCasa>
        )}
        <PerfilCasa casa={casa} endereco={endereco} />
        <ResumoMvp
          itens={[
            ['Cômodos', comodos.length],
            ['Limpezas', limpezas.length],
            [
              'Estoque',
              b.estoque_item.filter(e => e.casa_id === casa.id).length,
            ],
            ['Compras', b.compras.filter(c => c.casa_id === casa.id).length],
          ]}
        />
        <div className='casa-paineis'>
          <button
            className='casa-painel-atalho'
            type='button'
            aria-haspopup='dialog'
            onClick={() => setPainel('comodos')}
          >
            <span className='casa-painel-titulo'>
              <DoorOpen size={19} aria-hidden='true' /> Seus cômodos{' '}
              <ArrowUpRight size={16} aria-hidden='true' />
            </span>
            <span className='casa-painel-previa'>
              {comodos
                .slice(0, 4)
                .map(c => c.nome)
                .join(', ') || 'Adicionar cômodo'}
              {comodos.length > 4 ? ` e mais ${comodos.length - 4}` : ''}
            </span>
          </button>
          <button
            className='casa-painel-atalho'
            type='button'
            aria-haspopup='dialog'
            onClick={() => setPainel('cuidados')}
          >
            <span className='casa-painel-titulo'>
              <CalendarDays size={19} aria-hidden='true' /> Próximos cuidados{' '}
              <ArrowUpRight size={16} aria-hidden='true' />
            </span>
            <span className='casa-painel-previa'>
              {cuidados.map(l => l.nome).join(', ') ||
                'Nenhum cuidado agendado'}
            </span>
          </button>
        </div>
        <nav className='casa-atalhos' aria-label='Organizar a casa'>
          <Link to='/limpeza'>
            <Sparkles size={18} aria-hidden='true' /> Organizar limpezas
          </Link>
          <Link to='/cozinha?visao=despensa'>
            <Archive size={18} aria-hidden='true' /> Conferir despensa
          </Link>
          <Link to='/cozinha?visao=compras'>
            <ShoppingBasket size={18} aria-hidden='true' /> Ver compras
          </Link>
          <Link to='/marketplace'>
            <Store size={18} aria-hidden='true' /> Encontrar ajuda
          </Link>
        </nav>
        {painel === 'comodos' && (
          <DialogoCasa titulo='Seus cômodos' aoFechar={() => setPainel(null)}>
            <ColecaoMvp
              titulo='Gerenciar cômodos'
              colecao='comodo'
              registros={comodos}
              padrao={{ casa_id: casa.id }}
              campos={[
                { nome: 'nome', rotulo: 'Nome' },
                {
                  nome: 'tipo',
                  rotulo: 'Tipo',
                  opcoes: [
                    ['quarto', 'Quarto'],
                    ['sala', 'Sala'],
                    ['cozinha', 'Cozinha'],
                    ['banheiro', 'Banheiro'],
                    ['lavanderia', 'Lavanderia'],
                    ['outro', 'Outro'],
                  ],
                },
                { nome: 'descricao', rotulo: 'Descrição', obrigatorio: false },
              ]}
              detalhe={c =>
                `${c.descricao || c.tipo}\n${limpezas.filter(l => l.comodo_id === c.id).length} atividades de limpeza`
              }
            />
          </DialogoCasa>
        )}
        {painel === 'cuidados' && (
          <DialogoCasa
            titulo='Próximos cuidados'
            aoFechar={() => setPainel(null)}
          >
            {cuidados.length ? (
              <ul className='mvp-painel'>
                {cuidados.map(l => (
                  <li className='mvp-registro' key={l.id}>
                    <div>
                      <strong>{l.nome}</strong>
                      <p className='mvp-detalhe'>
                        {comodos.find(c => c.id === l.comodo_id)?.nome}
                      </p>
                    </div>
                    <span className='mvp-detalhe'>
                      {dataCurta(l.proxima_vez)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='mvp-vazio'>Nenhum cuidado agendado.</p>
            )}
            <Link className='mvp-link casa-dialogo-link' to='/limpeza'>
              Ver todas as limpezas
            </Link>
          </DialogoCasa>
        )}
      </PaginaMvp>
    </div>
  );
}

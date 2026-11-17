import { useState } from 'react';
import { Link } from 'react-router-dom';
import PerfilCasa from './components/perfilCasa';
import { DialogoCasa } from './components/casaUi';
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
  return (
    <div className='casa-identidade'>
      <PaginaMvp titulo='Minha casa'>
        {salvo && (
          <p className='mvp-sucesso' role='status'>
            Residência atualizada nesta sessão.
          </p>
        )}
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
        <PerfilCasa
          casa={casa}
          endereco={endereco}
          aoEditar={() => setEditar(true)}
        />
        <ResumoMvp
          itens={[
            ['Cômodos', comodos.length],
            ['Atividades de limpeza', limpezas.length],
            [
              'Produtos em estoque',
              b.estoque_item.filter(e => e.casa_id === casa.id).length,
            ],
            [
              'Listas de compras',
              b.compras.filter(c => c.casa_id === casa.id).length,
            ],
          ]}
        />
        <div className='mvp-grade'>
          <ColecaoMvp
            titulo='Seus cômodos'
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
          <div>
            <nav className='mvp-atalhos' aria-label='Organizar a casa'>
              <Link to='/limpeza'>Organizar limpezas</Link>
              <Link to='/cozinha?visao=despensa'>Conferir despensa</Link>
              <Link to='/cozinha?visao=compras'>Ver compras</Link>
              <Link to='/marketplace'>Encontrar ajuda</Link>
            </nav>
            {limpezas.length > 0 && (
              <section className='mvp-painel'>
                <div className='mvp-painel-topo'>
                  <h2>Próximos cuidados</h2>
                  <Link className='mvp-link' to='/limpeza'>
                    Ver todos
                  </Link>
                </div>
                {limpezas
                  .slice()
                  .sort((a, c) =>
                    (a.proxima_vez || '9999').localeCompare(
                      c.proxima_vez || '9999'
                    )
                  )
                  .slice(0, 3)
                  .map(l => (
                    <div className='mvp-registro' key={l.id}>
                      <div>
                        <strong>{l.nome}</strong>
                        <p className='mvp-detalhe'>
                          {comodos.find(c => c.id === l.comodo_id)?.nome}
                        </p>
                      </div>
                      <span className='mvp-detalhe'>
                        {dataCurta(l.proxima_vez)}
                      </span>
                    </div>
                  ))}
              </section>
            )}
          </div>
        </div>
      </PaginaMvp>
    </div>
  );
}

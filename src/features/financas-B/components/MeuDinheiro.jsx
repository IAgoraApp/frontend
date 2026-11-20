import { useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ChartNoAxesCombined,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { moeda } from '../../../app/dados/bancoMvp';
import { EditorMvp } from '../../../shared/ui/mvp';
import { BotaoCasa, DialogoCasa } from '../../casa/components/casaUi';
import { proximoId } from '../../preparacao/modelo';
import {
  alterarDinheiro,
  categoriasGasto,
  destinosGasto,
  validarValor,
} from '../dinheiroDados';
import arteOrcamento from '../../landing-page/assets/05-financas-3d.png';
import arteReserva from '../../financas/assets/porquinho-metas.webp';

const campos = [
  { nome: 'nome', rotulo: 'Nome do gasto', limite: 100 },
  { nome: 'valor', rotulo: 'Valor por mês (R$)', tipo: 'number' },
  {
    nome: 'categoria',
    rotulo: 'Categoria',
    opcoes: categoriasGasto,
    obrigatorio: false,
  },
  {
    nome: 'frequencia',
    rotulo: 'Tipo de gasto',
    opcoes: [
      ['fixo', 'Fixo'],
      ['variavel', 'Variável'],
    ],
  },
  { nome: 'destino', rotulo: 'Depois da mudança', opcoes: destinosGasto },
];

export default function MeuDinheiro({
  usuario,
  dados,
  resumo,
  rotaPlano,
  editarSituacao,
}) {
  const [editor, setEditor] = useState(null);
  const [erro, setErro] = useState('');
  const rendaInformada = resumo.renda != null;

  function salvarGasto(valores) {
    alterarDinheiro(usuario, registro => {
      const gasto = {
        ...valores,
        id: editor.id ?? proximoId(registro.gastos),
        valor: validarValor(valores.valor, 'o gasto'),
      };
      registro.gastos = editor.id
        ? registro.gastos.map(item => (item.id === editor.id ? gasto : item))
        : [...registro.gastos, gasto];
    });
  }

  function removerGasto() {
    try {
      alterarDinheiro(usuario, registro => {
        registro.gastos = registro.gastos.filter(item => item.id !== editor.id);
      });
      setEditor(null);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <>
      <section
        className='dinheiro-balanco'
        aria-label='Comparação do orçamento mensal'
      >
        <div>
          <img className='dinheiro-balanco-arte' src={arteOrcamento} alt='' />
          <p>Saldo hoje</p>
          <strong>
            {rendaInformada ? moeda(resumo.agora) : 'Informe sua renda'}
          </strong>
          <button type='button' onClick={editarSituacao}>
            <Pencil size={15} aria-hidden='true' /> Editar renda
          </button>
        </div>
        <div>
          <img className='dinheiro-balanco-arte' src={arteReserva} alt='' />
          <p>Saldo após a mudança</p>
          <strong>
            {rendaInformada && resumo.temPlano
              ? moeda(resumo.depois)
              : 'A estimar'}
          </strong>
          {!resumo.temPlano && (
            <span>Preencha os gastos em Meu plano para comparar.</span>
          )}
          <Link to={rotaPlano}>
            Abrir Meu plano <ArrowRight size={15} aria-hidden='true' />
          </Link>
        </div>
      </section>
      <section className='dinheiro-painel' aria-labelledby='dinheiro-gastos'>
        <header className='dinheiro-painel-topo'>
          <div>
            <h2 id='dinheiro-gastos'>Meus gastos mensais</h2>
            <p>
              Marque quais despesas continuam ou já estão previstas no plano.
            </p>
          </div>
          <BotaoCasa
            onClick={() => {
              setErro('');
              setEditor({});
            }}
          >
            <Plus size={17} aria-hidden='true' /> Adicionar gasto
          </BotaoCasa>
        </header>
        {dados.gastos.length ? (
          <ul className='dinheiro-lista'>
            {dados.gastos.map(item => (
              <li key={item.id} data-frequencia={item.frequencia}>
                <span className='dinheiro-gasto-icone' aria-hidden='true'>
                  {item.frequencia === 'fixo' ? (
                    <CalendarDays size={19} />
                  ) : (
                    <ChartNoAxesCombined size={19} />
                  )}
                </span>
                <div className='dinheiro-gasto-dados'>
                  <strong>{item.nome}</strong>
                  <div className='dinheiro-gasto-detalhes'>
                    <span>
                      {item.frequencia === 'fixo' ? 'Fixo' : 'Variável'}
                    </span>
                    {item.categoria && (
                      <p>
                        {
                          categoriasGasto.find(
                            ([id]) => id === item.categoria
                          )?.[1]
                        }
                      </p>
                    )}
                    <p>
                      {destinosGasto.find(([id]) => id === item.destino)?.[1]}
                    </p>
                  </div>
                </div>
                <div className='dinheiro-gasto-valor'>
                  <strong>{moeda(item.valor)}</strong>
                  <span>por mês</span>
                </div>
                <button
                  type='button'
                  aria-label={'Editar ' + item.nome}
                  title='Editar gasto'
                  onClick={() => {
                    setErro('');
                    setEditor(item);
                  }}
                >
                  <Pencil size={17} aria-hidden='true' />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className='dinheiro-vazio'>
            Adicione o primeiro gasto para calcular quanto sobra no mês.
          </p>
        )}
      </section>
      {editor && (
        <DialogoCasa
          titulo={editor.id ? 'Editar gasto' : 'Adicionar gasto'}
          classe='dinheiro-editor'
          aoFechar={() => setEditor(null)}
        >
          <div className='dinheiro-editor-ajuda'>
            <div>
              <strong>
                {editor.id ? editor.nome : 'Quanto você gasta por mês?'}
              </strong>
              <p>Se o valor varia, use a média dos últimos meses.</p>
            </div>
            <img src={arteOrcamento} alt='' />
          </div>
          <p className='dinheiro-editor-dica'>
            Se a despesa já está em Meu plano, selecione essa opção em
            <strong> Depois da mudança</strong> para evitar contar duas vezes.
          </p>
          <EditorMvp
            cabecalho={false}
            rotuloSalvar={editor.id ? 'Salvar alterações' : 'Adicionar gasto'}
            inicial={{ frequencia: 'fixo', destino: 'continua', ...editor }}
            campos={campos}
            onSave={salvarGasto}
            onClose={() => setEditor(null)}
            acaoSecundaria={
              editor.id && (
                <button
                  type='button'
                  className='dinheiro-editor-excluir'
                  onClick={removerGasto}
                >
                  <Trash2 size={15} aria-hidden='true' /> Excluir gasto
                </button>
              )
            }
          />
          {erro && <p role='alert'>{erro}</p>}
        </DialogoCasa>
      )}
    </>
  );
}

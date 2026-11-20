import { House, MapPin, Sofa, Trash2 } from 'lucide-react';
import { EditorMvp } from '../../shared/ui/mvp';
import { DialogoCasa } from '../casa/components/casaUi';
import { camposEnderecoPerfil } from '../perfil/perfilDados';
import { modelo } from '../preparacao/modelo';
import { tipoValorImovel } from '../preparacao/valorImovel';
import { opcoesMobilia, salvarImovel } from './imovelDados';
import './encontrarCasa.css';

const camposImovel = modelo.casa_desejada.campos.map(campo => ({
  ...campo,
  limite: campo.maxLength,
  rotulo: campo.nome === 'titulo' ? 'Nome do imóvel' : campo.rotulo,
  obrigatorio: campo.nome === 'titulo',
}));
const campoObservacoes = camposImovel
  .filter(campo => campo.nome === 'descricao')
  .map(campo => ({ ...campo, rotulo: 'Observações (opcional)' }));

const tiposImovel = [
  ['apartamento', 'Apartamento'],
  ['casa', 'Casa'],
  ['kitnet', 'Kitnet'],
  ['studio', 'Studio'],
  ['sobrado', 'Sobrado'],
  ['quarto', 'Quarto'],
  ['outro', 'Outro'],
];

const secoesImovel = tipoAtual => [
  {
    titulo: 'Informações básicas',
    Icone: House,
    aberta: true,
    campos: [
      ...camposImovel
        .filter(campo => ['titulo', 'tipo', 'valor'].includes(campo.nome))
        .map(campo =>
          campo.nome === 'tipo'
            ? {
                ...campo,
                opcoes:
                  tipoAtual && !tiposImovel.some(([id]) => id === tipoAtual)
                    ? [...tiposImovel, [tipoAtual, tipoAtual]]
                    : tiposImovel,
              }
            : campo
        ),
      {
        nome: 'valor_tipo',
        rotulo: 'O valor é mensal ou total?',
        obrigatorio: false,
        opcoes: [
          ['mensal', 'Mensal (aluguel ou prestação)'],
          ['total', 'Total do imóvel'],
        ],
      },
    ],
  },
  {
    titulo: 'Endereço (opcional)',
    Icone: MapPin,
    campos: camposEnderecoPerfil.map(campo => ({
      ...campo,
      obrigatorio: false,
    })),
  },
  {
    titulo: 'Mobília (opcional)',
    Icone: Sofa,
    campos: [
      {
        nome: 'mobilia',
        rotulo: 'O imóvel vem com móveis?',
        obrigatorio: false,
        renderizar: selecionado => (
          <div className='imoveis-opcoes-mobilia'>
            {[...opcoesMobilia, ['', 'Ainda não sei']].map(
              ([valor, rotulo]) => (
                <label key={valor}>
                  <input
                    type='radio'
                    name='mobilia'
                    value={valor}
                    defaultChecked={valor === (selecionado ?? '')}
                  />
                  {rotulo}
                </label>
              )
            )}
          </div>
        ),
      },
    ],
  },
];

export default function EditorImovel({
  usuario,
  imovel = {},
  endereco,
  aoSalvar,
  aoFechar,
  aoExcluir,
}) {
  const tipoSalvo = imovel.tipo?.trim();
  const tipoNormalizado = tipoSalvo?.toLowerCase();
  const tipoParaEdicao = tiposImovel.some(
    ([valor]) => valor === tipoNormalizado
  )
    ? tipoNormalizado
    : tipoSalvo;
  return (
    <DialogoCasa
      titulo={imovel.id ? 'Editar imóvel' : 'Adicionar imóvel'}
      classe='imoveis-modal imoveis-modal-edicao'
      aoFechar={aoFechar}
    >
      <p className='imoveis-editor-ajuda'>
        Só o nome é obrigatório. Você pode completar o restante depois.
      </p>
      <EditorMvp
        cabecalho={false}
        inicial={{
          ...endereco,
          ...imovel,
          tipo: tipoParaEdicao,
          valor_tipo: tipoValorImovel(imovel),
        }}
        secoes={secoesImovel(tipoParaEdicao)}
        grupoSecoes='edicao-imovel'
        campos={campoObservacoes}
        rotuloSalvar={imovel.id ? 'Salvar alterações' : 'Adicionar imóvel'}
        onClose={aoFechar}
        onSave={valores => aoSalvar(salvarImovel(usuario, imovel.id, valores))}
        acaoSecundaria={
          aoExcluir && (
            <button
              type='button'
              className='inline-flex items-center gap-2 text-sm font-bold text-(--vermelho-alerta)'
              onClick={aoExcluir}
            >
              <Trash2 size={16} aria-hidden='true' /> Excluir imóvel
            </button>
          )
        }
      />
    </DialogoCasa>
  );
}

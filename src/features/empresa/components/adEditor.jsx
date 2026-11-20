import { Camera, ClipboardList, CircleDollarSign } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDadosServidor } from '../../../app/dados/contextoServidor';
import { enviarImagemEmpresa } from '../empresaApi';
import { EditorMvp } from '../../../shared/ui/mvp';
import { categoriasMercado } from '../../marketplace/content';
import EditorFotos from './photoEditor';
import { diasServico, nomeDiaServico } from './servicoDisponibilidade';

const tipos = [
  ['fixo', 'Valor fixo'],
  ['a_partir_de', 'A partir de'],
  ['por_hora', 'Por hora'],
  ['por_diaria', 'Por diária'],
  ['orcamento', 'Sob orçamento'],
];

export default function EditorAnuncio({
  anuncio,
  somenteFotos,
  aoSalvar,
  aoCancelar,
}) {
  const servidor = useDadosServidor();
  const [fotos, setFotos] = useState(anuncio?.fotos ?? []);
  const [tipo, setTipo] = useState(anuncio?.tipo_preco ?? 'fixo');
  const [ocupado, setOcupado] = useState(false);
  const [dias, setDias] = useState(anuncio?.disponibilidade?.dias ?? []);
  const opcoesDias = [
    ...new Set([
      ...Object.keys(diasServico),
      ...(anuncio?.disponibilidade?.dias ?? []),
    ]),
  ];
  const categorias = categoriasMercado.map(c => [c.slug, c.nome]);
  if (
    anuncio?.categoria &&
    !categorias.some(([slug]) => slug === anuncio.categoria)
  )
    categorias.push([anuncio.categoria, anuncio.categoria]);

  const identificacao = [
    { nome: 'titulo', rotulo: 'Título do serviço', limite: 150 },
    { nome: 'categoria', rotulo: 'Categoria', opcoes: categorias },
    { nome: 'descricao', rotulo: 'Descrição', tipo: 'textarea' },
  ];
  const atendimento = [
    {
      nome: 'tipo_preco',
      rotulo: 'Tipo de preço',
      obrigatorio: false,
      renderizar: () => (
        <select
          aria-label='Tipo de preço'
          value={tipo}
          onChange={e => setTipo(e.target.value)}
        >
          {tipos.map(([id, nome]) => (
            <option key={id} value={id}>
              {nome}
            </option>
          ))}
        </select>
      ),
    },
    ...(tipo === 'orcamento'
      ? []
      : [{ nome: 'preco', rotulo: 'Preço (R$)', tipo: 'number' }]),
    {
      nome: 'dias',
      rotulo: 'Dias disponíveis',
      obrigatorio: false,
      renderizar: () => (
        <div className='empresa-editor-dias'>
          {opcoesDias.map(dia => (
            <label key={dia}>
              <input
                type='checkbox'
                checked={dias.includes(dia)}
                onChange={e => {
                  const marcado = e.target.checked;
                  setDias(atuais =>
                    marcado
                      ? [...atuais, dia]
                      : atuais.filter(item => item !== dia)
                  );
                }}
              />
              {nomeDiaServico(dia)}
            </label>
          ))}
        </div>
      ),
    },
  ];

  const imagens = servidor && !anuncio ? [] : [
    {
      nome: 'fotos',
      rotulo: 'Fotos do serviço',
      obrigatorio: false,
      renderizar: () => (
        <EditorFotos
          fotos={fotos}
          aoAlterar={setFotos}
          aoCarregar={setOcupado}
          enviar={servidor ? arquivo => enviarImagemEmpresa(arquivo, anuncio?.id) : undefined}
        />
      ),
    },
  ];
  return (
    <section className='mvp-painel empresa-servico-editor'>
      {servidor && !anuncio && <p>Salve o rascunho para adicionar fotos.</p>}
      <EditorMvp
        cabecalho={false}
        mostrarCancelar={Boolean(aoCancelar)}
        onClose={aoCancelar}
        titulo='Serviço'
        rotuloSalvar={
          somenteFotos
            ? 'Salvar fotos'
            : anuncio
              ? 'Salvar alterações'
              : 'Salvar rascunho'
        }
        acaoSecundaria={
          !aoCancelar && (
            <Link
              className='mvp-link'
              to={
                anuncio
                  ? `/empresa/anuncios/${anuncio.id}`
                  : '/empresa/anuncios'
              }
            >
              Cancelar
            </Link>
          )
        }
        inicial={anuncio}
        secoes={[
          ...(somenteFotos
            ? []
            : [
                {
                  titulo: 'Informações do anúncio',
                  Icone: ClipboardList,
                  aberta: true,
                  campos: identificacao,
                },
                {
                  titulo: 'Preço e disponibilidade',
                  Icone: CircleDollarSign,
                  aberta: true,
                  campos: atendimento,
                },
              ]),
          ...(imagens.length ? [{ titulo: 'Imagens', Icone: Camera, aberta: true, campos: imagens }] : []),
        ]}
        onSave={dados => {
          if (ocupado)
            throw new Error(
              'Aguarde o carregamento das fotos antes de salvar.'
            );
          return aoSalvar(
            somenteFotos
              ? { ...anuncio, fotos }
              : {
                  ...dados,
                  tipo_preco: tipo,
                  fotos,
                  disponibilidade: {
                    ...anuncio?.disponibilidade,
                    dias: opcoesDias.filter(dia => dias.includes(dia)),
                  },
                }
          );
        }}
      />
    </section>
  );
}

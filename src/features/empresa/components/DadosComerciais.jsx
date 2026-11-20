import { useState } from 'react';
import { Building2, Clock3, Mail, MapPin } from 'lucide-react';
import { EditorMvp } from '../../../shared/ui/mvp';
import { MarcaEmpresa } from '../../marketplace/empresaMarketplace';
import fotoAtendimento from '../assets/EditorialPhotoServices.png';
import { salvarEmpresa } from '../empresaDados';

const dias = [
  ['segunda_sexta', 'Segunda a sexta'],
  ['segunda', 'Segunda'],
  ['terca', 'Terça'],
  ['quarta', 'Quarta'],
  ['quinta', 'Quinta'],
  ['sexta', 'Sexta'],
  ['sabado', 'Sábado'],
  ['domingo', 'Domingo'],
];
const faixa = /^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/;

function HorarioDia({ dia, valor, aoAlterar }) {
  const [inicioInicial = '', fimInicial = ''] = faixa.test(valor ?? '')
    ? valor.split('-').map(hora => hora.trim())
    : [];
  const [inicio, setInicio] = useState(inicioInicial);
  const [fim, setFim] = useState(fimInicial);

  return (
    <div className='empresa-horario-dia'>
      <strong>{dia}</strong>
      <label>
        Abertura
        <input
          aria-label={`${dia} — abertura`}
          type='time'
          value={inicio}
          onChange={evento => {
            const hora = evento.target.value;
            setInicio(hora);
            aoAlterar(hora, fim);
          }}
        />
      </label>
      <label>
        Fechamento
        <input
          aria-label={`${dia} — fechamento`}
          type='time'
          value={fim}
          onChange={evento => {
            const hora = evento.target.value;
            setFim(hora);
            aoAlterar(inicio, hora);
          }}
        />
      </label>
      {valor && !inicioInicial && <small>Horário atual: {valor}</small>}
    </div>
  );
}

function HorariosSemana({ horarios }) {
  const [alterados, setAlterados] = useState({});
  return (
    <div className='empresa-horarios'>
      <p>
        Use o horário de segunda a sexta para definir um padrão. Preencha um dia
        específico quando o horário for diferente.
      </p>
      {dias.map(([id, dia]) => (
        <HorarioDia
          key={id}
          dia={dia}
          valor={horarios?.[id]}
          aoAlterar={(inicio, fim) => {
            setAlterados(atual => ({
              ...atual,
              [id]: inicio || fim ? `${inicio}-${fim}` : null,
            }));
          }}
        />
      ))}
      <input
        type='hidden'
        name='horario_atendimento'
        value={JSON.stringify(alterados)}
      />
    </div>
  );
}

const secoes = [
  {
    titulo: 'Identidade da empresa',
    descricao: 'Nome, CNPJ, categoria e apresentação.',
    Icone: Building2,
    campos: [
      { nome: 'nome', rotulo: 'Nome da empresa', limite: 150 },
      { nome: 'cnpj', rotulo: 'CNPJ', limite: 18 },
      { nome: 'categoria', rotulo: 'Categoria', limite: 150 },
      {
        nome: 'descricao',
        rotulo: 'Descrição',
        tipo: 'textarea',
        obrigatorio: false,
      },
    ],
  },
  {
    titulo: 'Canais de contato',
    descricao: 'Telefone, e-mail comercial e site.',
    Icone: Mail,
    campos: [
      {
        nome: 'telefone',
        rotulo: 'Telefone comercial',
        tipo: 'tel',
        limite: 20,
      },
      {
        nome: 'email_comercial',
        rotulo: 'E-mail comercial',
        tipo: 'email',
        limite: 255,
      },
      {
        nome: 'site',
        rotulo: 'Site',
        tipo: 'url',
        limite: 500,
        obrigatorio: false,
      },
    ],
  },
  {
    titulo: 'Área de atendimento',
    descricao: 'Cidades e regiões onde você atende.',
    Icone: MapPin,
    campos: [
      {
        nome: 'local',
        rotulo: 'Locais atendidos (separados por vírgula)',
        obrigatorio: false,
      },
    ],
  },
  {
    titulo: 'Horários da semana',
    descricao: 'Adicione horários de abertura e fechamento.',
    Icone: Clock3,
    campos: [
      {
        nome: 'horario_atendimento',
        rotulo: 'Horários de atendimento',
        obrigatorio: false,
        renderizar: horarios => <HorariosSemana horarios={horarios} />,
      },
    ],
  },
];

export function PreviaVisualEmpresa({ empresa }) {
  const [falhou, setFalhou] = useState(false);
  const capa =
    !falhou && empresa.banner && !empresa.banner.startsWith('/mock/');
  return (
    <figure className='empresa-editor-visual'>
      <img
        src={capa ? empresa.banner : fotoAtendimento}
        alt={capa ? 'Capa da empresa' : ''}
        onError={capa ? () => setFalhou(true) : undefined}
      />
      <figcaption>
        <MarcaEmpresa empresa={empresa} />
        <div>
          <strong>{empresa.nome}</strong>
          <span>{capa ? 'Capa atual' : 'Foto ilustrativa'}</span>
        </div>
      </figcaption>
    </figure>
  );
}

export default function DadosComerciais({
  empresa,
  userId,
  aoFechar,
  notificar,
}) {
  return (
    <EditorMvp
      cabecalho={false}
      mostrarCancelar={Boolean(aoFechar)}
      onClose={aoFechar}
      secoes={
        empresa
          ? secoes
          : secoes.map((secao, indice) => ({ ...secao, aberta: indice === 0 }))
      }
      grupoSecoes='dados-comerciais'
      rotuloSalvar='Salvar alterações'
      inicial={{ ...empresa, local: empresa?.local_atendimento?.join(', ') }}
      onSave={valores => {
        const {
          nome,
          cnpj,
          categoria,
          telefone,
          email_comercial,
          site,
          descricao,
          local,
        } = valores;
        if (site && !/^https?:\/\//i.test(site))
          throw new Error('O site deve começar com http:// ou https://.');
        const alterados = JSON.parse(valores.horario_atendimento ?? '{}');
        const horario_atendimento = { ...empresa?.horario_atendimento };
        for (const [id, dia] of dias) {
          if (!(id in alterados)) continue;
          const valor = alterados[id];
          if (valor && !faixa.test(valor))
            throw new Error(
              `Preencha a abertura e o fechamento de ${dia.toLowerCase()}.`
            );
          if (valor) horario_atendimento[id] = valor;
          else delete horario_atendimento[id];
        }
        salvarEmpresa(userId, {
          nome,
          cnpj,
          categoria,
          telefone,
          email_comercial,
          site,
          descricao,
          horario_atendimento,
          local_atendimento: (local ?? '')
            .split(',')
            .map(item => item.trim())
            .filter(Boolean),
        });
        notificar('Informações comerciais atualizadas.');
      }}
    />
  );
}

import { useState } from 'react';
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Clock3,
  Globe,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { nomeCategoria } from './marketplaceDados';

const dias = {
  segunda_sexta: 'Segunda a sexta',
  segunda: 'Segunda',
  terca: 'Terça',
  quarta: 'Quarta',
  quinta: 'Quinta',
  sexta: 'Sexta',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

function imagemPublica(url) {
  return typeof url === 'string' && url && !url.startsWith('/mock/');
}

export function MarcaEmpresa({ empresa }) {
  const [falhou, setFalhou] = useState(false);
  const iniciais = (empresa.nome ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(palavra => palavra[0])
    .join('');

  return (
    <span className='mercado-a-marca-empresa' aria-hidden='true'>
      {!falhou && imagemPublica(empresa.logo) ? (
        <img src={empresa.logo} alt='' onError={() => setFalhou(true)} />
      ) : (
        iniciais || <Building2 size={24} />
      )}
    </span>
  );
}

export function CartaoEmpresa({ empresa, estado }) {
  return (
    <Link
      className='mercado-a-perfil-cartao'
      to={`/empresas/${empresa.id}`}
      state={estado}
    >
      <div className='mercado-a-perfil-identidade'>
        <MarcaEmpresa key={empresa.id} empresa={empresa} />
        <div>
          <h2>{empresa.nome}</h2>
          <span className='mercado-a-verificada'>
            <BadgeCheck size={16} aria-hidden='true' /> Empresa verificada
          </span>
        </div>
      </div>
      {empresa.descricao && <p>{empresa.descricao}</p>}
      {!!empresa.local_atendimento?.length && (
        <p className='mercado-a-local'>
          <MapPin size={16} aria-hidden='true' />{' '}
          {empresa.local_atendimento.join(', ')}
        </p>
      )}
      <span className='mercado-a-perfil-acao'>
        Ver perfil da empresa <ArrowUpRight size={17} aria-hidden='true' />
      </span>
    </Link>
  );
}

export function PerfilEmpresaMarketplace({ empresa, acoes, situacao }) {
  const [bannerFalhou, setBannerFalhou] = useState(false);
  const horarios = Object.entries(empresa.horario_atendimento || {}).filter(
    ([, valor]) => typeof valor === 'string' && valor.trim()
  );
  return (
    <section
      className='mercado-a-perfil-publico'
      aria-label='Informações da empresa'
    >
      <div className='mercado-a-capa-empresa'>
        {!bannerFalhou && imagemPublica(empresa.banner) && (
          <img
            className='mercado-a-banner-empresa'
            src={empresa.banner}
            alt=''
            onError={() => setBannerFalhou(true)}
          />
        )}
      </div>
      <div className='mercado-a-perfil-dados'>
        <div className='mercado-a-perfil-apresentacao'>
          <div className='mercado-a-perfil-identidade'>
            <MarcaEmpresa key={empresa.logo ?? 'padrao'} empresa={empresa} />
            <div>
              {empresa.validado ? (
                <p className='mercado-a-verificada'>
                  <BadgeCheck size={16} aria-hidden='true' /> Empresa verificada
                </p>
              ) : (
                situacao && <p>{situacao}</p>
              )}
              <h1>{empresa.nome}</h1>
              <p>{nomeCategoria(empresa.categoria)}</p>
            </div>
          </div>
          <div className='mercado-a-perfil-botoes'>
            {acoes ?? (
              <a
                className='mercado-a-voltar-detalhe'
                href='#servicos-disponiveis'
              >
                Ver serviços
              </a>
            )}
          </div>
        </div>
        {empresa.descricao && (
          <p className='mercado-a-perfil-descricao'>{empresa.descricao}</p>
        )}
        <dl className='mercado-a-empresa-infos'>
          {!!empresa.local_atendimento?.length && (
            <div>
              <dt>
                <MapPin size={16} aria-hidden='true' /> Atendimento
              </dt>
              <dd>{empresa.local_atendimento.join(', ')}</dd>
            </div>
          )}
          {!!horarios.length && (
            <div>
              <dt>
                <Clock3 size={16} aria-hidden='true' /> Horário
              </dt>
              <dd>
                {horarios.map(([dia, valor]) => (
                  <span key={dia}>
                    {dias[dia] || dia.replaceAll('_', ' ')}: {valor}
                  </span>
                ))}
              </dd>
            </div>
          )}
          {empresa.telefone && (
            <div>
              <dt>
                <Phone size={16} aria-hidden='true' /> Telefone
              </dt>
              <dd>
                <a href={`tel:${empresa.telefone.replace(/[^\d+]/g, '')}`}>
                  {empresa.telefone}
                </a>
              </dd>
            </div>
          )}
          {empresa.email_comercial && (
            <div>
              <dt>
                <Mail size={16} aria-hidden='true' /> E-mail comercial
              </dt>
              <dd>
                <a href={`mailto:${empresa.email_comercial}`}>
                  {empresa.email_comercial}
                </a>
              </dd>
            </div>
          )}
          {/^https?:\/\//i.test(empresa.site ?? '') && (
            <div>
              <dt>
                <Globe size={16} aria-hidden='true' /> Site
              </dt>
              <dd>
                <a href={empresa.site} target='_blank' rel='noreferrer'>
                  {empresa.site.replace(/^https?:\/\//i, '')}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}

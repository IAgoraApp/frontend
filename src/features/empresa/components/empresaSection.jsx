import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Title } from '../../../shared/ui';
import { statuses, updateEmpresa, useEmpresa, validateAd } from '../content';
import {
  Action,
  Card,
  CompanyHeading,
  Dialog,
  Empty,
  scope,
  ServiceImage,
} from './empresaUi';
import CompanyHome from './companyHome';
import CompanyDashboard from './companyDashboard';
import AdsList from './adsList';
import AdEditor from './adEditor';
import AdDetail from './adDetail';
import CompanyProfile from './companyProfile';
import CompanyContacts from './companyContacts';
import PhotoEditor from './photoEditor';

const headings = {
  painel: [
    'Desempenho dos seus anúncios',
    'Acompanhe os resultados e veja como seu negócio está se saindo.',
  ],
  anuncios: ['Seus anúncios.', 'Acompanhe status, visualizações e contatos.'],
  novo: [
    'Você faz bem. Conta pra geral.',
    'Apresente o serviço com clareza e revise antes de publicar.',
  ],
  editar: [
    'Ajuste o que seu serviço precisa mostrar.',
    'Revise as informações antes de salvar.',
  ],
  fotos: ['Mostre seu trabalho.', 'Adicione fotos do serviço ou portfólio.'],
  previa: [
    'Assim seu serviço será apresentado.',
    'Confira título, descrição, preço e contato antes de continuar.',
  ],
  perfil: [
    'Sua empresa. Sua assinatura.',
    'Seu perfil também vende confiança.',
  ],
  contatos: [
    'Meus contatos.',
    'Veja os clientes que entraram em contato com você.',
  ],
};
export default function EmpresaSection({ pagina }) {
  const { data, error } = useEmpresa();
  const params = useParams();
  const navigate = useNavigate();
  const ad = data.ads.find(item => item.id === params.id);
  const contact = data.contacts.find(
    item =>
      item.id === params.id &&
      (!item.companyId || item.companyId === data.company.id)
  );
  const [notice, setNotice] = useState('');
  const [failure, setFailure] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [photos, setPhotos] = useState(() => ad?.photos ?? []);
  const needsAd = ['editar', 'detalhe', 'fotos', 'previa'].includes(pagina);
  function mutate(update, message) {
    try {
      updateEmpresa(update);
      setFailure('');
      if (message) setNotice(message);
      return true;
    } catch (error) {
      setFailure(error.message);
      return false;
    }
  }
  function saveAd(value, mode) {
    const status = mode === 'draft' ? 'draft' : (ad?.status ?? 'draft');
    const next = { ...value, status, updatedAt: new Date().toISOString() };
    if (
      mutate(
        previous => ({
          ...previous,
          ads: previous.ads.some(item => item.id === next.id)
            ? previous.ads.map(item => (item.id === next.id ? next : item))
            : [...previous.ads, next],
        }),
        mode === 'draft' ? 'Rascunho salvo.' : 'Anúncio atualizado.'
      )
    )
      navigate(
        '/meus-servicos/' + next.id + (mode === 'preview' ? '/previa' : '')
      );
  }
  function adAction(action) {
    if (action === 'delete') {
      if (
        mutate(
          previous => ({
            ...previous,
            ads: previous.ads.filter(item => item.id !== ad.id),
          }),
          'Anúncio excluído. O histórico de contatos foi mantido.'
        )
      ) {
        setConfirm(null);
        navigate('/meus-servicos');
      }
      return;
    }
    const status =
      action === 'pause'
        ? 'paused'
        : action === 'publish'
          ? 'review'
          : 'active';
    if (action === 'publish') {
      const invalid = validateAd(ad);
      if (invalid) {
        setFailure(invalid);
        setConfirm(null);
        return;
      }
    }
    if (
      mutate(
        previous => ({
          ...previous,
          ads: previous.ads.map(item =>
            item.id === ad.id
              ? { ...item, status, updatedAt: new Date().toISOString() }
              : item
          ),
        }),
        status === 'review'
          ? 'Pedido de análise registrado nesta demonstração local.'
          : status === 'paused'
            ? 'Anúncio pausado.'
            : 'Anúncio reativado nesta demonstração.'
      )
    ) {
      setConfirm(null);
      if (action === 'publish') navigate('/meus-servicos/' + ad.id);
    }
  }
  const title =
    pagina === 'detalhe'
      ? ad?.title || 'Rascunho sem título'
      : pagina === 'conversa'
        ? contact?.name
        : headings[pagina]?.[0];
  return (
    <div lang='pt-BR' className={scope}>
      <Container className='pt-5'>
        <p className='rounded-lg bg-(--azul-fundo) p-3 text-xs leading-relaxed text-(--texto-apoio)'>
          Demonstração local{data.example ? ' com dados de exemplo' : ''}.
          Anúncios, solicitações e respostas ficam neste navegador; não há
          publicação ou envio externo conectado.
        </p>
        {error && (
          <p role='alert' className='mt-4 rounded-lg bg-amber-50 p-4 text-sm'>
            Não foi possível ler os dados salvos. Eles foram preservados. Esta é
            uma prévia de exemplo.
          </p>
        )}
        {failure && (
          <p
            role='alert'
            className='mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800'
          >
            {failure}
          </p>
        )}
        {notice && (
          <div
            role='status'
            className='mt-4 flex items-center justify-between gap-4 rounded-lg bg-green-50 p-4 text-sm text-green-900'
          >
            {notice}
            <button
              type='button'
              aria-label='Fechar aviso'
              className='size-11 shrink-0 text-xl'
              onClick={() => setNotice('')}
            >
              ×
            </button>
          </div>
        )}
      </Container>
      {pagina === 'inicio' ? (
        <main>
          <CompanyHome data={data} />
        </main>
      ) : (
        <Container as='main' className='pb-10'>
          {(needsAd && !ad) || (pagina === 'conversa' && !contact) ? (
            <div className='py-8'>
              <CompanyHeading
                title='Registro não encontrado.'
                description='Este registro pode ter sido removido.'
              />
              <Empty
                to={pagina === 'conversa' ? '/contatos' : '/meus-servicos'}
                action='Voltar'
              >
                Abra a lista para consultar os registros disponíveis.
              </Empty>
            </div>
          ) : (
            <>
              <CompanyHeading
                title={title}
                description={
                  pagina === 'conversa'
                    ? contact.service
                    : headings[pagina]?.[1]
                }
                back={
                  pagina === 'conversa'
                    ? '/contatos'
                    : needsAd
                      ? '/meus-servicos'
                      : '/empresa'
                }
              />
              {pagina === 'painel' && <CompanyDashboard data={data} />}
              {pagina === 'anuncios' && <AdsList data={data} />}
              {(pagina === 'novo' || pagina === 'editar') && (
                <AdEditor
                  key={ad?.id ?? 'new'}
                  ad={ad}
                  company={data.company}
                  onSave={saveAd}
                />
              )}
              {pagina === 'detalhe' && (
                <AdDetail key={ad.id} ad={ad} onAction={setConfirm} />
              )}
              {pagina === 'perfil' && (
                <CompanyProfile
                  company={data.company}
                  onSave={company =>
                    mutate(
                      previous => ({ ...previous, company }),
                      'Perfil da empresa atualizado.'
                    )
                  }
                />
              )}
              {(pagina === 'contatos' || pagina === 'conversa') && (
                <CompanyContacts
                  key={contact?.id ?? 'contacts'}
                  data={data}
                  contact={contact}
                  onStatus={(item, status) =>
                    mutate(
                      previous => ({
                        ...previous,
                        contacts: previous.contacts.map(entry =>
                          entry.id === item.id ? { ...entry, status } : entry
                        ),
                      }),
                      'Status do contato atualizado.'
                    )
                  }
                  onReply={(item, text) =>
                    mutate(
                      previous => ({
                        ...previous,
                        contacts: previous.contacts.map(entry =>
                          entry.id === item.id
                            ? {
                                ...entry,
                                status:
                                  entry.status === 'done' ? 'done' : 'progress',
                                messages: [
                                  ...entry.messages,
                                  {
                                    id: crypto.randomUUID(),
                                    author: 'company',
                                    text,
                                    date: new Date().toISOString(),
                                  },
                                ],
                              }
                            : entry
                        ),
                      }),
                      'Resposta registrada localmente. Nenhuma mensagem externa foi enviada.'
                    )
                  }
                />
              )}
              {pagina === 'fotos' && (
                <Card title='Fotos do anúncio'>
                  <PhotoEditor photos={photos} onChange={setPhotos} />
                  <div className='mt-6 flex flex-wrap gap-3'>
                    <Action
                      onClick={() => {
                        if (
                          mutate(
                            previous => ({
                              ...previous,
                              ads: previous.ads.map(item =>
                                item.id === ad.id
                                  ? {
                                      ...item,
                                      photos,
                                      updatedAt: new Date().toISOString(),
                                    }
                                  : item
                              ),
                            }),
                            'Fotos atualizadas.'
                          )
                        )
                          navigate('/meus-servicos/' + ad.id);
                      }}
                    >
                      Salvar fotos
                    </Action>
                    <Action secondary as={Link} to={'/meus-servicos/' + ad.id}>
                      Voltar ao anúncio
                    </Action>
                  </div>
                </Card>
              )}
              {pagina === 'previa' && (
                <div className='space-y-6'>
                  <Card>
                    <div className='grid items-start gap-6 lg:grid-cols-2'>
                      <ServiceImage
                        ad={ad}
                        className='aspect-[1.5] rounded-lg'
                      />
                      <div>
                        <p className='text-xs font-bold text-(--laranja-principal)'>
                          PRÉVIA DO ANÚNCIO · {statuses[ad.status]}
                        </p>
                        <Title className='mt-4 text-3xl font-extrabold'>
                          {ad.title || 'Rascunho sem título'}
                        </Title>
                        <p className='mt-3 text-(--texto-apoio)'>
                          {data.company.name} · {ad.region}
                        </p>
                        <p className='mt-4 font-bold'>
                          {ad.price} · Atendimento {ad.attendance.toLowerCase()}
                        </p>
                        <p className='mt-5 whitespace-pre-wrap leading-relaxed'>
                          {ad.description}
                        </p>
                        <p className='mt-4 text-sm text-(--texto-apoio)'>
                          {ad.phone} · {ad.email}
                        </p>
                      </div>
                    </div>
                  </Card>
                  <div className='flex flex-wrap gap-3'>
                    {['draft', 'review'].includes(ad.status) && (
                      <Action onClick={() => setConfirm('publish')}>
                        Enviar para análise
                      </Action>
                    )}
                    <Action
                      secondary
                      as={Link}
                      to={'/meus-servicos/' + ad.id + '/editar'}
                    >
                      Editar
                    </Action>
                    <Action secondary as={Link} to={'/meus-servicos/' + ad.id}>
                      Voltar ao anúncio
                    </Action>
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      )}
      {confirm && (
        <Dialog
          title={
            confirm === 'delete'
              ? 'Excluir anúncio?'
              : confirm === 'pause'
                ? 'Pausar anúncio?'
                : confirm === 'publish'
                  ? 'Registrar pedido de análise?'
                  : confirm === 'renew'
                    ? 'Renovar anúncio?'
                    : 'Reativar anúncio?'
          }
          onClose={() => setConfirm(null)}
        >
          <p className='mb-6 text-(--texto-apoio)'>
            {confirm === 'delete'
              ? 'O anúncio será removido. Os contatos anteriores serão preservados. Esta ação não pode ser desfeita.'
              : confirm === 'pause'
                ? 'O serviço deixará de aparecer no Marketplace desta demonstração. Você poderá reativá-lo depois.'
                : confirm === 'publish'
                  ? 'O anúncio ficará com status Em análise nesta demonstração. Nenhuma publicação externa será realizada.'
                  : 'O anúncio voltará a ficar ativo no Marketplace desta demonstração.'}
          </p>
          <div className='flex flex-wrap gap-3'>
            <Action onClick={() => adAction(confirm)}>Confirmar</Action>
            <Action secondary onClick={() => setConfirm(null)}>
              Cancelar
            </Action>
          </div>
        </Dialog>
      )}
    </div>
  );
}

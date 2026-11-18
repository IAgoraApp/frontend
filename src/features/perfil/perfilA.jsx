import { useState } from 'react';
import {
  Camera,
  ChevronRight,
  CreditCard,
  House,
  MapPin,
  Receipt,
  UserRound,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useBancoMvp } from '../../app/dados/bancoMvp';
import Rodape from '../../shared/footer';
import { Botao, Container, Titulo } from '../../shared/ui';
import { EditorMvp } from '../../shared/ui/mvp';
import { DialogoCasa } from '../casa/components/casaUi';
import CobrancasPerfilA from './components/CobrancasPerfilA';
import MomentoPerfilA from './components/MomentoPerfilA';
import { extrairIniciais } from './content';
import './perfilA.css';
import {
  camposEnderecoPerfil,
  desvincularEnderecoPerfil,
  momentosPerfil,
  salvarEnderecoPerfil,
  salvarFotoPerfil,
  salvarInformacoes,
} from './perfilDados';

const areas = [
  ['perfil', 'Dados pessoais', UserRound],
  ['assinatura', 'Assinatura', Receipt],
  ['pagamentos', 'Pagamentos', CreditCard],
];

function RetratoPerfil({ nome, foto }) {
  const [falhou, setFalhou] = useState(false);
  return foto && !foto.startsWith('/mock/') && !falhou ? (
    <img
      src={foto}
      alt=''
      referrerPolicy='no-referrer'
      onError={() => setFalhou(true)}
      className='size-full rounded-full object-cover'
    />
  ) : (
    <span
      aria-hidden='true'
      className='grid size-full place-items-center rounded-full bg-(--laranja-fundo) font-titulo text-3xl font-extrabold sm:text-4xl text-[#9d2c08]'
    >
      {extrairIniciais(nome)}
    </span>
  );
}

function EnderecoPerfil({ endereco }) {
  const rua = [endereco.rua, endereco.numero, endereco.complemento]
    .filter(Boolean)
    .join(', ');
  return (
    <address className='mt-3 text-sm leading-relaxed break-words text-(--texto-apoio) not-italic'>
      {rua}
      <br />
      {endereco.bairro}, {endereco.cidade} – {endereco.estado}
      <br />
      CEP {endereco.cep} · {endereco.pais}
    </address>
  );
}

export default function PerfilA() {
  const { b, perfil, casa } = useBancoMvp();
  const [params] = useSearchParams();
  const visao =
    areas.find(([id]) => id === params.get('visao'))?.[0] ?? 'perfil';
  const [modal, setModal] = useState('');
  const [aviso, setAviso] = useState('');
  const [erro, setErro] = useState('');
  const usuario = b.users.find(item => item.id === perfil?.user_id);
  const endereco = b.endereco.find(item => item.id === perfil?.endereco_id);
  const situacao = momentosPerfil.find(([id]) => id === perfil?.tipo)?.[1];

  function abrirModal(tipo) {
    setAviso('');
    setErro('');
    setModal(tipo);
  }

  function removerEndereco() {
    try {
      desvincularEnderecoPerfil(perfil.user_id);
      setModal('');
      setAviso('Endereço removido do perfil.');
    } catch (falha) {
      setErro(falha.message);
    }
  }

  if (!perfil || !usuario)
    return (
      <Container como='main' classe='py-8'>
        <Titulo como='h1' classe='text-3xl font-extrabold'>
          Meu perfil
        </Titulo>
        <p className='mt-3 text-(--texto-apoio)'>
          O perfil não pôde ser carregado.
        </p>
      </Container>
    );

  return (
    <>
      <main className='min-w-0 flex-1 bg-(--azul-fundo) font-corpo text-(--azul-titulo) [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-(--laranja-principal)'>
        <Container classe='pb-12 pt-6 lg:pt-8'>
          <section
            aria-labelledby='perfil-nome'
            className='mb-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 rounded-2xl border border-(--borda-suave) bg-white p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4 sm:p-5'
          >
            <div className='size-16 shrink-0 rounded-full bg-(--azul-fundo) p-1 sm:size-20'>
              <RetratoPerfil
                key={perfil.foto ?? 'padrao'}
                nome={perfil.nome}
                foto={perfil.foto}
              />
            </div>
            <div className='min-w-0 flex-1'>
              <h1
                id='perfil-nome'
                className='font-titulo text-2xl leading-tight font-extrabold wrap-anywhere sm:text-3xl'
              >
                {perfil.nome}
              </h1>
              <p className='text-sm wrap-anywhere text-(--texto-apoio)'>
                {usuario.email}
              </p>
              <p className='mt-1 text-sm font-bold text-[#9d2c08]'>
                {situacao}
              </p>
            </div>
            <Botao
              type='button'
              variante='contorno'
              classe='col-span-full justify-self-start gap-2 text-sm sm:col-span-1'
              onClick={() => abrirModal('foto')}
            >
              <Camera size={17} aria-hidden='true' /> Alterar foto
            </Botao>
          </section>
          <div className='grid min-w-0 gap-4'>
            <nav
              aria-label='Áreas do perfil'
              className='grid grid-cols-3 gap-1 rounded-xl border border-(--borda-suave) bg-white p-1.5 sm:p-2'
            >
              {areas.map(([id, nome, Icone]) => (
                <Link
                  key={id}
                  to={id === 'perfil' ? '/perfil' : '?visao=' + id}
                  onClick={() => setAviso('')}
                  aria-current={visao === id ? 'page' : undefined}
                  className='flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-center text-xs font-bold text-(--texto-apoio) hover:bg-(--azul-fundo) aria-[current=page]:bg-(--laranja-fundo) aria-[current=page]:text-[#9d2c08] sm:flex-row sm:gap-2 sm:px-3 sm:text-sm'
                >
                  <Icone size={17} aria-hidden='true' className='shrink-0' />{' '}
                  {nome}
                </Link>
              ))}
            </nav>
            {aviso && (
              <p
                role='status'
                className='rounded-lg bg-[#e7f5ed] px-4 py-2 text-sm font-bold text-(--verde-sucesso)'
              >
                {aviso}
              </p>
            )}
            {visao === 'perfil' ? (
              <div className='grid min-w-0 gap-4'>
                <MomentoPerfilA perfil={perfil} aoSalvar={setAviso} />
                <section
                  aria-labelledby='perfil-informacoes'
                  className='min-w-0 rounded-2xl border border-(--borda-suave) bg-white p-5 sm:p-6'
                >
                  <Titulo
                    id='perfil-informacoes'
                    classe='text-xl font-extrabold sm:text-2xl'
                  >
                    Informações pessoais
                  </Titulo>
                  <div className='perfil-editor mt-5'>
                    <EditorMvp
                      cabecalho={false}
                      titulo='Informações pessoais'
                      rotuloSalvar='Salvar alterações'
                      inicial={{ ...perfil, email: usuario.email }}
                      campos={[
                        { nome: 'nome', rotulo: 'Nome completo', limite: 150 },
                        {
                          nome: 'email',
                          rotulo: 'E-mail',
                          tipo: 'email',
                          limite: 255,
                        },
                      ]}
                      mostrarCancelar={false}
                      onSave={valores => {
                        salvarInformacoes(perfil.user_id, valores);
                        setAviso('Informações pessoais atualizadas.');
                      }}
                    />
                  </div>
                </section>
                <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]'>
                  <section
                    aria-labelledby='perfil-residencia'
                    className='min-w-0 rounded-2xl border border-(--borda-suave) bg-white p-5 sm:p-6'
                  >
                    <div className='flex items-center gap-2'>
                      <House
                        size={20}
                        aria-hidden='true'
                        className='shrink-0 text-(--laranja-destaque)'
                      />
                      <Titulo
                        id='perfil-residencia'
                        classe='text-xl font-extrabold'
                      >
                        Minha residência
                      </Titulo>
                    </div>
                    <p className='mt-3 text-sm text-(--texto-apoio)'>
                      {casa?.nome || 'Residência sem nome'}
                    </p>
                    <Link
                      to='/casa'
                      className='mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[#9d2c08] hover:underline'
                    >
                      Abrir Minha casa{' '}
                      <ChevronRight size={16} aria-hidden='true' />
                    </Link>
                    <Link
                      to='/meus-contatos'
                      className='flex min-h-11 items-center gap-1 text-sm font-bold text-[#9d2c08] hover:underline'
                    >
                      Meus contatos{' '}
                      <ChevronRight size={16} aria-hidden='true' />
                    </Link>
                  </section>
                  <section
                    aria-labelledby='perfil-endereco'
                    className='min-w-0 rounded-2xl border border-(--borda-suave) bg-white p-5 sm:p-6'
                  >
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        <MapPin
                          size={20}
                          aria-hidden='true'
                          className='shrink-0 text-(--laranja-destaque)'
                        />
                        <Titulo
                          id='perfil-endereco'
                          classe='text-xl font-extrabold'
                        >
                          Endereço do perfil
                        </Titulo>
                      </div>
                      <Botao
                        type='button'
                        variante='contorno'
                        classe='text-sm'
                        onClick={() => abrirModal('endereco')}
                      >
                        {endereco ? 'Editar endereço' : 'Adicionar endereço'}
                      </Botao>
                    </div>
                    {endereco ? (
                      <EnderecoPerfil endereco={endereco} />
                    ) : (
                      <p className='mt-3 text-sm text-(--texto-apoio)'>
                        Nenhum endereço vinculado.
                      </p>
                    )}
                  </section>
                </div>
              </div>
            ) : (
              <CobrancasPerfilA
                key={visao}
                b={b}
                userId={perfil.user_id}
                visao={visao}
                aoSalvar={setAviso}
              />
            )}
          </div>
        </Container>
        {modal && (
          <DialogoCasa
            titulo={
              modal === 'foto'
                ? 'Alterar foto'
                : modal === 'remover'
                  ? 'Remover endereço?'
                  : endereco
                    ? 'Editar endereço do perfil'
                    : 'Adicionar endereço ao perfil'
            }
            aoFechar={() => setModal('')}
          >
            {modal === 'remover' ? (
              <>
                <p className='text-sm text-(--texto-apoio)'>
                  O endereço será desvinculado do seu perfil.
                </p>
                {erro && (
                  <p
                    role='alert'
                    className='mt-3 text-sm text-(--vermelho-alerta)'
                  >
                    {erro}
                  </p>
                )}
                <div className='mt-5 flex flex-wrap justify-end gap-2'>
                  <Botao
                    type='button'
                    variante='contorno'
                    onClick={() => setModal('endereco')}
                  >
                    Cancelar
                  </Botao>
                  <Botao
                    type='button'
                    classe='bg-(--vermelho-alerta)!'
                    onClick={removerEndereco}
                  >
                    Remover endereço
                  </Botao>
                </div>
              </>
            ) : (
              <div className='perfil-editor'>
                {modal === 'foto' && (
                  <p className='mb-4 text-sm text-(--texto-apoio)'>
                    Cole o link direto da imagem. Deixe em branco para usar suas
                    iniciais.
                  </p>
                )}
                <EditorMvp
                  key={modal}
                  cabecalho={false}
                  titulo={modal === 'foto' ? 'Alterar foto' : 'Editar endereço'}
                  inicial={
                    modal === 'foto'
                      ? {
                          foto: /^https?:\/\//i.test(perfil.foto ?? '')
                            ? perfil.foto
                            : '',
                        }
                      : (endereco ?? { pais: 'Brasil' })
                  }
                  campos={
                    modal === 'foto'
                      ? [
                          {
                            nome: 'foto',
                            rotulo: 'Link da foto',
                            tipo: 'url',
                            obrigatorio: false,
                            limite: 500,
                          },
                        ]
                      : camposEnderecoPerfil
                  }
                  acaoSecundaria={
                    modal === 'endereco' &&
                    endereco && (
                      <button
                        type='button'
                        className='mr-auto text-(--vermelho-alerta)'
                        onClick={() => abrirModal('remover')}
                      >
                        Remover endereço
                      </button>
                    )
                  }
                  rotuloSalvar='Salvar alterações'
                  onSave={valores => {
                    if (modal === 'foto')
                      salvarFotoPerfil(perfil.user_id, valores.foto);
                    else salvarEnderecoPerfil(perfil.user_id, valores);
                    setAviso(
                      modal === 'foto'
                        ? 'Foto do perfil atualizada.'
                        : 'Endereço do perfil atualizado.'
                    );
                  }}
                  onClose={() => setModal('')}
                />
              </div>
            )}
          </DialogoCasa>
        )}
      </main>
      <Rodape />
    </>
  );
}

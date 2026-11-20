import { useDadosServidor } from '../../app/dados/contextoServidor';
import { encerrarSessao } from '../../app/dados/sessao';
import { salvarIdentidade, salvarPerfilPessoal, vincularEndereco } from './perfilApi';
import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { useState } from 'react';
import {
  ChevronRight,
  CreditCard,
  House,
  MapPin,
  Receipt,
  UserRound,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { rotaPerfilMoradia, usePerfilPreparacao } from '../../app/dados/perfilNavegacao';
import { useBancoMvp } from '../../app/dados/bancoMvp';
import Rodape from '../../shared/footer';
import { Botao, Container, Titulo } from '../../shared/ui';
import { EditorMvp } from '../../shared/ui/mvp';
import { DialogoCasa } from '../casa/components/casaUi';
import CobrancasPerfilA from './components/CobrancasPerfilA';
import MomentoPerfilA from './components/MomentoPerfilA';
import { IdentidadePerfil, NavegacaoPerfil } from './components/EstruturaPerfil';
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
  const servidor = useDadosServidor();
  const navegar = useNavigate();
  const preparacao = usePerfilPreparacao();
  const rotaPerfil = rotaPerfilMoradia(preparacao ? 2 : 1);
  const { b, perfil, casa } = useBancoMvp();
  const [params] = useSearchParams();
  const visao =
    areas.find(([id]) => id === params.get('visao'))?.[0] ?? 'perfil';
  const [modal, setModal] = useState('');
  const notificar = useAvisoPerfilA();
  const [erro, setErro] = useState('');
  const usuario = b.users.find(item => item.id === perfil?.user_id);
  const endereco = b.endereco.find(item => item.id === perfil?.endereco_id);
  const situacao = momentosPerfil.find(([id]) => id === perfil?.tipo)?.[1];

  function abrirModal(tipo) {
    setErro('');
    setModal(tipo);
  }

  async function removerEndereco() {
    try {
      if (servidor) {
        await vincularEndereco(perfil.id);
        await servidor.atualizar();
      } else desvincularEnderecoPerfil(perfil.user_id);
      setModal('');
      notificar('Endereço removido do perfil.');
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
          <IdentidadePerfil
            nome={perfil.nome}
            email={usuario.email}
            foto={perfil.foto === '/images/perfil-padrao.svg' ? null : perfil.foto}
            situacao={situacao}
            aoAlterarFoto={() => abrirModal('foto')}
          />
          {servidor && <Botao type='button' variante='contorno' classe='mb-4' onClick={() => {
            encerrarSessao();
            navegar('/login', { replace: true });
          }}>Sair da conta</Botao>}
          <div className='grid min-w-0 gap-4'>
            <NavegacaoPerfil areas={areas} rota={rotaPerfil} visao={visao} />
            {visao === 'perfil' ? (
              <div className='grid min-w-0 gap-4'>
                <MomentoPerfilA key={perfil.user_id + ':' + perfil.tipo} perfil={perfil} />
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
                      key={perfil.user_id}
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
                      onSave={async valores => {
                        if (servidor) {
                          await salvarIdentidade(perfil.id, valores);
                          await servidor.atualizar();
                        } else salvarInformacoes(perfil.user_id, valores);
                        notificar('Informações pessoais atualizadas.');
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
                        {preparacao ? 'Minha jornada' : 'Minha residência'}
                      </Titulo>
                    </div>
                    <p className='mt-3 text-sm text-(--texto-apoio)'>
                      {preparacao
                        ? 'Organize as etapas para a sua mudança.'
                        : casa?.nome || 'Nenhuma residência cadastrada.'}
                    </p>
                    <Link
                      to={preparacao ? '/minhajornada' : '/casa'}
                      className='mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[#9d2c08] hover:underline'
                    >
                      {preparacao ? 'Abrir Minha Jornada' : 'Abrir Minha casa'}{' '}
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
                key={perfil.user_id + ':' + visao}
                b={b}
                userId={perfil.user_id}
                visao={visao}
                aoSalvar={notificar}
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
                  onSave={async valores => {
                    if (servidor) {
                      if (modal === 'foto') await salvarPerfilPessoal(perfil.id, { foto: valores.foto ?? '' });
                      else await vincularEndereco(perfil.id, valores);
                      await servidor.atualizar();
                    } else if (modal === 'foto')
                      salvarFotoPerfil(perfil.user_id, valores.foto);
                    else salvarEnderecoPerfil(perfil.user_id, valores);
                    notificar(
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
      <Rodape variante='compacto' />
    </>
  );
}

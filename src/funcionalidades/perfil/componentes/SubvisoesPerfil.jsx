import { IconeConcluido } from '../../../compartilhado/interface/IndicadoresFuncionais';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Upload } from 'lucide-react';
import {
  Botao,
  CabecalhoSubpagina,
  CampoFormulario,
  ModalConfirmacao,
  SeloEditorial,
} from '../../../compartilhado/indice';
import {
  extrairIniciais,
  opcoesNotificacoesPerfil,
  opcoesPrivacidadePerfil,
  secoesControleConta,
} from '../conteudo';

export function VisaoControleConta({
  aoVoltar,
  aoAbrirVisao,
  aoSair,
}) {
  return (
    <div className='space-y-8'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        selo='SUA CONTA'
        titulo='Sua conta, sob seu controle'
        subtitulo='Escolha o que deseja revisar.'
        assinatura='chave'
      />

      <div className='rounded-2xl bg-(--azul-fundo) p-4 sm:p-6'>
        <div className='space-y-3'>
          {secoesControleConta.map(item => (
            <button
              key={item.id}
              type='button'
              onClick={() => aoAbrirVisao(item.id)}
              className='flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl bg-white px-5 py-4 text-left transition-colors hover:bg-[#fcfdfe]'
            >
              <div className='flex min-w-0 items-center gap-4'>

                <div className='min-w-0'>
                  <p className='text-base font-bold text-(--azul-titulo) sm:text-lg'>
                    {item.titulo}
                  </p>
                  <p className='text-sm text-(--texto-apoio)'>
                    {item.subtitulo}
                  </p>
                </div>
              </div>
              <span className='shrink-0 text-sm font-bold text-(--azul-titulo)'>
                Ver detalhes
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <Botao
          type='button'
          variante='secundario'
          onClick={aoSair}
          classe='px-7!'
        >
          Sair da conta
        </Botao>
        <Botao
          type='button'
          variante='fantasma'
          onClick={() => aoAbrirVisao('documentos')}
          classe='border border-(--borda-suave) px-6!'
        >
          Termos e privacidade
        </Botao>
      </div>
    </div>
  );
}

export function VisaoInformacoesPessoais({
  perfil,
  aoSalvar,
  aoVoltar,
  aoAbrirMomento,
}) {
  const [nome, setNome] = useState(perfil.nomeCompleto || perfil.nome || '');
  const [email, setEmail] = useState(perfil.email || '');
  const [cidade, setCidade] = useState(perfil.cidade || 'São Paulo, SP');
  const [aviso, setAviso] = useState('');

  const lidarEnvio = evento => {
    evento.preventDefault();
    if (!nome.trim()) {
      setAviso('Informe seu nome para continuar.');
      return;
    }
    const primeiroNome = nome.trim().split(/\s+/)[0] || nome.trim();
    aoSalvar({
      nome: primeiroNome,
      nomeCompleto: nome.trim(),
      email: email.trim(),
      cidade: cidade.trim(),
    });
    setAviso('Informações atualizadas no seu perfil.');
  };

  return (
    <div className='space-y-8'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        selo='SUA CONTA'
        titulo='Informações pessoais'
        subtitulo='Revise seus dados e preferências.'
        assinatura={null}
      />

      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]'>
        <form
          onSubmit={lidarEnvio}
          className='space-y-6 rounded-2xl bg-(--azul-fundo) p-6 sm:p-8'
        >
          <CampoFormulario
            id='perfil-info-nome'
            rotulo='Nome'
            type='text'
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder='Maria Silva'
          />

          <div className='grid gap-5 sm:grid-cols-2'>
            <CampoFormulario
              id='perfil-info-email'
              rotulo='E-mail'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='maria@exemplo.com'
            />
            <CampoFormulario
              id='perfil-info-cidade'
              rotulo='Cidade'
              type='text'
              value={cidade}
              onChange={e => setCidade(e.target.value)}
              placeholder='São Paulo, SP'
            />
          </div>

          {aviso && (
            <p className='text-sm font-semibold text-(--laranja-principal)'>
              {aviso}
            </p>
          )}

          <div className='flex flex-wrap gap-3'>
            <Botao type='submit' cor='laranja' classe='px-8!'>
              Salvar alterações
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              onClick={aoVoltar}
              classe='px-8!'
            >
              Cancelar
            </Botao>
          </div>
        </form>

        <aside className='rounded-2xl border border-(--borda-suave) bg-white p-6'>
          <p className='text-xs font-bold tracking-[0.06em] text-(--azul-titulo) uppercase'>
            SUA CONTA, DO SEU JEITO
          </p>
          <h2 className='font-titulo mt-4 text-2xl font-extrabold text-(--azul-titulo)'>
            {nome.trim() || 'Visitante'}
          </h2>

          <div className='mt-5 space-y-4'>
            <div>
              <p className='text-sm font-bold text-(--azul-titulo)'>
                Seu momento
              </p>
              <p className='text-base text-(--texto-apoio)'>
                {perfil.momentoRotulo || 'Já moro sozinho'}
              </p>
            </div>
            <div>
              <p className='text-sm font-bold text-(--azul-titulo)'>
                Sua cidade
              </p>
              <p className='text-base text-(--texto-apoio)'>
                {cidade.trim() || 'São Paulo, SP'}
              </p>
            </div>
          </div>

          <Botao
            type='button'
            variante='secundario'
            onClick={aoAbrirMomento}
            classe='mt-6 w-full!'
          >
            Alterar meu momento
          </Botao>
        </aside>
      </div>
    </div>
  );
}

export function VisaoFotoPerfil({ perfil, aoSalvar, aoVoltar }) {
  const [fotoUrl, setFotoUrl] = useState(perfil.fotoUrl || '');
  const [nomeArquivo, setNomeArquivo] = useState(
    perfil.fotoNome || 'foto-perfil.jpg'
  );
  const [aviso, setAviso] = useState('');

  const iniciais = extrairIniciais(perfil.nomeCompleto || perfil.nome);

  const lidarArquivo = evento => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    setNomeArquivo(arquivo.name);
    const leitor = new FileReader();
    leitor.onload = () => {
      if (typeof leitor.result === 'string') {
        setFotoUrl(leitor.result);
        setAviso('Prévia atualizada. Clique em salvar para aplicar.');
      }
    };
    leitor.readAsDataURL(arquivo);
  };

  const lidarSalvar = evento => {
    evento.preventDefault();
    aoSalvar({
      fotoUrl,
      fotoNome: nomeArquivo,
    });
    setAviso('Foto de perfil atualizada.');
  };

  return (
    <div className='space-y-8'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        selo='SUA CONTA'
        titulo='Foto de perfil'
        subtitulo='Revise seus dados e preferências.'
        assinatura={null}
      />

      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]'>
        <form
          onSubmit={lidarSalvar}
          className='space-y-6 rounded-2xl bg-(--azul-fundo) p-6 sm:p-8'
        >
          <div className='flex flex-wrap items-center gap-6'>
            <div className='flex size-48 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#102a43] sm:size-60'>
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt='Prévia da foto de perfil'
                  className='size-full object-cover'
                />
              ) : (
                <span className='font-titulo text-6xl font-extrabold text-white'>
                  {iniciais}
                </span>
              )}
            </div>

            {fotoUrl && (
              <Botao
                type='button'
                variante='secundario'
                onClick={() => {
                  setFotoUrl('');
                  setNomeArquivo('');
                  setAviso('Foto removida da prévia.');
                }}
                classe='min-h-[44px]!'
              >
                Usar minhas iniciais
              </Botao>
            )}
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='entrada-foto-perfil'
              className='text-sm font-bold text-(--azul-titulo)'
            >
              Selecionar imagem
            </label>
            <div className='flex flex-wrap items-center gap-3 rounded-lg border border-(--borda-suave) bg-white px-4 py-3'>
              <span className='min-w-0 flex-1 truncate text-base text-(--texto-apoio)'>
                {nomeArquivo || 'foto-perfil.jpg'}
              </span>
              <label
                htmlFor='entrada-foto-perfil'
                className='inline-flex cursor-pointer items-center gap-2 rounded-full bg-(--azul-fundo) px-4 py-2 text-sm font-bold text-(--azul-titulo) transition-colors hover:bg-(--pessego-suave)'
              >
                <Upload size={16} aria-hidden='true' />
                Escolher arquivo
              </label>
              <input
                id='entrada-foto-perfil'
                type='file'
                accept='image/*'
                onChange={lidarArquivo}
                className='sr-only'
              />
            </div>
          </div>

          {aviso && (
            <p className='text-sm font-semibold text-(--laranja-principal)'>
              {aviso}
            </p>
          )}

          <div className='flex flex-wrap gap-3'>
            <Botao type='submit' cor='laranja' classe='px-8!'>
              Salvar alterações
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              onClick={aoVoltar}
              classe='px-8!'
            >
              Cancelar
            </Botao>
          </div>
        </form>

        <aside className='rounded-2xl border border-(--borda-suave) bg-white p-6'>
          <p className='text-xs font-bold tracking-[0.06em] text-(--azul-titulo) uppercase'>
            SUA CONTA, DO SEU JEITO
          </p>
          <h2 className='font-titulo mt-4 text-2xl font-extrabold text-(--azul-titulo)'>
            Sua presença, sem complicação
          </h2>
          <p className='mt-3 text-base leading-relaxed text-(--texto-apoio)'>
            Uma foto que te represente ou suas iniciais: seu perfil já ganha a
            sua cara.
          </p>
        </aside>
      </div>
    </div>
  );
}

export function VisaoSegurancaPerfil({ aoVoltar }) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const temOito = novaSenha.length >= 8;
  const temLetrasNumeros =
    /[A-Za-z]/.test(novaSenha) && /\d/.test(novaSenha);
  const temEspecial = /[^A-Za-z0-9]/.test(novaSenha);

  const lidarEnvio = evento => {
    evento.preventDefault();
    setErro('');
    setSucesso('');
    if (!senhaAtual) {
      setErro('Informe sua senha atual.');
      return;
    }
    if (!temOito || !temLetrasNumeros || !temEspecial) {
      setErro('Atenda a todos os critérios de segurança da nova senha.');
      return;
    }
    if (novaSenha !== confirmar) {
      setErro('A confirmação não coincide com a nova senha.');
      return;
    }
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmar('');
    setSucesso('Senha atualizada com segurança para esta sessão.');
  };

  return (
    <div className='space-y-8'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        selo='SUA CONTA'
        titulo='Segurança'
        subtitulo='Revise seus dados e preferências.'
        assinatura={null}
      />

      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]'>
        <form
          onSubmit={lidarEnvio}
          className='space-y-5 rounded-2xl bg-(--azul-fundo) p-6 sm:p-8'
        >
          <CampoFormulario
            id='seguranca-senha-atual'
            rotulo='Senha atual'
            type='password'
            value={senhaAtual}
            onChange={e => setSenhaAtual(e.target.value)}
            placeholder='••••••••'
          />
          <CampoFormulario
            id='seguranca-nova-senha'
            rotulo='Nova senha'
            type='password'
            value={novaSenha}
            onChange={e => setNovaSenha(e.target.value)}
            placeholder='••••••••••'
          />
          <CampoFormulario
            id='seguranca-confirmar-senha'
            rotulo='Confirmar nova senha'
            type='password'
            value={confirmar}
            onChange={e => setConfirmar(e.target.value)}
            placeholder='••••••••••'
          />

          {erro && (
            <p role='alert' className='text-sm font-semibold text-[#b42318]'>
              {erro}
            </p>
          )}
          {sucesso && (
            <p className='text-sm font-semibold text-(--laranja-principal)'>
              {sucesso}
            </p>
          )}

          <div className='flex flex-wrap gap-3 pt-1'>
            <Botao type='submit' cor='laranja' classe='px-8!'>
              Atualizar senha
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              onClick={aoVoltar}
              classe='px-8!'
            >
              Cancelar
            </Botao>
          </div>
        </form>

        <aside className='space-y-5'>
          <div className='rounded-2xl border border-(--borda-suave) bg-white p-6'>
            <p className='text-xs font-bold tracking-[0.06em] text-(--azul-titulo) uppercase'>
              SUA CONTA, DO SEU JEITO
            </p>
            <h2 className='font-titulo mt-4 text-2xl font-extrabold text-(--azul-titulo)'>
              Uma senha só para o Iagora
            </h2>

            <ul className='mt-5 space-y-4'>
              {[
                {
                  rotulo: 'Pelo menos 8 caracteres',
                  atendido: temOito,
                },
                {
                  rotulo: 'Letras e números',
                  atendido: temLetrasNumeros,
                },
                {
                  rotulo: 'Um caractere especial',
                  atendido: temEspecial,
                },
              ].map(regra => (
                <li key={regra.rotulo} className='flex items-start gap-2.5'>
                  <Check
                    size={18}
                    aria-hidden='true'
                    className={`mt-0.5 shrink-0 ${
                      regra.atendido
                        ? 'text-(--laranja-principal)'
                        : 'text-(--azul-titulo)'
                    }`}
                  />
                  <div>
                    <p className='font-bold text-(--azul-titulo)'>
                      {regra.rotulo}
                    </p>
                    <p className='text-sm text-(--texto-apoio)'>
                      Confira antes de salvar.
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className='rounded-2xl bg-(--azul-fundo) p-5'>
            <p className='font-bold text-(--azul-titulo)'>
              Escolha uma senha única
            </p>
            <p className='mt-1 text-sm leading-relaxed text-(--texto-apoio)'>
              Use pelo menos 8 caracteres com letras, números e um caractere
              especial.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function VisaoAlterarMomento({ aoSelecionarMomento, aoVoltar }) {
  const navegar = useNavigate();

  return (
    <div className='space-y-8'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        selo='SUA CONTA'
        titulo='Seu momento pode mudar'
        subtitulo='Escolha a experiência que combina com sua fase atual.'
        assinatura='chave'
      />

      <div className='flex flex-wrap gap-4'>
        <Botao
          type='button'
          cor='laranja'
          onClick={() => aoSelecionarMomento('morando', '/home')}
          classe='px-8!'
        >
          Já moro sozinho
        </Botao>
        <Botao
          type='button'
          variante='secundario'
          onClick={() => aoSelecionarMomento('preparacao', '/home-b')}
          classe='px-8!'
        >
          Vou morar sozinho
        </Botao>
        <Botao
          type='button'
          variante='secundario'
          onClick={() => navegar('/empresa')}
          classe='px-8!'
        >
          Quero anunciar meu serviço
        </Botao>
      </div>
    </div>
  );
}

export function VisaoNotificacoesPerfil({ perfil, aoSalvar, aoVoltar }) {
  const [notificacoes, setNotificacoes] = useState({
    rotina: perfil.notificacoes?.rotina ?? true,
    financas: perfil.notificacoes?.financas ?? true,
    resumoSemanal: perfil.notificacoes?.resumoSemanal ?? true,
    mensagensEmpresa: perfil.notificacoes?.mensagensEmpresa ?? true,
  });
  const [salvo, setSalvo] = useState(false);

  const alternar = chave => {
    setSalvo(false);
    setNotificacoes(atual => ({ ...atual, [chave]: !atual[chave] }));
  };

  const lidarEnvio = evento => {
    evento.preventDefault();
    aoSalvar({ notificacoes });
    setSalvo(true);
  };

  return (
    <div className='space-y-8'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        selo='SUA CONTA'
        titulo='Notificações'
        subtitulo='Revise seus dados e preferências.'
        assinatura={null}
      />

      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]'>
        <form
          onSubmit={lidarEnvio}
          className='space-y-4 rounded-2xl bg-(--azul-fundo) p-6 sm:p-8'
        >
          {opcoesNotificacoesPerfil.map(item => {
            const ativo = Boolean(notificacoes[item.chave]);
            return (
              <button
                key={item.chave}
                type='button'
                role='checkbox'
                aria-checked={ativo}
                onClick={() => alternar(item.chave)}
                className='flex w-full cursor-pointer items-center gap-4 rounded-xl bg-white p-5 text-left transition-colors hover:bg-[#fcfdfe]'
              >
                <span
                  aria-hidden='true'
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md border text-sm font-bold ${
                    ativo
                      ? 'border-(--laranja-principal) bg-(--laranja-principal) text-white'
                      : 'border-(--borda-suave) bg-white text-transparent'
                  }`}
                >
                  <IconeConcluido />
                </span>
                <span>
                  <span className='block text-lg font-bold text-(--azul-titulo)'>
                    {item.titulo}
                  </span>
                  <span className='mt-0.5 block text-sm text-(--texto-apoio)'>
                    {item.descricao}
                  </span>
                </span>
              </button>
            );
          })}

          {salvo && (
            <p className='text-sm font-semibold text-(--laranja-principal)'>
              Preferências de notificação salvas.
            </p>
          )}

          <div className='flex flex-wrap gap-3 pt-2'>
            <Botao type='submit' cor='laranja' classe='px-8!'>
              Salvar alterações
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              onClick={aoVoltar}
              classe='px-8!'
            >
              Cancelar
            </Botao>
          </div>
        </form>

        <aside className='rounded-2xl border border-(--borda-suave) bg-white p-6'>
          <p className='text-xs font-bold tracking-[0.06em] text-(--azul-titulo) uppercase'>
            SUA CONTA, DO SEU JEITO
          </p>
          <h2 className='font-titulo mt-4 text-2xl font-extrabold text-(--azul-titulo)'>
            Um lembrete que ajuda
          </h2>
          <div className='mt-5 rounded-xl bg-(--laranja-fundo) p-5 text-(--azul-titulo)'>
            <p className='text-xs font-bold'>Hoje · 13h45</p>
            <p className='font-titulo mt-2 text-lg font-extrabold'>
              Lavar a louça às 14h
            </p>
            <p className='mt-1 text-sm text-(--texto-apoio)'>
              Cozinha · Minha rotina
            </p>
          </div>
          <p className='mt-5 text-base leading-relaxed text-(--texto-apoio)'>
            Ative só os avisos que fazem sentido para você. Ajuste suas escolhas
            quando precisar.
          </p>
        </aside>
      </div>
    </div>
  );
}

export function VisaoPrivacidadePerfil({ perfil, aoSalvar, aoVoltar }) {
  const [privacidade, setPrivacidade] = useState({
    personalizarPorMomento:
      perfil.privacidade?.personalizarPorMomento ?? false,
    mostrarLembretes: perfil.privacidade?.mostrarLembretes ?? false,
    comunicacoesOpcionais: perfil.privacidade?.comunicacoesOpcionais ?? false,
  });
  const [salvo, setSalvo] = useState(false);

  const alternar = chave => {
    setSalvo(false);
    setPrivacidade(atual => ({ ...atual, [chave]: !atual[chave] }));
  };

  const lidarEnvio = evento => {
    evento.preventDefault();
    aoSalvar({ privacidade });
    setSalvo(true);
  };

  return (
    <div className='space-y-8'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        selo='SUA CONTA'
        titulo='Privacidade'
        subtitulo='Revise seus dados e preferências.'
        assinatura={null}
      />

      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]'>
        <form
          onSubmit={lidarEnvio}
          className='space-y-4 rounded-2xl bg-(--azul-fundo) p-6 sm:p-8'
        >
          {opcoesPrivacidadePerfil.map(item => {
            const ativo = Boolean(privacidade[item.chave]);
            return (
              <button
                key={item.chave}
                type='button'
                role='checkbox'
                aria-checked={ativo}
                onClick={() => alternar(item.chave)}
                className='flex w-full cursor-pointer items-center gap-4 rounded-xl bg-white p-5 text-left transition-colors hover:bg-[#fcfdfe]'
              >
                <span
                  aria-hidden='true'
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md border text-sm font-bold ${
                    ativo
                      ? 'border-(--laranja-principal) bg-(--laranja-principal) text-white'
                      : 'border-(--borda-suave) bg-white text-transparent'
                  }`}
                >
                  <IconeConcluido />
                </span>
                <span>
                  <span className='block text-lg font-bold text-(--azul-titulo)'>
                    {item.titulo}
                  </span>
                  <span className='mt-0.5 block text-sm text-(--texto-apoio)'>
                    {item.descricao}
                  </span>
                </span>
              </button>
            );
          })}

          {salvo && (
            <p className='text-sm font-semibold text-(--laranja-principal)'>
              Escolhas de privacidade salvas.
            </p>
          )}

          <div className='flex flex-wrap gap-3 pt-2'>
            <Botao type='submit' cor='laranja' classe='px-8!'>
              Salvar alterações
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              onClick={aoVoltar}
              classe='px-8!'
            >
              Cancelar
            </Botao>
          </div>
        </form>

        <aside className='rounded-2xl border border-(--borda-suave) bg-white p-6'>
          <p className='text-xs font-bold tracking-[0.06em] text-(--azul-titulo) uppercase'>
            SUA CONTA, DO SEU JEITO
          </p>
          <h2 className='font-titulo mt-4 text-2xl font-extrabold text-(--azul-titulo)'>
            Você escolhe o que personalizar
          </h2>
          <p className='mt-3 text-base leading-relaxed text-(--texto-apoio)'>
            Seu momento e suas preferências ajudam a organizar sugestões. Revise
            suas escolhas nesta tela.
          </p>
          <div className='mt-5 space-y-3'>
            <Botao
              como={Link}
              to='/privacidade'
              variante='secundario'
              classe='w-full!'
            >
              Ler sobre privacidade
            </Botao>
            <Botao
              como={Link}
              to='/termos'
              variante='fantasma'
              classe='w-full! border border-(--borda-suave)'
            >
              Ver Termos de Uso
            </Botao>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function VisaoMoradiaPerfil({
  perfil,
  ehPreparacao,
  aoSalvar,
  aoVoltar,
}) {
  const [residencia, setResidencia] = useState(
    perfil.tipoMoradia || 'Minha casa · Apartamento'
  );
  const [salvo, setSalvo] = useState(false);

  const lidarEnvio = evento => {
    evento.preventDefault();
    aoSalvar({ tipoMoradia: residencia.trim() || 'Minha casa · Apartamento' });
    setSalvo(true);
  };

  return (
    <div className='space-y-8'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        selo='SUA CONTA'
        titulo='Moradia'
        subtitulo='Revise seus dados e preferências.'
        assinatura={null}
      />

      <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]'>
        <form
          onSubmit={lidarEnvio}
          className='space-y-5 rounded-2xl bg-(--azul-fundo) p-6 sm:p-8'
        >
          <CampoFormulario
            id='perfil-moradia-residencia'
            rotulo='Minha residência'
            type='text'
            value={residencia}
            onChange={e => {
              setSalvo(false);
              setResidencia(e.target.value);
            }}
            placeholder='Minha casa · Apartamento'
          />

          <Botao
            como={Link}
            to={ehPreparacao ? '/encontrar-casa' : '/casa?visao=residencia'}
            variante='secundario'
            classe='px-7!'
          >
            Editar informações da casa
          </Botao>

          {salvo && (
            <p className='text-sm font-semibold text-(--laranja-principal)'>
              Dados de moradia atualizados.
            </p>
          )}

          <div className='flex flex-wrap gap-3'>
            <Botao type='submit' cor='laranja' classe='px-8!'>
              Salvar alterações
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              onClick={aoVoltar}
              classe='px-8!'
            >
              Cancelar
            </Botao>
          </div>
        </form>

        <aside className='rounded-2xl border border-(--borda-suave) bg-white p-6'>
          <p className='text-xs font-bold tracking-[0.06em] text-(--azul-titulo) uppercase'>
            SUA CONTA, DO SEU JEITO
          </p>
          <h2 className='font-titulo mt-4 text-2xl font-extrabold text-(--azul-titulo)'>
            Uma casa conectada à sua rotina
          </h2>
          <div className='mt-5'>
            <p className='text-sm font-bold text-(--azul-titulo)'>
              Minha residência
            </p>
            <p className='mt-1 text-base text-(--texto-apoio)'>
              {residencia || 'Apartamento'} · {perfil.cidade || 'São Paulo, SP'}
            </p>
          </div>
          <Botao
            como={Link}
            to={ehPreparacao ? '/encontrar-casa' : '/casa'}
            variante='secundario'
            classe='mt-6 w-full!'
          >
            Ver os cuidados da casa
          </Botao>
        </aside>
      </div>
    </div>
  );
}

export function VisaoDocumentosPerfil({
  aoAbrirPrivacidade,
  aoAbrirControle,
  aoFechar,
}) {
  return (
    <div className='mx-auto max-w-[720px] rounded-2xl border border-(--borda-suave) bg-white p-6 shadow-xs sm:p-8'>
      <SeloEditorial texto='IAGORA · UM PASSO DE CADA VEZ' />
      <h1 className='font-titulo mt-4 text-3xl font-extrabold text-(--azul-titulo) sm:text-4xl'>
        Seus dados, suas escolhas
      </h1>
      <p className='mt-2 text-base text-(--texto-apoio) sm:text-lg'>
        Escolha o que deseja abrir.
      </p>

      <div className='mt-6 space-y-3'>
        <Botao
          type='button'
          variante='secundario'
          onClick={aoAbrirPrivacidade}
          classe='w-full! justify-center!'
        >
          Privacidade
        </Botao>
        <Botao
          como={Link}
          to='/termos'
          variante='secundario'
          classe='w-full! justify-center!'
        >
          Termos
        </Botao>
        <Botao
          type='button'
          variante='secundario'
          onClick={aoAbrirControle}
          classe='w-full! justify-center!'
        >
          Preferências
        </Botao>
        <Botao
          type='button'
          variante='fantasma'
          onClick={aoFechar}
          classe='w-full! justify-center!'
        >
          Fechar
        </Botao>
      </div>
    </div>
  );
}

export function VisaoExcluirConta({ aoConfirmarExclusao, aoVoltar }) {
  const [textoConfirmacao, setTextoConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  const tentarExcluir = evento => {
    evento.preventDefault();
    if (textoConfirmacao.trim().toUpperCase() !== 'EXCLUIR') {
      setErro('Digite EXCLUIR em letras maiúsculas para confirmar.');
      return;
    }
    setErro('');
    setModalAberto(true);
  };

  return (
    <div className='space-y-8'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        selo='SUA CONTA'
        titulo='Antes de excluir sua conta'
        subtitulo='Revise a decisão com cuidado.'
        assinatura='chave'
      />

      <div className='rounded-xl bg-(--laranja-fundo) p-5 text-(--azul-titulo)'>
        <p className='text-lg font-bold'>A exclusão encerra sua conta</p>
        <p className='mt-1 text-base text-(--texto-apoio)'>
          Em um produto conectado, essa ação exige confirmação e tratamento dos
          dados conforme as condições aplicáveis. Aqui é uma demonstração.
        </p>
      </div>

      <form onSubmit={tentarExcluir} className='max-w-[776px] space-y-5'>
        <CampoFormulario
          id='confirmar-exclusao-conta'
          rotulo='Digite EXCLUIR para confirmar'
          type='text'
          value={textoConfirmacao}
          onChange={e => setTextoConfirmacao(e.target.value)}
          placeholder='EXCLUIR'
          erro={erro}
        />

        <div className='flex flex-wrap gap-3'>
          <Botao type='submit' cor='laranja' classe='px-8!'>
            Confirmar exclusão
          </Botao>
          <Botao
            type='button'
            variante='secundario'
            onClick={aoVoltar}
            classe='px-8!'
          >
            Manter minha conta
          </Botao>
        </div>
      </form>

      <ModalConfirmacao
        aberto={modalAberto}
        titulo='Deseja realmente encerrar a conta?'
        descricao='Os dados salvos localmente neste navegador serão limpos e você retornará para a tela inicial de acesso.'
        textoConfirmar='Confirmar exclusão'
        textoCancelar='Manter minha conta'
        destrutivo
        aoCancelar={() => setModalAberto(false)}
        aoConfirmar={() => {
          setModalAberto(false);
          aoConfirmarExclusao();
        }}
      />
    </div>
  );
}

export function CartaoMomento({
  titulo,
  descricao,
  imagem,
  alt,
  destaquePessego = false,
  selecionado = false,
  aoClicar,
}) {
  return (
    <button
      type='button'
      onClick={aoClicar}
      aria-pressed={selecionado}
      className={`group flex cursor-pointer flex-col overflow-hidden text-left shadow-md transition-transform hover:-translate-y-0.5 ${
        destaquePessego ? 'bg-(--laranja-fundo)' : 'bg-white'
      } ${
        selecionado
          ? 'ring-3 ring-(--laranja-principal)'
          : 'ring-1 ring-white/15'
      }`}
    >
      <div className='aspect-[16/10] w-full overflow-hidden'>
        <img
          src={imagem}
          alt={alt}
          className='size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
        />
      </div>
      <div className='flex flex-1 flex-col justify-center gap-1.5 p-6 text-(--azul-titulo) sm:p-8'>
        <div className='flex items-center justify-between gap-2'>
          <h3 className='font-titulo text-2xl leading-tight font-extrabold sm:text-[1.75rem]'>
            {titulo}
          </h3>
          {selecionado && (
            <span className='inline-flex items-center gap-1 rounded-full bg-(--laranja-principal) px-3 py-1 text-xs font-bold text-white'>
              Atual
            </span>
          )}
        </div>
        <p className='text-base leading-relaxed text-(--azul-titulo)/85 sm:text-lg'>
          {descricao}
        </p>
      </div>
    </button>
  );
}

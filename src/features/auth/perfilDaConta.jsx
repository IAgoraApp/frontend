import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Botao, Container } from '../../shared/ui';
import {
  contaApi,
  encerrarSessao,
  lerSessao,
  salvarSessao,
} from '../../app/dados/contaApi';
import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { rotaPerfilMoradia } from '../../app/dados/perfilNavegacao';
import { acessoLocal } from '../../app/dados/acessoLocal';
import { atualizarEmpresa } from '../../app/estado/estadoEmpresa';
import { EtapaCadastro } from './components/EtapaCadastro';
import fotoProfissional from '../empresa/assets/ServiceCover.png';
import './auth.css';

export default function PerfilDaConta({ empresa = false, cadastro = false }) {
  const [sessao] = useState(lerSessao);
  const { state } = useLocation();
  if (cadastro && acessoLocal)
    return (
      <EditorPerfil
        sessao={{ email: state?.email || '' }}
        empresa
        cadastro
        local
      />
    );
  if (!sessao || sessao.tipo !== (empresa ? 2 : 1))
    return <Navigate to='/login' replace />;
  if (cadastro && !sessao.cadastroPendente)
    return <Navigate to='/empresa/perfil' replace />;
  return <EditorPerfil sessao={sessao} empresa={empresa} cadastro={cadastro} />;
}

function EditorPerfil({ sessao, empresa, cadastro, local = false }) {
  const navegar = useNavigate();
  const { pathname } = useLocation();
  const notificar = useAvisoPerfilA();
  const [perfil, setPerfil] = useState(local ? {} : null);
  const [carregando, setCarregando] = useState(!local);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [complemento, setComplemento] = useState(false);
  const [previa, setPrevia] = useState(null);
  const endpoint = empresa
    ? '/empresas/meu-perfil'
    : `/perfis/user/${sessao.id}`;
  const { token } = sessao;

  useEffect(() => {
    if (local) return;
    const controller = new AbortController();
    contaApi(endpoint, { token, signal: controller.signal })
      .then(result => {
        if (!result)
          throw new Error('O servidor não retornou os dados do perfil.');
        if (controller.signal.aborted) return;
        if (!empresa && [1, 2].includes(Number(result.tipo))) {
          const momentoMoradia = Number(result.tipo);
          const sessaoAtual = lerSessao();
          if (sessaoAtual?.token === token)
            salvarSessao({ ...sessaoAtual, momentoMoradia });
        }
        setPerfil(result);
      })
      .catch(falha => {
        if (falha.name === 'AbortError') return;
        if (empresa && falha.status === 404)
          setPerfil({ email_comercial: sessao.email });
        else setErro(falha.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });
    return () => controller.abort();
  }, [endpoint, token, empresa, sessao.email, local]);

  const rotaMoradia = perfil && rotaPerfilMoradia(Number(perfil.tipo));
  useEffect(() => {
    if (!empresa && rotaMoradia && pathname !== rotaMoradia)
      navegar(rotaMoradia, { replace: true });
  }, [empresa, navegar, pathname, rotaMoradia]);

  async function salvar(evento) {
    evento.preventDefault();
    if (salvando) return;
    if (cadastro && !complemento) {
      setComplemento(true);
      return;
    }
    const dados = Object.fromEntries(new FormData(evento.currentTarget));
    const nome = dados.nome.trim();
    setErro('');
    setAviso('');
    setSalvando(true);
    try {
      if (!nome) throw new Error('Informe o nome do perfil.');
      if (empresa) {
        const cnpj = dados.cnpj.replace(/\D/g, '');
        if (cnpj.length !== 14)
          throw new Error('Informe um CNPJ com 14 dígitos.');
        const payload = {
          nome,
          cnpj,
          categoria: dados.categoria.trim(),
          telefone: dados.telefone.trim(),
          email_comercial: dados.email_comercial.trim(),
          descricao: dados.descricao.trim() || null,
          site: dados.site.trim() || null,
          local_atendimento: dados.local_atendimento
            .split(',')
            .map(local => local.trim())
            .filter(Boolean),
          horario_atendimento: dados.horario_atendimento.trim()
            ? { segunda_sexta: dados.horario_atendimento.trim() }
            : null,
        };
        if (!payload.categoria || !payload.telefone)
          throw new Error('Informe a categoria e o telefone comercial.');
        if (local) {
          atualizarEmpresa(atual => ({
            ...atual,
            empresa: {
              ...atual.empresa,
              ...payload,
              email: payload.email_comercial,
            },
          }));
          navegar('/empresa/dashboard', { replace: true });
          return;
        }
        await contaApi(perfil.id ? endpoint : '/empresas/perfil', {
          metodo: perfil.id ? 'PATCH' : 'POST',
          dados: payload,
          token,
        });
        if (cadastro) {
          salvarSessao({ ...sessao, cadastroPendente: false });
          navegar('/empresa/perfil', { replace: true });
          return;
        }
        setPerfil(await contaApi(endpoint, { token }));
      } else {
        const payload = { nome, tipo: Number(dados.tipo) };
        await contaApi(`/perfis/${perfil.id}`, {
          metodo: 'PATCH',
          dados: payload,
          token,
        });
        setPerfil(atual => ({ ...atual, ...payload }));
        salvarSessao({ ...sessao, momentoMoradia: payload.tipo });
        notificar('Perfil salvo.');
        navegar(rotaPerfilMoradia(payload.tipo), { replace: true });
        return;
      }
      setAviso('Perfil salvo.');
    } catch (falha) {
      setErro(
        empresa && [404, 405, 501].includes(falha.status)
          ? 'O servidor ainda não disponibiliza o cadastro do perfil comercial. Sua conta continua ativa.'
          : falha.message
      );
    } finally {
      setSalvando(false);
    }
  }

  async function enviarParaAnalise() {
    if (salvando) return;
    setSalvando(true);
    setErro('');
    setAviso('');
    try {
      await contaApi('/empresas/meu-perfil/enviar-validacao', {
        metodo: 'POST',
        token,
      });
      setAviso('Perfil enviado para análise.');
    } catch (falha) {
      setErro(
        [404, 405, 501].includes(falha.status)
          ? 'O envio para análise ainda está indisponível no servidor.'
          : falha.message
      );
    } finally {
      setSalvando(false);
    }
  }

  const formulario = (
    <section className='acesso-formulario'>
      {cadastro && (
        <ol
          className='etapa-empresa-progresso'
          aria-label='Etapas do cadastro empresarial'
        >
          <li aria-current={!complemento ? 'step' : undefined}>
            Dados comerciais
          </li>
          <li aria-current={complemento ? 'step' : undefined}>Atendimento</li>
        </ol>
      )}
      <h1>
        {cadastro
          ? 'Dados da sua empresa'
          : empresa
            ? 'Perfil da empresa'
            : 'Meu perfil'}
      </h1>
      <p>
        {empresa
          ? cadastro
            ? complemento
              ? 'Acrescente detalhes de atendimento, se quiser.'
              : 'Informe os dados comerciais para montar seu perfil.'
            : 'Complete o perfil comercial para enviar sua empresa para análise.'
          : 'Personalize como você aparece no IAgora e escolha seu momento de moradia.'}
      </p>
      {carregando && <p role='status'>Carregando perfil…</p>}
      {erro && <p role='alert'>{erro}</p>}
      {aviso && <p role='status'>{aviso}</p>}
      {perfil && (
        <form
          className='acesso-campos'
          data-empresa-etapa={
            cadastro ? (complemento ? 'complemento' : 'dados') : undefined
          }
          onInput={
            cadastro
              ? evento => {
                  const { name, value } = evento.target;
                  if (name === 'nome' || name === 'categoria')
                    setPrevia(atual => ({ ...atual, [name]: value.trim() }));
                }
              : undefined
          }
          onSubmit={salvar}
        >
          <label>
            {empresa ? 'Nome da empresa' : 'Nome'}
            <input
              name='nome'
              defaultValue={perfil.nome}
              required
              maxLength={150}
            />
          </label>
          {empresa ? (
            <>
              <label>
                CNPJ
                <input
                  name='cnpj'
                  defaultValue={perfil.cnpj}
                  inputMode='numeric'
                  required
                  maxLength={18}
                />
              </label>
              <label>
                Categoria de serviço
                <input
                  name='categoria'
                  defaultValue={perfil.categoria}
                  required
                  maxLength={150}
                />
              </label>
              <label>
                Telefone comercial
                <input
                  name='telefone'
                  type='tel'
                  defaultValue={perfil.telefone}
                  required
                  maxLength={20}
                />
              </label>
              <label>
                E-mail comercial
                <input
                  name='email_comercial'
                  type='email'
                  defaultValue={
                    perfil.email_comercial ??
                    perfil.emailComercial ??
                    sessao.email
                  }
                  required
                  maxLength={255}
                />
              </label>
              <label className='etapa-cadastro-opcional'>
                Site (opcional)
                <input
                  name='site'
                  type={cadastro && !complemento ? 'text' : 'url'}
                  maxLength={500}
                  defaultValue={perfil.site}
                />
              </label>
              <label className='etapa-cadastro-opcional'>
                Cidades atendidas (opcional)
                <input
                  name='local_atendimento'
                  placeholder='São Paulo - SP, Osasco - SP'
                  defaultValue={
                    Array.isArray(perfil.local_atendimento)
                      ? perfil.local_atendimento.join(', ')
                      : ''
                  }
                />
              </label>
              <label className='etapa-cadastro-opcional'>
                Horário de segunda a sexta (opcional)
                <input
                  name='horario_atendimento'
                  placeholder='08:00-18:00'
                  defaultValue={perfil.horario_atendimento?.segunda_sexta}
                />
              </label>
              <label className='etapa-cadastro-linha etapa-cadastro-opcional'>
                Descrição (opcional)
                <textarea
                  name='descricao'
                  rows={cadastro ? 1 : 3}
                  defaultValue={perfil.descricao}
                />
              </label>
            </>
          ) : (
            <label>
              Seu momento de moradia
              <select name='tipo' defaultValue={perfil.tipo}>
                <option value='1'>Já tenho minha casa</option>
                <option value='2'>Planejo morar sozinho</option>
              </select>
            </label>
          )}
          <div className='etapa-cadastro-linha flex flex-wrap items-center gap-2'>
            <Botao type='submit' disabled={salvando}>
              {cadastro
                ? complemento
                  ? 'Salvar e continuar'
                  : 'Continuar'
                : 'Salvar perfil'}
            </Botao>
            {cadastro && complemento && (
              <Botao
                type='button'
                variante='contorno'
                disabled={salvando}
                onClick={() => setComplemento(false)}
              >
                Rever dados
              </Botao>
            )}
            {empresa && perfil.id && !perfil.validado && (
              <Botao
                type='button'
                variante='contorno'
                disabled={salvando}
                onClick={enviarParaAnalise}
              >
                Enviar para análise
              </Botao>
            )}
          </div>
        </form>
      )}
    </section>
  );

  if (cadastro)
    return (
      <EtapaCadastro sessao={local ? null : sessao} empresa ocupado={salvando}>
        <div className='etapa-cadastro-conteudo etapa-cadastro-empresa'>
          {formulario}
          <aside
            className='etapa-cadastro-foto'
            aria-label='Prévia no Marketplace'
          >
            <div className='etapa-empresa-previa'>
              <img src={fotoProfissional} alt='' />
              <div>
                <p>Prévia do perfil</p>
                <h2>
                  {(previa?.nome ?? perfil?.nome) || 'Nome da sua empresa'}
                </h2>
                <p>
                  {(previa?.categoria ?? perfil?.categoria) ||
                    'Categoria de serviço'}
                </p>
              </div>
            </div>
            <p>O perfil poderá aparecer no Marketplace depois da aprovação.</p>
          </aside>
        </div>
      </EtapaCadastro>
    );

  return (
    <main className='acesso-pagina py-5'>
      <Container classe='grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]'>
        {formulario}
        <aside className='self-start rounded-xl bg-(--azul-titulo) p-5 text-white sm:p-6'>
          <h2 className='text-xl font-extrabold'>Sua conta</h2>
          <p className='mt-2 wrap-anywhere'>
            {sessao.email ||
              'Preencha os dados comerciais para concluir esta etapa.'}
          </p>
          {perfil && (!empresa || perfil.validado) && (
            <Link
              className='mt-4 block font-bold underline'
              to={
                empresa ? '/empresa' : perfil.tipo === 2 ? '/home-b' : '/home'
              }
            >
              {empresa ? 'Abrir painel' : 'Abrir meu espaço'}
            </Link>
          )}
          <button
            type='button'
            className='mt-4 cursor-pointer text-sm font-bold underline'
            onClick={() => {
              encerrarSessao();
              navegar('/login', { replace: true });
            }}
          >
            Sair da conta
          </button>
        </aside>
      </Container>
    </main>
  );
}

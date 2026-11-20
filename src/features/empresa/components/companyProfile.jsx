import {
  ArrowLeft,
  Camera,
  CreditCard,
  Eye,
  Image,
  Pencil,
  Receipt,
  UserRound,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Botao, Container, Titulo } from '../../../shared/ui';
import { lerImagemComoDados } from '../../../app/estado/estadoEmpresa';
import { EditorMvp } from '../../../shared/ui/mvp';
import { DialogoCasa } from '../../casa/components/casaUi';
import { resumoEndereco } from '../../marketplace/contratacoes';
import CobrancasPerfilA from '../../perfil/components/CobrancasPerfilA';
import { NavegacaoPerfil } from '../../perfil/components/EstruturaPerfil';
import { camposEnderecoPerfil } from '../../perfil/perfilDados';
import { PerfilEmpresaMarketplace } from '../../marketplace/empresaMarketplace';
import { FotoServico } from '../../marketplace/catalogoMarketplaceA';
import {
  nomeCategoria,
  precoServico,
  servicoPublico,
} from '../../marketplace/marketplaceDados';
import DadosComerciais, { PreviaVisualEmpresa } from './DadosComerciais';
import './companyProfile.css';
import '../../perfil/perfilA.css';
import {
  concluirPagamentoPublicacao,
  enviarEmpresaParaAnalise,
  salvarEmpresa,
  salvarEnderecoEmpresa,
} from '../empresaDados';

const areas = [
  ['perfil', 'Visão geral', UserRound],
  ['assinatura', 'Assinatura', Receipt],
  ['pagamentos', 'Pagamentos', CreditCard],
];
const painel =
  'min-w-0 rounded-2xl border border-(--borda-suave) bg-white p-5 sm:p-6';
const midias = [
  {
    nome: 'logo',
    titulo: 'Logo da empresa',
    descricao: 'A imagem que identifica a empresa no Marketplace.',
    Icone: Camera,
  },
  {
    nome: 'banner',
    titulo: 'Capa do perfil',
    descricao: 'Uma imagem horizontal para o topo da página.',
    Icone: Image,
  },
];

function imagemValida(valor) {
  return /^(https?:\/\/|data:image\/jpeg;base64,)/i.test(valor ?? '');
}

function EditorMidiasEmpresa({ empresa, userId, aoFechar, notificar }) {
  const [imagens, setImagens] = useState({
    logo: imagemValida(empresa.logo) ? empresa.logo : '',
    banner: imagemValida(empresa.banner) ? empresa.banner : '',
  });
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const previa = {
    ...empresa,
    logo: imagemValida(imagens.logo) ? imagens.logo : null,
    banner: imagemValida(imagens.banner) ? imagens.banner : null,
  };

  function atualizar(nome, valor) {
    setErro('');
    setImagens(atual => ({ ...atual, [nome]: valor }));
  }

  async function carregar(nome, evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = '';
    if (!arquivo) return;
    setOcupado(true);
    try {
      atualizar(nome, await lerImagemComoDados(arquivo));
    } catch (falha) {
      setErro(falha.message || 'Não foi possível abrir a imagem.');
    } finally {
      setOcupado(false);
    }
  }

  return (
    <DialogoCasa
      titulo='Editar logo e capa'
      aoFechar={aoFechar}
      classe='empresa-editor-dialogo empresa-editor-midias'
    >
      <div className='empresa-editor-layout'>
        <PreviaVisualEmpresa key={previa.banner ?? 'capa'} empresa={previa} />
        <div className='perfil-editor'>
          <EditorMvp
            cabecalho={false}
            secoes={midias.map(({ nome, titulo, descricao, Icone }) => ({
              titulo,
              descricao,
              Icone,
              campos: [
                {
                  nome,
                  rotulo: titulo,
                  obrigatorio: false,
                  renderizar: () => (
                    <div className='empresa-editor-arquivo'>
                      <label>
                        Escolher imagem
                        <input
                          type='file'
                          accept='image/jpeg,image/png,image/webp'
                          disabled={ocupado}
                          onChange={evento => carregar(nome, evento)}
                        />
                      </label>
                      <label>
                        Ou cole o endereço da imagem
                        <input
                          type='url'
                          maxLength={500}
                          placeholder='https://'
                          value={
                            imagens[nome].startsWith('data:')
                              ? ''
                              : imagens[nome]
                          }
                          onChange={evento =>
                            atualizar(nome, evento.target.value)
                          }
                        />
                      </label>
                      {imagens[nome] && (
                        <button
                          className='mvp-link justify-self-start'
                          type='button'
                          onClick={() => atualizar(nome, '')}
                        >
                          Remover imagem
                        </button>
                      )}
                    </div>
                  ),
                },
              ],
            }))}
            grupoSecoes='midias-empresa'
            onClose={aoFechar}
            rotuloSalvar='Salvar imagens'
            onSave={() => {
              if (ocupado) throw new Error('Aguarde o carregamento da imagem.');
              const logo = imagens.logo.trim();
              const banner = imagens.banner.trim();
              if ([logo, banner].some(valor => valor && !imagemValida(valor)))
                throw new Error(
                  'Informe um endereço que comece com http:// ou https://.'
                );
              salvarEmpresa(userId, {
                cnpj: empresa.cnpj,
                logo: logo || null,
                banner: banner || null,
              });
              notificar('Imagens da empresa atualizadas.');
            }}
            acaoSecundaria={
              erro ? (
                <p role='alert'>{erro}</p>
              ) : ocupado ? (
                <p role='status'>Carregando imagem…</p>
              ) : null
            }
          />
        </div>
      </div>
    </DialogoCasa>
  );
}

export default function PerfilEmpresa({
  b,
  userId,
  empresa,
  visao,
  somenteMidias,
  executar,
  notificar,
}) {
  const [params] = useSearchParams();
  const navegar = useNavigate();
  const [editarDados, setEditarDados] = useState(false);
  const previa = !somenteMidias && params.get('visao') === 'publico';

  const [editarEndereco, setEditarEndereco] = useState(false);
  const endereco = b.endereco.find(e => e.id === empresa?.endereco_id);
  const emAnalise = b.validacoes_empresa?.includes(empresa?.id);
  const atual = areas.some(([id]) => id === visao) ? visao : 'perfil';
  const servicosPublicos = empresa
    ? b.servico.filter(
        servico =>
          servico.empresa_id === empresa.id &&
          servicoPublico(
            servico,
            empresa,
            undefined,
            b.publicacao_servico.filter(item => item.servico_id === servico.id)
          )
      )
    : [];

  if (previa && empresa)
    return (
      <main className='empresa-perfil-fundo'>
        <Container classe='empresa-perfil-pagina'>
          <div className='empresa-perfil-barra'>
            <Link
              className='mvp-link inline-flex items-center gap-2'
              to='/empresa/perfil'
            >
              <ArrowLeft size={17} aria-hidden='true' /> Voltar ao meu perfil
            </Link>
            <span>Prévia do Marketplace</span>
          </div>
          {!empresa.validado && (
            <p className='empresa-perfil-aviso'>
              A empresa precisa ser verificada para aparecer no Marketplace.
            </p>
          )}
          <PerfilEmpresaMarketplace
            key={empresa.banner ?? 'padrao'}
            empresa={empresa}
          />
          <section className={painel} aria-labelledby='servicos-disponiveis'>
            <h2 id='servicos-disponiveis' className='text-xl font-extrabold'>
              Serviços da empresa
            </h2>
            {servicosPublicos.length ? (
              <ul className='mercado-a-grade mt-4'>
                {servicosPublicos.map(servico => (
                  <li className='mercado-a-cartao' key={servico.id}>
                    <div className='mercado-a-cartao-foto'>
                      <FotoServico servico={servico} />
                    </div>
                    <div className='mercado-a-cartao-corpo'>
                      <span className='text-sm'>
                        {nomeCategoria(servico.categoria)}
                      </span>
                      <h3>{servico.titulo}</h3>
                      <strong>{precoServico(servico)}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='mt-2 text-(--texto-apoio)'>
                Nenhum serviço disponível no momento.
              </p>
            )}
          </section>
        </Container>
      </main>
    );

  return (
    <main className='empresa-perfil-fundo'>
      <Container classe='empresa-perfil-pagina'>
        {empresa ? (
          <div className='empresa-perfil-hero'>
            <PerfilEmpresaMarketplace
              key={empresa.banner ?? 'padrao'}
              empresa={empresa}
              situacao={
                emAnalise ? 'Em análise' : 'Aguardando envio para análise'
              }
              acoes={
                <>
                  <Botao
                    como={Link}
                    to='/empresa/perfil?visao=publico'
                    cor='laranja'
                    classe='gap-2'
                  >
                    <Eye size={17} aria-hidden='true' /> Ver como cliente
                  </Botao>
                  <Botao
                    como={Link}
                    to='/empresa/perfil/midias'
                    variante='contorno'
                    classe='gap-2'
                  >
                    <Camera size={17} aria-hidden='true' /> Logo e capa
                  </Botao>
                </>
              }
            />
          </div>
        ) : (
          <h1 className='font-titulo text-3xl font-extrabold'>
            Cadastrar perfil da empresa
          </h1>
        )}
        <div className='grid min-w-0 gap-4'>
          <NavegacaoPerfil areas={areas} rota='/empresa/perfil' visao={atual} />
          {atual !== 'perfil' ? (
            <CobrancasPerfilA
              b={b}
              userId={userId}
              visao={atual}
              aoSalvar={notificar}
              atualizarPublicacao={concluirPagamentoPublicacao}
            />
          ) : (
            <div className='empresa-perfil-secoes'>
              <section className={painel}>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <Titulo classe='text-xl font-extrabold sm:text-2xl'>
                    Informações comerciais
                  </Titulo>
                  {empresa && !empresa.validado && !emAnalise && (
                    <Botao
                      type='button'
                      variante='contorno'
                      onClick={() =>
                        executar(
                          () => enviarEmpresaParaAnalise(userId),
                          'Perfil enviado para análise.'
                        )
                      }
                    >
                      Enviar para análise
                    </Botao>
                  )}
                </div>
                {empresa && (
                  <>
                    <p className='mt-3 text-(--texto-apoio)'>
                      Atualize a descrição, os contatos, as regiões e os
                      horários que aparecem para seus clientes.
                    </p>
                    <Botao
                      type='button'
                      variante='contorno'
                      classe='mt-4 gap-2'
                      onClick={() => setEditarDados(true)}
                    >
                      <Pencil size={16} aria-hidden='true' /> Editar dados
                      comerciais
                    </Botao>
                  </>
                )}
                {!empresa && (
                  <div className='perfil-editor mt-5'>
                    <DadosComerciais userId={userId} notificar={notificar} />
                  </div>
                )}
              </section>
              {empresa && (
                <section className={painel}>
                  <div className='flex flex-wrap items-center justify-between gap-3'>
                    <Titulo classe='text-xl font-extrabold'>
                      Endereço comercial
                    </Titulo>
                    <Botao
                      type='button'
                      variante='contorno'
                      onClick={() => setEditarEndereco(true)}
                    >
                      {endereco ? 'Editar endereço' : 'Adicionar endereço'}
                    </Botao>
                  </div>
                  <p className='mt-3 wrap-anywhere text-(--texto-apoio)'>
                    {endereco
                      ? resumoEndereco(endereco)
                      : 'Nenhum endereço cadastrado.'}
                  </p>
                </section>
              )}
              {empresa && (
                <section className={painel}>
                  <Titulo classe='text-xl font-extrabold'>
                    Serviços no Marketplace
                  </Titulo>
                  <p className='mt-3 text-(--texto-apoio)'>
                    {servicosPublicos.length === 1
                      ? '1 serviço visível para os clientes.'
                      : servicosPublicos.length +
                        ' serviços visíveis para os clientes.'}
                  </p>
                  {servicosPublicos.length > 0 && (
                    <div className='empresa-perfil-fotos'>
                      {servicosPublicos.slice(0, 3).map(servico => (
                        <Link
                          key={servico.id}
                          to={`/empresa/anuncios/${servico.id}/fotos`}
                          aria-label={`Gerenciar fotos de ${servico.titulo}`}
                          className='mercado-a-cartao-foto'
                        >
                          <FotoServico servico={servico} />
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link
                    className='mvp-link mt-3 inline-block'
                    to='/empresa/anuncios'
                  >
                    Gerenciar meus serviços
                  </Link>
                </section>
              )}
            </div>
          )}
        </div>
      </Container>
      {somenteMidias && empresa && (
        <EditorMidiasEmpresa
          empresa={empresa}
          userId={userId}
          notificar={notificar}
          aoFechar={() => navegar('/empresa/perfil', { replace: true })}
        />
      )}
      {editarDados && empresa && (
        <DialogoCasa
          titulo='Editar dados comerciais'
          aoFechar={() => setEditarDados(false)}
          classe='empresa-editor-dialogo'
        >
          <div className='empresa-editor-layout'>
            <PreviaVisualEmpresa empresa={empresa} />
            <div className='perfil-editor'>
              <DadosComerciais
                empresa={empresa}
                userId={userId}
                notificar={notificar}
                aoFechar={() => setEditarDados(false)}
              />
            </div>
          </div>
        </DialogoCasa>
      )}
      {editarEndereco && (
        <DialogoCasa
          titulo='Endereço comercial'
          aoFechar={() => setEditarEndereco(false)}
        >
          <EditorMvp
            cabecalho={false}
            campos={camposEnderecoPerfil}
            inicial={endereco}
            onClose={() => setEditarEndereco(false)}
            onSave={valores => {
              const dados = Object.fromEntries(
                camposEnderecoPerfil.map(({ nome }) => [nome, valores[nome]])
              );
              if (!/^\d{5}-?\d{3}$/.test(dados.cep))
                throw new Error('Informe um CEP com oito dígitos.');
              salvarEnderecoEmpresa(userId, dados);
              notificar('Endereço atualizado.');
            }}
          />
        </DialogoCasa>
      )}
    </main>
  );
}

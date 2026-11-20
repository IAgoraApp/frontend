import { useState } from 'react';
import { ChevronLeft, ChevronRight, House, Plus, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { moeda } from '../../../app/dados/bancoMvp';
import { useAvisoPerfilA } from '../../../app/avisos/avisosPerfilA';
import { BotaoCasa, DialogoCasa } from '../../casa/components/casaUi';
import PerfilCasa from '../../casa/components/perfilCasa';
import fotoApartamento from '../../encontrar-casa/assets/apartamento-vila-mariana.jpg';
import fotoStudio from '../../encontrar-casa/assets/studio-sp-iagora.jpg';
import fotoMesa from '../../casa/assets/casa-organizada-notebook.jpg';
import fotoCozinha from '../../casa/assets/cozinha-comida-boa.jpg';
import arteTransporte from '../../calculadoras/assets/transporte.svg';
import { salvarGastosImovel } from '../moradiaDados';
import { tipoValorImovel } from '../../preparacao/valorImovel';

const grupos = [
  {
    titulo: 'Moradia e contas',
    foto: fotoMesa,
    campos: [
      ['Aluguel ou prestação', 'moradia'],
      ['Condomínio', 'moradia'],
      ['IPTU mensal ou rateado', 'moradia'],
      ['Água e esgoto', 'servicos'],
      ['Energia elétrica', 'servicos'],
      ['Gás', 'servicos'],
      ['Internet', 'servicos'],
    ],
  },
  {
    titulo: 'Deslocamento',
    foto: arteTransporte,
    campos: [
      ['Transporte para o trabalho', 'transporte'],
      ['Outros deslocamentos', 'transporte'],
    ],
  },
  {
    titulo: 'Dia a dia',
    foto: fotoCozinha,
    campos: [
      ['Mercado', 'alimentacao'],
      ['Limpeza e higiene', 'organizacao'],
      ['Telefone', 'servicos'],
      ['Outros gastos fixos', 'outros'],
    ],
  },
];

const exemplos = {
  'Aluguel ou prestação': 'R$ 1.400 por mês.',
  Condomínio: 'R$ 300 por mês. Confira o que a taxa inclui.',
  'IPTU mensal ou rateado': 'R$ 600 ao ano ÷ 12 = R$ 50 por mês.',
  'Água e esgoto': 'R$ 70 por mês, se a conta vier separada.',
  'Energia elétrica': 'R$ 120 por mês.',
  Gás: 'Uma troca de R$ 120 a cada 3 meses = R$ 40 por mês.',
  Internet: 'Um plano de R$ 90 por mês.',
  'Transporte para o trabalho': '2 viagens de R$ 5 por dia × 22 dias = R$ 220.',
  'Outros deslocamentos': '8 viagens de R$ 5 = R$ 40 por mês.',
  'Limpeza e higiene': 'R$ 90 por mês.',
  Telefone: 'Um plano de R$ 45 por mês.',
  'Outros gastos fixos': 'Uma assinatura de R$ 30 por mês.',
};

const fonteCesta =
  'https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/precos-agropecuarios/analise-da-pesquisa-nacional-de-precos-da-cesta-basica-de-alimentos/analise-da-pesquisa-nacional-de-precos-da-cesta-basica-de-alimentos-todas-as-capitais-outubro-2026.pdf';

const mensalEmCentavos = valor => Math.round(Number(valor || 0) * 100);

export default function MeuPlano({
  usuario,
  imoveis,
  imovel,
  endereco,
  resumo,
  custos,
  selecionar,
  adicionarImovel,
  rotaDinheiro,
}) {
  const [grupoAtivo, setGrupoAtivo] = useState(null);
  const [rascunho, setRascunho] = useState({});
  const [erro, setErro] = useState('');
  const notificar = useAvisoPerfilA();
  const indice = imoveis.indexOf(imovel);

  if (!imovel)
    return (
      <section className='meu-plano-vazio'>
        <img src={fotoApartamento} alt='' />
        <div>
          <House size={25} aria-hidden='true' />
          <h2>Qual imóvel você tem em mente?</h2>
          <p>Cadastre um imóvel desejado para montar seu orçamento mensal.</p>
          <BotaoCasa
            type='button'
            onClick={adicionarImovel}
            aria-haspopup='dialog'
          >
            <Plus size={17} aria-hidden='true' /> Cadastrar imóvel
          </BotaoCasa>
        </div>
      </section>
    );

  const valorMensalDoImovel =
    tipoValorImovel(imovel) === 'mensal' ? imovel.valor : null;
  const campos = grupos
    .flatMap(grupo => grupo.campos)
    .map(([nome, categoria]) => {
      const existente = custos.find(
        item =>
          item.tipo === 'mensal' &&
          item.nome === nome &&
          item.categoria === categoria
      );
      const imovelMensal =
        nome === 'Aluguel ou prestação' && valorMensalDoImovel != null;
      return {
        nome,
        categoria,
        rotulo: imovelMensal ? 'Valor mensal do imóvel' : nome,
        imovelMensal,
        valor: imovelMensal ? valorMensalDoImovel : (existente?.valor ?? ''),
        id: existente?.id,
      };
    });
  const ids = new Set(campos.map(item => item.id).filter(Boolean));
  const outros = custos.filter(
    item => item.tipo === 'mensal' && !ids.has(item.id)
  );
  const gruposResumo = grupos.map(grupo => {
    const registros = campos.filter(
      campo =>
        grupo.campos.some(([nome]) => nome === campo.nome) && campo.valor !== ''
    );
    const subtotal = registros.reduce(
      (soma, item) => soma + mensalEmCentavos(item.valor),
      0
    );
    return {
      ...grupo,
      registros,
      subtotal,
    };
  });
  const outrosSubtotal = outros.reduce(
    (soma, item) => soma + mensalEmCentavos(item.valor),
    0
  );
  const { renda, depois: saldo, gastosFuturos: total } = resumo;

  const camposAtivos = grupoAtivo
    ? campos.filter(campo =>
        grupoAtivo.campos.some(([nome]) => nome === campo.nome)
      )
    : [];

  function abrirGrupo(grupo) {
    setRascunho({});
    setErro('');
    setGrupoAtivo(grupo);
  }

  function salvar(evento) {
    evento.preventDefault();
    try {
      salvarGastosImovel(
        usuario,
        imovel.id,
        camposAtivos
          .filter(campo => !campo.imovelMensal)
          .map(campo => ({
            ...campo,
            valor: rascunho[campo.nome] ?? campo.valor,
          }))
      );
      setGrupoAtivo(null);
      setErro('');
      notificar('Gastos do imóvel salvos.');
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <div className='meu-plano'>
      <div className='meu-plano-imoveis'>
        <h2>Imóvel do plano</h2>
        <div aria-label='Alternar imóvel' className='meu-plano-setas'>
          <button
            type='button'
            aria-label='Imóvel anterior'
            disabled={indice <= 0}
            onClick={() => {
              setErro('');
              selecionar(imoveis[indice - 1]);
            }}
          >
            <ChevronLeft size={20} aria-hidden='true' />
          </button>
          <span aria-live='polite'>
            {indice + 1} de {imoveis.length}
          </span>
          <button
            type='button'
            aria-label='Próximo imóvel'
            disabled={indice === imoveis.length - 1}
            onClick={() => {
              setErro('');
              selecionar(imoveis[indice + 1]);
            }}
          >
            <ChevronRight size={20} aria-hidden='true' />
          </button>
          <button
            type='button'
            className='meu-plano-adicionar-imovel'
            onClick={adicionarImovel}
            aria-haspopup='dialog'
            aria-label='Adicionar imóvel'
            title='Adicionar imóvel'
          >
            <Plus size={19} aria-hidden='true' />
          </button>
        </div>
      </div>
      <PerfilCasa
        casa={{ nome: imovel.titulo, tipo: imovel.tipo ?? 'Tipo a definir' }}
        endereco={endereco}
        foto={/studio|kitnet/i.test(imovel.tipo) ? fotoStudio : fotoApartamento}
        legendaFoto='Foto de referência de um imóvel'
      >
        {imovel.valor != null && (
          <p className='meu-plano-valor-imovel'>
            <strong>{moeda(imovel.valor)}</strong>
            <span>
              {tipoValorImovel(imovel) === 'mensal'
                ? 'por mês'
                : 'valor total do imóvel'}
            </span>
          </p>
        )}
        <Link
          className='text-sm font-bold underline'
          to={'/encontrar-casa?imovel=' + imovel.id}
        >
          Ver imóvel na jornada
        </Link>
      </PerfilCasa>
      <header className='meu-plano-total'>
        <div>
          <h2>Gastos mensais previstos</h2>
          <strong aria-live='polite'>{moeda(total)}</strong>
        </div>
        <div className='meu-plano-renda'>
          {renda != null ? (
            <dl>
              <div>
                <dt>Renda mensal</dt>
                <dd>{moeda(renda)}</dd>
              </div>
              <div data-deficit={saldo < 0}>
                <dt>{saldo < 0 ? 'Faltam por mês' : 'Sobram por mês'}</dt>
                <dd>{moeda(Math.abs(saldo))}</dd>
              </div>
            </dl>
          ) : (
            <p>Informe a renda para calcular o saldo.</p>
          )}
          <Link className='meu-plano-link-dinheiro' to={rotaDinheiro}>
            <Wallet size={17} aria-hidden='true' /> Editar renda
          </Link>
        </div>
      </header>
      <section className='meu-plano-form' aria-label='Orçamento mensal'>
        <div className='meu-plano-grupos'>
          {gruposResumo.map(grupo => {
            return (
              <button
                className='meu-plano-grupo'
                key={grupo.titulo}
                type='button'
                aria-haspopup='dialog'
                onClick={() => abrirGrupo(grupo)}
              >
                <img src={grupo.foto} alt='' />
                <span className='meu-plano-grupo-texto'>
                  <span>
                    <strong>{grupo.titulo}</strong>
                    <small>
                      {grupo.registros.length
                        ? 'Editar gastos'
                        : 'Adicionar gastos'}
                    </small>
                  </span>
                  <span className='meu-plano-grupo-total'>
                    <strong>{moeda(grupo.subtotal / 100)}</strong>
                    <ChevronRight size={16} aria-hidden='true' />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {outros.length > 0 && (
          <p className='text-sm text-(--texto-apoio)'>
            O total inclui {moeda(outrosSubtotal / 100)} de outros custos
            mensais já cadastrados.
          </p>
        )}
      </section>
      {grupoAtivo && (
        <DialogoCasa
          titulo={grupoAtivo.titulo}
          classe='meu-plano-modal'
          aoFechar={() => setGrupoAtivo(null)}
        >
          <form onSubmit={salvar}>
            <p className='meu-plano-modal-ajuda'>
              Informe seus gastos mensais. Os exemplos são ilustrativos e variam
              por cidade, imóvel e rotina.
            </p>
            <div className='meu-plano-modal-campos'>
              {camposAtivos.map((campo, indice) => (
                <div className='meu-plano-modal-campo' key={campo.nome}>
                  <label htmlFor={'meu-plano-gasto-' + indice}>
                    {campo.rotulo}
                  </label>
                  <div className='meu-plano-valor'>
                    <span aria-hidden='true'>R$</span>
                    <input
                      id={'meu-plano-gasto-' + indice}
                      type='number'
                      inputMode='decimal'
                      min='0'
                      max='9999999999.99'
                      step='.01'
                      placeholder='0,00'
                      readOnly={campo.imovelMensal}
                      aria-readonly={campo.imovelMensal || undefined}
                      aria-describedby={'meu-plano-referencia-' + indice}
                      value={rascunho[campo.nome] ?? campo.valor}
                      onChange={evento => {
                        const valor = evento.target.value;
                        setRascunho(atual => ({
                          ...atual,
                          [campo.nome]: valor,
                        }));
                      }}
                    />
                  </div>
                  <small id={'meu-plano-referencia-' + indice}>
                    {campo.imovelMensal ? (
                      'Valor mensal vinculado ao cadastro deste imóvel.'
                    ) : campo.nome === 'Mercado' ? (
                      <a href={fonteCesta} target='_blank' rel='noreferrer'>
                        Cesta básica em São Paulo: R$ 951,37 em out. de 2026
                        (Conab/DIEESE).
                      </a>
                    ) : (
                      'Exemplo mensal: ' + exemplos[campo.nome]
                    )}
                  </small>
                </div>
              ))}
            </div>
            {erro && (
              <p role='alert' className='mt-3 text-(--vermelho-alerta)'>
                {erro}
              </p>
            )}
            <footer className='meu-plano-modal-rodape'>
              <BotaoCasa
                secundario
                type='button'
                onClick={() => setGrupoAtivo(null)}
              >
                Cancelar
              </BotaoCasa>
              <BotaoCasa type='submit'>Salvar gastos</BotaoCasa>
            </footer>
          </form>
        </DialogoCasa>
      )}
    </div>
  );
}

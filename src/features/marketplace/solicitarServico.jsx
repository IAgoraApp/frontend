import { useState } from 'react';
import {
  alterarBancoMarketplace,
  hoje,
  inserir,
} from '../../app/dados/bancoMvp';
import { MarcaEmpresa } from './empresaMarketplace';
import { precoServico, servicoPublico } from './marketplaceDados';
import DialogoMarketplace from './dialogoMarketplace';
import { garantirChat, resumoEndereco } from './contratacoes';

export default function SolicitarServico({
  servico,
  empresa,
  perfil,
  endereco,
  aoFechar,
  aoEnviar,
}) {
  const [erro, setErro] = useState('');
  const [usarNovoEndereco, setUsarNovoEndereco] = useState(!endereco);

  function enviar(evento) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const descricao = String(dados.get('descricao') ?? '').trim();
    const data = dados.get('data') || null;
    try {
      if (!descricao) throw new Error('Descreva o serviço que você precisa.');
      if (data && data < `${hoje()}T00:00`)
        throw new Error('Escolha uma data a partir de hoje.');
      if (!dados.has('ciente'))
        throw new Error('Confirme como o pagamento será combinado.');
      let chatId;
      const novoEndereco = usarNovoEndereco
        ? Object.fromEntries(
            [
              'cep',
              'rua',
              'numero',
              'bairro',
              'cidade',
              'estado',
              'complemento',
            ].map(campo => [campo, String(dados.get(campo) ?? '').trim()])
          )
        : null;
      if (
        novoEndereco &&
        (!novoEndereco.rua ||
          !novoEndereco.numero ||
          !novoEndereco.bairro ||
          !novoEndereco.cidade ||
          !/^[A-Za-z]{2}$/.test(novoEndereco.estado) ||
          !/^\d{5}-?\d{3}$/.test(novoEndereco.cep))
      )
        throw new Error('Confira o endereço, o CEP e a sigla do estado.');
      alterarBancoMarketplace(db => {
        const atual = db.servico.find(s => s.id === servico.id);
        const prestador = db.perfil_empresa.find(
          e => e.id === atual?.empresa_id
        );
        if (!atual || !servicoPublico(atual, prestador, undefined, db.publicacao_servico.filter(p => p.servico_id === atual.id)))
          throw new Error('O serviço saiu do catálogo.');
        if (
          db.servico_contratado.some(
            c =>
              c.servico_id === atual.id &&
              c.perfil_id === perfil.id &&
              ['pendente', 'aceito', 'em_andamento'].includes(c.status)
          )
        )
          throw new Error('Você já tem uma conversa aberta para este serviço.');
        let enderecoId = endereco?.id;
        if (novoEndereco) {
          const local = inserir(
            'endereco',
            {
              ...novoEndereco,
              pais: 'Brasil',
              estado: novoEndereco.estado.toUpperCase(),
              cep: novoEndereco.cep.replace('-', ''),
            },
            db
          );
          db.enderecos_marketplace = [
            ...(db.enderecos_marketplace ?? []),
            local,
          ];
          enderecoId = local.id;
        }
        if (!enderecoId) throw new Error('Informe o endereço de atendimento.');
        const pedido = inserir(
          'servico_contratado',
          {
            servico_id: atual.id,
            perfil_id: perfil.id,
            endereco_id: enderecoId,
            descricao,
            data_agendamento: data,
            valor: atual.tipo_preco === 'fixo' ? Number(atual.preco ?? 0) : 0,
            status: 'pendente',
            data_contratacao: new Date().toISOString(),
            data_conclusao: null,
          },
          db
        );
        chatId = garantirChat(db, pedido, atual.empresa_id).id;
      });
      aoEnviar(chatId);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <DialogoMarketplace titulo='Iniciar conversa' aoFechar={aoFechar}>
      <div className='mercado-a-dialogo-contexto'>
        <MarcaEmpresa empresa={empresa} />
        <div>
          <strong>{servico.titulo}</strong>
          <p>
            {empresa.nome} · {precoServico(servico)}
          </p>
        </div>
      </div>
      <form className='mercado-a-pedido-form' onSubmit={enviar}>
        <label>
          O que você precisa?
          <textarea
            name='descricao'
            required
            maxLength={2000}
            rows={3}
            placeholder='Descreva o que precisa ser feito.'
          />
        </label>
        <label>
          Data e horário de preferência <small>Opcional</small>
          <input type='datetime-local' name='data' min={hoje() + 'T00:00'} />
        </label>
        <fieldset className='mercado-a-pedido-endereco'>
          <legend>Endereço de atendimento</legend>
          {endereco && (
            <>
              <label>
                <input
                  type='radio'
                  name='tipoEndereco'
                  checked={!usarNovoEndereco}
                  onChange={() => setUsarNovoEndereco(false)}
                />{' '}
                Usar endereço cadastrado
              </label>
              {!usarNovoEndereco && <p>{resumoEndereco(endereco)}</p>}
              <label>
                <input
                  type='radio'
                  name='tipoEndereco'
                  checked={usarNovoEndereco}
                  onChange={() => setUsarNovoEndereco(true)}
                />{' '}
                Informar outro endereço
              </label>
            </>
          )}
          {usarNovoEndereco && (
            <div className='mercado-a-endereco-campos'>
              {[
                ['cep', 'CEP', 9],
                ['estado', 'UF', 2],
                ['rua', 'Rua', 120],
                ['numero', 'Número', 12],
                ['bairro', 'Bairro', 80],
                ['cidade', 'Cidade', 80],
                ['complemento', 'Complemento (opcional)', 80],
              ].map(([nome, rotulo, limite]) => (
                <label key={nome} data-campo={nome}>
                  {rotulo}
                  <input
                    name={nome}
                    maxLength={limite}
                    required={nome !== 'complemento'}
                    inputMode={nome === 'cep' ? 'numeric' : undefined}
                  />
                </label>
              ))}
            </div>
          )}
        </fieldset>
        <div className='mercado-a-pedido-nota'>
          <strong>Como funciona</strong>
          <p>
            Ao enviar, uma conversa deste serviço será aberta para combinar os
            detalhes.
          </p>
          <label>
            <input type='checkbox' name='ciente' required /> Estou ciente de que
            o pagamento é combinado e feito diretamente com a empresa.
          </label>
        </div>
        {erro && (
          <p className='mvp-confirmacao' role='alert'>
            {erro}
          </p>
        )}
        <div className='mercado-a-contato-acoes'>
          <button type='submit' className='mvp-primario'>
            Abrir conversa
          </button>
          <button type='button' className='mvp-link' onClick={aoFechar}>
            Voltar
          </button>
        </div>
      </form>
    </DialogoMarketplace>
  );
}

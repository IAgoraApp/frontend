import { useState } from 'react';
import { CampoFormulario } from '../../../compartilhado/interface/indice';
import { chaveData } from '../../rotina/utilitarios/datas';
import { comodosCasa } from '../conteudo';
import { BotaoCasa, SelecaoCasa } from './InterfaceCasa';

export default function FormularioManutencao({
  item,
  aoSalvar,
  aoCancelar,
}) {
  const [valores, setValores] = useState(
    item ?? {
      title: '',
      room: 'Cozinha',
      priority: 'Média',
      date: chaveData(),
      frequency: 'none',
      notes: '',
    }
  );
  const [erro, setErro] = useState('');

  const alterar = evento =>
    setValores(anterior => ({
      ...anterior,
      [evento.target.name]: evento.target.value,
    }));

  return (
    <form
      className='space-y-5'
      onSubmit={evento => {
        evento.preventDefault();
        if (!valores.title.trim()) {
          setErro('Informe o título da manutenção.');
          return;
        }
        aoSalvar({
          ...valores,
          title: valores.title.trim(),
          id: item?.id ?? crypto.randomUUID(),
          completedAt: item?.completedAt ?? null,
        });
      }}
    >
      <CampoFormulario
        id='manutencao-titulo'
        name='title'
        rotulo='Título'
        placeholder='Ex.: Revisar torneira'
        value={valores.title}
        onChange={alterar}
        maxLength={120}
        required
      />
      <div className='grid gap-5 sm:grid-cols-2'>
        <SelecaoCasa
          id='manutencao-comodo'
          name='room'
          rotulo='Cômodo'
          value={valores.room}
          onChange={alterar}
        >
          {comodosCasa.map(comodo => (
            <option key={comodo}>{comodo}</option>
          ))}
        </SelecaoCasa>
        <SelecaoCasa
          id='manutencao-prioridade'
          name='priority'
          rotulo='Prioridade'
          value={valores.priority}
          onChange={alterar}
        >
          {['Alta', 'Média', 'Baixa'].map(valor => (
            <option key={valor}>{valor}</option>
          ))}
        </SelecaoCasa>
      </div>
      <div className='grid gap-5 sm:grid-cols-2'>
        <CampoFormulario
          id='manutencao-data'
          name='date'
          rotulo='Data'
          type='date'
          value={valores.date}
          onChange={alterar}
          required
        />
        <SelecaoCasa
          id='manutencao-frequencia'
          name='frequency'
          rotulo='Frequência'
          value={valores.frequency}
          onChange={alterar}
        >
          <option value='none'>Sem repetição</option>
          <option value='monthly'>Mensal</option>
        </SelecaoCasa>
      </div>
      <label
        className='flex flex-col gap-2 text-sm font-bold'
        htmlFor='manutencao-observacoes'
      >
        Observações
        <textarea
          id='manutencao-observacoes'
          name='notes'
          value={valores.notes}
          onChange={alterar}
          maxLength={1000}
          rows={3}
          className='rounded-lg border border-[#dbe5ed] p-3 font-normal'
        />
      </label>
      {erro && (
        <p role='alert' className='text-sm text-[#b42318]'>
          {erro}
        </p>
      )}
      <div className='flex flex-wrap gap-3'>
        <BotaoCasa type='submit'>Salvar manutenção</BotaoCasa>
        <BotaoCasa secundario type='button' onClick={aoCancelar}>
          Cancelar
        </BotaoCasa>
      </div>
    </form>
  );
}

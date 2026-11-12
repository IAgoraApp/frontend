import { useState } from 'react';
import { CampoFormulario } from '../../../compartilhado/interface/indice';
import { BotaoCasa, SelecaoCasa } from '../../casa/componentes/indice';
import { adicionarLimpezaNaRotina, chaveHojeLimpeza } from '../conteudo';

export function FormularioRotinaLimpeza({ guia, aoConcluir, aoCancelar }) {
  const [erro, setErro] = useState('');

  return (
    <form
      className='space-y-5'
      onSubmit={evento => {
        evento.preventDefault();
        const valores = Object.fromEntries(new FormData(evento.currentTarget));
        try {
          const adicionada = adicionarLimpezaNaRotina(valores, guia);
          aoConcluir(
            adicionada
              ? 'Cuidado adicionado à sua rotina.'
              : 'Este cuidado já está na sua rotina neste horário.'
          );
        } catch (falha) {
          setErro(
            falha.message || 'Não foi possível salvar. Tente novamente.'
          );
        }
      }}
    >
      <p className='font-bold'>{guia.title}</p>
      <SelecaoCasa
        id='limpeza-frequencia'
        name='frequencia'
        rotulo='Frequência'
        defaultValue='weekly'
      >
        <option value='none'>Sem repetição</option>
        <option value='daily'>Diária</option>
        <option value='weekly'>Semanal</option>
        <option value='monthly'>Mensal</option>
      </SelecaoCasa>
      <div className='grid gap-4 sm:grid-cols-2'>
        <CampoFormulario
          id='limpeza-data'
          name='data'
          rotulo='Data'
          type='date'
          defaultValue={chaveHojeLimpeza()}
          required
        />
        <CampoFormulario
          id='limpeza-horario'
          name='horario'
          rotulo='Horário'
          type='time'
          defaultValue='10:00'
          required
        />
      </div>
      <SelecaoCasa
        id='limpeza-lembrete'
        name='lembrete'
        rotulo='Lembrete'
        defaultValue='30'
      >
        <option value='none'>Sem lembrete</option>
        <option value='0'>Na hora</option>
        <option value='30'>30 minutos antes</option>
        <option value='60'>1 hora antes</option>
      </SelecaoCasa>
      <p className='rounded-lg bg-(--azul-fundo) p-4 text-sm text-(--texto-apoio)'>
        O cuidado ficará identificado como Limpeza na categoria Casa da sua
        rotina.
      </p>
      {erro && (
        <p role='alert' className='text-sm text-[#b42318]'>
          {erro}
        </p>
      )}
      <div className='flex flex-wrap gap-3'>
        <BotaoCasa type='submit'>Confirmar</BotaoCasa>
        <BotaoCasa type='button' secundario onClick={aoCancelar}>
          Cancelar
        </BotaoCasa>
      </div>
    </form>
  );
}

export function FormularioChecklistLimpeza({ aoSalvar, aoCancelar }) {
  const [erro, setErro] = useState('');

  return (
    <form
      className='space-y-5'
      onSubmit={evento => {
        evento.preventDefault();
        const valores = Object.fromEntries(new FormData(evento.currentTarget));
        if (!valores.title.trim()) {
          setErro('Informe o título da tarefa.');
          return;
        }
        aoSalvar({
          ...valores,
          title: valores.title.trim(),
          id: crypto.randomUUID(),
        });
      }}
    >
      <CampoFormulario
        id='limpeza-tarefa'
        name='title'
        rotulo='Título da tarefa'
        placeholder='Ex.: Limpar a bancada'
        maxLength={120}
        required
      />
      <SelecaoCasa id='limpeza-comodo' name='room' rotulo='Cômodo'>
        {['Cozinha', 'Banheiro', 'Sala', 'Quarto', 'Lavanderia'].map(
          comodo => (
            <option key={comodo}>{comodo}</option>
          )
        )}
      </SelecaoCasa>
      <SelecaoCasa
        id='limpeza-tarefa-frequencia'
        name='frequency'
        rotulo='Frequência'
      >
        <option>Diária</option>
        <option>Semanal</option>
        <option>Mensal</option>
      </SelecaoCasa>
      <CampoFormulario
        id='limpeza-tarefa-materiais'
        name='materials'
        rotulo='Materiais (opcional)'
        maxLength={200}
      />
      {erro && (
        <p role='alert' className='text-sm text-[#b42318]'>
          {erro}
        </p>
      )}
      <div className='flex flex-wrap gap-3'>
        <BotaoCasa type='submit'>Salvar tarefa</BotaoCasa>
        <BotaoCasa secundario type='button' onClick={aoCancelar}>
          Cancelar
        </BotaoCasa>
      </div>
    </form>
  );
}

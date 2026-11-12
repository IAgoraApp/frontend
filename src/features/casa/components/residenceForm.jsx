import { useState } from 'react';
import {
  CampoFormulario,
  Titulo,
} from '../../../shared/ui/index';
import { comodosCasa } from '../content';
import { BotaoCasa, CartaoCasa, SelecaoCasa } from './casaUi';
import fotoAmbiente from '../assets/residencia-ambiente.png';

export default function FormularioResidencia({
  residencia,
  aoSalvar,
  aoCancelar,
}) {
  const [valores, setValores] = useState(
    residencia ?? { name: '', type: 'Apartamento', location: '', rooms: [] }
  );
  const [erro, setErro] = useState('');

  const alterar = evento =>
    setValores(anterior => ({
      ...anterior,
      [evento.target.name]: evento.target.value,
    }));

  return (
    <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]'>
      <CartaoCasa>
        <form
          className='space-y-6'
          onSubmit={evento => {
            evento.preventDefault();
            if (
              !valores.name.trim() ||
              !valores.location.trim() ||
              !valores.rooms.length
            ) {
              setErro(
                'Informe o nome, a localização e ao menos um cômodo.'
              );
              return;
            }
            aoSalvar({
              ...valores,
              name: valores.name.trim(),
              location: valores.location.trim(),
            });
          }}
        >
          <CampoFormulario
            id='residencia-nome'
            name='name'
            rotulo='Nome da residência'
            placeholder='Ex.: Meu apartamento'
            value={valores.name}
            onChange={alterar}
            maxLength={100}
            required
          />
          <div className='grid gap-5 sm:grid-cols-2'>
            <SelecaoCasa
              id='residencia-tipo'
              name='type'
              rotulo='Tipo de imóvel'
              value={valores.type}
              onChange={alterar}
            >
              {[
                'Apartamento',
                'Casa',
                'Kitnet',
                'Quarto compartilhado',
                'Outro',
              ].map(tipo => (
                <option key={tipo}>{tipo}</option>
              ))}
            </SelecaoCasa>
            <CampoFormulario
              id='residencia-localizacao'
              name='location'
              rotulo='Cidade e bairro'
              placeholder='Ex.: São Paulo, Pinheiros'
              value={valores.location}
              onChange={alterar}
              maxLength={150}
              required
            />
          </div>
          <fieldset>
            <legend className='mb-3 text-sm font-bold'>Cômodos</legend>
            <div className='grid gap-3 sm:grid-cols-2'>
              {comodosCasa.map(comodo => (
                <label
                  key={comodo}
                  className='flex min-h-12 items-center gap-3 rounded-lg border border-[#dbe5ed] p-3 text-sm'
                >
                  <input
                    type='checkbox'
                    checked={valores.rooms.includes(comodo)}
                    onChange={evento =>
                      setValores(anterior => ({
                        ...anterior,
                        rooms: evento.target.checked
                          ? [...anterior.rooms, comodo]
                          : anterior.rooms.filter(item => item !== comodo),
                      }))
                    }
                    className='size-5 accent-(--laranja-principal)'
                  />
                  {comodo}
                </label>
              ))}
            </div>
          </fieldset>
          {erro && (
            <p role='alert' className='text-sm text-[#b42318]'>
              {erro}
            </p>
          )}
          <div className='flex flex-wrap gap-3'>
            <BotaoCasa type='submit'>Salvar minha casa</BotaoCasa>
            <BotaoCasa type='button' secundario onClick={aoCancelar}>
              Cancelar
            </BotaoCasa>
          </div>
        </form>
      </CartaoCasa>
      <aside className='overflow-hidden rounded-xl bg-(--azul-fundo)'>
        <img
          src={fotoAmbiente}
          alt='Ambiente de uma residência aconchegante'
          className='aspect-[1.4] w-full object-cover'
        />
        <div className='p-6'>
          <p className='text-xs font-bold text-(--laranja-principal)'>
            SEU CANTO COMEÇA AQUI
          </p>
          <Titulo classe='mt-3 text-3xl font-extrabold'>
            Como você usa seu espaço?
          </Titulo>
          <p className='mt-4 leading-relaxed text-(--texto-apoio)'>
            Os cômodos escolhidos ajudam você a montar uma rotina possível de
            limpeza e cuidados.
          </p>
        </div>
      </aside>
    </div>
  );
}

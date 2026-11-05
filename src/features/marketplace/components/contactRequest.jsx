import { useState } from 'react';
import { FormField, Title } from '../../../shared/ui';
import { Action, Card } from '../../empresa/components/empresaUi';
import { updateEmpresa } from '../../empresa/content';

export default function ContactRequest({ company, ad, ads }) {
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  return (
    <Card title='Conte o que você precisa.'>
      <p className='mb-5 text-(--texto-apoio)'>
        Combine o escopo, a região, a disponibilidade e o valor antes de
        decidir.
      </p>
      {saved ? (
        <div
          role='status'
          className='rounded-lg bg-green-50 p-5 text-green-900'
        >
          <Title className='text-xl font-bold'>
            Solicitação registrada nesta demonstração.
          </Title>
          <p className='mt-3 text-sm'>
            Nenhuma mensagem foi enviada externamente. O registro fica neste
            navegador e aparece na área da empresa correspondente.
          </p>
          <button
            type='button'
            onClick={() => setSaved(false)}
            className='mt-4 min-h-11 font-bold underline'
          >
            Registrar outro pedido
          </button>
        </div>
      ) : (
        <form
          className='space-y-5'
          onSubmit={event => {
            event.preventDefault();
            const values = Object.fromEntries(
              new FormData(event.currentTarget)
            );
            if (
              !values.name.trim() ||
              !values.contact.trim() ||
              !values.message.trim()
            ) {
              setError('Preencha seu nome, contato e a mensagem.');
              return;
            }
            if (
              !values.contact.includes('@') &&
              values.contact.replace(/\D/g, '').length < 10
            ) {
              setError(
                'Informe um telefone com DDD ou um e-mail para contato.'
              );
              return;
            }
            if (
              values.contact.includes('@') &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact)
            ) {
              setError('Informe um e-mail válido.');
              return;
            }
            const service = ad ?? ads[0];
            const date = new Date().toISOString();
            try {
              updateEmpresa(previous => ({
                ...previous,
                contacts: [
                  ...previous.contacts,
                  {
                    id: crypto.randomUUID(),
                    companyId: company.id,
                    name: values.name.trim(),
                    contact: values.contact.trim(),
                    adId: service?.id ?? '',
                    service: service?.title ?? 'Contato com a empresa',
                    status: 'unread',
                    createdAt: date,
                    messages: [
                      {
                        id: crypto.randomUUID(),
                        author: 'client',
                        text: values.message.trim(),
                        date,
                      },
                    ],
                  },
                ],
                ads: previous.ads.map(item =>
                  item.id === service?.id
                    ? { ...item, contactCount: item.contactCount + 1 }
                    : item
                ),
              }));
              setError('');
              setSaved(true);
            } catch (error) {
              setError(error.message);
            }
          }}
        >
          <div className='grid gap-5 sm:grid-cols-2'>
            <FormField
              id='request-name'
              name='name'
              label='Seu nome'
              maxLength={100}
              required
            />
            <FormField
              id='request-contact'
              name='contact'
              label='Seu contato (telefone ou e-mail)'
              maxLength={150}
              required
            />
          </div>
          <label
            htmlFor='request-message'
            className='flex flex-col gap-2 text-sm font-bold'
          >
            Como a empresa pode ajudar?
            <textarea
              id='request-message'
              name='message'
              required
              maxLength={2000}
              rows={5}
              className='rounded-lg border border-[#dbe5ed] p-4 font-normal'
            />
          </label>
          <p className='text-xs text-(--texto-apoio)'>
            Demonstração local: este pedido não será enviado para a empresa fora
            deste navegador.
          </p>
          {error && (
            <p role='alert' className='text-sm text-red-800'>
              {error}
            </p>
          )}
          <Action type='submit'>Registrar solicitação de contato ↗</Action>
        </form>
      )}
    </Card>
  );
}

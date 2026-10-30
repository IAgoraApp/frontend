import { Link } from 'react-router-dom';
import { Title, Button, CaixaAnimada } from '../components/shared/ui';
import { Footer } from '../components/shared';

export default function MeusServicos() {
  return (
    <>

      <main className='mx-30 mb-20 mt-10 flex flex-col gap-10'>
        <section className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-2'>
          <div className='lg:col-span-7 flex flex-col justify-center'>
            <Title as='h2' variant='pequenoLj'>
              ANUNCIAR SERVIÇO / MOSTRE O QUE SUA EMPRESA FAZ
            </Title>
            <h1 className='font-heading text-6xl sm:text-7xl lg:text-[5.25rem] xl:text-[5.75rem] font-black text-(--azul-titulo) leading-[0.98] mt-3 tracking-tight'>
              Você faz bem. <br />
              <span className='text-(--laranja-principal)'>Conta pra geral.</span>
            </h1>
          </div>

          <div className='lg:col-span-5 flex flex-col items-center lg:items-end lg:pr-2 xl:pr-6'>
            <CaixaAnimada />
          </div>
        </section>

        <section className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start'>
          <div className='lg:col-span-7 bg-(--azul-fundo) p-8 flex flex-col gap-6'>
            <div>
              <Title as='h3' variant='pequenoLj'>
                01 / SOBRE O SERVIÇO
              </Title>

              <div className='mt-4 flex flex-col gap-4'>
                <div>
                  <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                    Título do anúncio
                  </label>
                  <input
                    type='text'
                    placeholder='Ex.: Limpeza residencial'
                    className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal)'
                  />
                </div>

                <div>
                  <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                    Categoria
                  </label>
                  <input
                    type='text'
                    placeholder='Escolha a categoria do serviço'
                    className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal)'
                  />
                </div>

                <div>
                  <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                    Descrição
                  </label>
                  <textarea
                    rows='4'
                    placeholder='O que está incluído? Como funciona o atendimento?'
                    className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal) resize-none'
                  />
                </div>
              </div>
            </div>

            <div>
              <Title as='h3' variant='pequenoLj'>
                02 / ATENDIMENTO E VALORES
              </Title>

              <div className='mt-4 flex flex-col gap-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                      Região de atendimento
                    </label>
                    <input
                      type='text'
                      placeholder='Cidade e bairros'
                      className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal)'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                      Valor
                    </label>
                    <input
                      type='text'
                      placeholder='Sob orçamento ou a partir de R$'
                      className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal)'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-(--azul-titulo) mb-1.5'>
                    Contato da empresa
                  </label>
                  <input
                    type='text'
                    placeholder='Telefone ou e-mail para combinar o serviço'
                    className='w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-(--laranja-principal)'
                  />
                </div>
              </div>
            </div>

            <div>
              <Title as='h3' variant='pequenoLj'>
                03 / MOSTRE SEU TRABALHO
              </Title>

              <div className='mt-4 bg-white border border-gray-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-(--laranja-principal) transition-colors'>
                <p className='font-heading font-bold text-(--azul-titulo) text-base'>
                  + Adicionar fotos do serviço
                </p>
                <p className='text-xs text-(--texto-claro) mt-1'>
                  Use imagens da sua equipe, dos materiais e dos trabalhos realizados.
                </p>
              </div>
            </div>

            <div className='flex gap-4 pt-2'>
              <Button color='laranja'>Publicar serviço ↗</Button>
              <Button color='preto'>Salvar rascunho</Button>
            </div>
          </div>

          <div className='lg:col-span-5 flex flex-col gap-4'>
            <Title as='h3' variant='pequenoLj'>
              COMO SEU ANÚNCIO APARECE
            </Title>

            <div className='bg-white border border-gray-200 overflow-hidden flex flex-col shadow-xs'>
              <img
                src='https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80'
                alt='Prévia do serviço'
                className='w-full h-56 object-cover'
              />

              <div className='p-6 flex flex-col gap-2'>
                <h3 className='font-heading text-2xl font-bold text-(--azul-titulo)'>
                  Casa em Dia Serviços
                </h3>
                <h4 className='font-heading text-lg font-bold text-(--azul-titulo)'>
                  Limpeza residencial
                </h4>
                <p className='text-xs text-(--texto-claro)'>
                  São Paulo e região · Valor sob orçamento
                </p>
                <p className='text-sm text-(--texto-claro) mt-2 leading-relaxed'>
                  Uma descrição direta ajuda o consumidor a entender o serviço e combinar os próximos passos.
                </p>

                <div className='mt-4'>
                  <Link to='/perfil-empresa'>
                    <Button color='preto' className='w-full'>
                      Ver perfil público ↗
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className='bg-(--azul-fundo) p-5 border border-gray-200'>
              <p className='font-heading font-bold text-xs uppercase tracking-wider text-(--laranja-principal) mb-2'>
                Dicas para um bom anúncio
              </p>
              <ul className='text-xs text-(--texto-claro) flex flex-col gap-1.5'>
                <li>✓ Título direto com o nome exato do serviço</li>
                <li>✓ Especifique bairros atendidos e horários disponíveis</li>
                <li>✓ Fotos reais aumentam as chances de orçamento em 3x</li>
                <li>✓ Responda aos contatos recebidos em poucos minutos</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

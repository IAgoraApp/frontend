import { Link } from 'react-router-dom';
import { Title, Button, CaixaAnimada } from '../../components/shared/ui';
import { Footer } from '../../components/shared';

export default function Dashboard() {

  const servicos = [
    {
      id: 1,
      titulo: 'Limpeza residencial',
      status: 'Publicado · Limpeza',
      preco: 'R$ 180 - R$ 350',
      views: '1.840 views',
      contatos: '22 contatos',
      badge: 'Ativo',
    },
    {
      id: 2,
      titulo: 'Limpeza pós-mudança',
      status: 'Publicado · Limpeza',
      preco: 'R$ 280 - R$ 600',
      views: '1.210 views',
      contatos: '16 contatos',
      badge: 'Ativo',
    },
    {
      id: 3,
      titulo: 'Organização de ambientes',
      status: 'Rascunho · Cuidados da casa',
      preco: 'R$ 150 - R$ 400',
      views: '0 views',
      contatos: '0 contatos',
      badge: 'Rascunho',
    },
  ];

  const contatosRecentes = [
    {
      nome: 'Mariana Duarte',
      servico: 'Limpeza residencial',
      bairro: 'Pinheiros, São Paulo',
      tempo: 'Hoje às 14:20',
      status: 'Novo contato',
    },
    {
      nome: 'Carlos Eduardo Ramos',
      servico: 'Limpeza pós-mudança',
      bairro: 'Vila Mariana, São Paulo',
      tempo: 'Ontem às 18:45',
      status: 'Respondido',
    },
    {
      nome: 'Beatriz Vasconcelos',
      servico: 'Limpeza residencial',
      bairro: 'Moema, São Paulo',
      tempo: '17 de Outubro',
      status: 'Agendado',
    },
  ];

  return (
    <>


      <main className='mx-30 mb-20 mt-10 flex flex-col gap-12'>
        <section className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-2'>
          <div className='lg:col-span-7 flex flex-col justify-center'>
            <Title as='h2' variant='pequenoLj'>
              PAINEL DA EMPRESA / BORA CRESCER
            </Title>
            <h1 className='font-heading text-6xl sm:text-7xl lg:text-[5.25rem] xl:text-[5.75rem] font-black text-(--azul-titulo) leading-[0.98] mt-3 tracking-tight'>
              Seu trabalho. <br />
              <span className='text-(--laranja-principal)'>Faz acontecer.</span>
            </h1>

            <div className='flex flex-wrap gap-2.5 mt-5'>
              <span className='bg-(--azul-fundo) text-(--azul-titulo) text-xs font-semibold px-3 py-1.5 rounded-full'>
                ● Empresa Verificada
              </span>
              <span className='bg-(--laranja-fundo) text-(--laranja-principal) text-xs font-semibold px-3 py-1.5 rounded-full'>
                ★ 4.9 (32 avaliações)
              </span>
              <span className='bg-(--azul-fundo) text-(--texto-claro) text-xs font-semibold px-3 py-1.5 rounded-full'>
                São Paulo - SP
              </span>
            </div>
          </div>

          <div className='lg:col-span-5 flex flex-col items-center lg:items-end lg:pr-2 xl:pr-6'>
            <CaixaAnimada />
          </div>
        </section>

        <section className='bg-[#102a43] p-10 flex justify-between items-center text-white'>
          <div className='w-1/2'>
            <p className='text-xs font-bold uppercase tracking-wider text-gray-300'>
              SUA EMPRESA, MAIS PERTO DE QUEM PRECISA
            </p>
            <h2 className='text-3xl font-bold font-heading mt-3 mb-6'>
              Seu próximo serviço começa com uma boa apresentação.
            </h2>
            <Link to='/meus-servicos'>
              <Button color='laranja'>Publicar um novo serviço ↗</Button>
            </Link>
          </div>

          <div>
            <img
              src='https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80'
              alt='Equipe de serviços'
              className='w-96 h-56 object-cover rounded-lg'
            />
          </div>
        </section>

        <section className='grid grid-cols-4 gap-6'>
          <div className='bg-(--azul-fundo) p-6'>
            <p className='text-(--texto-claro) font-semibold text-xs'>
              Serviços publicados
            </p>
            <h3 className='font-heading text-4xl font-bold text-(--azul-titulo) mt-2'>
              2
            </h3>
            <span className='text-xs font-semibold text-green-600 mt-1 block'>
              ● Ativos na busca
            </span>
          </div>

          <div className='bg-(--laranja-fundo) p-6'>
            <p className='text-(--texto-claro) font-semibold text-xs'>
              Rascunhos
            </p>
            <h3 className='font-heading text-4xl font-bold text-(--azul-titulo) mt-2'>
              1
            </h3>
            <span className='text-xs font-semibold text-(--laranja-principal) mt-1 block'>
              Pronto p/ publicar
            </span>
          </div>

          <div className='bg-(--azul-fundo) p-6'>
            <p className='text-(--texto-claro) font-semibold text-xs'>
              Sua região
            </p>
            <h3 className='font-heading text-2xl font-bold text-(--azul-titulo) mt-2'>
              São Paulo
            </h3>
            <span className='text-xs font-semibold text-blue-600 mt-1 block'>
              Zona Sul, Oeste e Centro
            </span>
          </div>

          <div className='bg-(--azul-fundo) p-6'>
            <p className='text-(--texto-claro) font-semibold text-xs'>
              Orçamentos este mês
            </p>
            <h3 className='font-heading text-4xl font-bold text-(--azul-titulo) mt-2'>
              38
            </h3>
            <span className='text-xs font-semibold text-green-600 mt-1 block'>
              +14% novos clientes
            </span>
          </div>
        </section>

        <section className='bg-(--azul-fundo) p-8 flex flex-col gap-6'>
          <div className='flex justify-between items-end'>
            <div>
              <Title as='h2' variant='pequenoLj'>
                DESEMPENHO
              </Title>
              <Title as='h3' variant='normal' className='text-2xl mt-1'>
                Visão geral e resultados do seu negócio
              </Title>
            </div>

            <span className='text-xs font-semibold text-(--texto-claro) bg-white px-3 py-1.5 rounded-full'>
              Últimos 30 dias
            </span>
          </div>

          <div className='grid grid-cols-4 gap-4'>
            <div className='bg-white p-5'>
              <p className='text-(--texto-claro) text-xs font-semibold'>
                Visualizações totais
              </p>
              <p className='font-heading text-2xl font-bold text-(--azul-titulo) mt-1'>
                3.420
              </p>
              <span className='text-xs text-green-600 font-semibold mt-1 block'>
                +28% este mês
              </span>
            </div>

            <div className='bg-white p-5'>
              <p className='text-(--texto-claro) text-xs font-semibold'>
                Contatos recebidos
              </p>
              <p className='font-heading text-2xl font-bold text-(--azul-titulo) mt-1'>
                38
              </p>
              <span className='text-xs text-green-600 font-semibold mt-1 block'>
                +14% novos clientes
              </span>
            </div>

            <div className='bg-white p-5'>
              <p className='text-(--texto-claro) text-xs font-semibold'>
                Taxa de resposta
              </p>
              <p className='font-heading text-2xl font-bold text-(--azul-titulo) mt-1'>
                98%
              </p>
              <span className='text-xs text-blue-600 font-semibold mt-1 block'>
                Tempo médio: 12 min
              </span>
            </div>

            <div className='bg-white p-5'>
              <p className='text-(--texto-claro) text-xs font-semibold'>
                Avaliação média
              </p>
              <p className='font-heading text-2xl font-bold text-(--azul-titulo) mt-1'>
                4.9 ★
              </p>
              <span className='text-xs text-(--laranja-principal) font-semibold mt-1 block'>
                32 avaliações reais
              </span>
            </div>
          </div>

          <div className='bg-white p-6'>
            <div className='flex justify-between items-center mb-4 pb-2 border-b border-gray-100'>
              <p className='font-heading text-base font-bold text-(--azul-titulo)'>
                Últimos contatos e solicitações de orçamento
              </p>
              <span className='text-xs font-semibold text-(--laranja-principal) cursor-pointer'>
                Ver todas as conversas ↗
              </span>
            </div>

            <div className='flex flex-col gap-3'>
              {contatosRecentes.map((item, idx) => (
                <div
                  key={idx}
                  className='flex justify-between items-center p-3.5 bg-(--azul-fundo) hover:bg-gray-100 transition-colors rounded-lg'
                >
                  <div className='flex-1 min-w-0 pr-4'>
                    <p className='font-heading font-bold text-sm text-(--azul-titulo) truncate'>
                      {item.nome}
                    </p>
                    <p className='text-xs text-(--texto-claro) truncate'>
                      {item.servico} · {item.bairro}
                    </p>
                  </div>

                  <div className='flex items-center gap-4 shrink-0'>
                    <span className='text-xs text-gray-500 w-32 text-right'>
                      {item.tempo}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 font-semibold rounded-full w-28 text-center ${
                        item.status === 'Novo contato'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'Agendado'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.status}
                    </span>
                    <div className='w-28 flex justify-end'>
                      <Button color='preto' className='text-xs py-1.5 px-4 w-full text-center'>
                        Responder
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='flex flex-col gap-4'>
          <div>
            <Title as='h2' variant='pequenoLj'>
              MEUS SERVIÇOS
            </Title>
            <Title as='h1' variant='normal'>
              O que sua empresa oferece.
            </Title>
          </div>

          <div className='bg-(--azul-fundo) p-8 flex flex-col gap-4 mt-2 rounded-2xl'>
            {servicos.map((s) => (
              <div
                key={s.id}
                className='bg-white p-6 flex justify-between items-center shadow-xs rounded-xl'
              >
                <div>
                  <div className='flex items-center gap-3'>
                    <h4 className='font-heading text-xl font-bold text-(--azul-titulo)'>
                      {s.titulo}
                    </h4>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        s.badge === 'Ativo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {s.badge}
                    </span>
                  </div>
                  <p className='text-(--texto-claro) text-sm mt-1'>
                    {s.status} · Faixa: <strong>{s.preco}</strong>
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {s.views} · {s.contatos}
                  </p>
                </div>

                <Link to='/meus-servicos' className='shrink-0'>
                  <Button color='preto' className='whitespace-nowrap px-7 py-2.5 text-sm'>
                    Editar anúncio ↗
                  </Button>
                </Link>
              </div>
            ))}

            <Link to='/meus-servicos'>
              <div className='border-2 border-dashed border-gray-300 p-4 flex justify-center items-center cursor-pointer hover:border-(--laranja-principal) bg-white/50 hover:bg-white transition-all text-center rounded-xl'>
                <span className='font-semibold text-(--texto-claro) text-sm'>
                  + Cadastrar outro serviço para sua empresa
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className='bg-[#102a43] p-10 flex justify-between items-center text-white'>
          <div className='max-w-xl'>
            <h2 className='text-2xl font-bold font-heading'>
              Seu perfil também vende confiança.
            </h2>
            <p className='text-gray-300 text-sm mt-1.5'>
              Conte sobre a empresa, mostre sua equipe e mantenha o contato em dia. Empresas com perfil 100% completo fecham até 3x mais negócios.
            </p>
          </div>

          <Link to='/perfil-empresa'>
            <Button color='laranja'>Editar perfil da empresa ↗</Button>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
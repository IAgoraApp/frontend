import fotoMudanca from '../../../ativos/imagens/fotografias/momento/mudanca.jpg';
import fotoRotina from '../../../ativos/imagens/fotografias/momento/rotina.jpg';
import './SecaoMomento.css';

const momentos = [
  {
    id: 'mudanca',
    titulo: 'Vou morar sozinho',
    chamada: 'Planejar minha mudança',
    foto: fotoMudanca,
    destino: '#como-funciona',
  },
  {
    id: 'rotina',
    titulo: 'Já tenho meu canto',
    chamada: 'Organizar minha rotina',
    foto: fotoRotina,
    destino: '#funcionalidades',
  },
];

export default function SecaoMomento() {
  return (
    <section
      id='momento'
      aria-labelledby='titulo-momento'
      className='momento-landing'
    >
      <div className='momento-container'>
        <header className='momento-cabecalho'>
          <span>CADA CONQUISTA TEM SEU JEITO</span>
          <h2 id='titulo-momento'>Em que momento você está?</h2>
        </header>
        <div className='momento-grade'>
          {momentos.map(momento => (
            <a
              key={momento.id}
              href={momento.destino}
              className='momento-cartao'
            >
              <div className='momento-foto'>
                <img
                  src={momento.foto}
                  alt=''
                  width='1536'
                  height='1024'
                  loading='lazy'
                  decoding='async'
                />
              </div>
              <div className='momento-conteudo'>
                <h3 id={`titulo-momento-${momento.id}`}>{momento.titulo}</h3>
                <span className='momento-chamada'>{momento.chamada}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

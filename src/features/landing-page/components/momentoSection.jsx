import { Link } from 'react-router-dom';
import fotoMudanca from '../assets/momento-mudanca.jpg';
import fotoRotina from '../assets/momento-rotina.jpg';
import './momentoSection.css';

const momentos = [
  {
    id: 'mudanca',
    titulo: 'Vou morar sozinho',
    chamada: 'Planejar minha mudança',
    foto: fotoMudanca,
  },
  {
    id: 'rotina',
    titulo: 'Já tenho meu canto',
    chamada: 'Organizar minha rotina',
    foto: fotoRotina,
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
        <header className='momento-cabecalho' data-entrada=''>
          <span>CADA CONQUISTA TEM SEU JEITO</span>
          <h2 id='titulo-momento'>Em que momento você está?</h2>
        </header>
        <div className='momento-grade'>
          {momentos.map(momento => (
            <Link key={momento.id} to='/login' className='momento-cartao'>
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
              <div className='momento-conteudo' data-entrada=''>
                <h3 id={`titulo-momento-${momento.id}`}>{momento.titulo}</h3>
                <span className='momento-chamada'>{momento.chamada}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

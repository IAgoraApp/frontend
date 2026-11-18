import { House, MapPin } from 'lucide-react';
import fotoCasa from '../assets/residencia-minha.png';

export default function PerfilCasa({ casa, endereco }) {
  return (
    <section className='casa-perfil' aria-labelledby='casa-perfil-nome'>
      <img
        className='casa-perfil-foto'
        src={fotoCasa}
        alt='Imagem de referência de uma casa com jardim'
      />
      <div className='casa-perfil-informacoes'>
        <span className='casa-perfil-tipo'>
          <House size={15} aria-hidden='true' />
          {casa.tipo}
        </span>
        <h2 id='casa-perfil-nome'>{casa.nome}</h2>
        {endereco && (
          <div className='casa-perfil-endereco'>
            <MapPin size={18} aria-hidden='true' />
            <div>
              <p>
                {endereco.rua}, {endereco.numero}
                {endereco.complemento ? `, ${endereco.complemento}` : ''}
              </p>
              <p>
                {endereco.bairro}, {endereco.cidade} — {endereco.estado}
              </p>
              <p>CEP {endereco.cep}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

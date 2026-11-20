import { House, MapPin } from 'lucide-react';
import fotoCasa from '../assets/residencia-minha.png';

export default function PerfilCasa({
  casa,
  endereco,
  foto = fotoCasa,
  legendaFoto = 'Imagem de referência de uma casa com jardim',
  children,
}) {
  const rua = [endereco?.rua, endereco?.numero, endereco?.complemento]
    .filter(Boolean)
    .join(', ');
  const cidade = [endereco?.cidade, endereco?.estado]
    .filter(Boolean)
    .join(' / ');
  const localidade = [endereco?.bairro, cidade].filter(Boolean).join(', ');
  const linhasEndereco = [
    rua,
    localidade,
    endereco?.cep && 'CEP ' + endereco.cep,
  ].filter(Boolean);

  return (
    <section className='casa-perfil' aria-labelledby='casa-perfil-nome'>
      <img className='casa-perfil-foto' src={foto} alt={legendaFoto} />
      <div className='casa-perfil-informacoes'>
        <span className='casa-perfil-tipo'>
          <House size={15} aria-hidden='true' />
          {casa.tipo}
        </span>
        <h2 id='casa-perfil-nome'>{casa.nome}</h2>
        {linhasEndereco.length > 0 && (
          <div className='casa-perfil-endereco'>
            <MapPin size={18} aria-hidden='true' />
            <div>
              {linhasEndereco.map((linha, indice) => (
                <p key={indice}>{linha}</p>
              ))}
            </div>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

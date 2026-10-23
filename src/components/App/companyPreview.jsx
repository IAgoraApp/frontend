import { Badge } from './ui';
import styles from '../../styles/app.module.css';

export default function CompanyPreview({ company }) {
  return (
    <div className={styles.stack}>
      {company.image && (
        <img
          className={styles.photo}
          src={company.image}
          alt='Imagem comercial escolhida'
        />
      )}
      <div className={styles.row}>
        {company.logo && (
          <img
            className='w-20 h-20 object-contain rounded-lg'
            src={company.logo}
            alt={`Logo de ${company.name}`}
          />
        )}
        <div>
          <h2>{company.name}</h2>
          <Badge>Perfil demonstrativo · sem verificação externa</Badge>
        </div>
      </div>
      <p>
        {company.description ||
          'A descrição comercial ainda não foi preenchida.'}
      </p>
      <p>
        <strong>Atuação:</strong> {company.categories}
      </p>
      <p>
        <strong>Região:</strong> {company.region}
      </p>
      <p>
        <strong>Horário:</strong> {company.hours || 'A combinar'}
      </p>
      {company.address && (
        <p>
          <strong>Endereço comercial:</strong> {company.address}
        </p>
      )}
      <p>
        <strong>Contatos informados:</strong>{' '}
        {company.phone || 'Telefone não informado'} ·{' '}
        {company.email || 'E-mail não informado'}
      </p>
      {company.website && (
        <p>
          <strong>Portfólio:</strong> {company.website}
        </p>
      )}
      {company.social && (
        <p>
          <strong>Rede social:</strong> {company.social}
        </p>
      )}
      <small className={styles.muted}>
        Prévia local. Os dados são exibidos como informados e não passam por
        validação externa.
      </small>
    </div>
  );
}

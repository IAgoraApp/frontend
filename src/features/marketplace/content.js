import apartment from '../empresa/assets/EditorialPhotoApartment.png';
import essentials from '../empresa/assets/PhotoEssentials.png';
import moving from '../empresa/assets/PhotoMoving.png';
import services from '../empresa/assets/EditorialPhotoServices.png';

export const sampleCompanies = [
  {
    id: 'liga-resolve',
    name: 'Liga & Resolve',
    category: 'Manutenção',
    region: 'São Paulo, SP e região',
    about:
      'Pequenos reparos e cuidados para deixar a casa funcionando. Combine o escopo e a disponibilidade antes do atendimento.',
    hours: 'Segunda a sexta, sob consulta',
    portfolio: [essentials],
    image: essentials,
    sample: true,
  },
  {
    id: 'mudae',
    name: 'Mudaê Transportes',
    category: 'Mudanças',
    region: 'São Paulo, SP e região',
    about:
      'Transporte e apoio para levar seu próximo capítulo para outro endereço. Combine os detalhes antes da mudança.',
    hours: 'Sob agendamento',
    portfolio: [moving],
    image: moving,
    sample: true,
  },
];
export function catalog(data) {
  const own = {
    ...data.company,
    image: data.company.portfolio[0] ?? services,
    sample: data.example,
  };
  const companies = [own, ...sampleCompanies];
  const ownAds = data.ads
    .filter(ad => ad.status === 'active')
    .map(ad => ({ ...ad, companyId: own.id, image: ad.photos[0] ?? services }));
  const sampleAds = [
    {
      id: 'reparos',
      title: 'Pequenos reparos residenciais',
      category: 'Manutenção',
      companyId: 'liga-resolve',
      description: sampleCompanies[0].about,
      region: sampleCompanies[0].region,
      price: 'Sob orçamento',
      attendance: 'Residencial',
      availability: 'Sob agendamento',
      photos: [essentials],
      image: essentials,
      status: 'active',
    },
    {
      id: 'mudanca',
      title: 'Mudanças e transporte',
      category: 'Mudanças',
      companyId: 'mudae',
      description: sampleCompanies[1].about,
      region: sampleCompanies[1].region,
      price: 'Sob orçamento',
      attendance: 'Residencial',
      availability: 'Sob agendamento',
      photos: [moving],
      image: moving,
      status: 'active',
    },
  ];
  return { companies, ads: [...ownAds, ...sampleAds] };
}
export const publicPhotos = { apartment, services };

import { servicesCatalog } from '../data/catalog';
import fallbackImage from '../assets/images/services.png';

export function availableServices(data) {
  return [
    ...servicesCatalog,
    ...data.ads
      .filter(ad => ad.status === 'Ativo')
      .map(ad => ({
        ...ad,
        company: data.company.name,
        companyProfile: data.company,
        image: ad.images[0] || data.company.image || fallbackImage,
        rating: null,
        reviews: [],
        local: true,
      })),
  ];
}

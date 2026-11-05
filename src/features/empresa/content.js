import { useMemo, useSyncExternalStore } from 'react';

export const storageKey = 'iagora:empresa:v1';
const changeEvent = 'iagora:empresa:change';
export const statuses = {
  active: 'Ativo',
  review: 'Em análise',
  paused: 'Pausado',
  expired: 'Expirado',
  draft: 'Rascunho',
};
export const contactStatuses = {
  unread: 'Não respondido',
  progress: 'Em andamento',
  done: 'Concluído',
};
export const categories = [
  'Limpeza',
  'Manutenção',
  'Mudanças',
  'Organização',
  'Outros',
];
export const companyId = 'casa-em-dia';
export const normalize = value =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
export const formatDate = value => new Date(value).toLocaleDateString('pt-BR');
export const safeUrl = value => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};
export function initialState() {
  const now = new Date().toISOString();
  const base = {
    description:
      'Limpeza residencial e pós-mudança, com equipe treinada e produtos de qualidade.',
    region: 'São Paulo, SP e região',
    price: 'A partir de R$ 120,00',
    phone: '(11) 91234-5678',
    email: 'contato@casaemdia.exemplo',
    availability: 'Segunda a sábado, das 8h às 18h',
    attendance: 'Residencial',
    photos: [],
    updatedAt: now,
    createdAt: now,
  };
  return {
    version: 1,
    example: true,
    company: {
      id: companyId,
      name: 'Casa em Dia Serviços',
      email: 'contato@casaemdia.exemplo',
      phone: '(11) 91234-5678',
      region: 'São Paulo, SP e região',
      category: 'Limpeza',
      about:
        'Somos uma empresa de limpeza e organização. Combinamos os detalhes de cada atendimento para entender o que sua casa precisa.',
      address: '',
      website: '',
      hours: 'Segunda a sábado, das 8h às 18h',
      logo: '',
      portfolio: [],
    },
    ads: [
      {
        ...base,
        id: 'limpeza-residencial',
        title: 'Limpeza residencial',
        category: 'Limpeza',
        status: 'active',
        views: 420,
        contactCount: 24,
      },
      {
        ...base,
        id: 'pos-mudanca',
        title: 'Limpeza pós-mudança',
        category: 'Limpeza',
        status: 'review',
        views: 230,
        contactCount: 12,
      },
      {
        ...base,
        id: 'organizacao',
        title: 'Organização de ambientes',
        category: 'Organização',
        status: 'paused',
        views: 98,
        contactCount: 6,
      },
      {
        ...base,
        id: 'limpeza-comercial',
        title: 'Limpeza comercial',
        category: 'Limpeza',
        status: 'expired',
        attendance: 'Comercial',
        views: 55,
        contactCount: 2,
      },
    ],
    contacts: [
      {
        id: 'joao',
        name: 'João Silva',
        contact: 'Contato demonstrativo',
        adId: 'limpeza-residencial',
        service: 'Limpeza residencial',
        status: 'unread',
        createdAt: now,
        messages: [
          {
            id: 'message-joao',
            author: 'client',
            text: 'Olá! Gostaria de um orçamento para limpar meu apartamento de dois quartos. Vocês atendem na Vila Mariana?',
            date: now,
          },
        ],
      },
      {
        id: 'mariana',
        name: 'Mariana Costa',
        contact: 'Contato demonstrativo',
        adId: 'pos-mudanca',
        service: 'Limpeza pós-mudança',
        status: 'progress',
        createdAt: now,
        messages: [
          {
            id: 'message-mariana',
            author: 'client',
            text: 'Preciso de uma limpeza completa após a mudança.',
            date: now,
          },
        ],
      },
      {
        id: 'carlos',
        name: 'Carlos Henrique',
        contact: 'Contato demonstrativo',
        adId: 'organizacao',
        service: 'Organização de ambientes',
        status: 'done',
        createdAt: now,
        messages: [
          {
            id: 'message-carlos',
            author: 'client',
            text: 'Quero organizar os armários e a cozinha.',
            date: now,
          },
        ],
      },
      {
        id: 'patricia',
        name: 'Patrícia Lima',
        contact: 'Contato demonstrativo',
        adId: 'limpeza-residencial',
        service: 'Limpeza residencial',
        status: 'progress',
        createdAt: now,
        messages: [
          {
            id: 'message-patricia',
            author: 'client',
            text: 'Vocês têm disponibilidade para esta semana?',
            date: now,
          },
        ],
      },
    ],
  };
}
const fallback = initialState();
export function parseCompany(raw) {
  if (!raw) return { data: fallback, error: false };
  try {
    const data = JSON.parse(raw);
    if (
      data?.version !== 1 ||
      typeof data.company?.name !== 'string' ||
      !Array.isArray(data.company.portfolio) ||
      !Array.isArray(data.ads) ||
      !Array.isArray(data.contacts) ||
      !data.ads.every(
        ad =>
          typeof ad.id === 'string' &&
          typeof ad.title === 'string' &&
          typeof ad.description === 'string' &&
          typeof ad.region === 'string' &&
          Object.hasOwn(statuses, ad.status) &&
          Array.isArray(ad.photos) &&
          Number.isFinite(ad.views) &&
          Number.isFinite(ad.contactCount)
      ) ||
      !data.contacts.every(
        contact =>
          typeof contact.id === 'string' &&
          typeof contact.name === 'string' &&
          Object.hasOwn(contactStatuses, contact.status) &&
          Array.isArray(contact.messages) &&
          contact.messages.every(
            message =>
              typeof message.text === 'string' &&
              typeof message.date === 'string'
          )
      )
    )
      throw new Error('invalid');
    return { data, error: false };
  } catch {
    return { data: fallback, error: true };
  }
}
function snapshot() {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return '__unavailable__';
  }
}
function subscribe(callback) {
  const storage = event => {
    if (event.key === storageKey || event.key === null) callback();
  };
  window.addEventListener('storage', storage);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener('storage', storage);
    window.removeEventListener(changeEvent, callback);
  };
}
export function useEmpresa() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  return useMemo(() => parseCompany(raw), [raw]);
}
export function updateEmpresa(update) {
  const current = parseCompany(snapshot());
  if (current.error)
    throw new Error(
      'Não foi possível ler os dados anteriores. Eles foram preservados.'
    );
  const next = update(current.data);
  if (parseCompany(JSON.stringify(next)).error)
    throw new Error('Confira os dados antes de salvar.');
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    throw new Error(
      'Não foi possível salvar no navegador. Libere espaço ou reduza as fotos.'
    );
  }
  window.dispatchEvent(new Event(changeEvent));
  return next;
}
export function validateAd(ad) {
  if (
    !ad.title.trim() ||
    !ad.description.trim() ||
    !ad.region.trim() ||
    !ad.price.trim()
  )
    return 'Preencha título, descrição, região e preço ou orçamento.';
  if (!categories.includes(ad.category)) return 'Escolha uma categoria.';
  if (!ad.phone.trim() && !ad.email.trim())
    return 'Informe pelo menos um contato da empresa.';
  if (ad.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ad.email))
    return 'Informe um e-mail válido.';
  return '';
}
export const emptyAd = company => ({
  id: crypto.randomUUID(),
  title: '',
  description: '',
  category: 'Limpeza',
  region: company.region,
  price: 'Sob orçamento',
  phone: company.phone,
  email: company.email,
  availability: company.hours,
  attendance: 'Residencial',
  photos: [],
  status: 'draft',
  views: 0,
  contactCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
export async function imageData(file) {
  if (
    !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
    file.size > 5 * 1024 * 1024
  )
    throw new Error('Use JPG, PNG ou WebP de até 5 MB.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 1000 / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.78);
  } finally {
    URL.revokeObjectURL(url);
  }
}

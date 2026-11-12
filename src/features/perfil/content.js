export const secoesControleConta = [
  { id: 'informacoes', titulo: 'Informações pessoais', subtitulo: 'Abrir preferências' },
  { id: 'foto', titulo: 'Foto de perfil', subtitulo: 'Abrir preferências' },
  { id: 'seguranca', titulo: 'Senha e acesso', subtitulo: 'Abrir preferências' },
  { id: 'momento', titulo: 'Seu momento', subtitulo: 'Abrir preferências' },
  { id: 'notificacoes', titulo: 'Notificações', subtitulo: 'Abrir preferências' },
  { id: 'privacidade', titulo: 'Privacidade', subtitulo: 'Abrir preferências' },
  { id: 'moradia', titulo: 'Minha residência', subtitulo: 'Abrir preferências' },
  { id: 'excluir', titulo: 'Excluir minha conta', subtitulo: 'Abrir preferências' },
];

export const opcoesNotificacoesPerfil = [
  {
    chave: 'rotina',
    titulo: 'Lembretes de tarefas',
    descricao: 'Ajuste quando quiser.',
  },
  {
    chave: 'financas',
    titulo: 'Vencimentos e limites',
    descricao: 'Ajuste quando quiser.',
  },
  {
    chave: 'resumoSemanal',
    titulo: 'Novidades da minha jornada',
    descricao: 'Ajuste quando quiser.',
  },
  {
    chave: 'mensagensEmpresa',
    titulo: 'Sugestões de conteúdo',
    descricao: 'Ajuste quando quiser.',
  },
];

export const opcoesPrivacidadePerfil = [
  {
    chave: 'personalizarPorMomento',
    titulo: 'Usar meu momento para personalizar sugestões',
    descricao: 'Preferência demonstrativa; sem envio real.',
  },
  {
    chave: 'mostrarLembretes',
    titulo: 'Mostrar lembretes dentro da plataforma',
    descricao: 'Preferência demonstrativa; sem envio real.',
  },
  {
    chave: 'comunicacoesOpcionais',
    titulo: 'Receber comunicações opcionais',
    descricao: 'Preferência demonstrativa; sem envio real.',
  },
];

export function extrairIniciais(nome) {
  const partes = String(nome || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (partes.length === 0) return 'IA';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

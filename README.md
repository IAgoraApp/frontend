# IAgora

Site institucional em React e Vite com as telas LandingPage e Sobre nós.

## Desenvolvimento

- Instale as dependências: npm ci
- Inicie o servidor: npm run dev
- Gere a versão de produção: npm run build
- Verifique o código: npm run lint

## Organização por funcionalidade

- src/app: configuração das rotas, layout público e estilos globais.
- src/features/landing-page: página inicial, seções, conteúdo e assets próprios.
- src/features/sobre-nos: página Sobre nós, CSS Module e assets próprios.
- src/shared: header, footer, componentes de UI reutilizáveis e logo.

Cada funcionalidade expõe sua página pelo index.js. Componentes compartilhados
não dependem das funcionalidades.

As páginas públicas são / e /sobrenos, agrupadas em PublicRoute e PublicLayout.
A rota técnica /manutencao e o errorElement seguem a organização do router original.
Endereços desconhecidos são tratados pelo errorElement.

Os helpers PublicRoute e PrivateRoute ficam em src/app/utils/checkAuth.jsx.
Como no projeto original, ambos apenas renderizam Outlet; ainda não validam autenticação.
Os layouts PublicLayout, UserLayout e EmpresasLayout são exportados por src/app/layouts.
Somente PublicLayout está associado às páginas atuais; os demais ficam disponíveis
para futuras funcionalidades. Cada layout seleciona a variante do header (public, user ou empresas).
As configurações de navegação e botões por variante ficam em src/shared/headerConfig.js, preservando os destinos originais. As telas desses destinos não foram recriadas.

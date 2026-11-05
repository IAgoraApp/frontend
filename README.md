# IAgora

Frontend em React e Vite com páginas institucionais, acesso pessoal e empresarial.

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

Páginas e componentes usam Tailwind CSS, incluindo o header e toda a Rotina.
Somente `sobre-nos` mantém um CSS Module. `src/app/styles/main.css` é a entrada
do Tailwind e define o tema global, sem estilos próprios de páginas.

O espaçamento lateral compartilhado segue o header e é definido por
`--page-gutter`, com os tokens em `src/app/styles/main.css` e as variantes
responsivas no `body` de `index.html`: 16 px no celular, 24 px a partir
de 640 px, 48 px a partir de 1024 px e 120 px a partir de 1280 px (com fonte
base de 16 px). Use `Container` de `shared/ui` nas páginas e seções que precisam
desse alinhamento. O layout não aplica padding ao conteúdo: fundos, imagens e
outros componentes podem ocupar a largura total, com um `Container` interno
quando necessário.
O header usa a mesma variável para suas margens; evite outros gutters fixos ou
limites de largura somente no conteúdo, pois eles deixam as bordas desalinhadas.

As páginas institucionais usam PublicLayout. Login e onboarding têm composição própria,
sem o header de navegação.
A rota técnica /manutencao e o errorElement seguem a organização do router original.
Endereços desconhecidos são tratados pelo errorElement.

Os helpers PublicRoute e PrivateRoute ficam em src/app/utils/checkAuth.jsx.
Como no projeto original, ambos apenas renderizam Outlet; ainda não validam autenticação.
Os layouts são exportados por `src/app/layouts` e compartilham a estrutura de
`AppLayout`. Cada grupo de rotas escolhe seu layout no router:

- `UserLayout`: header `user` com os links do userA por padrão, em `/home`,
  `/rotina` e `/perfil`.
- `UserLayout userType='userB'`: mesmo header de usuário com links próprios,
  em `/home-b` e `/minhajornada`. Exibe “Minha jornada” no lugar de “Rotina”.
- `EmpresasLayout`: acesso empresarial em `/dashboard`, com o header `empresas`.
  Empresas são um perfil separado dos usuários A e B.
- `PublicLayout`: header `public` em todas as páginas institucionais, incluindo
  `/sejaparceiro`, `/cadastro-empresa` e `/empresa/acesso`.

Os itens, destinos e botões de cada header ficam em `src/shared/headerConfig.js`.
Há somente três tipos de header: `public`, `empresas` e `user`. Os perfis `userA`
e `userB` compartilham a aparência de `user`, com navegação configurada em
`userHeaderVariants`.
O header adapta a navegação ao espaço disponível: exibe os links no desktop e
um menu recolhível em telas menores ou com zoom. O menu fecha ao navegar,
pressionar Escape ou clicar fora; sua abertura não desloca a página.

`rotina` implementa tarefas, calendário, histórico e modais com persistência local.
Sua organização e limitações estão em `src/features/rotina/README.md`.
As features `home-user-b` e `minha-jornada` têm apenas componentes vazios,
exports e rotas, prontos para receber as telas. A home existente do userA foi mantida.
Destinos como finanças e perfil empresarial ainda precisam das respectivas páginas.

Para adicionar páginas com navegação própria, agrupe as rotas sob o layout desejado:

```jsx
{
  element: <UserLayout />,
  children: [
    { path: '/home', element: <Home /> },
    { path: '/financas', element: <Financas /> },
  ],
}
```

Os layouts aceitam `className`, `headerProps` e `children`; sem `children`,
renderizam o `Outlet` das rotas filhas. Uma composição nova também pode usar
`AppLayout` diretamente com outra `headerVariant` registrada na configuração.

O login mantém espaço para as variações de texto e para a confirmação de senha,
evitando deslocamentos ao alternar entre pessoa, empresa e cadastro. O campo de
confirmação fica desabilitado e fora da navegação por teclado no modo de login.

# IAGORA · frontend

Aplicação React para experimentar os fluxos de independência, organização doméstica e divulgação de serviços do IAGORA. Funciona sem backend, com dados de exemplo editáveis e persistência neste navegador.

## Executar

```sh
npm install
npm run dev
```

Abra o endereço exibido pelo Vite. Em **Entrar**, crie uma conta local ou use **Explorar demonstração**, escolha um dos três perfis e percorra os módulos. Em **Meu perfil**, alterne o perfil sem perder os registros.

A demonstração mantém uma conta por navegador. Criar outra conta pede confirmação antes de substituir os dados. Recuperação de senha, encerramento de sessão e exclusão são operações locais, sem envio de e-mail. A conta demonstrativa não representa autenticação de produção.

## Organização preservada

- `src/router`: React Router existente, seus layouts e registros de funcionalidades.
- `src/layouts`: navegação pública, interna e comercial.
- `src/containers`: páginas de cada módulo.
- `src/components`: componentes por funcionalidade; `App` reúne controles efetivamente compartilhados.
- `src/data`: exemplos, catálogos, etapas, guias e opções dos formulários.
- `src/store/useAppStore.js`: estado compartilhado e ações locais, usando o Zustand já instalado.
- `src/utils`: cálculos, datas, pesquisa e verificação de credenciais demonstrativas.
- `src/styles`: Tailwind e CSS Modules existentes, com os tokens da Landing Page.

Tarefas de limpeza entram na rotina; conclusões atualizam histórico e indicadores; despesas da casa entram nas finanças; refeições geram compras; imóveis atualizam o simulador; anúncios ativos aparecem no Marketplace; perfil comercial, visualizações e solicitações alimentam o painel local.

Os dados ficam em `iagora:app:v1`. Os checklists antigos mantêm suas chaves; a rotina e as marcações antigas de limpeza são importadas ao iniciar. Se o armazenamento estiver bloqueado ou cheio, a interface informa a limitação e mantém o estado em memória.

## Verificação

```sh
npm run lint
npm test
npm run build
npm run test:browser
```

A suíte de navegador precisa de Node.js 22+ e Chromium instalado. Ela inicia o Vite em `127.0.0.1:4178`, abre um perfil temporário exclusivo, percorre as três jornadas e apaga apenas seus dados temporários ao terminar. Não acessa o perfil pessoal do navegador. Não adiciona dependências ao projeto.

Para outro executável ou servidor:

```sh
CHROMIUM_BIN=/caminho/do/chromium BASE_URL=http://127.0.0.1:5173 npm run test:browser
```

Os testes verificam operações entre módulos, persistência, formulários, exclusões, recuperação local, navegação, foco, Escape e larguras de 320, 390, 768 e 1440 px. Capturas de revisão são gravadas em `/tmp/iagora-*.png`.

O projeto usa JavaScript; não há configuração de TypeScript nem comando de verificação de tipos. Lint, testes e build são as verificações disponíveis.

## Fontes e limites

O [fluxo do FigJam](docs/fluxo-figjam.md) registra a leitura das 30 linhas e 3 colunas. A [auditoria e matriz funcional](docs/auditoria-frontend.md) relaciona os requisitos às implementações e descreve as demonstrações.

Google Calendar, bancos, login externo, IA remota, pagamentos, publicação compartilhada, mensagens e moderação reais dependem de integrações futuras. A interface identifica esses limites. Serviços, imóveis e avaliações dos catálogos são fictícios. Imagens adicionadas pelo usuário ficam locais, limitadas a 600 KB por arquivo e três imagens por anúncio.

As fontes externas e os arquivos de mídia originais foram preservados. Para uma futura publicação de produção, ainda cabe otimizar as imagens e o vídeo da Landing Page, substituir a autenticação e persistência locais, e definir termos e política definitivos.

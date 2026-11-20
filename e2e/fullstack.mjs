import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import process from 'node:process';
import { chromium } from 'playwright';

const origem = process.env.IAGORA_E2E_URL ?? 'http://127.0.0.1:5173';
const senhas = {
  A: process.env.IAGORA_DEMO_SENHA_A,
  B: process.env.IAGORA_DEMO_SENHA_B,
  C: process.env.IAGORA_DEMO_SENHA_C,
};
assert.ok(
  Object.values(senhas).every(Boolean),
  'Defina as três senhas de demonstração.'
);
const servidor = await fetch(origem);
assert.equal(
  servidor.status,
  200,
  'Inicie o frontend apontando para o banco de testes.'
);

const navegador = await chromium.launch();
const idTeste = randomUUID().slice(0, 8);

async function comConta(perfil, identidade, tela, executar, viewport) {
  const contexto = await navegador.newContext({ viewport });
  try {
    const pagina = await contexto.newPage();
    pagina.setDefaultTimeout(15000);
    await pagina.goto(new URL('/login', origem).href);
    await pagina
      .locator('input[name=email]')
      .fill(identidade + '@demo.iagora.example');
    await pagina.locator('input[name=senha]').fill(senhas[perfil]);
    await pagina.locator('form.acesso-campos button[type=submit]').click();
    await pagina.waitForURL(url => url.pathname !== '/login');
    await pagina.goto(new URL(tela, origem).href);
    await executar(pagina);
    console.log(
      `Perfil ${perfil} verificado (${viewport.width} × ${viewport.height})`
    );
  } finally {
    await contexto.close();
  }
}

try {
  await comConta(
    'A',
    'moradia',
    '/casa',
    async pagina => {
      await pagina
        .getByRole('heading', { name: 'Minha casa', exact: true })
        .first()
        .waitFor();
      await pagina.getByRole('button', { name: /seus cômodos/i }).click();
      await pagina
        .getByRole('button', { name: 'Adicionar', exact: true })
        .click();
      const comodo = 'Quarto E2E ' + idTeste;
      await pagina
        .getByRole('textbox', { name: 'Nome', exact: true })
        .fill(comodo);
      await pagina
        .getByRole('combobox', { name: 'Tipo', exact: true })
        .selectOption('quarto');
      await pagina.getByRole('button', { name: 'Salvar', exact: true }).click();
      await pagina.getByText(comodo, { exact: true }).waitFor();
      await pagina.reload();
      await pagina.getByRole('button', { name: /seus cômodos/i }).click();
      await pagina.getByText(comodo, { exact: true }).waitFor();
      await pagina.getByRole('button', { name: 'Excluir ' + comodo }).click();
      await pagina
        .getByRole('button', { name: 'Excluir', exact: true })
        .click();
      await pagina
        .getByText(comodo, { exact: true })
        .waitFor({ state: 'hidden' });
      await pagina
        .context()
        .route('**/api/perfis/user/**', rota =>
          rota.fulfill({ status: 401, json: { mensagem: 'Sessão expirada' } })
        );
      await pagina.reload();
      await pagina.waitForURL('**/login');
    },
    { width: 1440, height: 900 }
  );

  await comConta(
    'B',
    'planejamento',
    '/financas-b?visao=dinheiro',
    async pagina => {
      await pagina
        .getByRole('heading', { name: 'Meu dinheiro', exact: true })
        .waitFor();
      await pagina.getByText('Transporte mensal', { exact: true }).waitFor();
      await pagina.getByRole('button', { name: /editar renda/i }).click();
      await pagina.getByRole('spinbutton', { name: /renda/i }).fill('4321');
      await pagina.getByRole('button', { name: 'Salvar dados' }).click();
      await pagina.getByRole('dialog').waitFor({ state: 'hidden' });
      await pagina.reload();
      await pagina.getByRole('button', { name: /editar renda/i }).click();
      assert.equal(
        await pagina.getByRole('spinbutton', { name: /renda/i }).inputValue(),
        '4321'
      );
    },
    { width: 390, height: 844 }
  );

  await comConta(
    'C',
    'empresa',
    '/empresa/anunciar',
    async pagina => {
      const titulo = 'Anúncio E2E ' + idTeste;
      await pagina
        .getByRole('textbox', { name: 'Título do serviço' })
        .fill(titulo);
      const categorias = pagina.getByRole('combobox', {
        name: 'Categoria',
        exact: true,
      });
      await categorias.selectOption({ index: 1 });
      await pagina
        .getByRole('textbox', { name: 'Descrição' })
        .fill('Descrição fictícia para conferir o cadastro no navegador.');
      await pagina.getByRole('spinbutton', { name: 'Preço (R$)' }).fill('80');
      await pagina.getByRole('button', { name: /salvar rascunho/i }).click();
      await pagina.waitForURL(/\/empresa\/anuncios\/\d+$/);
      await pagina.reload();
      await pagina
        .getByRole('heading', { name: titulo, exact: true })
        .waitFor();
    },
    { width: 1280, height: 900 }
  );
} finally {
  await navegador.close();
}

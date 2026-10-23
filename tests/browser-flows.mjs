import { writeFile } from 'node:fs/promises';
const base = process.env.BASE_URL || 'http://127.0.0.1:4178';
const tabs = await fetch(`${process.env.CDP_URL}/json`).then(r => r.json());
const tab = tabs.find(tab => tab.type === 'page');
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve =>
  socket.addEventListener('open', resolve, { once: true })
);
let id = 0;
const pending = new Map();
const errors = [];
socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (data.id) {
    const promise = pending.get(data.id);
    if (data.error) promise.reject(new Error(JSON.stringify(data.error)));
    else promise.resolve(data.result);
    pending.delete(data.id);
  }
  if (data.method === 'Runtime.exceptionThrown')
    errors.push(
      data.params.exceptionDetails.exception?.description ||
        data.params.exceptionDetails.text
    );
  if (
    data.method === 'Runtime.consoleAPICalled' &&
    data.params.type === 'error'
  )
    errors.push(
      data.params.args.map(arg => arg.value || arg.description).join(' ')
    );
});
async function send(method, params = {}) {
  const requestId = ++id;
  const promise = new Promise((resolve, reject) =>
    pending.set(requestId, { resolve, reject })
  );
  socket.send(JSON.stringify({ id: requestId, method, params }));
  return promise;
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails)
    throw new Error(
      result.exceptionDetails.exception?.description ||
        result.exceptionDetails.text
    );
  return result.result.value;
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function wait(expression, message = expression) {
  for (let i = 0; i < 80; i++) {
    if (await evaluate(expression)) return;
    await pause(100);
  }
  throw new Error(
    `Timeout: ${message}\n${await evaluate('document.body.innerText.slice(0,2500)')}`
  );
}
async function navigate(path) {
  await send('Page.navigate', { url: `${base}${path}` });
  await wait(
    'document.readyState === "complete" && !!document.querySelector("h1")'
  );
  await pause(150);
}
async function click(text, tag = 'button,a,summary', index = 0) {
  const found = await evaluate(
    `(() => { const els=[...(document.querySelector('dialog[open]') || document).querySelectorAll(${JSON.stringify(tag)})].filter(el=>(el.textContent.replaceAll('↗','').replaceAll('→','').trim()===${JSON.stringify(text.replaceAll('↗', '').replaceAll('→', '').trim())} || el.getAttribute('aria-label') === ${JSON.stringify(text)}) && !!el.getClientRects().length); const el=els[${index}]; if (!el) return false; el.scrollIntoView({block:'center'}); el.click(); return true; })()`
  );
  if (!found)
    throw new Error(
      `Cannot click ${text}\n${await evaluate('document.body.innerText.slice(0,2500)')}`
    );
  await pause(100);
}
async function fill(label, value) {
  const result = await evaluate(
    `(() => { const label=[...(document.querySelector('dialog[open]') || document).querySelectorAll('label')].find(el=>el.querySelector('span')?.textContent.trim()===${JSON.stringify(label)}); const el=label?.querySelector('input,textarea,select'); if(!el) return false; el.focus(); const setter=Object.getOwnPropertyDescriptor(el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,'value').set; setter.call(el,${JSON.stringify(String(value))}); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`
  );
  if (!result) throw new Error(`Cannot fill ${label}`);
  await pause(40);
}
async function select(label, value) {
  const result = await evaluate(
    `(() => { const label=[...(document.querySelector('dialog[open]') || document).querySelectorAll('label')].find(el=>el.querySelector('span')?.textContent.trim()===${JSON.stringify(label)}); const el=label?.querySelector('select'); if(!el) return false; el.value=${JSON.stringify(value)}; el.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`
  );
  if (!result) throw new Error(`Cannot select ${label}`);
  await pause(100);
}
async function check(text) {
  const result = await evaluate(
    `(() => { const el=[...(document.querySelector('dialog[open]') || document).querySelectorAll('label')].find(el=>el.textContent.includes(${JSON.stringify(text)}))?.querySelector('input[type=checkbox]'); if(!el) return false; el.click(); return true; })()`
  );
  if (!result) throw new Error(`Cannot check ${text}`);
  await pause(100);
}
async function assert(expression, label) {
  await wait(expression, label);
  console.log(`PASS ${label}`);
}
async function screenshot(name, width = 1440) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: width < 600,
  });
  await evaluate('window.scrollTo(0,0)');
  await pause(200);
  const result = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  await writeFile(
    `/tmp/iagora-${name}.png`,
    Buffer.from(result.data, 'base64')
  );
}
async function state() {
  return await evaluate(
    'JSON.parse(localStorage.getItem("iagora:app:v1")).state'
  );
}
async function dialogClosed() {
  await wait('!document.querySelector("dialog[open]")');
}
await send('Runtime.enable');
await send('Page.enable');
async function mainJourney() {
  await navigate('/');
  await evaluate('localStorage.clear()');
  await navigate('/rotina');
  await assert(
    'location.pathname === "/login"',
    'Private routes redirect to login'
  );
  await click('Criar conta');
  await fill('Seu nome', 'Pessoa Teste');
  await fill('E-mail', 'teste@iagora.local');
  await fill('Senha (mínimo 8 caracteres)', 'Senha1234');
  await fill('Confirme a senha', 'Senha1234');
  await check('Li e aceito');
  await click('Criar conta local →');
  await wait('location.pathname === "/onboarding"');
  await assert(
    'document.querySelectorAll("section[aria-label] button").length === 3',
    'Three onboarding profiles'
  );
  await evaluate(
    '[...document.querySelectorAll("section button")].find(el=>el.textContent.includes("Já moro sozinho")).click()'
  );
  await wait(
    'location.pathname === "/home" && document.body.innerText.includes("O que vamos resolver")'
  );
  await assert(
    'document.body.innerText.includes("Pessoa")',
    'Home uses registered name'
  );
  await navigate('/rotina');
  await click('+ Nova tarefa');
  await fill('O que precisa fazer?', 'Tarefa integração');
  await click('Salvar tarefa');
  await dialogClosed();
  await assert(
    'document.body.innerText.includes("Tarefa integração")',
    'Task creation'
  );
  await evaluate(
    '[...document.querySelectorAll("button")].find(el=>el.getAttribute("aria-label")==="Editar Tarefa integração").click()'
  );
  await fill('O que precisa fazer?', 'Tarefa editada');
  await click('Salvar tarefa');
  await dialogClosed();
  await check('Tarefa editada');
  await click('Histórico');
  await assert(
    'document.body.innerText.includes("Tarefa editada")',
    'Task completion history'
  );
  await click('Calendário');
  await assert(
    '!!document.querySelector("input[type=month]")',
    'Routine calendar available'
  );
  const previousCleaningCount = (await state()).data.tasks.filter(task => task.cleaningId).length;
  await navigate('/limpeza');
  await click('Levar para minha rotina');
  let s = await state();
  if (s.data.tasks.filter(task => task.cleaningId).length !== previousCleaningCount + 4)
    throw new Error('Cleaning integration missing');
  console.log('PASS Cleaning sends tasks into routine');
  await click('Levar para minha rotina');
  s = await state();
  if (s.data.tasks.filter(task => task.cleaningId).length !== previousCleaningCount + 4)
    throw new Error('Duplicate cleaning tasks');
  console.log('PASS Cleaning import deduplicates tasks');
  await click('+ Personalizar checklist');
  await fill('Atividade', 'Limpar mesa');
  await fill('Descrição curta', 'Minha mesa de trabalho');
  await fill('Materiais necessários', 'Pano');
  await fill(
    'Passo a passo (uma etapa por linha)',
    'Retirar objetos\nLimpar superfície'
  );
  await click('Salvar no checklist');
  await dialogClosed();
  await assert(
    'document.body.innerText.includes("Limpar mesa")',
    'Custom cleaning checklist'
  );
  await check('Lavar a louça');
  s = await state();
  if (!s.data.completions.some(item => item.title.includes('Lavar a louça')))
    throw new Error('Cleaning completion not shared');
  console.log('PASS Cleaning completion updates history');
  await navigate('/casa');
  await click('Cadastrar residência');
  await fill('Nome do seu canto', 'Meu apê de teste');
  await fill('Cidade', 'São Paulo');
  await click('Salvar residência');
  await dialogClosed();
  await click('+ Despesa da casa');
  await fill('Descrição', 'Conta da casa teste');
  await fill('Valor (R$)', '75.50');
  await click('Salvar lançamento');
  await dialogClosed();
  await navigate('/financas');
  await assert(
    'document.body.innerText.includes("Conta da casa teste")',
    'House expense appears in finance'
  );
  await click('Orçamento e meta');
  await fill('Orçamento mensal para despesas (R$)', '100');
  await click('Salvar planejamento');
  await dialogClosed();
  await assert(
    'document.body.innerText.includes("ultrapassaram")',
    'Budget alert recalculates'
  );
  await navigate('/cozinha');
  await fill('Ingredientes que você tem (separados por vírgula)', 'ovo,tomate');
  await click('Sugerir com meus ingredientes');
  await assert(
    'document.body.innerText.includes("ingredientes encontrados")',
    'Local recipe suggestions'
  );
  await click('Mostrar todas');
  await click('Planejar refeição');
  await click('Salvar refeição');
  await dialogClosed();
  await click('Gerar lista de compras do planejamento');
  s = await state();
  if (!s.data.shopping.length || !s.data.mealPlan.length)
    throw new Error('Shopping list generation failed');
  console.log('PASS Meal plan generates shopping list');
  await navigate('/home');
  await screenshot('home-desktop');
  await navigate('/perfil');
  await select('Tipo de perfil', 'planejando');
  await click('Usar este perfil');
  await wait(
    'location.pathname === "/home" && document.body.innerText.includes("O que vamos resolver")'
  );
  await navigate('/minhajornada');
  await check('Registrar minha renda');
  await assert(
    'document.body.innerText.includes("1 de 15")',
    'Journey progress updates'
  );
  await navigate('/financas');
  await fill('Renda mensal (R$)', '6000');
  await fill('Economia atual (R$)', '4000');
  await click('Salvar simulação e meta');
  s = await state();
  if (s.data.plan.income !== 6000 || s.data.plan.savings !== 4000)
    throw new Error('Simulation not persisted');
  console.log('PASS Financial simulation persists');
  await click('Salvar cenário com nome');
  await fill('Nome', 'Plano teste');
  await click('Salvar cenário');
  await dialogClosed();
  await navigate('/encontrar-casa');
  await check('Comparar imóvel');
  await click('Ver detalhes');
  await click('Usar aluguel e taxas no meu orçamento');
  s = await state();
  if (!s.data.plan.housingFees) throw new Error('Property fees not reflected');
  console.log('PASS Property costs update financial plan');
  await click('Fechar janela');
  await navigate('/aprendendo');
  await click('Começar atividade');
  await click('Escolher uma tarefa pequena e definir o próximo dia');
  s = await state();
  if (s.data.lessons.length !== 1) throw new Error('Lesson not completed');
  console.log('PASS Learning quiz updates progress');
  await click('Voltar aos guias');
  await screenshot('learning-mobile', 390);
  await navigate('/perfil');
  await select('Tipo de perfil', 'anunciante');
  await click('Usar este perfil');
  await wait(
    'location.pathname === "/home" && document.body.innerText.includes("O que vamos resolver")'
  );
  await navigate('/perfil-empresa');
  await fill('Nome comercial ou profissional', 'Negócio Teste');
  await fill('Descrição do negócio', 'Cuidados da casa em demonstração');
  await fill('Telefone comercial', '11999999999');
  await click('Salvar perfil comercial');
  await navigate('/meus-servicos');
  await fill('Título do anúncio', 'Serviço integração');
  await fill('Descrição detalhada', 'Serviço local para testar a publicação');
  await fill('Contato (telefone, e-mail ou canal)', '11999999999');
  await fill('Preço inicial (R$)', '150');
  await click('Publicar localmente');
  await wait('location.pathname === "/dashboard"');
  await assert(
    'document.body.innerText.includes("Serviço integração")',
    'Published ad appears on dashboard'
  );
  await navigate('/marketplace');
  await fill('Serviço ou profissional', 'Serviço integração');
  await assert(
    'document.body.innerText.includes("Negócio Teste")',
    'Commercial profile reflected in Marketplace'
  );
  await click('Conhecer serviço ↗');
  await click('Simular solicitação de contato');
  await fill('Sua mensagem de exemplo', 'Quero um orçamento de exemplo');
  await click('Salvar solicitação simulada');
  await click('Fechar janela');
  await navigate('/dashboard');
  s = await state();
  const ad = s.data.ads.find(ad => ad.title === 'Serviço integração');
  if (ad.views !== 1 || !s.data.contacts.length)
    throw new Error('Views or contacts not updated');
  console.log('PASS Local views and contacts update dashboard');
  await click('Pausar');
  await navigate('/marketplace');
  await fill('Serviço ou profissional', 'Serviço integração');
  await assert(
    'document.body.innerText.includes("Nenhum serviço com esses filtros")',
    'Paused ad leaves Marketplace'
  );
  await navigate('/dashboard');
  await click('Ativar localmente', 'button', 1);
  await navigate('/marketplace');
  await fill('Serviço ou profissional', 'Serviço integração');
  await assert(
    'document.body.innerText.includes("Negócio Teste")',
    'Reactivated ad returns to Marketplace'
  );
  await navigate('/home');
  await send('Page.reload');
  await wait(
    'document.readyState === "complete" && !!document.querySelector("h1")'
  );
  s = await state();
  if (
    s.data.house.name !== 'Meu apê de teste' ||
    s.data.profile !== 'anunciante' ||
    s.data.ads.length < 2
  )
    throw new Error('Data persistence failed');
  console.log('PASS Cross-module persistence after reload');
  await screenshot('advertiser-mobile', 390);
  const routes = {
    morando: [
      '/home',
      '/rotina',
      '/casa',
      '/limpeza',
      '/cozinha',
      '/financas',
      '/perfil',
      '/marketplace',
    ],
    planejando: [
      '/home',
      '/minhajornada',
      '/financas',
      '/aprendendo',
      '/encontrar-casa',
      '/perfil',
    ],
    anunciante: [
      '/home',
      '/dashboard',
      '/marketplace',
      '/meus-servicos',
      '/meusServicos',
      '/perfil-empresa',
      '/perfilEmpresa',
      '/perfil',
    ],
  };
  for (const [profile, paths] of Object.entries(routes)) {
    await navigate('/perfil');
    await select('Tipo de perfil', profile);
    await click('Usar este perfil');
    for (const path of paths) {
      await navigate(path);
      await assert(
        `!document.body.innerText.includes('Esse caminho não foi encontrado') && location.pathname === ${JSON.stringify(path)}`,
        `Route ${profile} ${path}`
      );
      const overflow = await evaluate(
        'document.documentElement.scrollWidth > innerWidth + 2'
      );
      if (overflow)
        console.log(
          'OVERFLOW',
          profile,
          path,
          await evaluate('document.documentElement.scrollWidth')
        );
    }
  }
  for (const path of [
    '/',
    '/sobrenos',
    '/cadastro-empresa',
    '/cadastroEmpresa',
    '/parceiros',
    '/seja-parceiro',
    '/login',
    '/cadastro',
    '/recuperar-senha',
  ]) {
    await navigate(path);
    await assert(
      '!!document.querySelector("h1") && !document.body.innerText.includes("Esse caminho não foi encontrado")',
      `Public route ${path}`
    );
    const overflow = await evaluate(
      'document.documentElement.scrollWidth > innerWidth + 2'
    );
    if (overflow)
      console.log(
        'OVERFLOW public',
        path,
        await evaluate('document.documentElement.scrollWidth')
      );
  }
  await navigate('/');
  await screenshot('landing-mobile', 390);
  await screenshot('landing-desktop', 1440);
  if (errors.length)
    throw new Error(`Browser errors: ${JSON.stringify(errors)}`);
  console.log('PASS No runtime or console errors');
}

async function additionalChecks() {
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await navigate('/perfil');
  await select('Tipo de perfil', 'morando');
  await click('Usar este perfil');
  await navigate('/rotina');
  await click('+ Nova tarefa');
  await fill('O que precisa fazer?', 'Tarefa excluir');
  await select('Frequência', 'Semanal');
  await click('Salvar tarefa');
  await assert(
    'document.body.innerText.includes("Selecione pelo menos um dia")',
    'Weekly task validates selected days'
  );
  await click('Seg');
  await click('Salvar tarefa');
  await dialogClosed();
  await evaluate(
    '[...document.querySelectorAll("button")].find(el=>el.getAttribute("aria-label")==="Excluir Tarefa excluir").click()'
  );
  await click('Cancelar');
  await dialogClosed();
  await assert(
    'document.body.innerText.includes("Tarefa excluir")',
    'Deletion cancel preserves task'
  );
  await evaluate(
    '[...document.querySelectorAll("button")].find(el=>el.getAttribute("aria-label")==="Excluir Tarefa excluir").click()'
  );
  await click('Confirmar exclusão');
  await dialogClosed();
  await assert(
    '!document.body.innerText.includes("Tarefa excluir")',
    'Task delete confirmation'
  );
  await click('+ Nova tarefa');
  await assert(
    'document.activeElement?.tagName === "INPUT"',
    'Modal focuses form control'
  );
  await send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  });
  await send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  });
  await dialogClosed();
  console.log('PASS Escape closes native modal');
  await click('Google Calendar · integração futura');
  await assert(
    'document.body.innerText.includes("Nenhum calendário está conectado")',
    'Calendar integration is explicitly unavailable'
  );
  await click('Voltar à rotina');
  await navigate('/casa');
  await click('Editar residência');
  await fill('Nome do seu canto', 'Apê revisado');
  await click('Salvar residência');
  await dialogClosed();
  await click('+ Registrar manutenção');
  await fill('O que precisa de atenção?', 'Trocar filtro teste');
  await click('Salvar manutenção');
  await dialogClosed();
  await check('Trocar filtro teste');
  let s = await state();
  if (
    !s.data.maintenance.find(item => item.title === 'Trocar filtro teste')?.done
  )
    throw new Error('Maintenance not completed');
  console.log('PASS Maintenance create and completion');
  await navigate('/financas');
  await click('+ Novo lançamento');
  await fill('Descrição', 'Receita CRUD');
  await select('Tipo', 'income');
  await fill('Valor (R$)', '100');
  await click('Salvar lançamento');
  await dialogClosed();
  await fill('Pesquisar lançamento', 'Receita CRUD');
  await click('Editar');
  await fill('Valor (R$)', '250');
  await click('Salvar lançamento');
  await dialogClosed();
  s = await state();
  if (
    s.data.transactions.find(item => item.title === 'Receita CRUD')?.amount !==
    250
  )
    throw new Error('Finance edit');
  console.log('PASS Finance income edit');
  await click('Excluir');
  await click('Confirmar exclusão');
  await dialogClosed();
  await assert(
    'document.body.innerText.includes("Nenhum lançamento encontrado")',
    'Finance deletes and filters empty result'
  );
  await fill('Pesquisar lançamento', 'Aluguel');
  await click('Lançar próximo mês');
  s = await state();
  if (s.data.transactions.filter(item => item.title === 'Aluguel').length !== 2)
    throw new Error('Recurring bill copy');
  await click('Lançar próximo mês');
  s = await state();
  if (s.data.transactions.filter(item => item.title === 'Aluguel').length !== 2)
    throw new Error('Recurring duplicate');
  console.log('PASS Recurring bill copy deduplicates');
  await click('Integração bancária futura');
  await assert(
    'document.body.innerText.includes("Nenhuma conta, saldo ou transação")',
    'Bank integration is explicitly unavailable'
  );
  await click('Continuar com dados locais');
  await navigate('/cozinha');
  await fill('Adicionar item', '2 pães');
  await click('Adicionar', 'button');
  await evaluate('document.querySelector("#lista-compras").scrollIntoView()');
  await evaluate(
    '[...document.querySelectorAll("#lista-compras li")].find(el=>el.textContent.includes("2 pães")).querySelector("button").click()'
  );
  await fill('Item e quantidade', '3 pães');
  await click('Salvar item');
  await dialogClosed();
  await check('3 pães');
  s = await state();
  if (!s.data.shopping.find(item => item.name === '3 pães')?.done)
    throw new Error('Shopping CRUD');
  console.log('PASS Shopping edit and check');
  await evaluate(
    '[...document.querySelectorAll("#lista-compras li")].find(el=>el.textContent.includes("3 pães")).querySelectorAll("button")[1].click()'
  );
  await click('Confirmar exclusão');
  await dialogClosed();
  await evaluate(
    'document.querySelector("button[aria-label^=Favoritar]").click()'
  );
  await check('Só favoritas');
  await assert(
    'document.querySelectorAll("#explorar-receitas article").length===1',
    'Recipe favorites filter'
  );
  await navigate('/marketplace');
  await select('Tipo de atendimento', 'Online');
  await assert(
    'document.querySelectorAll("article").length===1',
    'Marketplace attendance filter'
  );
  await fill('Preço máximo (R$)', '1');
  await assert(
    'document.body.innerText.includes("Nenhum serviço com esses filtros")',
    'Marketplace price filter'
  );
  await click('Limpar filtros');
  await evaluate(
    'document.querySelector("button[aria-label^=Favoritar]").click()'
  );
  await check('Só favoritos');
  await assert(
    'document.querySelectorAll("article").length===1',
    'Marketplace favorites filter'
  );
  await navigate('/perfil');
  await select('Tipo de perfil', 'anunciante');
  await click('Usar este perfil');
  await navigate('/meus-servicos');
  await fill('Título do anúncio', 'Rascunho incompleto');
  await click('Salvar rascunho');
  await wait('location.pathname === "/dashboard"');
  await fill('Pesquisar anúncio', 'Rascunho incompleto');
  await click('Editar anúncio');
  await wait('!!document.querySelector("form")');
  await fill('Título do anúncio', 'Rascunho editado');
  await click('Salvar rascunho');
  await wait('location.pathname === "/dashboard"');
  await fill('Pesquisar anúncio', 'Rascunho editado');
  await click('Excluir');
  await click('Confirmar exclusão');
  await dialogClosed();
  await assert(
    'document.body.innerText.includes("Nenhum anúncio neste filtro")',
    'Ad draft editing and deletion'
  );
  await navigate('/perfil-empresa');
  await evaluate(
    `(() => { const file=new File([new Uint8Array([1,2,3])], 'invalid.txt', {type:'text/plain'}); const transfer=new DataTransfer();transfer.items.add(file); const input=document.querySelector('input[type=file]');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true})); })()`
  );
  await assert(
    'document.body.innerText.includes("Escolha uma imagem JPG")',
    'Image upload validates file type'
  );
  await navigate('/perfil');
  await check('Mostrar lembretes');
  await navigate('/home');
  await assert(
    '!document.body.innerText.includes("Lembretes e avisos locais")',
    'Notification preference controls Home'
  );
  await navigate('/perfil');
  await fill('Nome', 'Pessoa Editada');
  await fill('E-mail de acesso local', 'novo@iagora.local');
  await click('Salvar informações');
  await click('Sair da conta local');
  await wait('location.pathname === "/login"');
  await fill('E-mail', 'novo@iagora.local');
  await fill('Senha (mínimo 8 caracteres)', 'Wrong123');
  await click('Entrar no meu cantinho');
  await assert(
    'document.body.innerText.includes("E-mail ou senha não correspondem")',
    'Login rejects wrong password'
  );
  await click('Esqueci a senha');
  await fill('E-mail', 'novo@iagora.local');
  await click('Continuar recuperação local');
  await fill('Nova senha (mínimo 8 caracteres)', 'NovaSenha123');
  await fill('Confirme a senha', 'Diferente123');
  await click('Salvar nova senha');
  await assert(
    'document.body.innerText.includes("As senhas precisam ser iguais")',
    'Password confirmation validates'
  );
  await fill('Confirme a senha', 'NovaSenha123');
  await click('Salvar nova senha');
  await wait('document.body.innerText.includes("Entrar no meu cantinho")');
  await fill('Senha (mínimo 8 caracteres)', 'NovaSenha123');
  await click('Entrar no meu cantinho');
  await wait(
    'location.pathname === "/home" && document.body.innerText.includes("Pessoa")'
  );
  console.log('PASS Profile email and recovered password work on login');
  for (const width of [320, 390, 768, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: width < 600,
    });
    for (const path of [
      '/home',
      '/dashboard',
      '/meus-servicos',
      '/perfil-empresa',
      '/marketplace',
      '/',
      '/sobrenos',
      '/cadastro-empresa',
      '/onboarding',
    ]) {
      await navigate(path);
      await assert(
        'document.documentElement.scrollWidth <= innerWidth + 2',
        `No page overflow ${width}px ${path}`
      );
    }
  }
  await navigate('/perfil');
  await select('Tipo de perfil', 'morando');
  await click('Usar este perfil');
  await navigate('/home');
  await screenshot('home-desktop', 1440);
  await screenshot('home-mobile', 390);
  await navigate('/');
  await screenshot('landing-mobile', 390);
  await screenshot('landing-desktop', 1440);
  await navigate('/perfil');
  await click('Excluir conta e dados locais');
  await click('Confirmar exclusão');
  await wait('location.pathname === "/login"');
  await assert(
    '!localStorage.getItem("iagora:app:v1") || JSON.parse(localStorage.getItem("iagora:app:v1")).state.account === null',
    'Account deletion removes local identity'
  );
  await navigate('/home');
  await assert(
    'location.pathname === "/login"',
    'Account deletion ends access'
  );
  if (errors.length)
    throw new Error(`Browser errors: ${JSON.stringify(errors)}`);
  console.log('PASS No runtime or console errors');
}

try {
  await mainJourney();
  await additionalChecks();
} finally {
  socket.close();
}
